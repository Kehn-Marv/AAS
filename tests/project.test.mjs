import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const organIds = [
  "heart",
  "brain",
  "lungs",
  "liver",
  "gallbladder",
  "kidney",
  "eye",
  "pancreas",
  "small_intestine",
  "intestine",
  "spleen",
  "thymus",
  "skin",
];
const gltfModelIds = organIds.filter((id) => id !== "skin");

test("ships the complete attributed model set", async () => {
  await access(new URL("THIRD_PARTY_ASSETS.md", root));

  const sizes = await Promise.all(
    gltfModelIds.map(async (id) => {
      const info = await stat(new URL(`public/models/${id}.glb`, root));
      return info.size;
    }),
  );

  assert.equal(sizes.length, 12);
  assert.ok(sizes.every((size) => size > 8_000), "every model should contain GLB data");
  assert.ok(sizes.every((size) => size < 20 * 1024 * 1024), "each model should stay below the repository budget");
  await assert.rejects(access(new URL("public/models/skin.glb", root)));
});

test("keeps English content and AAS product metadata in place", async () => {
  const [data, copy, page, layout] = await Promise.all([
    readFile(new URL("app/lib/anatomy.ts", root), "utf8"),
    readFile(new URL("app/lib/copy.ts", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  for (const id of organIds) assert.match(data, new RegExp(`id: "${id}"`));
  assert.match(data, /modelKind: "skin-patch"/);
  assert.match(copy, /Anatomic Agentic System/);
  assert.match(copy, /AAS/);
  assert.match(page, /codex-preview/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(`${data}\n${copy}`, /[—–]/, "visible copy should avoid em and en dashes");
});

test("ships a source-aware multidisciplinary learning contract and heart lesson", async () => {
  const [learning, anatomy, studio] = await Promise.all([
    readFile(new URL("app/lib/learning.ts", root), "utf8"),
    readFile(new URL("app/lib/anatomy.ts", root), "utf8"),
    readFile(new URL("app/components/AnatomyStudio.tsx", root), "utf8"),
  ]);

  for (const contract of [
    "LearningDiscipline",
    "LearningTopic",
    "LearningLesson",
    "LearningScene",
    "LearningActivity",
    "LearningAssessment",
  ]) {
    assert.match(learning, new RegExp(`type ${contract}`));
  }

  assert.match(learning, /id: "heart-blood-flow-basics"/);
  assert.match(learning, /kind: "locate"/);
  assert.match(learning, /kind: "section"/);
  assert.match(learning, /kind: "quiz"/);
  assert.match(anatomy, /sourceIds: \["openstax"\]/);
  assert.match(anatomy, /reviewStatus: "draft"/);
  assert.match(studio, /className="guided-lesson"/);
  assert.match(studio, /role="progressbar"/);
});

test("keeps responsive and fallback repair contracts in place", async () => {
  const [css, studio, viewer] = await Promise.all([
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/components/AnatomyStudio.tsx", root), "utf8"),
    readFile(new URL("app/components/AnatomyViewer.tsx", root), "utf8"),
  ]);

  assert.match(css, /\.viewer-panel\s*\{[^}]*height:\s*calc\(100svh - var\(--header-height\) - 28px\)/s);
  assert.match(css, /\.library-panel\s*\{[^}]*width:\s*100%[^}]*max-width:\s*100%[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.mobile-nav\s*\{[^}]*position:\s*fixed/s);
  assert.match(studio, /aria-label=\{ui\.sources\}/);
  assert.match(studio, /aria-label=\{ui\.mobileNavigation\}/);
  assert.match(viewer, /canCreateWebGLContext/);
  assert.match(viewer, /dpr=\{\[1, 1\.5\]\}/);
  assert.match(viewer, /resolution=\{256\}/);
});

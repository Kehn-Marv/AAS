import type { LocalizedText } from "./anatomy";

export type DisciplineId =
  | "medical-anatomy"
  | "biology"
  | "chemistry"
  | "physics"
  | "earth-science"
  | "engineering";

export type LearningSourceRef = {
  sourceId: string;
  note: LocalizedText;
};

export type LearningEntity = {
  id: string;
  kind: "organ" | "structure" | "process" | "concept";
  name: LocalizedText;
};

export type LearningScene = {
  id: string;
  renderer: "3d" | "diagram" | "simulation";
  organId?: string;
  initialHotspotId?: string;
  entities: LearningEntity[];
};

type ActivityBase = {
  id: string;
  title: LocalizedText;
  instruction: LocalizedText;
  success: LocalizedText;
};

export type LearningActivity =
  | (ActivityBase & {
      kind: "locate";
      targetHotspotId: string;
    })
  | (ActivityBase & {
      kind: "section";
      minimumDepth: number;
    })
  | (ActivityBase & {
      kind: "quiz";
      assessmentId: string;
    });

export type LearningAssessment = {
  id: string;
  kind: "single-choice";
  organId: string;
  sourceRefs: LearningSourceRef[];
};

export type LearningLesson = {
  id: string;
  disciplineId: DisciplineId;
  topicId: string;
  title: LocalizedText;
  durationMinutes: number;
  objective: LocalizedText;
  scene: LearningScene;
  activities: LearningActivity[];
  assessments: LearningAssessment[];
  sourceRefs: LearningSourceRef[];
};

export type LearningTopic = {
  id: string;
  title: LocalizedText;
  lessonIds: string[];
};

export type LearningDiscipline = {
  id: DisciplineId;
  title: LocalizedText;
  status: "active" | "planned";
  topicIds: string[];
};

const t = (en: string): LocalizedText => ({ en });

/**
 * The heart lesson is the first vertical slice of the discipline-agnostic
 * learning contract. Future disciplines can supply other renderers while
 * reusing the same lesson, activity, assessment, and source boundaries.
 */
export const heartGuidedLesson: LearningLesson = {
  id: "heart-blood-flow-basics",
  disciplineId: "medical-anatomy",
  topicId: "cardiovascular-foundations",
  title: t("Guided heart structure"),
  durationMinutes: 4,
  objective: t(
    "Locate the left ventricle, inspect the heart interior, and explain how structure relates to pumping pressure.",
  ),
  scene: {
    id: "heart-3d-scene",
    renderer: "3d",
    organId: "heart",
    initialHotspotId: "aorta",
    entities: [
      { id: "heart", kind: "organ", name: t("Heart") },
      { id: "ventricle", kind: "structure", name: t("Left ventricle") },
      { id: "aorta", kind: "structure", name: t("Aorta") },
    ],
  },
  activities: [
    {
      id: "heart-locate-ventricle",
      kind: "locate",
      targetHotspotId: "ventricle",
      title: t("Locate"),
      instruction: t("Select the left ventricle label on the 3D specimen."),
      success: t("Left ventricle located."),
    },
    {
      id: "heart-section-interior",
      kind: "section",
      minimumDepth: 0.18,
      title: t("Observe"),
      instruction: t("Turn on section mode and move section depth beyond 0.18."),
      success: t("Interior observation complete."),
    },
    {
      id: "heart-check-understanding",
      kind: "quiz",
      assessmentId: "heart-wall-thickness-check",
      title: t("Explain"),
      instruction: t("Complete the quick quiz to check the structure-pressure relationship."),
      success: t("Quiz passed and the guided loop is complete."),
    },
  ],
  assessments: [
    {
      id: "heart-wall-thickness-check",
      kind: "single-choice",
      organId: "heart",
      sourceRefs: [
        { sourceId: "openstax", note: t("Heart chamber structure and circulatory function") },
      ],
    },
  ],
  sourceRefs: [
    { sourceId: "openstax", note: t("Heart anatomy and circulation foundations") },
    { sourceId: "medlineplus", note: t("Public health reference entry point") },
  ],
};

export const learningTopics: LearningTopic[] = [
  {
    id: "cardiovascular-foundations",
    title: t("Cardiovascular foundations"),
    lessonIds: [heartGuidedLesson.id],
  },
];

export const learningDisciplines: LearningDiscipline[] = [
  {
    id: "medical-anatomy",
    title: t("Medical anatomy"),
    status: "active",
    topicIds: learningTopics.map((topic) => topic.id),
  },
];

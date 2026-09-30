"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  Box3,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  FrontSide,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Plane,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { Language, Organ } from "../lib/anatomy";
import { localize } from "../lib/anatomy";

type AnatomyViewerProps = {
  organ: Organ;
  nextModel?: string;
  lang: Language;
  autoRotate: boolean;
  showLabels: boolean;
  sectionMode: boolean;
  sectionDepth: number;
  selectedStructure: string | null;
  onSelectStructure: (name: string | null) => void;
  onSelectHotspot: (id: string) => void;
  resetSignal: number;
  loadingLabel: string;
  errorLabel: string;
  webglFallbackLabel: string;
};

type GltfOrgan = Organ & { model: string };

type RenderModelProps = Omit<
  AnatomyViewerProps,
  "autoRotate" | "resetSignal" | "loadingLabel" | "errorLabel" | "webglFallbackLabel" | "nextModel"
>;

type ModelErrorBoundaryProps = {
  model: string;
  label: string;
  children: ReactNode;
};

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to render anatomy model", error, info.componentStack);
  }

  componentDidUpdate(previous: ModelErrorBoundaryProps) {
    if (previous.model !== this.props.model && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="viewer-error" role="alert">
            {this.props.label}
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}

const materialProfiles: Record<string, { roughness: number; envMapIntensity: number }> = {
  heart: { roughness: 0.4, envMapIntensity: 1.08 },
  brain: { roughness: 0.5, envMapIntensity: 0.9 },
  lungs: { roughness: 0.52, envMapIntensity: 0.86 },
  liver: { roughness: 0.42, envMapIntensity: 1 },
  gallbladder: { roughness: 0.34, envMapIntensity: 1.12 },
  kidney: { roughness: 0.43, envMapIntensity: 1 },
  eye: { roughness: 0.3, envMapIntensity: 1.16 },
  pancreas: { roughness: 0.48, envMapIntensity: 0.9 },
  small_intestine: { roughness: 0.42, envMapIntensity: 1.02 },
  intestine: { roughness: 0.44, envMapIntensity: 0.98 },
  spleen: { roughness: 0.45, envMapIntensity: 0.96 },
  thymus: { roughness: 0.5, envMapIntensity: 0.88 },
};

function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <Lightformer form="rect" intensity={3.4} color="#fff4e7" position={[0, 4, 4]} scale={[5, 2]} />
      <Lightformer form="rect" intensity={2.1} color="#a8e1df" position={[-4, 1, 2]} scale={[3, 4]} />
      <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[4, -1, -2]} scale={2.5} />
    </Environment>
  );
}

/** Spotlight pool: places the specimen inside a soft light ring in dark scenes, complementing the contact shadow. */
function SpotlightPool({ accent }: { accent: string }) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.42, "rgba(255, 255, 255, 0.26)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);

  const tint = useMemo(
    () => new Color(accent).lerp(new Color("#ffffff"), 0.55),
    [accent],
  );

  if (!texture) return null;

  return (
    <mesh position={[0, -1.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.6, 3.6]} />
      <meshBasicMaterial
        map={texture}
        color={tint}
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function cloneMaterial(material: Material, organ: Organ) {
  let cloned = material.clone();

  // Upgrade to Physical material: adds subtle sheen to simulate soft tissue scattering
  if (cloned instanceof MeshStandardMaterial && !(cloned instanceof MeshPhysicalMaterial)) {
    const physical = new MeshPhysicalMaterial();
    // Physical.copy assumes both source and target are Physical; use Standard.copy for shared properties, keeping physical defaults
    MeshStandardMaterial.prototype.copy.call(physical, cloned);
    physical.sheen = 0.32;
    physical.sheenRoughness = 0.58;
    physical.sheenColor = new Color(organ.accent).lerp(new Color("#ffffff"), 0.72);
    physical.clearcoat = 0.05;
    physical.clearcoatRoughness = 0.72;
    cloned.dispose();
    cloned = physical;
  }

  cloned.userData.baseOpacity = cloned.opacity;
  cloned.userData.baseTransparent = cloned.transparent;
  cloned.userData.baseSide = cloned.side;

  if (cloned instanceof MeshStandardMaterial) {
    const profile = materialProfiles[organ.id] ?? { roughness: 0.46, envMapIntensity: 0.94 };
    cloned.metalness = 0;
    cloned.roughness = profile.roughness;
    cloned.envMapIntensity = profile.envMapIntensity;
    cloned.userData.baseEmissive = cloned.emissive.clone();
    cloned.userData.baseEmissiveIntensity = cloned.emissiveIntensity;

  }

  return cloned;
}

function prepareScene(source: Object3D, organ: Organ) {
  const scene = source.clone(true);
  scene.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.castShadow = false;
    node.receiveShadow = false;
    node.material = Array.isArray(node.material)
      ? node.material.map((material) => cloneMaterial(material, organ))
      : cloneMaterial(node.material, organ);
  });
  return scene;
}

function OrganModel({
  organ,
  lang,
  sectionMode,
  sectionDepth,
  selectedStructure,
  showLabels,
  onSelectStructure,
  onSelectHotspot,
}: Omit<RenderModelProps, "organ"> & { organ: GltfOrgan }) {
  const gltf = useGLTF(organ.model);
  const scene = useMemo(() => prepareScene(gltf.scene, organ), [gltf.scene, organ]);
  const transform = useMemo(() => {
    scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(scene);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 1.72 / largestDimension;

    return {
      position: new Vector3(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      ),
      scale,
    };
  }, [scene]);
  const clippingPlane = useMemo(
    () => new Plane(new Vector3(-1, 0, 0), sectionDepth * 1.12),
    [sectionDepth],
  );

  useEffect(() => {
    scene.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const isSelected = selectedStructure === node.name;

      materials.forEach((material) => {
        material.clippingPlanes = sectionMode ? [clippingPlane] : [];
        material.clipShadows = false;
        material.side = sectionMode ? DoubleSide : material.userData.baseSide;
        material.opacity = selectedStructure && !isSelected
          ? 0.12
          : material.userData.baseOpacity ?? 1;
        material.transparent = Boolean(selectedStructure && !isSelected)
          || Boolean(material.userData.baseTransparent);
        material.depthWrite = !(selectedStructure && !isSelected);

        if (material instanceof MeshStandardMaterial) {
          const baseEmissive = material.userData.baseEmissive as Color | undefined;
          material.emissive.copy(
            isSelected
              ? new Color(organ.accent).multiplyScalar(0.2)
              : baseEmissive ?? new Color(0x000000),
          );
          material.emissiveIntensity = isSelected
            ? 0.8
            : material.userData.baseEmissiveIntensity ?? 0;
        }
        material.needsUpdate = true;
      });
    });
  }, [clippingPlane, organ.accent, scene, sectionMode, selectedStructure]);

  const handleStructureClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const name = event.object.name || event.object.parent?.name || "Unnamed structure";
    onSelectStructure(selectedStructure === name ? null : name);
  };

  return (
    <group>
      <group position={transform.position} scale={transform.scale}>
        <primitive object={scene} onPointerDown={handleStructureClick} />
      </group>

      {showLabels
        && organ.hotspots.map((hotspot, index) => (
          <Html
            key={hotspot.id}
            position={hotspot.position}
            center
            zIndexRange={[30 - index, 0]}
          >
            <button
              type="button"
              className="viewer-hotspot"
              onClick={(event) => {
                event.stopPropagation();
                onSelectHotspot(hotspot.id);
              }}
              style={{ "--hotspot-accent": organ.accent } as React.CSSProperties}
            >
              <span aria-hidden="true">{index + 1}</span>
              <strong>{localize(hotspot.name, lang)}</strong>
            </button>
          </Html>
        ))}
    </group>
  );
}

const fatLobules = [
  [-0.92, -0.43, 0.74, 0.17],
  [-0.58, -0.48, 0.75, 0.2],
  [-0.2, -0.4, 0.74, 0.18],
  [0.18, -0.48, 0.75, 0.21],
  [0.58, -0.4, 0.74, 0.18],
  [0.92, -0.49, 0.73, 0.2],
] as const;

function SkinPatchModel({
  organ,
  lang,
  sectionMode,
  sectionDepth,
  selectedStructure,
  showLabels,
  onSelectStructure,
  onSelectHotspot,
}: RenderModelProps) {
  const clippingPlane = useMemo(
    () => new Plane(new Vector3(-1, 0, 0), sectionDepth * 1.12),
    [sectionDepth],
  );
  const arterialCurve = useMemo(
    () => new CatmullRomCurve3([
      new Vector3(-1.02, -0.12, 0.76),
      new Vector3(-0.52, -0.2, 0.77),
      new Vector3(0, -0.1, 0.76),
      new Vector3(0.52, -0.19, 0.77),
      new Vector3(1.02, -0.13, 0.75),
    ]),
    [],
  );
  const venousCurve = useMemo(
    () => new CatmullRomCurve3([
      new Vector3(-1.02, -0.28, 0.75),
      new Vector3(-0.48, -0.22, 0.76),
      new Vector3(0.02, -0.31, 0.75),
      new Vector3(0.54, -0.24, 0.76),
      new Vector3(1.02, -0.3, 0.74),
    ]),
    [],
  );

  const materialState = (name: string) => {
    const isSelected = selectedStructure === name;
    const isFaded = Boolean(selectedStructure && !isSelected);

    return {
      clippingPlanes: sectionMode ? [clippingPlane] : [],
      depthWrite: !isFaded,
      emissive: isSelected ? organ.accent : "#000000",
      emissiveIntensity: isSelected ? 0.48 : 0,
      opacity: isFaded ? 0.14 : 1,
      side: sectionMode ? DoubleSide : FrontSide,
      transparent: isFaded,
    };
  };

  const handleStructureClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const name = event.object.name || event.object.parent?.name || "Unnamed structure";
    onSelectStructure(selectedStructure === name ? null : name);
  };

  return (
    <group>
      <group scale={0.82} rotation={[-0.08, -0.18, 0]} position={[0, -0.06, 0]}>
        <RoundedBox
          name="Epidermis"
          args={[2.34, 0.2, 1.42]}
          radius={0.055}
          smoothness={4}
          position={[0, 0.56, 0]}
          onPointerDown={handleStructureClick}
        >
          <meshPhysicalMaterial
            color="#d8a07e"
            roughness={0.58}
            clearcoat={0.18}
            clearcoatRoughness={0.7}
            envMapIntensity={0.82}
            {...materialState("Epidermis")}
          />
        </RoundedBox>

        <RoundedBox
          name="Dermis"
          args={[2.31, 0.58, 1.39]}
          radius={0.07}
          smoothness={4}
          position={[0, 0.16, 0]}
          onPointerDown={handleStructureClick}
        >
          <meshPhysicalMaterial
            color="#b9655e"
            roughness={0.62}
            clearcoat={0.1}
            clearcoatRoughness={0.74}
            envMapIntensity={0.76}
            {...materialState("Dermis")}
          />
        </RoundedBox>

        <RoundedBox
          name="Subcutaneous tissue"
          args={[2.25, 0.52, 1.34]}
          radius={0.1}
          smoothness={4}
          position={[0, -0.41, 0]}
          onPointerDown={handleStructureClick}
        >
          <meshPhysicalMaterial
            color="#d6a752"
            roughness={0.72}
            clearcoat={0.04}
            envMapIntensity={0.64}
            {...materialState("Subcutaneous tissue")}
          />
        </RoundedBox>

        {fatLobules.map(([x, y, z, radius], index) => (
          <mesh
            key={`${x}-${index}`}
            name="Adipose lobule"
            position={[x, y, z]}
            scale={[1.18, 0.78, 0.52]}
            onPointerDown={handleStructureClick}
          >
            <sphereGeometry args={[radius, 20, 14]} />
            <meshPhysicalMaterial
              color={index % 2 === 0 ? "#edc96d" : "#dfb553"}
              roughness={0.66}
              envMapIntensity={0.72}
              {...materialState("Adipose lobule")}
            />
          </mesh>
        ))}

        <RoundedBox
          name="Hair follicle"
          args={[0.15, 0.72, 0.15]}
          radius={0.07}
          smoothness={4}
          position={[0.5, 0.14, 0.75]}
          rotation={[0, 0, -0.2]}
          onPointerDown={handleStructureClick}
        >
          <meshPhysicalMaterial
            color="#7b4b3c"
            roughness={0.5}
            envMapIntensity={0.78}
            {...materialState("Hair follicle")}
          />
        </RoundedBox>

        <mesh
          name="Hair shaft"
          position={[0.42, 0.88, 0.75]}
          rotation={[0, 0, -0.2]}
          onPointerDown={handleStructureClick}
        >
          <cylinderGeometry args={[0.028, 0.04, 0.78, 14]} />
          <meshPhysicalMaterial
            color="#34221d"
            roughness={0.42}
            envMapIntensity={0.86}
            {...materialState("Hair shaft")}
          />
        </mesh>

        <mesh
          name="Sweat gland"
          position={[-0.54, -0.04, 0.76]}
          onPointerDown={handleStructureClick}
        >
          <torusKnotGeometry args={[0.12, 0.026, 56, 10, 2, 3]} />
          <meshPhysicalMaterial
            color="#e5a2a0"
            roughness={0.48}
            envMapIntensity={0.82}
            {...materialState("Sweat gland")}
          />
        </mesh>

        <mesh
          name="Dermal artery"
          onPointerDown={handleStructureClick}
        >
          <tubeGeometry args={[arterialCurve, 36, 0.028, 10, false]} />
          <meshPhysicalMaterial
            color="#a63f45"
            roughness={0.38}
            envMapIntensity={0.92}
            {...materialState("Dermal artery")}
          />
        </mesh>

        <mesh
          name="Dermal vein"
          onPointerDown={handleStructureClick}
        >
          <tubeGeometry args={[venousCurve, 36, 0.027, 10, false]} />
          <meshPhysicalMaterial
            color="#356f83"
            roughness={0.4}
            envMapIntensity={0.9}
            {...materialState("Dermal vein")}
          />
        </mesh>
      </group>

      {showLabels
        && organ.hotspots.map((hotspot, index) => (
          <Html
            key={hotspot.id}
            position={hotspot.position}
            center
            zIndexRange={[30 - index, 0]}
          >
            <button
              type="button"
              className="viewer-hotspot"
              onClick={(event) => {
                event.stopPropagation();
                onSelectHotspot(hotspot.id);
              }}
              style={{ "--hotspot-accent": organ.accent } as React.CSSProperties}
            >
              <span aria-hidden="true">{index + 1}</span>
              <strong>{localize(hotspot.name, lang)}</strong>
            </button>
          </Html>
        ))}
    </group>
  );
}

function RenderModel(props: RenderModelProps) {
  if (props.organ.modelKind === "skin-patch") {
    return <SkinPatchModel {...props} />;
  }

  if (typeof props.organ.model === "string") {
    const organ: GltfOrgan = { ...props.organ, model: props.organ.model };
    return <OrganModel {...props} organ={organ} />;
  }

  throw new Error(`No renderable model configured for ${props.organ.id}`);
}

function LoadingModel({ label }: { label: string }) {
  return (
    <Html center>
      <div className="viewer-loader" role="status">
        <span aria-hidden="true" />
        {label}
      </div>
    </Html>
  );
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

export function AnatomyViewer(props: AnatomyViewerProps) {
  const [webglSupported] = useState(canCreateWebGLContext);

  useEffect(() => {
    if (props.nextModel) useGLTF.preload(props.nextModel);
  }, [props.nextModel]);

  if (!webglSupported) {
    return (
      <div
        className="viewer-webgl-fallback"
        role="img"
        aria-label={`${localize(props.organ.name, props.lang)} 3D model unavailable`}
      >
        <span aria-hidden="true">3D</span>
        <strong>{localize(props.organ.name, props.lang)}</strong>
        <p>{props.webglFallbackLabel}</p>
      </div>
    );
  }

  return (
    <Canvas
      key={`anatomy-viewer-${props.resetSignal}`}
      camera={{ position: [0, 0.08, 4.25], fov: 34, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      frameloop={props.autoRotate ? "always" : "demand"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.toneMappingExposure = 1.06;
      }}
      onPointerMissed={() => props.onSelectStructure(null)}
      role="img"
      aria-label={`${localize(props.organ.name, props.lang)} 3D model`}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.26} />
      <hemisphereLight args={["#dff7ff", "#180d0c", 0.62]} />
      <directionalLight position={[3.8, 5.2, 4.4]} intensity={1.92} color="#fff5e9" />
      <directionalLight position={[-4.5, 1.4, 2.2]} intensity={0.72} color="#9adce2" />
      <directionalLight position={[0, -3.5, -3.5]} intensity={0.44} color={props.organ.accent} />

      <ModelErrorBoundary
        model={props.organ.model ?? props.organ.modelKind ?? props.organ.id}
        label={props.errorLabel}
      >
        <Suspense fallback={<LoadingModel label={props.loadingLabel} />}>
          <RenderModel key={props.organ.id} {...props} />
        </Suspense>
      </ModelErrorBoundary>

      {/* Spotlight pool (dark mode) + contact shadow (light mode) */}
      <SpotlightPool accent={props.organ.accent} />
      <ContactShadows
        key={`shadow-${props.organ.id}-${props.autoRotate ? "moving" : "still"}`}
        position={[0, -1.08, 0]}
        scale={6.5}
        far={2.4}
        blur={2.5}
        opacity={0.55}
        resolution={256}
        color="#1c2f2b"
        frames={props.autoRotate ? Infinity : 1}
      />

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        autoRotate={props.autoRotate}
        autoRotateSpeed={0.62}
        enableDamping
        dampingFactor={0.075}
        minDistance={2.55}
        maxDistance={6.4}
        minPolarAngle={0.18}
        maxPolarAngle={Math.PI - 0.18}
      />
    </Canvas>
  );
}

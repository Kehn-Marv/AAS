export type Language = "en";

export type LocalizedText = {
  en: string;
};

export type BodySystem =
  | "cardiovascular"
  | "nervous"
  | "respiratory"
  | "digestive"
  | "urinary"
  | "sensory"
  | "endocrine"
  | "lymphatic"
  | "integumentary";

export type Hotspot = {
  id: string;
  name: LocalizedText;
  detail: LocalizedText;
  position: [number, number, number];
};

export type AnatomyFact = {
  label: LocalizedText;
  value: LocalizedText;
  sourceIds?: string[];
  reviewStatus?: "draft" | "reviewed";
  lastReviewed?: string;
};

export type AnatomyQuiz = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
  explanation: LocalizedText;
};

export type Organ = {
  id: string;
  name: LocalizedText;
  latin: string;
  system: BodySystem;
  model?: string;
  modelKind?: "gltf" | "skin-patch";
  modelSource?: "hra" | "local";
  accent: string;
  summary: LocalizedText;
  role: LocalizedText;
  modelScope?: LocalizedText;
  facts: AnatomyFact[];
  functions: LocalizedText[];
  hotspots: Hotspot[];
  quiz: AnatomyQuiz;
};

const t = (en: string): LocalizedText => ({ en });

export const systems: Record<BodySystem, LocalizedText> = {
  cardiovascular: t("Cardiovascular"),
  nervous: t("Nervous"),
  respiratory: t("Respiratory"),
  digestive: t("Digestive"),
  urinary: t("Urinary"),
  sensory: t("Sensory"),
  endocrine: t("Endocrine"),
  lymphatic: t("Lymphatic and immune"),
  integumentary: t("Integumentary"),
};

export const organs: Organ[] = [
  {
    id: "heart",
    name: t("Heart"),
    latin: "Cor",
    system: "cardiovascular",
    model: "/models/heart.glb",
    accent: "#f26f65",
    summary: t(
      "A hollow muscular organ whose rhythmic contractions move blood through pulmonary and systemic circulation.",
    ),
    role: t("Keeps oxygen, nutrients, and metabolic waste moving through the body."),
    facts: [
      { label: t("Size"), value: t("About the size of a fist"), sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: t("Weight"), value: t("About 250 to 350 g in adults"), sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: t("Location"), value: t("In the mediastinum, behind the sternum"), sourceIds: ["openstax"], reviewStatus: "draft" },
      { label: t("Resting output"), value: t("Roughly 5 L of blood per minute"), sourceIds: ["openstax"], reviewStatus: "draft" },
    ],
    functions: [
      t("The right heart pumps deoxygenated blood to the lungs"),
      t("The left heart pumps oxygenated blood to the body"),
      t("The conduction system coordinates each contraction"),
    ],
    hotspots: [
      { id: "aorta", name: t("Aorta"), detail: t("The largest artery carrying oxygenated blood into systemic circulation."), position: [0, 0.72, 0] },
      { id: "ventricle", name: t("Left ventricle"), detail: t("The thickest walled chamber, responsible for pumping blood to the body."), position: [-0.28, -0.2, 0.38] },
      { id: "atrium", name: t("Right atrium"), detail: t("Receives venous blood returning from systemic circulation."), position: [0.3, 0.28, 0.25] },
    ],
    quiz: {
      question: t("Which heart chamber has the thickest wall?"),
      options: [t("Right atrium"), t("Left atrium"), t("Right ventricle"), t("Left ventricle")],
      answer: 3,
      explanation: t("The left ventricle must generate enough pressure to drive blood through systemic circulation."),
    },
  },
  {
    id: "brain",
    name: t("Brain"),
    latin: "Encephalon",
    system: "nervous",
    model: "/models/brain.glb",
    accent: "#d59bbb",
    summary: t("The core of the central nervous system, integrating sensation and supporting movement, cognition, memory, language, and emotion."),
    role: t("Receives, integrates, and sends signals that sustain behavior and homeostasis."),
    facts: [
      { label: t("Weight"), value: t("About 1.3 to 1.4 kg in adults") },
      { label: t("Major regions"), value: t("Cerebrum, cerebellum, and brainstem") },
      { label: t("Protection"), value: t("Skull, meninges, and cerebrospinal fluid") },
      { label: t("Energy demand"), value: t("About one fifth of resting energy use") },
    ],
    functions: [
      t("The cerebral cortex supports perception and higher cognition"),
      t("The cerebellum coordinates balance and fine movement"),
      t("The brainstem regulates basic functions such as breathing and circulation"),
    ],
    hotspots: [
      { id: "frontal", name: t("Frontal lobe"), detail: t("Supports planning, decision making, speech production, and voluntary movement."), position: [-0.4, 0.3, 0.42] },
      { id: "cerebellum", name: t("Cerebellum"), detail: t("Coordinates movement, posture, and balance."), position: [0.42, -0.34, 0.2] },
      { id: "temporal", name: t("Temporal lobe"), detail: t("Contributes to hearing, memory, and language comprehension."), position: [0.44, -0.02, 0.42] },
    ],
    quiz: {
      question: t("Which region mainly coordinates balance and fine movement?"),
      options: [t("Cerebellum"), t("Thalamus"), t("Frontal lobe"), t("Pituitary gland")],
      answer: 0,
      explanation: t("The cerebellum integrates sensory information to refine movement and maintain posture."),
    },
  },
  {
    id: "lungs",
    name: t("Lungs"),
    latin: "Pulmones",
    system: "respiratory",
    model: "/models/lungs.glb",
    accent: "#ef9f9b",
    summary: t("Paired spongy organs in the thorax that exchange oxygen and carbon dioxide between alveoli and capillaries."),
    role: t("Supplies oxygen for cellular metabolism and removes carbon dioxide."),
    facts: [
      { label: t("Lobes"), value: t("Three on the right, two on the left") },
      { label: t("Location"), value: t("In the thorax, on either side of the heart") },
      { label: t("Exchange unit"), value: t("Alveoli") },
      { label: t("Main muscle"), value: t("Diaphragm") },
    ],
    functions: [
      t("Ventilation moves air into and out of the lungs"),
      t("The alveolar membrane enables gas diffusion"),
      t("The respiratory system also contributes to acid base balance"),
    ],
    hotspots: [
      { id: "trachea", name: t("Trachea"), detail: t("Carries air from the larynx toward the main bronchi."), position: [0, 0.82, 0] },
      { id: "right-lung", name: t("Right lung"), detail: t("Usually divided into superior, middle, and inferior lobes."), position: [-0.43, 0.05, 0.25] },
      { id: "left-lung", name: t("Left lung"), detail: t("Has a cardiac notch that accommodates the heart."), position: [0.43, 0.05, 0.25] },
    ],
    quiz: {
      question: t("Where does most oxygen and carbon dioxide exchange occur?"),
      options: [t("Trachea"), t("Alveoli"), t("Pleura"), t("Larynx")],
      answer: 1,
      explanation: t("Thin alveolar walls lie next to capillaries, enabling rapid gas diffusion."),
    },
  },
  {
    id: "liver",
    name: t("Liver"),
    latin: "Hepar",
    system: "digestive",
    model: "/models/liver.glb",
    accent: "#bc6d5e",
    summary: t("The largest solid organ, involved in nutrient metabolism, detoxification, bile production, protein synthesis, and energy storage."),
    role: t("Processes nutrients arriving from the digestive tract and maintains many metabolic balances."),
    facts: [
      { label: t("Weight"), value: t("About 1.4 to 1.6 kg in adults") },
      { label: t("Location"), value: t("Right upper abdomen, below the diaphragm") },
      { label: t("Dual blood supply"), value: t("Hepatic artery and portal vein") },
      { label: t("Secretion"), value: t("Bile") },
    ],
    functions: [
      t("Regulates carbohydrate, lipid, and amino acid metabolism"),
      t("Synthesizes albumin and many clotting factors"),
      t("Transforms and clears many foreign and endogenous substances"),
    ],
    hotspots: [
      { id: "right-lobe", name: t("Right lobe"), detail: t("The largest lobe of the liver."), position: [-0.32, 0.12, 0.25] },
      { id: "left-lobe", name: t("Left lobe"), detail: t("Extends across the midline of the body."), position: [0.38, 0.1, 0.25] },
      { id: "porta", name: t("Porta hepatis region"), detail: t("The region where vessels, ducts, and nerves enter or leave the liver."), position: [0.03, -0.26, 0.3] },
    ],
    quiz: {
      question: t("Which digestive secretion is produced by the liver?"),
      options: [t("Insulin"), t("Bile"), t("Gastric acid"), t("Saliva")],
      answer: 1,
      explanation: t("Hepatocytes produce bile, which can be stored and concentrated in the gallbladder."),
    },
  },
  {
    id: "gallbladder",
    name: t("Gallbladder"),
    latin: "Vesica biliaris",
    system: "digestive",
    model: "/models/gallbladder.glb",
    accent: "#74a96f",
    summary: t(
      "A pear shaped muscular sac below the liver that stores and concentrates bile, then releases it into the duodenum when digestion requires it.",
    ),
    role: t("Times the delivery of bile to the small intestine to support lipid digestion and absorption."),
    facts: [
      { label: t("Length"), value: t("About 8 to 10 cm in adults") },
      { label: t("Location"), value: t("In a fossa beneath the right lobe of the liver") },
      { label: t("Main regions"), value: t("Fundus, body, and neck") },
      { label: t("Connecting duct"), value: t("Cystic duct") },
    ],
    functions: [
      t("Stores bile continuously produced by the liver between meals"),
      t("Concentrates bile by absorbing water and ions"),
      t("Contracts to release bile through the cystic and common bile ducts"),
    ],
    hotspots: [
      { id: "fundus", name: t("Fundus"), detail: t("The broad rounded end of the gallbladder."), position: [0, -0.56, 0.18] },
      { id: "body", name: t("Body"), detail: t("The main region that stores and concentrates bile."), position: [0.08, 0.02, 0.24] },
      { id: "neck", name: t("Neck"), detail: t("Narrows and continues into the cystic duct."), position: [-0.06, 0.58, 0.14] },
    ],
    quiz: {
      question: t("What is the primary function of the gallbladder?"),
      options: [t("Produce bile"), t("Store and concentrate bile"), t("Produce insulin"), t("Absorb oxygen")],
      answer: 1,
      explanation: t("Bile is produced by the liver; the gallbladder stores, concentrates, and releases it as needed."),
    },
  },
  {
    id: "kidney",
    name: t("Kidneys"),
    latin: "Renes",
    system: "urinary",
    model: "/models/kidney.glb",
    accent: "#cf796d",
    summary: t("Paired retroperitoneal organs that form urine through filtration and selective reabsorption while regulating the internal environment."),
    role: t("Regulates fluids, ions, acid base balance, and blood pressure while excreting metabolic waste."),
    facts: [
      { label: t("Location"), value: t("On either side of the spine, behind the peritoneum") },
      { label: t("Functional unit"), value: t("Nephron") },
      { label: t("Blood inflow"), value: t("Renal artery") },
      { label: t("Urine outflow"), value: t("Ureter") },
    ],
    functions: [
      t("Glomeruli filter blood plasma"),
      t("Renal tubules reclaim needed water and solutes"),
      t("Produces regulators including renin and erythropoietin"),
    ],
    hotspots: [
      { id: "cortex", name: t("Renal cortex"), detail: t("Contains renal corpuscles and parts of renal tubules."), position: [0.22, 0.28, 0.25] },
      { id: "medulla", name: t("Renal medulla"), detail: t("Contains renal pyramids and contributes to urine concentration."), position: [0.12, -0.05, 0.28] },
      { id: "ureter", name: t("Ureter"), detail: t("Carries urine from the renal pelvis to the bladder."), position: [0, -0.55, 0.05] },
    ],
    quiz: {
      question: t("What is the basic functional unit of the kidney?"),
      options: [t("Alveolus"), t("Hepatic lobule"), t("Nephron"), t("Neuron")],
      answer: 2,
      explanation: t("Each nephron includes a filtration apparatus and tubules that adjust the filtrate."),
    },
  },
  {
    id: "eye",
    name: t("Eye"),
    latin: "Bulbus oculi",
    system: "sensory",
    model: "/models/eye.glb",
    accent: "#78acd0",
    summary: t("A sensory organ that focuses light on the retina, where photoreceptors convert it into neural signals."),
    role: t("Collects light, forms a focused image, and sends visual information to the brain."),
    facts: [
      { label: t("Diameter"), value: t("About 24 mm in adults") },
      { label: t("Clear front surface"), value: t("Cornea") },
      { label: t("Light sensing layer"), value: t("Retina") },
      { label: t("Signal pathway"), value: t("Optic nerve") },
    ],
    functions: [
      t("The cornea and lens refract light together"),
      t("The iris regulates how much light enters"),
      t("The retina converts light into neural activity"),
    ],
    hotspots: [
      { id: "cornea", name: t("Cornea"), detail: t("The clear curved front surface and a major refractive element."), position: [0.55, 0, 0] },
      { id: "lens", name: t("Lens"), detail: t("Changes shape to help focus on near or distant objects."), position: [0.2, 0, 0] },
      { id: "optic", name: t("Optic nerve"), detail: t("Carries signals generated by the retina toward the brain."), position: [-0.56, 0, 0] },
    ],
    quiz: {
      question: t("Which layer of the eye contains photoreceptors?"),
      options: [t("Sclera"), t("Cornea"), t("Retina"), t("Iris")],
      answer: 2,
      explanation: t("Rods and cones in the retina detect light."),
    },
  },
  {
    id: "pancreas",
    name: t("Pancreas"),
    latin: "Pancreas",
    system: "endocrine",
    model: "/models/pancreas.glb",
    accent: "#e6b66f",
    summary: t("An organ with exocrine and endocrine roles, producing digestive enzymes and hormones that regulate blood glucose."),
    role: t("Helps digest protein, fat, and carbohydrate while stabilizing blood glucose."),
    facts: [
      { label: t("Location"), value: t("Behind the stomach, across the upper abdomen") },
      { label: t("Exocrine role"), value: t("Digestive enzymes and bicarbonate") },
      { label: t("Endocrine role"), value: t("Islet hormones") },
      { label: t("Key glucose hormones"), value: t("Insulin and glucagon") },
    ],
    functions: [
      t("Acinar cells produce digestive enzymes"),
      t("Duct cells secrete bicarbonate"),
      t("Islet cells release hormones that regulate blood glucose"),
    ],
    hotspots: [
      { id: "head", name: t("Head"), detail: t("Sits within the curve formed by the duodenum."), position: [0.38, -0.05, 0.1] },
      { id: "body", name: t("Body"), detail: t("The central portion crossing the abdominal midline."), position: [0, 0.05, 0.1] },
      { id: "tail", name: t("Tail"), detail: t("Extends leftward toward the spleen."), position: [-0.42, 0.06, 0.1] },
    ],
    quiz: {
      question: t("Which pancreatic hormone mainly lowers blood glucose?"),
      options: [t("Epinephrine"), t("Insulin"), t("Glucagon"), t("Thyroxine")],
      answer: 1,
      explanation: t("Insulin promotes glucose uptake by cells and supports energy storage."),
    },
  },
  {
    id: "small_intestine",
    name: t("Ileum"),
    latin: "Ileum",
    system: "digestive",
    model: "/models/small_intestine.glb",
    accent: "#e39a93",
    summary: t(
      "The final segment of the small intestine, linking the jejunum to the cecum while continuing digestion and absorption, including terminal uptake of bile salts and vitamin B12.",
    ),
    role: t("Completes absorption in the distal small bowel and passes intestinal contents toward the large intestine."),
    modelScope: t("This model represents the ileum only; the duodenum and jejunum are not included."),
    facts: [
      { label: t("Part of"), value: t("Final segment of the small intestine") },
      { label: t("Length"), value: t("About 1.8 m in a living adult") },
      { label: t("Proximal connection"), value: t("Jejunum") },
      { label: t("Distal connection"), value: t("Ileocecal valve and cecum") },
    ],
    functions: [
      t("Absorbs bile salts and vitamin B12 bound to intrinsic factor"),
      t("Continues absorbing water, electrolytes, and digested nutrients"),
      t("Lymphoid tissue helps monitor antigens in the intestinal lumen"),
    ],
    hotspots: [
      { id: "loops", name: t("Ileal loops"), detail: t("Coiled intestinal loops accommodate substantial length within the abdomen."), position: [0, 0.16, 0.38] },
      { id: "mesenteric", name: t("Mesenteric border"), detail: t("The mesentery attaches here and carries vessels, nerves, and lymphatics."), position: [-0.42, -0.08, 0.18] },
      { id: "terminal", name: t("Terminal ileum"), detail: t("Joins the cecum at the ileocecal valve."), position: [0.4, -0.44, 0.22] },
    ],
    quiz: {
      question: t("Which structure connects the ileum to the cecum?"),
      options: [t("Pylorus"), t("Ileocecal valve"), t("Cardia"), t("Cystic duct")],
      answer: 1,
      explanation: t("The terminal ileum enters the cecum at the ileocecal valve."),
    },
  },
  {
    id: "intestine",
    name: t("Large intestine"),
    latin: "Intestinum crassum",
    system: "digestive",
    model: "/models/intestine.glb",
    accent: "#d89278",
    summary: t("The final digestive segment, absorbing remaining water and electrolytes and forming feces from indigestible material."),
    role: t("Recovers water and electrolytes, hosts gut microbes, and stores material before defecation."),
    facts: [
      { label: t("Main parts"), value: t("Cecum, colon, rectum, and anal canal") },
      { label: t("Length"), value: t("About 1.5 m in adults") },
      { label: t("Main absorption"), value: t("Water and electrolytes") },
      { label: t("Feature"), value: t("Haustra and teniae coli") },
    ],
    functions: [
      t("Absorbs remaining water from digestive contents"),
      t("Gut microbes metabolize some undigested substrates"),
      t("Moves, compacts, and stores fecal material"),
    ],
    hotspots: [
      { id: "ascending", name: t("Ascending colon"), detail: t("Runs upward from the cecum to the hepatic flexure."), position: [-0.42, 0.1, 0.25] },
      { id: "transverse", name: t("Transverse colon"), detail: t("The segment crossing the upper abdomen."), position: [0, 0.48, 0.22] },
      { id: "sigmoid", name: t("Sigmoid colon"), detail: t("The S shaped segment linking the descending colon to the rectum."), position: [0.32, -0.44, 0.2] },
    ],
    quiz: {
      question: t("What is the main absorptive role of the large intestine?"),
      options: [t("Amino acids"), t("Dietary fats"), t("Water and electrolytes"), t("Oxygen")],
      answer: 2,
      explanation: t("Most nutrients are absorbed in the small intestine, while the large intestine mainly recovers remaining water and electrolytes."),
    },
  },
  {
    id: "spleen",
    name: t("Spleen"),
    latin: "Lien",
    system: "lymphatic",
    model: "/models/spleen.glb",
    accent: "#a887b1",
    summary: t("A lymphatic organ in the left upper abdomen that filters blood, removes aged red cells, and supports immune responses to blood borne pathogens."),
    role: t("Monitors blood for antigens, recycles blood cell components, and stores a portion of platelets."),
    facts: [
      { label: t("Location"), value: t("Left upper abdomen, deep to ribs 9 to 11") },
      { label: t("White pulp"), value: t("Immune surveillance") },
      { label: t("Red pulp"), value: t("Blood filtration") },
      { label: t("Belongs to"), value: t("Lymphatic and immune system") },
    ],
    functions: [
      t("Removes aged or damaged red blood cells"),
      t("Activates immune responses to blood borne antigens"),
      t("Recycles iron from red blood cells"),
    ],
    hotspots: [
      { id: "superior", name: t("Superior pole"), detail: t("The upper end of the spleen near the diaphragm."), position: [0, 0.42, 0.08] },
      { id: "hilum", name: t("Splenic hilum"), detail: t("The indented region where splenic vessels and nerves enter or leave."), position: [0.12, 0, 0.2] },
      { id: "inferior", name: t("Inferior pole"), detail: t("The lower end of the spleen."), position: [0, -0.42, 0.08] },
    ],
    quiz: {
      question: t("What is one major role of splenic red pulp?"),
      options: [t("Producing bile"), t("Filtering blood"), t("Secreting insulin"), t("Forming urine")],
      answer: 1,
      explanation: t("Red pulp removes aged red cells and recycles some of their components."),
    },
  },
  {
    id: "thymus",
    name: t("Thymus"),
    latin: "Thymus",
    system: "lymphatic",
    model: "/models/thymus.glb",
    accent: "#d3b887",
    summary: t(
      "A primary lymphoid organ behind the sternum and above the heart that provides the environment for immature T cells to develop, undergo selection, and establish self tolerance.",
    ),
    role: t("Produces mature T cells that can recognize foreign antigens without strongly attacking the body's own tissues."),
    modelScope: t("This model represents the left thymic lobe only; the right lobe is not included."),
    facts: [
      { label: t("Location"), value: t("Anterior superior mediastinum, behind the sternum") },
      { label: t("Shape"), value: t("Usually composed of right and left lobes") },
      { label: t("Microscopic regions"), value: t("Cortex and medulla") },
      { label: t("Age change"), value: t("Progressively involutes and is replaced by fat after puberty") },
    ],
    functions: [
      t("Supports maturation of T cell precursors arriving from bone marrow"),
      t("Uses positive selection to retain cells that recognize self MHC"),
      t("Uses negative selection to remove cells that strongly recognize self antigens"),
    ],
    hotspots: [
      { id: "superior", name: t("Superior pole"), detail: t("The upper end of the left thymic lobe extending toward the neck."), position: [0, 0.58, 0.16] },
      { id: "lobe", name: t("Left thymic lobe"), detail: t("Built from many thymic lobules containing cortex and medulla."), position: [0.08, 0.04, 0.26] },
      { id: "inferior", name: t("Inferior pole"), detail: t("The lower end of the left thymic lobe near the pericardium."), position: [-0.04, -0.56, 0.16] },
    ],
    quiz: {
      question: t("Where do immature T cells primarily undergo selection and maturation?"),
      options: [t("Thymus"), t("Gallbladder"), t("Pancreas"), t("Kidney")],
      answer: 0,
      explanation: t("The thymic cortex and medulla provide the environment required for T cell development and selection."),
    },
  },
  {
    id: "skin",
    name: t("Skin"),
    latin: "Cutis",
    system: "integumentary",
    modelKind: "skin-patch",
    modelSource: "local",
    accent: "#d5a07d",
    summary: t("A layered organ covering the body surface, forming a barrier and contributing to sensation, temperature control, immune defense, and vitamin D synthesis."),
    role: t("Creates a regulated protective interface between the body and its environment."),
    modelScope: t("This code generated model is a local skin cross section and contains no whole body or genital anatomy."),
    facts: [
      { label: t("Main layers"), value: t("Epidermis and dermis") },
      { label: t("Subcutaneous tissue"), value: t("Lies below the skin and is not part of the skin itself") },
      { label: t("Largest organ"), value: t("By surface area") },
      { label: t("Barrier protein"), value: t("Keratin") },
    ],
    functions: [
      t("Limits water loss and blocks many external agents"),
      t("Sensory receptors detect touch, temperature, and pain"),
      t("Blood flow and sweating help regulate body temperature"),
    ],
    hotspots: [
      { id: "epidermis", name: t("Epidermis"), detail: t("The avascular outer epithelium that forms the main barrier."), position: [-0.7, 0.7, 0.82] },
      { id: "dermis", name: t("Dermis"), detail: t("Connective tissue rich layer containing vessels, nerves, and appendages."), position: [0.5, 0.2, 0.82] },
      { id: "subcutis", name: t("Subcutaneous tissue"), detail: t("Composed mainly of loose connective tissue and adipose tissue."), position: [-0.62, -0.48, 0.82] },
    ],
    quiz: {
      question: t("What is the name of the outermost main layer of skin?"),
      options: [t("Epidermis"), t("Dermis"), t("Fascia"), t("Periosteum")],
      answer: 0,
      explanation: t("The epidermis is the outer layer of the skin, with the dermis beneath it."),
    },
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<string, Organ>;

export const anatomySources = [
  {
    id: "hra",
    title: t("Human Reference Atlas 3D Reference Object Library"),
    detail: t("Source of the 12 binary organ models. The objects are released under CC BY 4.0 and maintained by the HuBMAP Human Reference Atlas project."),
    url: "https://humanatlas.io/3d-reference-library",
  },
  {
    id: "openstax",
    title: t("OpenStax Anatomy and Physiology 2e"),
    detail: t("A foundational reference for organ structure and physiology, licensed under CC BY 4.0."),
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  },
  {
    id: "medlineplus",
    title: t("U.S. National Library of Medicine MedlinePlus"),
    detail: t("A public reference entry point for health and body systems."),
    url: "https://medlineplus.gov/anatomy.html",
  },
];

export const localize = (value: LocalizedText, lang: Language) => value[lang];

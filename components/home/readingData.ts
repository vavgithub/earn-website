export const READING_EYEBROW = "Further Reading";
export const READING_HEADING =
  "Go deeper into the forces moving the energy markets.";
export const READING_MORE = "View all insights + resources →";

export type ReadingCard = {
  id: string;
  image: string;
  imageAlt: string;
  kicker: string;
  titleLead: string;
  titleTail?: string;
  body: string;
  action: string;
  actionCompact?: string;
  rounded?: boolean;
};

export const READING_CARDS: ReadingCard[] = [
  {
    id: "market",
    image: "/assets/images/reading/datacenter.png",
    imageAlt: "",
    kicker: "Market Analysis",
    titleLead: "Hyperscalers need energy.",
    titleTail: "They also need the data.",
    body: "How differing buyer requirements are creating a new interoperability challenge for energy producers.",
    action: "Read the analysis →",
  },
  {
    id: "regulatory",
    image: "/assets/images/reading/processing.png",
    imageAlt: "",
    kicker: "Regulatory Deep Dive",
    titleLead:
      "What the EU Methane Regulation actually requires of importers.",
    body: "From 1 January 2027, importers must supply verified methane data. How trace and claim, certification, and OGMP 2.0 reporting reshape the verification infrastructure needed to sell into Europe.",
    action: "Read the deep dive →",
  },
  {
    id: "methodology",
    image: "/assets/images/reading/methodology.png",
    imageAlt: "",
    kicker: "Methodology",
    titleLead: "How verified records hold up under audit.",
    body: "Explore the methodologies, verification requirements, versioning, and governance rules behind EarnDLT records.",
    action: "Explore our methodologies →",
    actionCompact: "Explore methodologies →",
    rounded: true,
  },
];

export const ARCHITECTURE_EYEBROW = "The Architecture";

export const ARCHITECTURE_HEADING = "What makes the record portable.";

export const ARCHITECTURE_LEAD =
  "A verified record, a natural gas network model, a governance framework, and open agent access work together to make energy data portable across markets, standards, and systems.";

export type ArchitectureStep = {
  id: "record" | "network" | "trust" | "machine";
  index: string;
  title: string;
  kicker: string;
  body: [string, string];
};

export const ARCHITECTURE_STEPS: ArchitectureStep[] = [
  {
    id: "record",
    index: "01",
    title: "Verified Record",
    kicker: "Verified Record + Immutable Lineage +\nInteroperable Schema",
    body: [
      "A governed digital representation keeps energy connected to its provenance, attributes, methodology, verification, ownership, and commercial context as it moves and changes context.",
      "An extensible schema allows that same representation to move across commodities, methodologies, systems, and market requirements without rebuilding the underlying record.",
    ],
  },
  {
    id: "network",
    index: "02",
    title: "Natural Gas Network Model",
    kicker: "55K+ Verified Pipline Segments + Connections",
    body: [
      "A live model of the infrastructure, pathways, meter points, operators, and relationships through which gas actually moves.",
      "It grounds the governed representation in the physical system, connecting the record to where energy originates, how it moves and changes, and where it is ultimately delivered.",
    ],
  },
  {
    id: "trust",
    index: "03",
    title: "Trust + Governance",
    kicker: "Governance Framework + Token Methodologies + Standards Alignment",
    body: [
      "Trust and governance define how energy data and derived outputs are structured, calculated, verified, versioned, and interpreted, while maintaining alignment with relevant standards and reporting frameworks.",
      "Those rules remain connected to both the governed representation and the physical intelligence behind it, preserving how information was produced and making it trustworthy, comparable, and machine-operable.",
    ],
  },
  {
    id: "machine",
    index: "04",
    title: "Machine Interface",
    kicker: "MCP + APIs + SDKs + CUA",
    body: [
      "The machine interface makes governed data, context, and rules accessible to software, systems, people, and agents without losing their underlying meaning.",
      "It allows organizations to connect existing workflows and progressively automate how information is accessed, interpreted, and acted on without replacing the systems already in place.",
    ],
  },
];

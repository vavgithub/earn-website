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
    title: "Governed Representation",
    kicker: "EarnDLT Registry + Interoperable Schema",
    body: [
      "EarnDLT maintains the governed record on the Hedera blockchain, preserving an immutable history that connects energy to its provenance, attributes, methodology, verification, ownership, and commercial context.",
      "An extensible schema lets that same representation move across commodities, methodologies, and market requirements without rebuilding the underlying record.",
    ],
  },
  {
    id: "network",
    index: "02",
    title: "Physical Intelligence",
    kicker: "Natural Gas Network Model",
    body: [
      "Earn maps natural gas infrastructure across the Lower 48 and the EU, connecting pipelines, supply basins, operators, meter points, and delivery pathways into a unified model of the physical system.",
      "The model grounds each governed representation in real-world context, connecting the record to where the gas originates, how it moves and changes, and where it is delivered.",
    ],
  },
  {
    id: "trust",
    index: "03",
    title: "Trust + Governance",
    kicker: "Governance Framework + Token Methodologies + Standards Alignment",
    body: [
      "EarnDLT defines and versions the methodologies, verification requirements, and governance rules used to structure, calculate, and interpret governed energy data, while aligning them with relevant external standards and reporting frameworks.",
      "This governing environment applies across both the governed representation and physical intelligence, preserving how data and derived outputs were produced, verified, and governed throughout their lifecycle. Together with the shared schema, it provides the trusted semantic and rules layer that forms the machine-operable foundation.",
    ],
  },
  {
    id: "machine",
    index: "04",
    title: "Governed Representation",
    kicker: "MCP + APIs + SDKs + CUA",
    body: [
      "Earn provides multiple ways to access and act on the platform, from APIs and human-directed interfaces through supervised agents to agentic automation, allowing organizations to evolve at their own pace without replacing the systems and workflows already in place.",
      "The Machine Interface connects the governed core to the outside ecosystem, exposing data and governance through a unified semantic model that preserves their meaning across systems.",
    ],
  },
];

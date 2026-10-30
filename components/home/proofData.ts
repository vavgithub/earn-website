export const PROOF_EYEBROW = "Proof";

export const PROOF_HEADING_LEAD = "Proven across infrastructure, transactions,";

export const PROOF_HEADING_TAIL = "and published research.";

export type ProofItem = {
  id: string;
  logo: string;
  logoAlt: string;
  title: string;
  body: string;
  action: string;
  href?: string;
  openInNewTab?: boolean;
};

export const PROOF_ITEMS: ProofItem[] = [
  {
    id: "tallgrass",
    logo: "/assets/images/proof/tallgrass.svg",
    logoAlt: "Tallgrass",
    title: "Deployed in real energy infrastructure",
    body: "Earn’s governed data infrastructure is deployed across the 1,713-mile Rockies Express Pipeline, connecting verified energy records to physical movement across an interstate network.",
    action: "View the deployment →",
  },
  {
    id: "proman",
    logo: "/assets/images/proof/proman.svg",
    logoAlt: "Proman",
    title: "Used in a real commercial transaction",
    body: "First tokenized methanol cargo — proof the model extends beyond natural gas.\n“…paves the way for tokenisation to become an integral part of future methanol transactions.” - Tim Cornelius, Proman",
    action: "Read the case study →",
  },
  {
    id: "payne",
    logo: "/assets/images/proof/payne.png",
    logoAlt: "The Payne Institute for Public Policy",
    title: "Subject of published external research",
    body: "Research published by the Payne Institute examines QET-LNG against emerging regulatory, interoperability, and ISO-aligned requirements.",
    action: "Read the research →",
  },
];

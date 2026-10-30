export type ProductLogo = "greentruth" | "earn" | "e10" | "eig"

export type Product = {
  id: string
  logo: ProductLogo
  brand: string
  title: string
  body: string[]
  feature?: boolean
  span?: boolean
  iconUrl?: string
  linkLabel?: string
  href?: string
  openInNewTab?: boolean
  linkKind?: "textLink" | "button"
  iconMode?: "icon" | "image"
  filters?: string[]
  chips?: string[]
  textColor?: string
  textSize?: string
  linkColor?: string
  chipBackground?: string
  chipLabelColor?: string
}

export const PRODUCT_EYEBROW = "Earn EcoSystem"
export const PRODUCT_HEADING = "One verified record.\nEvery application built on top of it."
export const PRODUCT_LEAD =
  "Earn products share a single source of verified energy data — so what you prove once counts everywhere it's needed."
export const PRODUCT_LINK_LABEL = "Learn more →"
export const PRODUCT_CHIP_LABEL = "Chip Label"
export const PRODUCT_CHIP_COUNT = 6
export const PRODUCT_FILTER_LABEL = "Filter by Role"

export const PRODUCT_ROLES = [
  { id: "all", label: "All" },
  { id: "mineral", label: "Mineral Rights Owner" },
  { id: "producer", label: "Natural Gas Producer" },
  { id: "rng", label: "RNG  Producer" },
  { id: "gatherers", label: "Gatherers + Processors" },
  { id: "pipelines", label: "Pipelines" },
  { id: "storage", label: "Storage" },
  { id: "lng", label: "LNG Liquefaction" },
  { id: "marketers", label: "Marketers" },
  { id: "traders", label: "Traders" },
  { id: "importer", label: "LNG Importer" },
  { id: "datacenters", label: "Data Centers/Hyperscalers" },
  { id: "corporates", label: "Corporates/Industrial" },
  { id: "utilities", label: "Utilities" },
] as const

export const PRODUCTS: Product[] = [
  {
    id: "qet",
    logo: "greentruth",
    brand: "Greentruth",
    title: "QET Registry",
    feature: true,
    body: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  },
  {
    id: "verified",
    logo: "earn",
    brand: "EarnDLT",
    title: "Verified Energy Data Infrastructure",
    span: true,
    body: [
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci vel.",
      "Sed quia non numquam eius modi tempora incidunt.",
    ],
  },
  {
    id: "trading",
    logo: "e10",
    brand: "Enterprise 10",
    title: "Trading Desk (ETRM) Automation",
    body: [
      "t vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    ],
  },
  {
    id: "gas-day",
    logo: "eig",
    brand: "Energy Intelligence Graph",
    title: "Gas-Day Traceability",
    body: [
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla.",
    ],
  },
  {
    id: "resilience",
    logo: "eig",
    brand: "Energy Intelligence Graph",
    title: "Data Center Site Resilience Scoring",
    body: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  },
  {
    id: "vessel",
    logo: "eig",
    brand: "Energy Intelligence Graph",
    title: "Vessel Intelligence",
    body: [
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    ],
  },
  {
    id: "pipeline",
    logo: "eig",
    brand: "Energy Intelligence Graph",
    title: "Pipeline Pathway Mapping",
    body: [
      "t vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
    ],
  },
  {
    id: "gastrace",
    logo: "greentruth",
    brand: "Greentruth",
    title: "GasTrace",
    body: [
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
    ],
  },
  {
    id: "rng-forwards",
    logo: "greentruth",
    brand: "Greentruth",
    title: "RNG Forwards",
    body: [
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    ],
  },
]

export const PRODUCT_LOGOS: Record<ProductLogo, string> = {
  greentruth: "/assets/images/products/logo-greentruth.svg",
  earn: "/assets/images/products/logo-earn.svg",
  e10: "/assets/images/products/logo-e10.svg",
  eig: "/assets/images/products/logo-eig.svg",
}

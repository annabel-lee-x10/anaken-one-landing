function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type ProjectInput = {
  id: string;
  type: string;
  name: string;
  tagline: string;
  description?: string;
  url?: string;
  image: string;
  status?: "live" | "coming-soon";
};

export type Project = ProjectInput & { slug: string };

const RAW_PROJECTS: ProjectInput[] = [
  { id: "01", type: "Tool", name: "AI Fact-Check Engine", tagline: "Verify AI-generated claims in real time.", description: "Paste any text and get a structured breakdown of claims, sources, and confidence scores. Designed for anyone who needs to trust AI output before acting on it.", url: "https://aifactchecker.anaken.one/", image: "/projects/ai-fact-check.svg" },
  { id: "02", type: "Tool", name: "promptVault",          tagline: "Your personal prompt engineering HQ.",    description: "A local-first prompt library. Store, tag, and refine your best prompts across models and use cases — so good results are repeatable, not accidental.", url: "https://promptvault.anaken.one/", image: "/projects/promptvault.svg" },
  { id: "03", type: "Game", name: "Where's Munki",        tagline: "Find the hidden cat in a bustling city.",  description: "A Where's Wally-style browser game. Hunt for Munki, a sneaky golden kitten hiding in busy illustrated scenes. 10 levels, 3 difficulties, hints, and multiplayer challenges.", url: "https://wheresmunki.anaken.one/", image: "/projects/wheres-munki.svg" },
  { id: "04", type: "Guide", name: "Solo in Seoul",       tagline: "A solo traveller's guide to Seoul.",       description: "A curated single-page guide for solo travellers in Seoul. Browse venues by type or area, with hand-picked recommendations for cafes, restaurants, and experiences.", url: "https://soloinseoul.anaken.one/", image: "/projects/solo-in-seoul.svg" },
];

export const PROJECTS: Project[] = RAW_PROJECTS.map(p => ({ ...p, slug: toSlug(p.name) }));

export const TYPE_COLORS: Record<string, string> = {
  Tool:  "#3366FF",
  Game:  "#FF3355",
  Guide: "#FF3355",
  App:   "#3366FF",
};

export const TOOLS: Project[] = PROJECTS.filter(p => p.type === "Tool" || p.type === "App");
export const GAMES: Project[] = PROJECTS.filter(p => p.type === "Game" || p.type === "Guide");

export const SHIPPED_PROJECTS: Project[] = PROJECTS.filter(p => p.status !== "coming-soon");

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}

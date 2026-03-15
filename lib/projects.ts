function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type ProjectInput = {
  id: string;
  type: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  image: string;
};

export type Project = ProjectInput & { slug: string };

const RAW_PROJECTS: ProjectInput[] = [
  { id: "01", type: "Tool", name: "AI Fact-Check Engine", tagline: "Verify AI-generated claims in real time.", description: "Paste any text and get a structured breakdown of claims, sources, and confidence scores. Built to cut through AI hallucination at speed.", url: "https://aifactchecker.anaken.one/", image: "/projects/ai-fact-check.svg" },
  { id: "02", type: "Tool", name: "promptVault",          tagline: "Your personal prompt engineering HQ.",    description: "A local-first prompt library. Organize, tag, iterate, and recall your best prompts across models and use cases.", url: "https://promptvault.anaken.one/", image: "/projects/promptvault.svg" },
  { id: "03", type: "Game", name: "Space Commanders",     tagline: "Classic arcade shooter for the browser.", description: "A top-down space shooter with progressive difficulty and powerups. No dependencies, pure browser.", url: "https://space-commanders-classic.anaken.one/", image: "/projects/space-commanders.svg" },
  { id: "04", type: "Game", name: "Simple Snake",         tagline: "Classic snake game, built with you.",     description: "Snake, rebuilt collaboratively. Touch-friendly, keyboard-playable, intentionally minimal.", url: "https://simple-snake.anaken.one/", image: "/projects/simple-snake.svg" },
  { id: "05", type: "Game", name: "Where's Munki",        tagline: "Find the hidden cat in a bustling city.",  description: "A Where's Wally-style browser game. Hunt for Munki, a sneaky golden kitten hiding in busy illustrated scenes. 10 levels, 3 difficulties, hints, and multiplayer challenges.", url: "https://wheresmunki.anaken.one/", image: "/projects/wheres-munki.svg" },
  { id: "06", type: "Guide", name: "Solo in Seoul",       tagline: "A solo traveller's guide to Seoul.",       description: "A curated single-page guide for solo travellers in Seoul. Browse venues by type or area, with hand-picked recommendations for cafes, restaurants, and more.", url: "https://soloinseoul.anaken.one/", image: "/projects/solo-in-seoul.svg" },
];

export const PROJECTS: Project[] = RAW_PROJECTS.map(p => ({ ...p, slug: toSlug(p.name) }));

export const TYPE_COLORS: Record<string, string> = {
  Tool:  "#3366FF",
  Game:  "#00CC66",
  Guide: "#FFCC00",
};

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find(p => p.slug === slug);
}

/**
 * Single source of truth for editable site content.
 *
 * How it works:
 * - DEFAULT_DATA below ships with the project (safe fallback, always available).
 * - The admin panel (/admin) edits a copy stored in the browser's localStorage
 *   under STORAGE_KEY, so changes preview instantly on that browser.
 * - localStorage is per-browser, not a database — it will NOT show your edits
 *   to other visitors. When you're happy with your changes, use "Export data.js"
 *   in the admin panel and replace this file in your project, then redeploy.
 *   That's what makes an edit permanent and visible to everyone.
 */

const STORAGE_KEY = "portfolio_site_data_v1";

const DEFAULT_DATA = {
  meta: {
    siteTitle: "Maren Okafor — Web Developer",
  },
  profile: {
    name: "Maren Okafor",
    role: "Web Developer",
    tagline: "I build fast, accessible web apps — from the database to the last pixel.",
    location: "Lagos, Nigeria (open to remote)",
    bio: "I'm a full-stack developer focused on React, Node, and clean, maintainable systems. Over the last six years I've shipped products for startups and small teams, usually as the first or only engineer — which means I care as much about a good deploy pipeline as I do about a good button.",
    availability: "Open to new projects — Q1 2027",
    resumeUrl: "#",
  },
  contact: {
    email: "hello@marenokafor.dev",
    phone: "+234 812 345 6789",
    location: "Lagos, Nigeria",
  },
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "X", url: "https://x.com/" }
  ],
  skills: [
    "JavaScript / TypeScript", "React & Next.js", "Node.js", "PostgreSQL",
    "REST & GraphQL APIs", "Docker", "CI/CD", "Accessibility (WCAG)"
  ],
  projects: [
    {
      title: "Ledger",
      summary: "A shared expense tracker for small teams, with real-time syncing and CSV export.",
      stack: "Next.js, PostgreSQL, Stripe",
      url: "#",
      year: "2026"
    },
    {
      title: "Fieldnote",
      summary: "Offline-first note app for researchers, built around conflict-free local sync.",
      stack: "React, IndexedDB, CRDTs",
      url: "#",
      year: "2025"
    },
    {
      title: "Portside",
      summary: "Internal logistics dashboard for a freight operator — cut manual reporting by 70%.",
      stack: "Node.js, GraphQL, D3",
      url: "#",
      year: "2025"
    },
    {
      title: "Loop",
      summary: "A lightweight CMS for editorial teams who find most CMS tools too heavy.",
      stack: "Next.js, Prisma, S3",
      url: "#",
      year: "2024"
    }
  ]
};

function loadSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    // Shallow-merge so new default fields survive old saved data.
    return {
      meta: { ...DEFAULT_DATA.meta, ...(parsed.meta || {}) },
      profile: { ...DEFAULT_DATA.profile, ...(parsed.profile || {}) },
      contact: { ...DEFAULT_DATA.contact, ...(parsed.contact || {}) },
      socials: Array.isArray(parsed.socials) ? parsed.socials : DEFAULT_DATA.socials,
      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_DATA.skills,
      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_DATA.projects,
    };
  } catch (e) {
    console.error("Could not read saved site data, using defaults.", e);
    return structuredClone(DEFAULT_DATA);
  }
}

function saveSiteData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetSiteData() {
  localStorage.removeItem(STORAGE_KEY);
}

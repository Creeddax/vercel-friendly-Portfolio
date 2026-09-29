function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderSite() {
  const data = loadSiteData();

  document.title = data.meta.siteTitle;
  document.getElementById("nav-mark").textContent = initials(data.profile.name);

  // Hero
  document.getElementById("hero-name").textContent = data.profile.name;
  document.getElementById("hero-role").textContent = data.profile.role;
  document.getElementById("hero-tagline").textContent = data.profile.tagline;
  document.getElementById("hero-availability").textContent = data.profile.availability;
  document.getElementById("hero-location").textContent = data.profile.location;
  const resumeLink = document.getElementById("hero-resume");
  resumeLink.href = data.profile.resumeUrl || "#";

  // About
  document.getElementById("about-bio").innerHTML = data.profile.bio
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  const skillsList = document.getElementById("skills-list");
  skillsList.innerHTML = data.skills
    .map((s) => `<li class="skill-chip">${escapeHtml(s)}</li>`)
    .join("");

  // Projects
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = data.projects
    .map((p, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `
        <a class="project-row" href="${escapeHtml(p.url || "#")}" target="_blank" rel="noopener">
          <span class="project-index">${n}</span>
          <span class="project-main">
            <span class="project-title">${escapeHtml(p.title)}</span>
            <span class="project-summary">${escapeHtml(p.summary)}</span>
          </span>
          <span class="project-stack">${escapeHtml(p.stack)}</span>
          <span class="project-cta">
            View project
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>`;
    })
    .join("");

  // Contact
  document.getElementById("contact-email").textContent = data.contact.email;
  document.getElementById("contact-email").href = `mailto:${data.contact.email}`;
  document.getElementById("contact-phone").textContent = data.contact.phone;
  document.getElementById("contact-phone").href = `tel:${data.contact.phone.replace(/[^\d+]/g, "")}`;
  document.getElementById("contact-location").textContent = data.contact.location;

  const socialRow = document.getElementById("social-row");
  socialRow.innerHTML = data.socials
    .map((s) => `<a class="social-link" href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>`)
    .join("");

  document.getElementById("footer-name").textContent = data.profile.name;
  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function setupMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

document.addEventListener("DOMContentLoaded", () => {
  renderSite();
  setupMobileMenu();
});

// Live-update if the admin panel is open in another tab and saves changes.
window.addEventListener("storage", (e) => {
  if (e.key === "portfolio_site_data_v1") renderSite();
});

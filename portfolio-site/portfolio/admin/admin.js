let currentData = null;

/* ---------- Auth ---------- */
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}
function showDashboard() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("logout-btn").style.display = "inline-block";
  currentData = loadSiteData();
  populateForm(currentData);
}
function showLogin() {
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
}

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = document.getElementById("password").value;
  if (value === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    document.getElementById("login-error").style.display = "none";
    showDashboard();
  } else {
    document.getElementById("login-error").style.display = "block";
  }
});
document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

/* ---------- Populate ---------- */
function populateForm(data) {
  document.getElementById("f-name").value = data.profile.name;
  document.getElementById("f-role").value = data.profile.role;
  document.getElementById("f-tagline").value = data.profile.tagline;
  document.getElementById("f-bio").value = data.profile.bio;
  document.getElementById("f-availability").value = data.profile.availability;
  document.getElementById("f-location").value = data.profile.location;
  document.getElementById("f-resume").value = data.profile.resumeUrl;

  document.getElementById("f-email").value = data.contact.email;
  document.getElementById("f-phone").value = data.contact.phone;
  document.getElementById("f-contact-location").value = data.contact.location;

  renderSocials(data.socials);
  renderSkills(data.skills);
  renderProjects(data.projects);
}

/* ---------- Socials ---------- */
function renderSocials(socials) {
  const wrap = document.getElementById("socials-list");
  wrap.innerHTML = "";
  socials.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "repeat-row";
    row.innerHTML = `
      <div class="repeat-row-head">
        <span>Link ${i + 1}</span>
        <button type="button" class="icon-btn" data-remove-social="${i}" aria-label="Remove link">✕</button>
      </div>
      <div class="two-col">
        <div class="field"><label>Label</label><input type="text" data-social-label="${i}" value="${escapeAttr(s.label)}" /></div>
        <div class="field"><label>URL</label><input type="text" data-social-url="${i}" value="${escapeAttr(s.url)}" /></div>
      </div>`;
    wrap.appendChild(row);
  });
  wrap.querySelectorAll("[data-remove-social]").forEach((btn) =>
    btn.addEventListener("click", () => {
      socials.splice(Number(btn.dataset.removeSocial), 1);
      renderSocials(socials);
    })
  );
}
document.getElementById("add-social").addEventListener("click", () => {
  currentData.socials.push({ label: "New link", url: "https://" });
  renderSocials(currentData.socials);
});

/* ---------- Skills ---------- */
function renderSkills(skills) {
  const wrap = document.getElementById("skills-list-admin");
  wrap.innerHTML = "";
  skills.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "repeat-row";
    row.innerHTML = `
      <div class="repeat-row-head">
        <span>Skill ${i + 1}</span>
        <button type="button" class="icon-btn" data-remove-skill="${i}" aria-label="Remove skill">✕</button>
      </div>
      <div class="field"><input type="text" data-skill="${i}" value="${escapeAttr(s)}" /></div>`;
    wrap.appendChild(row);
  });
  wrap.querySelectorAll("[data-remove-skill]").forEach((btn) =>
    btn.addEventListener("click", () => {
      skills.splice(Number(btn.dataset.removeSkill), 1);
      renderSkills(skills);
    })
  );
}
document.getElementById("add-skill").addEventListener("click", () => {
  currentData.skills.push("New skill");
  renderSkills(currentData.skills);
});

/* ---------- Projects ---------- */
function renderProjects(projects) {
  const wrap = document.getElementById("projects-list");
  wrap.innerHTML = "";
  projects.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "repeat-row";
    row.innerHTML = `
      <div class="repeat-row-head">
        <span>Project ${i + 1}</span>
        <button type="button" class="icon-btn" data-remove-project="${i}" aria-label="Remove project">✕</button>
      </div>
      <div class="two-col">
        <div class="field"><label>Title</label><input type="text" data-proj-title="${i}" value="${escapeAttr(p.title)}" /></div>
        <div class="field"><label>Year</label><input type="text" data-proj-year="${i}" value="${escapeAttr(p.year)}" /></div>
      </div>
      <div class="field"><label>Summary</label><textarea data-proj-summary="${i}" style="min-height:70px;">${escapeAttr(p.summary)}</textarea></div>
      <div class="two-col">
        <div class="field"><label>Tech stack</label><input type="text" data-proj-stack="${i}" value="${escapeAttr(p.stack)}" /></div>
        <div class="field"><label>Project URL</label><input type="text" data-proj-url="${i}" value="${escapeAttr(p.url)}" /></div>
      </div>`;
    wrap.appendChild(row);
  });
  wrap.querySelectorAll("[data-remove-project]").forEach((btn) =>
    btn.addEventListener("click", () => {
      projects.splice(Number(btn.dataset.removeProject), 1);
      renderProjects(projects);
    })
  );
}
document.getElementById("add-project").addEventListener("click", () => {
  currentData.projects.push({ title: "New project", summary: "", stack: "", url: "https://", year: String(new Date().getFullYear()) });
  renderProjects(currentData.projects);
});

function escapeAttr(str) {
  return String(str ?? "").replaceAll('"', "&quot;");
}

/* ---------- Collect + Save ---------- */
function collectForm() {
  const socials = [...document.querySelectorAll("[data-social-label]")].map((el, i) => ({
    label: el.value,
    url: document.querySelector(`[data-social-url="${i}"]`).value,
  }));
  const skills = [...document.querySelectorAll("[data-skill]")].map((el) => el.value);
  const projectCount = document.querySelectorAll("[data-proj-title]").length;
  const projects = [];
  for (let i = 0; i < projectCount; i++) {
    projects.push({
      title: document.querySelector(`[data-proj-title="${i}"]`).value,
      year: document.querySelector(`[data-proj-year="${i}"]`).value,
      summary: document.querySelector(`[data-proj-summary="${i}"]`).value,
      stack: document.querySelector(`[data-proj-stack="${i}"]`).value,
      url: document.querySelector(`[data-proj-url="${i}"]`).value,
    });
  }

  return {
    meta: { siteTitle: `${document.getElementById("f-name").value} — ${document.getElementById("f-role").value}` },
    profile: {
      name: document.getElementById("f-name").value,
      role: document.getElementById("f-role").value,
      tagline: document.getElementById("f-tagline").value,
      bio: document.getElementById("f-bio").value,
      availability: document.getElementById("f-availability").value,
      location: document.getElementById("f-location").value,
      resumeUrl: document.getElementById("f-resume").value,
    },
    contact: {
      email: document.getElementById("f-email").value,
      phone: document.getElementById("f-phone").value,
      location: document.getElementById("f-contact-location").value,
    },
    socials,
    skills,
    projects,
  };
}

function flashStatus(msg) {
  const el = document.getElementById("status-msg");
  el.textContent = msg;
  el.classList.add("is-visible");
  setTimeout(() => el.classList.remove("is-visible"), 3500);
}

document.getElementById("save-btn").addEventListener("click", () => {
  currentData = collectForm();
  saveSiteData(currentData);
  flashStatus("Saved to this browser. Reload the site tab to preview.");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Reset all fields to the project defaults? This clears your saved edits in this browser.")) return;
  resetSiteData();
  currentData = loadSiteData();
  populateForm(currentData);
  flashStatus("Reset to defaults.");
});

document.getElementById("export-btn").addEventListener("click", () => {
  const data = collectForm();
  const fileContents = `const STORAGE_KEY = "portfolio_site_data_v1";\n\nconst DEFAULT_DATA = ${JSON.stringify(data, null, 2)};\n\nfunction loadSiteData() {\n  try {\n    const raw = localStorage.getItem(STORAGE_KEY);\n    if (!raw) return structuredClone(DEFAULT_DATA);\n    const parsed = JSON.parse(raw);\n    return {\n      meta: { ...DEFAULT_DATA.meta, ...(parsed.meta || {}) },\n      profile: { ...DEFAULT_DATA.profile, ...(parsed.profile || {}) },\n      contact: { ...DEFAULT_DATA.contact, ...(parsed.contact || {}) },\n      socials: Array.isArray(parsed.socials) ? parsed.socials : DEFAULT_DATA.socials,\n      skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_DATA.skills,\n      projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_DATA.projects,\n    };\n  } catch (e) {\n    console.error("Could not read saved site data, using defaults.", e);\n    return structuredClone(DEFAULT_DATA);\n  }\n}\n\nfunction saveSiteData(data) {\n  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));\n}\n\nfunction resetSiteData() {\n  localStorage.removeItem(STORAGE_KEY);\n}\n`;

  const blob = new Blob([fileContents], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  flashStatus("Downloaded data.js — replace js/data.js in your project and redeploy.");
});

/* ---------- Init ---------- */
if (isLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}

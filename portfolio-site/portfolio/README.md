# Portfolio Site

A static, mobile-first portfolio site with a built-in admin panel, ready to deploy on Vercel with zero configuration.

## Structure

```
index.html          Public site
admin/index.html     Admin panel (edit content)
admin/admin-auth.js   Admin password (change before deploying)
admin/admin.js        Admin panel logic
css/styles.css        All styles (design tokens at the top)
js/data.js             Site content (name, bio, projects, contact, links)
js/main.js              Renders the public site
```

## Run it locally

No build step. Any static file server works, e.g.:

```
npx serve .
```

Then open `http://localhost:3000` for the site and `http://localhost:3000/admin/` for the admin panel.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside it with the Vercel CLI).
2. In Vercel, "Add New Project" → import the repo. No framework preset needed — Vercel will serve it as a static site.
3. Deploy. That's it — `/` is the site, `/admin` is the admin panel.

## Editing content

Open `/admin`, sign in (default password `admin123` — **change this in `admin/admin-auth.js` before you deploy**), and edit:

- Profile (name, role, tagline, bio, availability, location, resume link)
- Contact details (email, phone, location)
- Social links (add/remove any number)
- Skills (add/remove any number)
- Projects (add/remove any number)

**Important — how saving works:** "Save changes" saves to that browser's local storage, so you can preview instantly on the "View site" tab. It does **not** update the live site for other visitors, because this is a static site with no database. When you're happy with your edits, click **Export data.js**, replace `js/data.js` in your project with the downloaded file, commit, and redeploy. That's what makes an edit permanent and visible to everyone.

If you'd rather skip that export/redeploy step and have edits go live immediately for everyone, the admin form is already structured as a single JSON object — wire `save-btn` in `admin/admin.js` to POST it to a small database instead (e.g. Vercel KV, Upstash Redis, or Postgres) and have `js/data.js` fetch from it. That's a backend upgrade, not a redesign.

## Security note

The admin password check in `admin/admin-auth.js` runs in the browser — it keeps casual visitors out but is not real authentication (anyone can view the page source). Fine for a personal site with non-sensitive content; if you need real protection, put `/admin` behind server-side auth (e.g. Vercel Edge Middleware with a signed cookie, or migrate to Next.js + NextAuth).

## Customizing design

All colors, type, spacing and radii are CSS custom properties at the top of `css/styles.css` — change them there and they cascade through the whole site.

# HEARD Lab — GitHub Pages Website Template

A standalone multi-page academic research laboratory website for **HEARD Lab** (Human-centered Engineering and Autonomous Robot Design), Department of Mechanical Engineering, SUNY Korea.

## Pages

- `index.html` — Home: hero banner, About the Lab, Research Directions, News, Announcements, Selected Publications, PI, Members, Media Coverage.
- `team.html` — PI and current members.
- `news.html` — Lab updates and announcements.
- `publications.html` — Journal Articles / International Conferences / Conferences Held in Korea (filter tabs).
- `courses.html` — Courses taught.
- `contact.html` — Contact details (unverified fields left clearly blank).

## Quick setup

1. On GitHub, create a new **public** repository named `HEARDLab` under your account `jjeonghany`.
2. Download and unzip this template; copy **all files** into the repository root.
3. In PowerShell, from that folder:

```powershell
git add .
git commit -m "Launch HEARD Lab website"
git push origin main
```

4. Open repository **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
5. Website: `https://jjeonghany.github.io/HEARDLab/` (after publishing).
6. Later, buy a domain such as `heardlab.org` and connect it under **Settings → Pages → Custom domain**, then configure DNS with your registrar.

The site uses **relative URLs**, so it works at `jjeonghany.github.io/HEARDLab/` and after connecting a custom domain. No npm, Jekyll, or build step required.

## Where to edit things

| Content | File |
|---|---|
| News, announcements, members, publications, courses | `assets/js/content.js` |
| Main-page mission and research descriptions | `index.html` |
| PI profile | `team.html`, `index.html` |
| Contact information | `contact.html` |
| Brand colors and typography | `assets/css/style.css`, `:root` section |
| Laboratory mark (original, editable vector placeholder) | `assets/images/heardlab-mark.svg` |
| University brand | `assets/images/school-logo-placeholder.svg` |
| Hero image | `assets/images/hero-concept.webp` |
| Research card illustrations | `assets/images/*-illustration.svg` |
| Faculty portrait | `assets/images/portrait-placeholder.svg` |

### Note about images and branding

- `hero-concept.webp` is an **AI-generated conceptual visualization**, **not a photograph of HEARD Lab**. Its disclosure is visible in the banner. Replace with real photos before announcing an official lab launch if possible.
- `school-logo-placeholder.svg` is **not the official SUNY Korea logo**. Replace with the correct institutional asset provided by the university and follow brand guidelines. The placeholder is intentionally labeled.
- The HEARD Lab geometric H icon is an original starter concept, not an approved lab logo.
- Staff portraits are placeholders; don't infer members' identities from them.

## Important content-review checklist (before public launch)

- [ ] Replace the conceptual hero visual with a real lab/equipment photo.
- [ ] Replace the school placeholder with an official SUNY Korea logo.
- [ ] Replace PI portrait placeholder with an approved photograph.
- [ ] Fill member names, roles, and images with permission.
- [ ] Add your current faculty email and confirmed room address to Contact.
- [ ] Check CV publication entries. The list is based on a **June 21, 2026 CV** and excludes under-review manuscripts by default.
- [ ] Review news headlines and exact dates; currently generalized to `2026` because month-level dates were not verified.
- [ ] Add real media links in `assets/js/content.js` (property `media`) as they become available.
- [ ] Optional: Add custom domain and HTTPS after launching.

## Licensing & credit

The site layout is an original implementation inspired by the broad information architecture of https://decode.mit.edu/. Its design, code, and written copy are original and do not reuse MIT lab logos, assets, or site source. The generated robotics hero is an illustrative concept image.

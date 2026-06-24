# 🌟 Kaushal Vyas | Portfolio

[![GitHub Pages](https://img.shields.io/badge/Website-Live-brightgreen)](https://kvyas.in)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Welcome to the source code of my personal portfolio website! Built with pure HTML, CSS, and JavaScript, deployed via GitHub Pages. Redesigned into a cosmic dark theme (teal + gold) with the help of Claude Design.

✨ **Live Demo**: [kvyas.in](https://kvyas.in)

---

## 🛠 Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Deployment**: GitHub Pages + Custom Domain
- **Form Handling**: FormSubmit.co
- **Performance**: 100% Lighthouse Score (Optimized assets)

---

## 🎨 Key Features
- **Cosmic Dark Theme**: Animated starfield canvas, teal + gold accents, serif/mono type pairing
- **Scroll Choreography**: Reveal-on-scroll, animated stat counters, education grade rings, progress bar
- **Responsive Design**: Desktop layout collapses to a mobile menu + single column
- **Direct Email Integration**: FormSubmit.co with `mailto:` fallback
- **Dynamic Content**: Book quotes load from `books.json` (with covers, expandable), achievements from `achievements.json`
- **SEO Optimized**: Meta + Open Graph tags, semantic HTML

---

## 🗂 Project Structure
```
index.html          # Markup for every section
css/style.css       # Design system (colors, type, layout, responsive)
js/script.js        # Starfield, scroll/reveal animations, dynamic content, contact form
assets/
  books.json        # Reading list — drives the "Threads" section
  achievements.json # Awards & milestones — drives the "Achievements" section
  resume.pdf        # Linked from the nav / skills "Résumé" buttons
  images/           # Portrait, book covers, social + favicon
```

---

## ✍️ Updating Content
The Achievements and Reading sections render straight from JSON — no HTML edits needed:
- **Add a book**: append an object to `assets/books.json` (`bookName`, `author`, `genre`, `publishYear`, `dateOfCompletion`, `coverImage`, `quotes[]`) and drop the cover in `assets/images/book-covers/`.
- **Add an achievement**: append an object to `assets/achievements.json` (`title`, `date`, `description`, `category`, `rating`, `icon`, `proofLink`). Cards auto-sort newest-first and the emoji `icon` is recoloured to match the theme.

Everything else (hero, about, education, experience, skills) lives directly in `index.html`. Commit and push — GitHub Pages serves the rest.

---

## 🚀 Installation (For Local Development)
```bash
git clone https://github.com/kaushalvyasofficial/portfolio.git
cd portfolio
# Serve locally (fetch() needs http, not file://):
python3 -m http.server 8000
# then open http://localhost:8000
```
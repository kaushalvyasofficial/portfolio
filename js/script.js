/* ============================================================
   Kaushal Vyas — Portfolio  ·  interactions + dynamic content
   ============================================================ */

const EMAIL = "kaushalvyasofficial@gmail.com";
const TEAL = "#2FB89A";
const GOLD = "#E3A53A";

// Tiny monochrome line icons (inherit currentColor) for the reading-card meta.
const ICON_CAL = '<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/></svg>';
const ICON_CHECK = '<svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/></svg>';

document.addEventListener("DOMContentLoaded", () => {
    initStars();
    initNav();
    initMobileMenu();
    initReveal();
    initHeroEntrance();
    initContactForm();
    updateYear();
    loadAchievements();
    loadBooks();
});

/* ---------- small helpers ---------- */
function escapeHtml(str) {
    return String(str == null ? "" : str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatDate(dateString, longMonth) {
    try {
        const d = new Date(dateString);
        if (isNaN(d)) return dateString;
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: longMonth ? "long" : "short",
            day: "numeric"
        });
    } catch (e) {
        return dateString;
    }
}

/* ============ ANIMATED STARFIELD ============ */
function initStars() {
    const cv = document.getElementById("stars");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w, h, stars;

    const make = () => {
        w = cv.width = window.innerWidth;
        h = cv.height = window.innerHeight;
        const n = Math.min(180, Math.floor((w * h) / 9000));
        stars = Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.3 + 0.2,
            a: Math.random() * 0.6 + 0.15,
            tw: Math.random() * 0.02 + 0.004,
            vy: Math.random() * 0.12 + 0.02,
            c: Math.random() > 0.78 ? "47,184,160" : (Math.random() > 0.6 ? "227,165,58" : "255,255,255")
        }));
    };
    make();
    window.addEventListener("resize", make);

    if (prefersReducedMotion()) {
        // draw a single static frame
        for (const s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + s.c + "," + s.a + ")";
            ctx.fill();
        }
        return;
    }

    let t = 0;
    const draw = () => {
        ctx.clearRect(0, 0, w, h);
        t += 0.01;
        for (const s of stars) {
            s.y += s.vy;
            if (s.y > h) s.y = 0;
            const a = s.a + Math.sin(t + s.x) * s.tw * 10;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + s.c + "," + Math.max(0.05, a) + ")";
            ctx.fill();
        }
        requestAnimationFrame(draw);
    };
    draw();
}

/* ============ NAV: scroll state, progress bar, active link ============ */
function initNav() {
    const nav = document.getElementById("nav");
    const prog = document.getElementById("progress");
    const navlinks = Array.from(document.querySelectorAll("[data-navlink]"));
    const sections = navlinks
        .map(a => document.querySelector(a.getAttribute("href")))
        .filter(Boolean);

    const onScroll = () => {
        const sc = window.scrollY;
        if (nav) nav.classList.toggle("scrolled", sc > 40);
        if (prog) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            prog.style.transform = "scaleX(" + (docH > 0 ? sc / docH : 0) + ")";
        }
        // active link
        const pos = sc + window.innerHeight * 0.32;
        let activeId = null;
        for (const sec of sections) {
            if (pos >= sec.offsetTop) activeId = sec.id;
        }
        navlinks.forEach(a => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + activeId);
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

/* ============ MOBILE MENU ============ */
function initMobileMenu() {
    const burger = document.getElementById("burger");
    const menu = document.getElementById("mobileMenu");
    if (!burger || !menu) return;

    const setMenu = (open) => {
        menu.classList.toggle("open", open);
        burger.textContent = open ? "CLOSE" : "MENU";
        document.body.style.overflow = open ? "hidden" : "";
    };

    burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.querySelectorAll("[data-mlink]").forEach(a =>
        a.addEventListener("click", () => setMenu(false))
    );
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") setMenu(false);
    });
}

/* ============ REVEAL ON SCROLL + counters + rings ============ */
function initReveal() {
    const reduced = prefersReducedMotion();

    const revealEls = document.querySelectorAll("[data-reveal]");
    const staggerEls = document.querySelectorAll("[data-stagger]");

    if (reduced || !("IntersectionObserver" in window)) {
        revealEls.forEach(el => el.classList.add("in"));
        staggerEls.forEach(group => group.classList.add("in"));
        document.querySelectorAll(".cnum").forEach(el => setCounterFinal(el));
        document.querySelectorAll("[data-ring]").forEach(el => setRingFinal(el));
        return;
    }

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;

            if (el.hasAttribute("data-stagger")) {
                Array.from(el.children).forEach((child, i) => {
                    child.style.transitionDelay = (i * 0.08) + "s";
                });
                el.classList.add("in");
            } else {
                el.classList.add("in");
            }

            el.querySelectorAll && el.querySelectorAll(".cnum").forEach(animateCounter);
            el.querySelectorAll && el.querySelectorAll("[data-ring]").forEach(animateRing);

            obs.unobserve(el);
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));
    staggerEls.forEach(el => io.observe(el));
}

function setCounterFinal(el) {
    const target = parseFloat(el.dataset.count || "0");
    const dec = parseInt(el.dataset.dec || "0", 10);
    el.textContent = (el.dataset.prefix || "") + target.toFixed(dec) + (el.dataset.suffix || "");
}

function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.count || "0");
    const dec = parseInt(el.dataset.dec || "0", 10);
    const pre = el.dataset.prefix || "";
    const suf = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = pre + (target * ease(p)).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function setRingFinal(el) {
    const pct = parseFloat(el.dataset.pct || "0");
    const col = el.dataset.accent || "#2FB89A";
    el.style.background = "conic-gradient(" + col + " 0% " + pct + "%, rgba(255,255,255,.07) " + pct + "% 100%)";
}

function animateRing(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const pct = parseFloat(el.dataset.pct || "0");
    const col = el.dataset.accent || "#2FB89A";
    const dur = 1400;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
        const p = Math.min(1, (now - start) / dur);
        const v = pct * ease(p);
        el.style.background = "conic-gradient(" + col + " 0% " + v + "%, rgba(255,255,255,.07) " + v + "% 100%)";
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/* ============ HERO ENTRANCE ============ */
function initHeroEntrance() {
    const els = document.querySelectorAll("#heroText .reveal");
    if (prefersReducedMotion()) {
        els.forEach(el => el.classList.add("in"));
        return;
    }
    els.forEach((el, i) => {
        el.style.transitionDelay = (0.15 + i * 0.12) + "s";
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
    });
}

/* ============ CONTACT FORM (FormSubmit.co) ============ */
function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const btn = document.getElementById("sendBtn");

    form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Sending…";

        // Read via FormData — form.name would resolve to HTMLFormElement.name, not the input.
        const data = new FormData(form);
        try {
            const res = await fetch("https://formsubmit.co/ajax/" + EMAIL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name: data.get("name"),
                    email: data.get("email"),
                    message: data.get("message"),
                    _subject: "New Portfolio Message"
                })
            });
            if (!res.ok) throw new Error("send failed");

            form.reset();
            btn.textContent = "Thanks — I'll be in touch ✓";
            btn.style.background = "#E3A53A";
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = "";
                btn.disabled = false;
            }, 3500);
        } catch (err) {
            btn.textContent = "Failed — email me directly";
            btn.style.background = "";
            btn.disabled = false;
            setTimeout(() => { btn.textContent = original; }, 3500);
        }
    });
}

/* ============ FOOTER YEAR ============ */
function updateYear() {
    const y = document.getElementById("current-year");
    if (y) y.textContent = new Date().getFullYear();
}

/* ============ ACHIEVEMENTS (achievements.json) ============ */
async function loadAchievements() {
    const grid = document.getElementById("achievements-grid");
    if (!grid) return;
    grid.innerHTML = '<div class="loading">Loading achievements…</div>';

    try {
        const res = await fetch("./assets/achievements.json");
        if (!res.ok) throw new Error("fetch failed");
        const list = await res.json();
        if (!Array.isArray(list) || !list.length) {
            grid.innerHTML = '<div class="loading">No achievements yet.</div>';
            return;
        }

        const sorted = list.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

        grid.innerHTML = sorted.map((a, i) => {
            const blob = i % 2 ? "teal" : "gold";
            const tint = i % 2 ? TEAL : GOLD;
            const cat = escapeHtml((a.category || "Achievement").toUpperCase());
            const proof = a.proofLink && a.proofLink !== "#"
                ? `<a class="ach-proof" href="${escapeHtml(a.proofLink)}" target="_blank" rel="noopener noreferrer">View proof ↗</a>`
                : "";
            return `
        <article class="ach-card" data-rowcard>
          <div class="ach-blob ${blob}"></div>
          <div class="ach-top">
            <span class="ach-cat">${cat}</span>
            <span class="ach-stars">${stars(a.rating)}</span>
          </div>
          <h3 class="ach-title"><span class="ach-icon emoji" style="--tint:${tint}">${escapeHtml(a.icon || "🏆")}</span>${escapeHtml(a.title)}</h3>
          <div class="ach-date">${formatDate(a.date, true)}</div>
          <p class="ach-desc">${escapeHtml(a.description)}</p>
          ${proof}
        </article>`;
        }).join("");
    } catch (err) {
        console.error("achievements:", err);
        grid.innerHTML = `
      <div class="error-box">
        <p>Couldn't load achievements.</p>
        <button class="btn btn-solid" onclick="loadAchievements()">Retry</button>
      </div>`;
    }
}

function stars(rating) {
    const r = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
    let out = "";
    for (let i = 1; i <= 5; i++) {
        out += i <= r ? "★" : '<span class="empty">★</span>';
    }
    return out;
}

/* ============ READING / BOOKS (books.json) ============ */
async function loadBooks() {
    const grid = document.getElementById("reading-grid");
    if (!grid) return;
    grid.innerHTML = '<div class="loading">Loading book quotes…</div>';

    try {
        const res = await fetch("./assets/books.json");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        const books = Array.isArray(data) ? data : [data];
        if (!books.length) {
            grid.innerHTML = '<div class="loading">No books yet.</div>';
            return;
        }

        grid.innerHTML = books.map((book, i) => {
            const accent = i % 2 ? "gold" : "teal";
            const quotes = Array.isArray(book.quotes) ? book.quotes : [];
            const featured = quotes[0] || "No quotes saved yet.";
            const title = escapeHtml(book.bookName || book.book || "Unknown Title");
            const genre = escapeHtml((book.genre || "").split("/")[0].trim() || "Book");
            const cover = escapeHtml(book.coverImage || "./assets/images/tab.png");

            const meta = [];
            if (book.publishYear) meta.push(ICON_CAL + escapeHtml(book.publishYear));
            if (book.dateOfCompletion) meta.push(ICON_CHECK + formatDate(book.dateOfCompletion));
            meta.push(quotes.length + " quote" + (quotes.length === 1 ? "" : "s"));

            const quotesHtml = quotes.map((q, qi) => `
        <div class="quote-item">
          <span class="quote-num">${qi + 1}.</span>
          <span class="quote-text">${escapeHtml(q)}</span>
        </div>`).join("");

            return `
        <article class="book-card" data-book-index="${i}">
          <div class="book-main" role="button" tabindex="0" aria-expanded="false">
            <div class="book-cover"><img src="${cover}" alt="${title} cover" loading="lazy"></div>
            <div class="book-body">
              <div class="book-genre ${accent}">${genre}</div>
              <h3 class="book-title">${title}</h3>
              <div class="book-author">${escapeHtml(book.author || "Unknown Author")}</div>
              <p class="book-quote ${accent}">${escapeHtml(featured)}</p>
              <div class="book-foot">
                ${meta.map(m => `<span>${m}</span>`).join('<span class="dot">•</span>')}
                <span class="book-toggle">Read all ▾</span>
              </div>
            </div>
          </div>
          <div class="book-quotes">
            <div class="book-quotes-inner">${quotesHtml}</div>
          </div>
        </article>`;
        }).join("");

        wireBookToggles(grid);
    } catch (err) {
        console.error("books:", err);
        grid.innerHTML = `
      <div class="error-box">
        <p>Couldn't load book quotes.</p>
        <button class="btn btn-solid" onclick="loadBooks()">Retry</button>
      </div>`;
    }
}

function wireBookToggles(grid) {
    const toggle = card => {
        const open = card.classList.toggle("expanded");
        const main = card.querySelector(".book-main");
        const label = card.querySelector(".book-toggle");
        if (main) main.setAttribute("aria-expanded", open ? "true" : "false");
        if (label) label.textContent = open ? "Hide ▴" : "Read all ▾";
    };

    grid.querySelectorAll(".book-main").forEach(main => {
        const card = main.closest(".book-card");
        main.addEventListener("click", () => toggle(card));
        main.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(card);
            }
        });
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            grid.querySelectorAll(".book-card.expanded").forEach(card => toggle(card));
        }
    });
}

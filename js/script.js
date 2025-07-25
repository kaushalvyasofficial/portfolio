// ==================== ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initializeNavbar();
    typeWriterName();
    loadQuotes();
    loadAchievements();
    updateCurrentYear();
});

// ==================== CONTACT FORM HANDLER ====================
document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector("button");
    const thankYou = document.getElementById("thank-you-message");

    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
        await fetch("https://formsubmit.co/ajax/kaushalvyasofficial@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
                _subject: "New Portfolio Message"
            })
        });

        form.style.display = "none";
        thankYou.style.display = "block";

    } catch (error) {
        btn.textContent = "Failed - Try Again";
        btn.disabled = false;
        alert("Message failed to send. Please email me directly at kaushalvyasofficial@gmail.com");
    }
});

// ==================== TYPEWRITER NAME ANIMATION ====================
function typeWriterName() {
    const name = "Kaushal Vyas";
    const letters = [
        { char: "K", class: "k" },
        { char: "a", class: "a" },
        { char: "u", class: "u" },
        { char: "s", class: "s" },
        { char: "h", class: "h" },
        { char: "a", class: "a" },
        { char: "l", class: "l" },
        { char: " ", class: "space" },
        { char: "V", class: "v" },
        { char: "y", class: "y" },
        { char: "a", class: "a2" },
        { char: "s", class: "s2" }
    ];

    const nameElement = document.getElementById("animated-name");
    if (!nameElement) return; // Safety check

    nameElement.innerHTML = "";

    let i = 0;
    const speed = 150;

    function type() {
        if (i < letters.length) {
            const span = document.createElement("span");
            span.className = letters[i].class;
            span.textContent = letters[i].char;
            nameElement.appendChild(span);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing is complete
            const cursor = nameElement.querySelector('.typewriter-cursor');
            if (cursor) cursor.style.display = 'none';
        }
    }

    setTimeout(type, 1500); // Initial delay
}

// ==================== LOAD QUOTES FROM LOCAL JSON ====================
async function loadQuotes() {
    const container = document.getElementById("threads-container");
    if (!container) return; // Safety check

    try {
        // Show loading state
        container.innerHTML = '<div class="loading-quotes">Loading book quotes...</div>';

        const response = await fetch("./assets/books.json");
        if (!response.ok) throw new Error("Failed to fetch quotes from books.json");

        const data = await response.json();

        // Handle both single book object and array of books
        const books = Array.isArray(data) ? data : [data];

        if (!books || books.length === 0) {
            container.innerHTML = "<p>No quotes found in books.json file.</p>";
            return;
        }

        // Generate book cards HTML
        container.innerHTML = books.map((book, index) => {

            const allQuotes = Array.isArray(book.quotes) ? book.quotes : ["No quotes available"];
            const firstQuote = allQuotes[0] || "No quotes available";
            return `
  <div class="book-card" data-book-index="${index}">
    <div class="book-preview" onclick="toggleBookQuotes(${index})">
      <div class="book-cover">
        <img src="${book.coverImage || './assets/placeholder-book.jpg'}" alt="${book.bookName || book.book || 'Unknown Title'}" class="book-image">
      </div>
      <div class="book-content">
        <div class="book-header">
          <h3 class="book-title">${book.bookName || book.book || 'Unknown Title'}</h3>
          <p class="book-author">By ${book.author || 'Unknown Author'}</p>
        </div>
        <div class="featured-quote">
          ${truncateText(firstQuote, 120)}
        </div>
        <div class="book-meta">
          ${book.publishYear ? `<span class="meta-item">
            <div class="meta-icon">📅</div>
            <div class="meta-label">Published On</div>
            <div class="meta-value">${book.publishYear}</div>
          </span>` : ''}
          ${book.dateOfCompletion ? `<span class="meta-item">
            <div class="meta-icon">✅</div>
            <div class="meta-label">Completed on</div>
            <div class="meta-value">${formatDate(book.dateOfCompletion)}</div>
          </span>` : ''}
          ${book.genre ? `<span class="meta-item">
            <div class="meta-icon">📚</div>
            <div class="meta-label">Genre</div>
            <div class="meta-value">${book.genre}</div>
          </span>` : ''}
          
        </div>
      </div>
      <div class="expand-indicator">
        <span class="expand-arrow">▼</span>
      </div>
    </div>
    
    <div class="quotes-container">
      <div class="quotes-list">
        ${allQuotes.map((quote, qIndex) => `
          <div class="quote-item">
            <div class="quote-number">${qIndex + 1}.</div>
            <div class="quote-text">${quote}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
`;
        }).join('');
    } catch (error) {
        console.error("Error loading quotes:", error);
        container.innerHTML = `
      <div class="error-message">
        <p>❌ Failed to load quotes from books.json. Please check if the file exists in the assets folder.</p>
        <button onclick="loadQuotes()" class="btn" style="margin-top: 10px;">Retry</button>
      </div>
    `;
    }
}

// ==================== TOGGLE BOOK QUOTES EXPANSION ====================
function toggleBookQuotes(bookIndex) {
    const bookCard = document.querySelector(`[data-book-index="${bookIndex}"]`);
    if (!bookCard) return;

    const isExpanded = bookCard.classList.contains('expanded');
    const arrow = bookCard.querySelector('.expand-arrow');

    // Close all other expanded cards first
    document.querySelectorAll('.book-card.expanded').forEach(card => {
        if (card !== bookCard) {
            card.classList.remove('expanded');
            const otherArrow = card.querySelector('.expand-arrow');
            if (otherArrow) otherArrow.textContent = '▼';
        }
    });

    // Toggle current card
    if (isExpanded) {
        bookCard.classList.remove('expanded');
        if (arrow) arrow.textContent = '▼';
    } else {
        bookCard.classList.add('expanded');
        if (arrow) arrow.textContent = '▲';
    }
}

// ==================== LOAD ACHIEVEMENTS ====================
async function loadAchievements() {
    const container = document.getElementById("achievements-container");
    if (!container) return;

    try {
        // Show loading state
        container.innerHTML = '<div class="timeline"><div class="loading-achievements">Loading achievements...</div></div>';

        const response = await fetch("./assets/achievements.json");
        if (!response.ok) throw new Error("Failed to fetch achievements");

        const achievements = await response.json();

        if (!achievements || achievements.length === 0) {
            container.innerHTML = '<div class="error-achievements">No achievements found.</div>';
            return;
        }

        // Sort achievements by date (newest first)
        const sortedAchievements = achievements.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Generate timeline HTML
        const timelineHTML = `
            <div class="timeline">
                ${sortedAchievements.map((achievement, index) => `
                    <div class="achievement-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="achievement-content">
                            <div class="achievement-header">
                                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                                <div class="achievement-title-section">
                                    <h3 class="achievement-title">${achievement.title}</h3>
                                    <p class="achievement-date">${formatAchievementDate(achievement.date)}</p>
                                </div>
                                <div class="achievement-rating">
                                    ${generateStarRating(achievement.rating)}
                                </div>
                            </div>
                            
                            <p class="achievement-description">${achievement.description}</p>
                            
                            <div class="achievement-footer">
                                <span class="achievement-category">${achievement.category || 'Achievement'}</span>
                                ${achievement.proofLink && achievement.proofLink !== '#' ? `
                                    <a href="${achievement.proofLink}" target="_blank" rel="noopener noreferrer" class="achievement-proof">
                                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                            <polyline points="15,3 21,3 21,9"/>
                                            <line x1="10" y1="14" x2="21" y2="3"/>
                                        </svg>
                                        View Proof
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = timelineHTML;

    } catch (error) {
        console.error("Error loading achievements:", error);
        container.innerHTML = `
            <div class="error-achievements">
                <p>❌ Failed to load achievements. Please check if achievements.json exists in the assets folder.</p>
                <button onclick="loadAchievements()" class="btn" style="margin-top: 15px;">Retry</button>
            </div>
        `;
    }
}

// ==================== UTILITY FUNCTIONS ====================
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    // Find the last space before maxLength to avoid cutting words
    const truncated = text.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return (lastSpace > 0 ? truncated.substr(0, lastSpace) : truncated) + '...';
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString; // Return original if parsing fails
    }
}

function generateStarRating(rating) {
    const maxStars = 5;
    let starsHTML = '';

    for (let i = 1; i <= maxStars; i++) {
        if (i <= rating) {
            starsHTML += '<span class="star">★</span>';
        } else {
            starsHTML += '<span class="star empty">★</span>';
        }
    }

    return starsHTML;
}

function formatAchievementDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==================== NAVBAR FUNCTIONALITY ====================
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');

    let lastScrollTop = 0;
    let isMobile = window.innerWidth <= 768;

    // ========== SCROLL PROGRESS FUNCTIONALITY ==========
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        if (navbar) {
            navbar.style.setProperty('--scroll-progress', `${scrollPercent}%`);
        }
    }

    // ========== NAVBAR SCROLL EFFECTS ==========
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (!navbar) return;

        // Add scrolled class when scrolled down
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (only on mobile)
        if (isMobile) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.classList.add('hide');
                navbar.classList.remove('show');
            } else {
                navbar.classList.remove('hide');
                navbar.classList.add('show');
            }
        }

        lastScrollTop = scrollTop;
    }

    // ========== MOBILE MENU FUNCTIONALITY ==========
    function toggleMobileMenu() {
        if (mobileToggle && mobileOverlay) {
            mobileToggle.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
        }
    }

    function closeMobileMenu() {
        if (mobileToggle && mobileOverlay) {
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ========== ACTIVE LINK FUNCTIONALITY ==========
    function updateActiveLink() {
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========== SCROLL TO SECTION ==========
    function scrollToSection(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (!targetSection) return;

        // Calculate offset for navbar
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetOffset = targetSection.offsetTop - navbarHeight - 20;

        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();

        // Update active link
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    }

    // ========== SETUP EVENT LISTENERS ==========
    function setupEventListeners() {
        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function(e) {
                if (e.target === mobileOverlay) {
                    closeMobileMenu();
                }
            });
        }

        // Close mobile menu when clicking a mobile nav link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                scrollToSection.call(this, e);
                closeMobileMenu();
            });
        });

        // Desktop navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', scrollToSection);
        });

        // Scroll event listener
        window.addEventListener('scroll', function() {
            updateScrollProgress();
            handleNavbarScroll();
            updateActiveLink();
        });

        // Window resize handler
        window.addEventListener('resize', function() {
            isMobile = window.innerWidth <= 768;
            
            // Close mobile menu if switching to desktop
            if (!isMobile) {
                closeMobileMenu();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu and expanded cards
            if (e.key === 'Escape') {
                closeMobileMenu();
                
                // Close expanded book cards
                document.querySelectorAll('.book-card.expanded').forEach(card => {
                    card.classList.remove('expanded');
                    const arrow = card.querySelector('.expand-arrow');
                    if (arrow) arrow.textContent = '▼';
                });
            }
        });
    }

    // Initialize everything
    setupEventListeners();
    updateActiveLink();
    updateScrollProgress();
}
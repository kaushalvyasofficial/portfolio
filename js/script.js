// ==================== NAVBAR HIDE ON SCROLL ====================
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");
const scrollThreshold = 100; // Only hide navbar after scrolling this many pixels

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  // Show/hide navbar based on scroll direction
  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    navbar.style.top = "-70px";
  } else {
    navbar.style.top = "0";
  }

  // Add/remove background blur
  if (currentScroll > 50) {
    navbar.style.backgroundColor = "rgba(31, 31, 31, 0.95)";
    navbar.style.backdropFilter = "blur(5px)";
  } else {
    navbar.style.backgroundColor = "var(--bg-light)";
    navbar.style.backdropFilter = "none";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ==================== ON PAGE LOAD ====================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-year").textContent = new Date().getFullYear(); // Update footer year
  loadQuotes();       // Load MongoDB quotes
  loadGallery();      // Load gallery images
  typeWriterName();   // Start name animation
  setupSmoothScrolling(); // Setup nav link scroll
});

// ==================== SMOOTH SCROLLING ====================
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });
}

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
      nameElement.style.borderRight = "none";
    }
  }

  setTimeout(type, 1000); // Initial delay
}

// ==================== LOAD QUOTES FROM MONGODB ====================
/*
async function loadQuotes() {
  try {
    const response = await fetch("http://localhost:3001/api/quotes");
    if (!response.ok) throw new Error("Failed to fetch");

    const books = await response.json();
    const container = document.getElementById("threads-container");

    if (books.length === 0) {
      container.innerHTML = "<p>No quotes found in database.</p>";
      return;
    }

    container.innerHTML = books.map(book => `
      <div class="thread-book">
        <h3>${book.book} <small>by ${book.author}</small></h3>
        <div class="thread-quotes">
          <p>"${book.quote}"</p>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("threads-container").innerHTML = `
      <p class="error">Failed to load quotes. <button onclick="loadQuotes()">Retry</button></p>
    `;
  }
}
*/
// ==================== LOAD QUOTES FROM MONGODB (ENHANCED) ====================
async function loadQuotes() {
  const container = document.getElementById("threads-container");
  
  try {
    // Show loading state
    container.innerHTML = '<div class="loading-quotes">Loading book quotes...</div>';
    
    const response = await fetch("http://localhost:3001/api/quotes");
    if (!response.ok) throw new Error("Failed to fetch quotes");

    const books = await response.json();
    
    if (books.length === 0) {
      container.innerHTML = "<p>No quotes found in database.</p>";
      return;
    }

    // Generate book cards HTML
    container.innerHTML = books.map((book, index) => {
      // Get first quote for preview (handle both array and single quote)
      const firstQuote = Array.isArray(book.quotes) ? book.quotes[0] : book.quote;
      const allQuotes = Array.isArray(book.quotes) ? book.quotes : [book.quote];
      
      return `
        <div class="book-card" data-book-index="${index}">
          <div class="book-preview" onclick="toggleBookQuotes(${index})">
            <div class="book-info">
              <h3 class="book-title">${book.bookName || book.book}</h3>
              <p class="book-author">by ${book.author}</p>
              <div class="book-meta">
                ${book.publishYear ? `<span>📅 <br> ${book.publishYear}</span>` : ''}
                ${book.genre ? `<span>📚 <br> ${book.genre}</span>` : ''}
                ${book.dateOfCompletion ? `<span>✅ <br> Completed: ${book.dateOfCompletion}</span>` : ''}
              </div>
            </div>
            <div class="preview-quote">
              ${truncateText(firstQuote, 120)}
            </div>
            <div class="expand-indicator">
              <span>▼</span>
            </div>
          </div>
          
          <div class="quotes-container">
            <div class="quotes-list">
              ${allQuotes.map(quote => `
                <div class="quote-item">
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
        <p>❌ Failed to load quotes. Please check your connection.</p>
        <button onclick="loadQuotes()" class="btn" style="margin-top: 10px;">Retry</button>
      </div>
    `;
  }
}

// ==================== TOGGLE BOOK QUOTES EXPANSION ====================
function toggleBookQuotes(bookIndex) {
  const bookCard = document.querySelector(`[data-book-index="${bookIndex}"]`);
  const isExpanded = bookCard.classList.contains('expanded');
  
  // Close all other expanded cards first
  document.querySelectorAll('.book-card.expanded').forEach(card => {
    if (card !== bookCard) {
      card.classList.remove('expanded');
    }
  });
  
  // Toggle current card
  if (isExpanded) {
    bookCard.classList.remove('expanded');
  } else {
    bookCard.classList.add('expanded');
    
    // Smooth scroll to the expanded card after a brief delay
    setTimeout(() => {
      bookCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
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

// ==================== KEYBOARD NAVIGATION (BONUS) ====================
document.addEventListener('keydown', function(e) {
  // ESC key closes all expanded cards
  if (e.key === 'Escape') {
    document.querySelectorAll('.book-card.expanded').forEach(card => {
      card.classList.remove('expanded');
    });
  }
});
// ==================== LOAD GALLERY IMAGES FROM MONGODB ====================
async function loadGallery() {
  try {
    const response = await fetch("http://localhost:3001/api/gallery");
    const images = await response.json();

    const grid = document.querySelector(".gallery-grid");
    grid.innerHTML = images.map(img => `
      <figure>
        <img src="${img.imageUrl}" alt="${img.title}" loading="lazy">
        <figcaption>${img.description}</figcaption>
      </figure>
    `).join('');

  } catch (error) {
    console.error("Failed to load gallery:", error);
  }
}

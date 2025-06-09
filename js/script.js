// ---------- NAVBAR HIDE ON SCROLL ----------
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");
const scrollThreshold = 100; // Only hide navbar after scrolling this many pixels

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  
  // Show/hide based on scroll direction
  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    navbar.style.top = "-70px";
  } else {
    navbar.style.top = "0";
  }

  // Add/remove background based on scroll position
  if (currentScroll > 50) {
    navbar.style.backgroundColor = "rgba(31, 31, 31, 0.95)";
    navbar.style.backdropFilter = "blur(5px)";
  } else {
    navbar.style.backgroundColor = "var(--bg-light)";
    navbar.style.backdropFilter = "none";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ---------- THREADS WITH FETCH FROM books.json ----------
document.addEventListener("DOMContentLoaded", () => {
  // Update copyright year automatically
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Load books and quotes
  loadBookQuotes();

  // Add smooth scrolling for nav links
  setupSmoothScrolling();
});
/*
function loadBookQuotes() {
  const threadsContainer = document.getElementById("threads-container");
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("loading-indicator");
  loadingIndicator.innerHTML = `
    <div class="spinner"></div>
    <p>Loading book quotes...</p>
  `;
  threadsContainer.appendChild(loadingIndicator);

  fetch('assets/books.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(books => {
      threadsContainer.innerHTML = ''; // Remove loading indicator
      
      if (!books || books.length === 0) {
        threadsContainer.innerHTML = `<p class="empty-message">No books found. Check back later!</p>`;
        return;
      }

      books.forEach((book, index) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("thread-book");
        bookDiv.innerHTML = `
          <h3>${book.title}</h3>
          <span class="author">${book.author || 'Unknown Author'}</span>
          <span class="toggle-icon">+</span>
        `;

        const quoteList = document.createElement("div");
        quoteList.classList.add("thread-quotes");

        if (book.quotes && book.quotes.length > 0) {
          book.quotes.forEach(q => {
            const p = document.createElement("p");
            p.textContent = `"${q}"`;
            quoteList.appendChild(p);
          });
        } else {
          const p = document.createElement("p");
          p.textContent = "No quotes available for this book yet.";
          p.classList.add("no-quotes");
          quoteList.appendChild(p);
        }

        bookDiv.addEventListener("click", () => {
          const isExpanded = quoteList.style.display === "block";
          quoteList.style.display = isExpanded ? "none" : "block";
          bookDiv.querySelector(".toggle-icon").textContent = isExpanded ? "+" : "-";
          
          // Smooth scroll to keep clicked book in view
          if (!isExpanded) {
            setTimeout(() => {
              bookDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }
        });

        // Add animation delay based on index
        bookDiv.style.animationDelay = `${index * 0.1}s`;

        threadsContainer.appendChild(bookDiv);
        threadsContainer.appendChild(quoteList);
      });
    })
    .catch(error => {
      threadsContainer.innerHTML = `
        <div class="error-message">
          <p>Failed to load quotes 😞</p>
          <button onclick="loadBookQuotes()" class="btn retry-btn">Try Again</button>
        </div>
      `;
      console.error("Error loading books.json:", error);
    });
}
*/
function setupSmoothScrolling() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });
}

// ---------- FORM SUBMISSION HANDLER ----------
// Form submission handler
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const btn = form.querySelector('button');
  const thankYou = document.getElementById('thank-you-message');
  
  // Show loading
  btn.disabled = true;
  btn.textContent = 'Sending...';
  
  try {
    // Send to FormSubmit (invisible to user)
    await fetch('https://formsubmit.co/ajax/kaushalvyasofficial@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
        _subject: "New Portfolio Message"
      })
    });
    
    // Hide form, show thank-you
    form.style.display = 'none';
    thankYou.style.display = 'block';
    
  } catch (error) {
    btn.textContent = 'Failed - Try Again';
    btn.disabled = false;
    alert('Message failed to send. Please email me directly at kaushalvyasofficial@gmail.com');
  }
});

function typeWriterName() {
  const nameElement = document.getElementById('animated-name');
  nameElement.innerHTML = ''; // Clear initial text
  
  // Create cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  nameElement.appendChild(cursor);

  const letters = [
    { char: 'K', class: 'k', delay: 180 },
    { char: 'a', class: 'a', delay: 120 },
    { char: 'u', class: 'u', delay: 150 },
    { char: 's', class: 's', delay: 130 },
    { char: 'h', class: 'h', delay: 110 },
    { char: 'a', class: 'a', delay: 140 },
    { char: 'l', class: 'l', delay: 160 },
    { char: ' ', class: 'space', delay: 80 },
    { char: 'V', class: 'v', delay: 200 },
    { char: 'y', class: 'y', delay: 170 },
    { char: 'a', class: 'a2', delay: 130 },
    { char: 's', class: 's2', delay: 150 }
  ];

  let i = 0;
  let baseDelay = 1000; // Initial delay before typing starts

  function type() {
    if (i < letters.length) {
      const { char, className, delay } = letters[i];
      
      setTimeout(() => {
        const span = document.createElement('span');
        span.className = className;
        span.textContent = char;
        
        // Insert before cursor
        nameElement.insertBefore(span, cursor);
        
        // Random slight variation for human-like rhythm
        const randomVariation = Math.random() * 50 - 25; // ±25ms
        setTimeout(type, delay + randomVariation);
        
      }, i === 0 ? baseDelay : 0);
      
      i++;
    } else {
      // Typing complete - remove cursor after pause
      setTimeout(() => {
        cursor.style.display = 'none';
      }, 500);
    }
  }

  type(); // Start the effect
}
function typeWriterName() {
    
  const name = "Kaushal Vyas";
  const colors = [
    { char: 'K', class: 'k' },
    { char: 'a', class: 'a' },
    { char: 'u', class: 'u' },
    { char: 's', class: 's' },
    { char: 'h', class: 'h' },
    { char: 'a', class: 'a' },
    { char: 'l', class: 'l' },
    { char: ' ', class: 'space' },
    { char: 'V', class: 'v' },
    { char: 'y', class: 'y' },
    { char: 'a', class: 'a2' }, // Different class for second 'a'
    { char: 's', class: 's2' }  // Different class for second 's'
  ];

  const nameElement = document.getElementById('animated-name');
  nameElement.innerHTML = ''; // Clear initial text

  let i = 0;
  const speed = 150; // Typing speed in ms

  function type() {
    if (i < colors.length) {
      const charObj = colors[i];
      const span = document.createElement('span');
      span.className = charObj.class;
      span.textContent = charObj.char;
      nameElement.appendChild(span);
      i++;
      setTimeout(type, speed);
    } else {
      nameElement.style.borderRight = 'none'; // Remove cursor
    }
  }

  setTimeout(type, 1000); // Delay before starting (1 second)
}

// Call when page loads
document.addEventListener('DOMContentLoaded', typeWriterName);
document.querySelector('.typewriter-cursor').classList.add('done');

// In your existing script.js
document.getElementById('contact-form').addEventListener('submit', function(e) {
  // Show loading state
  const btn = this.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  
  // FormSubmit will handle the redirect automatically
  // No need for preventDefault() since we want the normal flow
});


// In script.js
async function loadQuotes() {
  try {
    const response = await fetch('http://localhost:3001/api/quotes');
    const books = await response.json();
    
    const container = document.getElementById('threads-container');
    container.innerHTML = books.map(book => `
      <div class="thread-book">
        <h3>${book.title}</h3>
        <div class="thread-quotes">
          <p>"${book.quote}"</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Failed to load quotes:", error);
    // Fallback to local JSON
    fetch('assets/books.json')
      .then(res => res.json())
      .then(fallbackBooks => {
        // Render fallback data
      });
  }
}

async function loadGallery() {
  try {
    const response = await fetch('http://localhost:3001/api/gallery');
    const images = await response.json();
    
    const grid = document.querySelector('.gallery-grid');
    grid.innerHTML = images.map(img => `
      <figure>
        <img src="${img.imageUrl}" alt="${img.title}" loading="lazy">
        <figcaption>${img.description}</figcaption>
      </figure>
    `).join('');
  } catch (error) {
    console.error("Failed to load gallery:", error);
    // Fallback to local JSON/images
  }
}
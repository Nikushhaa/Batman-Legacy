/**
 * ================================================================
 *  GOTHAM NEXUS — script.js
 *  Interactive animations and dynamic features
 *
 *  Sections:
 *  1. Cursor Glow (mouse-tracking spotlight)
 *  2. Navbar scroll behavior
 *  3. Hamburger / Mobile Menu
 *  4. Hero reveal on load
 *  5. Rain effect (CSS + JS drop generation)
 *  6. Floating particles
 *  7. Intersection Observer (scroll reveals)
 *  8. Counter animation (hero stats)
 *  9. Gadget filter tabs
 * 10. Form submission handler
 * ================================================================
 */

/* ================================================================
   1. CURSOR GLOW
   Moves a large radial-gradient div to follow the mouse,
   creating a cinematic torch / spotlight effect over the page.
================================================================ */

// Grab the cursor glow element by its ID
const cursorGlow = document.getElementById('cursorGlow');

// Listen for every mouse movement across the entire document
document.addEventListener('mousemove', (e) => {
  // Position the glowing circle so its center is at the cursor's page position.
  // CSS already does  transform: translate(-50%, -50%)  which offsets by half
  // the element's own width/height — so setting left/top to the cursor coords
  // is all we need.
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// Fade glow out when mouse leaves the viewport
document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorGlow.style.opacity = '1';
});


/* ================================================================
   2. NAVBAR SCROLL BEHAVIOR
   Adds a  .scrolled  class once the user scrolls past 60px,
   which activates the backdrop-blur + dark background via CSS.
================================================================ */

// Grab the navbar element
const navbar = document.getElementById('navbar');

// Helper function called on every scroll event
function handleNavbarScroll() {
  // If we've scrolled more than 60px from the top…
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');    // CSS triggers blur + bg
  } else {
    navbar.classList.remove('scrolled'); // Transparent again at top
  }
}

// Attach the handler to the window's scroll event
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// Run it once immediately in case the page loads scrolled
handleNavbarScroll();


/* ================================================================
   3. HAMBURGER / MOBILE MENU
   Toggles the full-screen mobile menu overlay and the
   animated hamburger→X icon transformation.
================================================================ */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

/**
 * toggleMobile — flips the .open class on both the button
 * and the overlay, toggling visibility + CSS transition.
 */
function toggleMobile() {
  // .toggle() adds the class if absent, removes it if present
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');

  // Lock body scroll when menu is open so the overlay stays put
  document.body.style.overflow =
    mobileMenu.classList.contains('open') ? 'hidden' : '';
}

/**
 * closeMobile — explicitly closes the menu.
 * Called from each mobile <a> tag's onclick attribute
 * so tapping a link hides the menu before scrolling.
 */
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Attach the toggle to the hamburger button click
hamburger.addEventListener('click', toggleMobile);

// Close the menu if the user clicks the overlay background directly
mobileMenu.addEventListener('click', (e) => {
  // Only close if the click is on the overlay itself, not a child link
  if (e.target === mobileMenu) closeMobile();
});


/* ================================================================
   4. HERO REVEAL ON PAGE LOAD
   Triggers the CSS opacity/translate transitions for all
   hero text layers 300ms after the DOM is ready.
================================================================ */

// Wait for the full DOM to be available
document.addEventListener('DOMContentLoaded', () => {

  // After a short pause (feels more cinematic), reveal the hero
  setTimeout(() => {
    // Grab every element inside the hero that has a data-reveal attribute
    const heroSection  = document.querySelector('.hero');
    const heroReveals  = heroSection.querySelectorAll('[data-reveal]');

    // Add .revealed to the section itself (for the child selectors in CSS)
    heroSection.classList.add('revealed');

    // Also mark each [data-reveal] element directly
    heroReveals.forEach(el => el.classList.add('revealed'));

    // Start the counter animation for the hero stats
    animateCounters();
  }, 300); // 300ms delay
});


/* ================================================================
   5. RAIN EFFECT
   Dynamically spawns <div class="rain-drop"> elements inside
   .rain-container and sets random CSS properties so each drop
   looks unique.
================================================================ */

const rainContainer = document.getElementById('rainContainer');

/**
 * createRainDrop — makes a single raindrop element and
 * appends it to the container. Each drop removes itself
 * after its animation ends so we don't accumulate DOM nodes.
 */
function createRainDrop() {
  const drop = document.createElement('div');
  drop.classList.add('rain-drop');

  // Random horizontal position (0%–100% of viewport width)
  drop.style.left = Math.random() * 100 + '%';

  // Random height between 40px and 90px
  const height = 40 + Math.random() * 50;
  drop.style.height = height + 'px';

  // Random animation duration (faster = heavier rain feel)
  const duration = 0.5 + Math.random() * 1.2; // 0.5s – 1.7s
  drop.style.animationDuration = duration + 's';

  // Random delay so drops don't all start simultaneously
  drop.style.animationDelay = Math.random() * 2 + 's';

  // Append to the rain container
  rainContainer.appendChild(drop);

  // Self-cleanup: remove the element once its CSS animation ends
  drop.addEventListener('animationend', () => drop.remove());
}

// Spawn a new drop every 60ms (≈16 drops/sec for a light Gotham drizzle)
setInterval(createRainDrop, 60);


/* ================================================================
   6. FLOATING PARTICLES
   Creates small glowing dots that float upward across the
   hero section, like embers or dust motes in the Gotham fog.
================================================================ */

const particlesContainer = document.getElementById('particles');

/**
 * createParticle — spawns one glowing dot at a random
 * horizontal position, animated upward via CSS.
 */
function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');

  // Random horizontal start position
  p.style.left   = Math.random() * 100 + '%';

  // Start from the bottom 40% of the hero section
  p.style.bottom = Math.random() * 40 + '%';

  // Random animation duration: 3s – 7s
  const dur = 3 + Math.random() * 4;
  p.style.animationDuration = dur + 's';

  // Slight random delay to stagger spawns
  p.style.animationDelay = Math.random() * 2 + 's';

  // Vary particle size slightly (1px – 3px)
  const size = 1 + Math.random() * 2;
  p.style.width  = size + 'px';
  p.style.height = size + 'px';

  particlesContainer.appendChild(p);

  // Remove after animation completes
  p.addEventListener('animationend', () => p.remove());
}

// Spawn a new particle every 400ms (creates a subtle, non-distracting effect)
setInterval(createParticle, 400);


/* ================================================================
   7. INTERSECTION OBSERVER — SCROLL REVEAL
   Watches all  [data-reveal]  elements outside the hero.
   When they scroll into view, .revealed is added, triggering
   the CSS transition (opacity 0→1, translateY 28px→0).
================================================================ */

// Configuration for the observer
const revealConfig = {
  root: null,           // Observe relative to the viewport
  rootMargin: '0px',    // No margin extension
  threshold: 0.12,      // Trigger when 12% of element is visible
};

/**
 * revealCallback — called by IntersectionObserver whenever
 * one of the watched elements enters or exits the viewport.
 */
function revealCallback(entries, observer) {
  entries.forEach(entry => {
    // entry.isIntersecting is true when the element is in view
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');   // Trigger CSS transition
      observer.unobserve(entry.target);          // Stop watching — reveal once only
    }
  });
}

// Create the observer instance with our config + callback
const revealObserver = new IntersectionObserver(revealCallback, revealConfig);

// Select every [data-reveal] element on the page that's NOT inside .hero
// (hero is handled separately on load above)
document.querySelectorAll('[data-reveal]').forEach(el => {
  // Skip hero children — they're triggered by the load handler
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});


/* ================================================================
   8. COUNTER ANIMATION
   Counts up from 0 to the target number for each  [data-count]
   element, using requestAnimationFrame for a smooth tick.
================================================================ */

/**
 * animateCounter — smoothly increments a single element
 * from 0 to its data-count value over ~1.5 seconds.
 *
 * @param {HTMLElement} el - The element to animate
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10); // Read target number from attribute
  const duration = 1500;                            // Total animation time in ms
  const start    = performance.now();               // Record start timestamp

  /**
   * tick — recursive animation frame.
   * Calculates current progress (0→1), applies an ease-out
   * curve, then updates the element's text content.
   */
  function tick(now) {
    // How far through the animation are we? (0 = just started, 1 = done)
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1); // Clamp to [0, 1]

    // Ease-out cubic: starts fast, decelerates near target
    const eased = 1 - Math.pow(1 - progress, 3);

    // Calculate current displayed number and round it
    const current = Math.round(eased * target);
    el.textContent = current;

    // Keep animating until we've reached the end
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target; // Ensure exact final value
    }
  }

  // Kick off the first frame
  requestAnimationFrame(tick);
}

/**
 * animateCounters — finds all [data-count] elements and
 * starts their individual counter animations.
 */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    animateCounter(el);
  });
}


/* ================================================================
   9. GADGET FILTER TABS
   Clicking a filter button hides/shows gadget cards based on
   their  data-category  attribute. Uses CSS class toggling for
   smooth opacity + scale transitions defined in style.css.
================================================================ */

// Grab all filter buttons and all gadget cards
const filterButtons = document.querySelectorAll('.filter-btn');
const gadgetCards   = document.querySelectorAll('.gadget-card');

/**
 * applyFilter — shows cards matching the selected filter,
 * hides all others. The "all" filter shows everything.
 *
 * @param {string} filter - The category string (e.g. "vehicle", "weapon", "tech", "all")
 */
function applyFilter(filter) {
  gadgetCards.forEach(card => {
    // Get the card's category from its data attribute
    const category = card.dataset.category;

    // Determine if this card should be visible
    const isVisible = filter === 'all' || category === filter;

    if (isVisible) {
      card.classList.remove('hidden');  // Show: triggers CSS transition back to full opacity
    } else {
      card.classList.add('hidden');     // Hide: CSS fades out and scales down
    }
  });
}

// Attach a click handler to every filter button
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove .active from all buttons, then add to the clicked one
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Read the filter value from the button's data attribute and apply it
    const selectedFilter = btn.dataset.filter;
    applyFilter(selectedFilter);
  });
});


/* ================================================================
  10. FORM SUBMISSION HANDLER
   Intercepts the form's default submit event, shows a
   success message, and resets the form — no page reload.
================================================================ */

/**
 * handleFormSubmit — called from the form's onsubmit attribute.
 * Prevents the default browser POST, shows the success banner.
 *
 * @param {Event} e - The form submit event
 */
function handleFormSubmit(e) {
  // Prevent the browser from navigating to a new URL
  e.preventDefault();

  // Get references to the form and the success message element
  const form    = document.getElementById('signalForm');
  const success = document.getElementById('formSuccess');

  // Hide the form and show the success confirmation
  form.style.display    = 'none';
  success.classList.add('show');   // CSS: display: block + fadeInUp animation

  // Reset the form so it's clean if the user navigates back
  form.reset();
}


/* ================================================================
   BONUS: Big Bat Logo Parallax
   Subtle parallax on the large center logo — it shifts slightly
   as the user scrolls, adding a depth / 3D feel.
================================================================ */

const bigBatLogo = document.getElementById('bigBatLogo');

// Update parallax offset on scroll
window.addEventListener('scroll', () => {
  if (!bigBatLogo) return;

  // Get the logo's position relative to the viewport
  const rect   = bigBatLogo.getBoundingClientRect();
  const center = window.innerHeight / 2;

  // How far the element's center is from the viewport center (−1 to +1)
  const offset = (rect.top + rect.height / 2 - center) / center;

  // Shift vertically by up to ±24px based on scroll position
  const shift = offset * 24;
  bigBatLogo.style.transform = `translateY(${shift}px)`;
}, { passive: true });


/* ================================================================
   BONUS: Bat-Signal Section Tilt on Mouse Move
   The CTA bat-signal section tilts very slightly in 3D
   following the cursor, creating an immersive effect.
================================================================ */

const batSignalCta = document.getElementById('batSignalCta');

if (batSignalCta) {
  // Parent section — use the whole contact section as the listening area
  const contactSection = document.querySelector('.contact');

  contactSection.addEventListener('mousemove', (e) => {
    // Get bounding box of the contact section
    const rect = contactSection.getBoundingClientRect();

    // Normalise cursor position within the section to [-1, 1]
    const xNorm = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const yNorm = ((e.clientY - rect.top ) / rect.height - 0.5) * 2;

    // Maximum tilt: 10 degrees
    const tiltX = yNorm * -10;  // Inverted so it tilts toward the cursor
    const tiltY = xNorm *  10;

    // Apply 3D rotation transform to the bat-signal element
    batSignalCta.style.transform =
      `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  // Reset tilt when cursor leaves the section
  contactSection.addEventListener('mouseleave', () => {
    batSignalCta.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    batSignalCta.style.transition = 'transform 0.5s ease';
  });

  // Remove transition override while actively moving (for snappy tracking)
  contactSection.addEventListener('mouseenter', () => {
    batSignalCta.style.transition = 'transform 0.08s linear';
  });
}//
//
//


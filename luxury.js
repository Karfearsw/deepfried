/* Luxury JavaScript - Banner Animations & Newsletter Popup */

// Luxury Banner Animation
class LuxuryBanner {
  constructor() {
    this.banner = null;
    this.content = null;
    this.init();
  }

  init() {
    this.banner = document.querySelector('.luxury-banner');
    this.content = document.querySelector('.banner-content');
    
    if (this.banner && this.content) {
      this.setupMarquee();
      this.addScrollEffects();
    }
  }

  setupMarquee() {
    // Duplicate content for seamless marquee effect
    const originalContent = this.content.innerHTML;
    this.content.innerHTML = originalContent + originalContent;
    
    // Add pause on hover
    this.banner.addEventListener('mouseenter', () => {
      this.content.style.animationPlayState = 'paused';
    });
    
    this.banner.addEventListener('mouseleave', () => {
      this.content.style.animationPlayState = 'running';
    });
  }

  addScrollEffects() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Subtle parallax effect
      if (this.banner) {
        const opacity = Math.max(0.7, 1 - (currentScrollY * 0.001));
        this.banner.style.opacity = opacity;
        
        // Slight movement based on scroll direction
        const translateY = scrollDelta * 0.1;
        this.banner.style.transform = `translateY(${translateY}px)`;
      }
      
      lastScrollY = currentScrollY;
    });
  }
}

// Newsletter Popup Manager
class NewsletterPopup {
  constructor() {
    this.popup = null;
    this.overlay = null;
    this.form = null;
    this.isOpen = false;
    this.freespreeTracked = false;
    this.init();
  }

  init() {
    this.createPopup();
    this.bindEvents();
    this.setupTriggers();
  }

  createPopup() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'newsletter-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(10, 10, 10, 0.8);
      z-index: 1999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease-in-out;
    `;

    // Create popup
    this.popup = document.createElement('div');
    this.popup.className = 'newsletter-popup';
    this.popup.setAttribute('role', 'dialog');
    this.popup.setAttribute('aria-modal', 'true');
    this.popup.setAttribute('aria-labelledby', 'newsletter-title');
    this.popup.innerHTML = `
      <div class="newsletter-content">
        <button class="newsletter-close" type="button" aria-label="Close newsletter popup">&times;</button>
        
        <div class="newsletter-logo">
          <div class="logo-container">
            <h2 class="logo-text">LUXE</h2>
            <p class="logo-subtitle">Curated Excellence</p>
          </div>
        </div>
        
        <div class="newsletter-form">
          <h3 id="newsletter-title" class="newsletter-title">Exclusive Access</h3>
          <p class="newsletter-text">
            Join our privileged community for early access to limited collections, 
            private sales, and insider previews of upcoming releases.
          </p>
          
          <form id="newsletter-form" class="newsletter-form-container">
            <div class="form-group">
              <input 
                type="email" 
                id="newsletter-email" 
                class="form-input" 
                placeholder="Enter your email address"
                required
                aria-label="Email address"
              >
            </div>
            
            <div class="form-group">
              <input 
                type="tel" 
                id="newsletter-phone" 
                class="form-input" 
                placeholder="Phone number (optional)"
                aria-label="Phone number"
              >
            </div>
            
            <div class="form-group">
              <label class="checkbox-container">
                <input type="checkbox" id="newsletter-consent" required>
                <span class="checkmark"></span>
                <span class="checkbox-text">
                  I consent to receive marketing communications and agree to the 
                  <a href="#privacy" class="privacy-link">privacy policy</a>
                </span>
              </label>
            </div>
            
            <button type="submit" class="btn btn-primary newsletter-submit">
              Gain Exclusive Access
            </button>
          </form>
          
          <p class="newsletter-disclaimer">
            Unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    `;

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .newsletter-overlay.active {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .newsletter-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 2000;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
      }
      
      .newsletter-popup.active {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
      }
      
      .newsletter-content {
        background-color: var(--luxury-white);
        border: 2px solid var(--luxury-black);
        display: grid;
        grid-template-columns: 1fr 1fr;
        position: relative;
        max-height: 80vh;
        overflow: hidden;
      }
      
      .newsletter-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--luxury-gray);
        z-index: 1;
        transition: color 0.2s ease;
      }
      
      .newsletter-close:hover {
        color: var(--luxury-black);
      }
      
      .newsletter-logo {
        background-color: var(--luxury-off-white);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        border-right: 1px solid var(--luxury-light-gray);
      }
      
      .logo-container {
        text-align: center;
      }
      
      .logo-text {
        font-size: 2.5rem;
        font-weight: 200;
        letter-spacing: 0.2em;
        margin: 0;
        color: var(--luxury-black);
      }
      
      .logo-subtitle {
        font-size: 0.875rem;
        color: var(--luxury-gray);
        margin: 10px 0 0;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      
      .newsletter-form {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .newsletter-title {
        font-size: 1.75rem;
        font-weight: 300;
        margin-bottom: 15px;
        color: var(--luxury-black);
      }
      
      .newsletter-text {
        color: var(--luxury-gray);
        margin-bottom: 25px;
        font-size: 0.875rem;
        line-height: 1.6;
      }
      
      .newsletter-form-container {
        margin-bottom: 20px;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-input {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid var(--luxury-light-gray);
        background-color: var(--luxury-white);
        color: var(--luxury-black);
        font-family: inherit;
        font-size: 0.875rem;
        transition: border-color 0.2s ease;
      }
      
      .form-input:focus {
        outline: none;
        border-color: var(--luxury-gold);
      }
      
      .checkbox-container {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        cursor: pointer;
        font-size: 0.75rem;
        color: var(--luxury-gray);
      }
      
      .checkbox-container input[type="checkbox"] {
        margin-top: 2px;
      }
      
      .privacy-link {
        color: var(--luxury-gold);
        text-decoration: underline;
      }
      
      .newsletter-submit {
        width: 100%;
        margin-top: 10px;
      }
      
      .newsletter-disclaimer {
        font-size: 0.75rem;
        color: var(--luxury-light-gray);
        text-align: center;
        margin: 0;
      }
      
      @media (max-width: 768px) {
        .newsletter-content {
          grid-template-columns: 1fr;
        }
        
        .newsletter-logo {
          border-right: none;
          border-bottom: 1px solid var(--luxury-light-gray);
          padding: 30px;
        }
        
        .newsletter-form {
          padding: 30px;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .newsletter-popup {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.popup);
  }

  bindEvents() {
    // Close button
    const closeBtn = this.popup.querySelector('.newsletter-close');
    closeBtn.addEventListener('click', () => this.close());

    // Overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Form submission
    this.form = this.popup.querySelector('#newsletter-form');
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Focus management
    this.setupFocusManagement();
  }

  setupFocusManagement() {
    const focusableElements = this.popup.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.popup.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  setupTriggers() {
    // Auto-show after 5 seconds
    setTimeout(() => {
      if (!this.hasUserInteracted()) {
        this.open();
      }
    }, 5000);

    // Show on scroll (after 50% of page)
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (!scrollTriggered && this.shouldShowOnScroll()) {
        scrollTriggered = true;
        if (!this.hasUserInteracted()) {
          this.open();
        }
      }
    });

    // Show on exit intent
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !this.hasUserInteracted()) {
        this.open();
      }
    });
  }

  shouldShowOnScroll() {
    const scrollPercentage = (window.scrollY / document.body.scrollHeight) * 100;
    return scrollPercentage > 50;
  }

  hasUserInteracted() {
    return localStorage.getItem('newsletter-interacted') === 'true';
  }

  markAsInteracted() {
    localStorage.setItem('newsletter-interacted', 'true');
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.popup.classList.add('active');
    
    // Focus first input
    const firstInput = this.popup.querySelector('input[type="email"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    // Track with Freespree
    this.trackFreespree('newsletter_popup_shown');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.popup.classList.remove('active');
    
    // Mark as interacted
    this.markAsInteracted();
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Track with Freespree
    this.trackFreespree('newsletter_popup_closed');
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const email = this.popup.querySelector('#newsletter-email').value;
    const phone = this.popup.querySelector('#newsletter-phone').value;
    const consent = this.popup.querySelector('#newsletter-consent').checked;
    
    if (!email || !consent) {
      alert('Please provide your email address and consent.');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Simulate submission
    const submitBtn = this.popup.querySelector('.newsletter-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Track with Freespree
    this.trackFreespree('newsletter_submitted', {
      email: email,
      phone: phone,
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      // Success message
      const formContainer = this.popup.querySelector('.newsletter-form-container');
      formContainer.innerHTML = `
        <div class="success-message">
          <h4 style="color: var(--luxury-gold); margin-bottom: 10px;">Welcome to Luxury</h4>
          <p style="color: var(--luxury-gray); font-size: 0.875rem;">
            Thank you for joining our exclusive community. You'll receive a confirmation email shortly.
          </p>
        </div>
      `;
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        this.close();
      }, 3000);
      
    }, 1500);
  }

  trackFreespree(event, data = {}) {
    // Freespree tracking integration
    if (typeof window.freespree !== 'undefined') {
      window.freespree.track(event, data);
    }
    
    // Fallback to console for debugging
    console.log('Freespree Track:', event, data);
  }
}

// Smooth Scroll Effects
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add scroll reveal animations
    this.setupScrollReveal();
  }

  setupScrollReveal() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe elements for reveal animation
    document.querySelectorAll('.product-card, .about-item, .contact-form').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Add revealed styles
    const style = document.createElement('style');
    style.textContent = `
      .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize Luxury Features
document.addEventListener('DOMContentLoaded', () => {
  // Initialize banner animation
  new LuxuryBanner();
  
  // Initialize newsletter popup
  new NewsletterPopup();
  
  // Initialize smooth scroll effects
  new SmoothScroll();
  
  console.log('Luxury features initialized successfully');
});

// Export for use in other scripts
window.LuxuryFeatures = {
  LuxuryBanner,
  NewsletterPopup,
  SmoothScroll
};
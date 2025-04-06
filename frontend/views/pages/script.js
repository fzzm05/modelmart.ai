
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
        mobileMenuButton.classList.toggle('open');
        
        // Transform menu icon to X when menu is open
        if (mobileMenu.classList.contains('show')) {
          const style = document.createElement('style');
          style.id = 'mobile-menu-style';
          style.textContent = `
            .mobile-menu-button.open .menu-icon {
              background: transparent;
            }
            .mobile-menu-button.open .menu-icon::before {
              transform: rotate(45deg);
              top: 0;
            }
            .mobile-menu-button.open .menu-icon::after {
              transform: rotate(-45deg);
              top: 0;
            }
          `;
          
          if (!document.getElementById('mobile-menu-style')) {
            document.head.appendChild(style);
          }
        }
      });
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('show')) {
          mobileMenu.classList.remove('show');
          if (mobileMenuButton) {
            mobileMenuButton.classList.remove('open');
          }
        }
        
        const targetId = this.getAttribute('href');
        
        // Skip for empty links or just "#"
        if (targetId === '#' || targetId === '') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Update the year in the footer copyright
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
  
    // Add navbar background when scrolling
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
          navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        } else {
          navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
      });
    }
  
    // Highlight active section in navbar
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');
  
    if (sections.length > 0 && navLinks.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -20% 0px',
        threshold: 0
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Get the matching navigation link
          const id = entry.target.getAttribute('id');
          const desktopNavLink = document.querySelector(`.nav-link[href="#${id}"]`);
          const mobileNavLink = document.querySelector(`.mobile-nav-link[href="#${id}"]`);
          
          if (entry.isIntersecting) {
            // Style for active desktop links
            if (desktopNavLink) {
              document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = '';
                link.style.fontWeight = '';
              });
              desktopNavLink.style.color = '#0f172a'; // var(--foreground)
              desktopNavLink.style.fontWeight = '500';
            }
            
            // Style for active mobile links
            if (mobileNavLink) {
              document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.style.color = '';
                link.style.fontWeight = '';
                link.style.borderLeftColor = 'transparent';
              });
              mobileNavLink.style.color = '#0f172a'; // var(--foreground)
              mobileNavLink.style.fontWeight = '500';
              mobileNavLink.style.borderLeftColor = '#1E40AF'; // var(--primary)
            }
          }
        });
      }, observerOptions);
  
      // Observe all sections
      sections.forEach(section => {
        observer.observe(section);
      });
    }
  });
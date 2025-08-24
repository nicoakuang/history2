document.addEventListener("DOMContentLoaded", () => {
  // === Sticky Header ===
  const header = document.getElementById("main-header");
  const nav = document.querySelector(".header-nav");
  const headerHeight = header.offsetHeight; // Get initial header height
  // === Mobile Menu Toggle ===
    const mobileMenuToggleButton = document.getElementById("mobile-menu-toggle");
    const mainNavMobile = document.getElementById("main-nav-mobile");

    if (mobileMenuToggleButton && mainNavMobile) {
        mobileMenuToggleButton.addEventListener("click", () => {
            mainNavMobile.classList.toggle("active");
            // Optional: Change icon to 'X' when active
            const icon = mobileMenuToggleButton.querySelector('i');
            if (mainNavMobile.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu if a nav item is clicked
        mainNavMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNavMobile.classList.remove('active');
                mobileMenuToggleButton.querySelector('i').classList.remove('fa-times');
                mobileMenuToggleButton.querySelector('i').classList.add('fa-bars');
            });
        });

        // Close mobile menu if clicked outside (optional, but good UX)
        document.addEventListener('click', (event) => {
            if (!mainNavMobile.contains(event.target) && !mobileMenuToggleButton.contains(event.target) && mainNavMobile.classList.contains('active')) {
                mainNavMobile.classList.remove('active');
                mobileMenuToggleButton.querySelector('i').classList.remove('fa-times');
                mobileMenuToggleButton.querySelector('i').classList.add('fa-bars');
            }
        });
    }

    // ... (rest of your existing JavaScript) ...

  window.addEventListener("scroll", () => {
    if (window.scrollY > headerHeight) {
      header.classList.add("sticky");
      // Add padding-top to body to prevent content jump
      document.body.style.paddingTop = header.offsetHeight + "px";
    } else {
      header.classList.remove("sticky");
      document.body.style.paddingTop = "0"; // Remove padding when not sticky
    }

    // Hide/show nav specifically for desktop when sticky
    if (window.innerWidth > 992) {
      // Assuming 992px is your tablet breakpoint
      if (header.classList.contains("sticky")) {
        
      } else {
        
      }
    }
  });

  // --- TOC Sidebar Toggle for Mobile ---
  const tocSidebar = document.getElementById("toc-sidebar");
  const tocToggleButton = document.getElementById("toc-toggle-button");

  if (tocToggleButton && tocSidebar) {
    tocToggleButton.addEventListener("click", () => {
      tocSidebar.classList.toggle("active");
    });
  }

  // === Dynamic Table of Contents (TOC) Generation ===
  const tocList = document.getElementById("toc-list");
  const headings = document.querySelectorAll(
    "main article h1, main article h2, main article h3"
  );
  let tocHtml = "";

  headings.forEach((heading) => {
    const id = heading.id || heading.textContent.replace(/\s+/g, "-").toLowerCase();
    heading.id = id; // Ensure all headings have an ID for linking

    let className = "";
    if (heading.tagName === "H2") {
      className = "toc-h2";
    } else if (heading.tagName === "H3") {
      className = "toc-h3";
    }
    tocHtml += `<li><a href="#${id}" class="${className}">${heading.textContent}</a></li>`;
  });
  if (tocList) {
    tocList.innerHTML = tocHtml;
  }


  // === ScrollSpy for TOC Active State ===
  const tocLinks = document.querySelectorAll("#toc-list a");
  const sections = document.querySelectorAll(
    "main article h1, main article h2, main article h3"
  ); // Target the actual headings

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px 0px -50% 0px", // Adjust to highlight section when it's roughly in the middle
    threshold: 0, // as soon as even one pixel of the target is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // === Smooth Scrolling for TOC links ===
  tocLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for sticky header
          behavior: "smooth",
        });
      }
    });
  });

  // === Image Gallery with Lightbox ===
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightbox = document.getElementById("article-lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const lightboxSource = lightbox ? lightbox.querySelector(".lightbox-source") : null;

  if (lightbox && lightboxImg && lightboxClose) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        lightbox.classList.add("active");
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        const sourceUrl = item.getAttribute("data-source");
        if (sourceUrl) {
          lightboxSource.href = sourceUrl;
          lightboxSource.style.display = 'block'; // Show source link
        } else {
          lightboxSource.style.display = 'none'; // Hide if no source
        }
      });
    });

    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }


  // === Interactive Glossary (Accordion) ===
  const glossaryHeaders = document.querySelectorAll(".glossary-header");

  glossaryHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling; // Get the next sibling (glossary-content)
      const icon = header.querySelector(".icon");

      // Close all other open glossaries
      glossaryHeaders.forEach((otherHeader) => {
        if (otherHeader !== header && otherHeader.classList.contains("active")) {
          otherHeader.classList.remove("active");
          otherHeader.nextElementSibling.classList.remove("active");
          otherHeader.querySelector(".icon").style.transform = "rotate(0deg)";
        }
      });

      // Toggle current glossary
      header.classList.toggle("active");
      content.classList.toggle("active");
      if (icon) {
        if (header.classList.contains("active")) {
          icon.style.transform = "rotate(90deg)";
        } else {
          icon.style.transform = "rotate(0deg)";
        }
      }
    });
  });


  // === Scroll Animations (Fade In Sections) ===
  const fadeInSections = document.querySelectorAll(".fade-in-section");

  const fadeInObserverOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the item is visible
  };

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, fadeInObserverOptions);

  fadeInSections.forEach((section) => {
    fadeInObserver.observe(section);
  });


  // === Back to Top Button ===
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      // Show button after scrolling down 300px
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
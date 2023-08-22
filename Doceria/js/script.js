document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById("nav-toggle");
    const mobileNav = document.getElementById("mobile-nav");
  
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-active");
    });
  
    // Feche a navegação móvel quando um link é clicado
    const mobileNavLinks = mobileNav.querySelectorAll("a");
    mobileNavLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("mobile-nav-active");
      });
    });
  });
  
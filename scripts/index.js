const navbar = document.querySelector('.navbar');
const mobileNavbar = document.querySelector('.navbar__mobile');
const button = document.querySelector('.burger');

button.addEventListener('click',function(){
    mobileNavbar.classList.toggle('active');
});


window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
        navbar.classList.add('active');
        navbar.classList.remove('active');
    }
});

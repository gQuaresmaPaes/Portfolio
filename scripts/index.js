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

function typeWriter(el) {
    const textArray = el.innerHTML.split('')
    el.innerHTML = ''

    textArray.forEach((letter, i) => {
        setTimeout(() => {
            el.innerHTML += letter
        }, 95 * i)
    })

    setInterval (() => typeWriter(el), 8000)
}

const elementName = document.getElementById('elementName')  // Substitua 'elementName' pelo ID correto
typeWriter(elementName)

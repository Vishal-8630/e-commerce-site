const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu(){
    mobileMenuElement.classList.toggle('toggle-menu');
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);
/*
   Author: Natividad, Mark Lorenz P.
   Section: WD-202
   Activity: HAU Table Tennis Website - navigation transition
*/

var menuBtn = document.getElementById("menu-btn");
var navMenu = document.getElementById("nav-menu");
var pageLinks = document.querySelectorAll("a[href$='.html']");

/* Hamburger menu: slides the mobile navigation open and closed */
function toggleMenu(){
    navMenu.classList.toggle("open");
    var isOpen = navMenu.classList.contains("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
    menuBtn.innerHTML = isOpen ? "&#10005;" : "&#9776;";
}

/* Page transition: fade the page out, then go to the clicked page */
function changePage(event){
    var target = this.getAttribute("href");
    if(this.target === "_blank"){
        return;
    }
    event.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(function(){
        window.location.href = target;
    }, 400);
}

menuBtn.addEventListener("click", toggleMenu);

for(var i = 0; i < pageLinks.length; i++){
    pageLinks[i].addEventListener("click", changePage);
}

/* Fix for the browser back button (page restored while still faded out) */
window.addEventListener("pageshow", function(){
    document.body.classList.remove("leaving");
});

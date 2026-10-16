/*
   Author: Natividad, Mark Lorenz P.
   Section: WD-202
   Activity: HAU Table Tennis Website - navigation transition and form validation
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

/* Contact form (join page) error messages and confirmation */
var form = document.getElementById("form");

function showError(field, message){
    document.getElementById(field.id + "-error").textContent = message;
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
}

function clearError(field){
    document.getElementById(field.id + "-error").textContent = "";
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
}

/* This shows a message when returns false */
function validateField(field){
    var value = field.value.trim();

    if(field.id === "name"){
        if(value === ""){
            showError(field, "Please enter your name.");
            return false;
        }
        if(value.length < 2){
            showError(field, "Your name must have at least 2 characters.");
            return false;
        }
    }

    if(field.id === "email"){
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(value === ""){
            showError(field, "Please enter your email address.");
            return false;
        }
        if(!emailPattern.test(value)){
            showError(field, "Please enter a valid email, for example name@example.com.");
            return false;
        }
    }

    /* Contact number */
    if(field.id === "contact" && value !== ""){
        var digits = value.replace(/\D/g, "");
        var phonePattern = /^[0-9+\-\s()]+$/;
        if(!phonePattern.test(value) || digits.length < 7 || digits.length > 15){
            showError(field, "Please enter a valid number, for example 0915-412-8640.");
            return false;
        }
    }

    clearError(field);
    return true;
}

function submitForm(event){
    event.preventDefault();
    var fields = [document.getElementById("name"), document.getElementById("email"), document.getElementById("contact")];
    var status = document.getElementById("form-status");
    var firstInvalid = null;

    for(var i = 0; i < fields.length; i++){
        if(!validateField(fields[i]) && firstInvalid === null){
            firstInvalid = fields[i];
        }
    }

    if(firstInvalid !== null){
        status.className = "form-status error-status";
        status.textContent = "Please fix the highlighted fields and try again.";
        firstInvalid.focus();
        return;
    }

    var firstName = fields[0].value.trim();
    HTMLFormElement.prototype.reset.call(form);
    status.className = "form-status";
    status.textContent = "Thank you, " + firstName + "! Your message was submitted. We will get back to you soon.";
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* Remove the red notification when the inputs are correct */
function clearStatusIfFixed(){
    var status = document.getElementById("form-status");
    if(status.className.indexOf("error-status") !== -1 && form.querySelectorAll(".invalid").length === 0){
        status.className = "form-status";
        status.textContent = "";
    }
}

function resetForm(){
    var fields = form.querySelectorAll("input, textarea");
    for(var i = 0; i < fields.length; i++){
        if(document.getElementById(fields[i].id + "-error")){
            clearError(fields[i]);
        }
    }
    var status = document.getElementById("form-status");
    status.className = "form-status";
    status.textContent = "";
}

if(form){
    var checkedFields = [document.getElementById("name"), document.getElementById("email"), document.getElementById("contact")];
    for(var j = 0; j < checkedFields.length; j++){
        checkedFields[j].addEventListener("blur", function(){
            validateField(this);
        });
        checkedFields[j].addEventListener("input", function(){
            if(this.classList.contains("invalid")){
                validateField(this);
                clearStatusIfFixed();
            }
        });
    }
    form.addEventListener("submit", submitForm);
    form.addEventListener("reset", resetForm);
}

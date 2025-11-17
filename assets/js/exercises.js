document.addEventListener("DOMContentLoaded", function() {
    create();
});


/* ================================= CREAR ================================= */
function create() {
    document.querySelector(".newexButton").addEventListener("click", () => {
        window.location.href = 'createEx.html'
    });
}
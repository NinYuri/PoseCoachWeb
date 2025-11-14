document.addEventListener("DOMContentLoaded", function() {
    passwordVisibility();
});

function passwordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".pass");

    toggleIcon.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        // Cambiar tipo
        passwordInput.type = isPassword ? "text" : "password";
        // Cambiar icono
        toggleIcon.classList.toggle("fa-eye");
        toggleIcon.classList.toggle("fa-eye-slash");
    });
}
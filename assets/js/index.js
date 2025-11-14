document.addEventListener("DOMContentLoaded", function() {
    passwordVisibility();
    register();
    loginUser();
});


/* ================================= CONTRASEÑA ================================= */
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


/* ================================= REGISTRO ================================= */
function register() {
    document.querySelector(".register").addEventListener("click", () => {
        window.location.href = 'register.html';
    });
}


/* ================================= VALIDACIONES ================================= */
function validate() {
    
}


/* ================================= BACKEND LOGIN ================================= */
async function loginUser() {
    document.querySelector(".loginForm").addEventListener("submit", async function(e) {
        e.preventDefault();

        const data = {
            identificador: document.getElementById("identificador").value,
            password: document.getElementById("password").value,
        }

        // URL Casa
        const URL = 'http://127.0.0.1:4000/users/login/'
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            if (response.ok) {
                Toast('success', '¡Inicio de sesión exitoso!');
                document.querySelector(".loginForm").reset();
                
                setTimeout(() => {
                    window.location.href = 'exercises.html';
                }, 2000);
            } else
                Errores(result);
        } catch(e) {
            Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde.');
        }
    });
}


/* ================================= ERRORES ================================= */
function Errores(errores) {
    const primerError = Object.values(errores)[0][0];
    Toast('error', primerError);
}

function Toast(icon, titulo) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-start',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
},
    });

    Toast.fire({
      icon: icon,
      title: titulo
    });
}
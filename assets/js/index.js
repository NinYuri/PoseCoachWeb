document.addEventListener("DOMContentLoaded", function() {
    passwordVisibility();
    password();
    register();
    loginUser();
});


/* ================================= LOADER ================================= */
function showLoader() {
    document.querySelector(".loader-overlay").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".loader-overlay").style.display = "none";
}


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

function password() {
    document.querySelector(".forget-password").addEventListener("click", () => {
        window.location.href = 'forgetPass.html';
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
    const user = document.getElementById("identificador").value;
    const password = document.getElementById("password").value;

    if(user === "" || user.trim() === "") {
        Toast('error', 'Por favor, escribe tu nombre de usuario');
        return false;
    }
    
    if(password === "" || password.trim() === "") {
        Toast('error', 'Por favor, escribe tu contraseña');
        return false;
    }
    
    return true;
}


/* ================================= BACKEND LOGIN ================================= */
async function loginUser() {
    document.querySelector(".loginForm").addEventListener("submit", async function(e) {
        e.preventDefault();

        if(!validate()) return;

        const data = {
            identificador: document.getElementById("identificador").value,
            password: document.getElementById("password").value,
        }

        const URL = 'http://127.0.0.1:4000/users/login/';
        try {
            showLoader();

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();
            hideLoader();

            if(response.ok) {
                Toast('success', '¡Inicio de sesión exitoso!');
                document.querySelector(".loginForm").reset();

                localStorage.setItem("username", data.identificador);
                localStorage.setItem("refresh_token", result.refresh_token);
                localStorage.setItem("access_token", result.access_token);
                
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 2000);
            } else
                Errores(result);
        } catch(e) {
            hideLoader();
            Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
        }
    });
}


/* ================================= ERRORES ================================= */
function Errores(errores) {
    if(!errores || !errores.error) {
        Toast('error', 'Ocurrió un error inesperado');
        return;
    }
    
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
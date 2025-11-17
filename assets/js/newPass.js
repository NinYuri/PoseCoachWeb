document.addEventListener("DOMContentLoaded", function() {
    passwordVisibility();
    otp();
    newPassword();
});


/* ================================= CONTRASEÑA ================================= */
function passwordVisibility() {
    const password = document.getElementById("new_password");
    const iconPass = document.querySelector(".new-pass");
    const confPassword = document.getElementById("new_password_confirm");
    const iconConf = document.querySelector(".conf-pass");

    iconPass.addEventListener("click", () => {
        const isPassword = password.type === "password";
        password.type = isPassword ? "text" : "password";
        iconPass.classList.toggle("fa-eye");
        iconPass.classList.toggle("fa-eye-slash");
    });

    iconConf.addEventListener("click", () => {
        const isPassword = confPassword.type === "password";
        confPassword.type = isPassword ? "text" : "password";
        iconConf.classList.toggle("fa-eye");
        iconConf.classList.toggle("fa-eye-slash");
    });
}


/* ================================= OTP ================================= */
function otp() {
    document.querySelector(".resetOTP").addEventListener("click", () => {
        window.location.href = 'otpPassword.html';
    });
}


/* ================================= VALIDACIONES ================================= */
function validate() {
    const password = document.getElementById("new_password").value;
    const confPassword = document.getElementById("new_password_confirm").value;

    if(password === "" || password.trim() === "") {
        Toast('error', 'Por favor, escribe tu nueva contraseña');
        return false;
    } else if (password.length < 8) {
        Toast('error', 'La nueva contraseña debe tener al menos 8 caracteres');
        return false;
    }

    if(confPassword === "" || confPassword.trim() === "") {
        Toast('error', 'Por favor, confirma tu nueva contraseña');
        return false;
    }

    if(password !== confPassword) {
        Toast('error', 'Lo siento, las contraseñas no coinciden');
        return false;
    }
    
    return true;
}


/* ================================= BACKEND NUEVA CONTRASEÑA ================================= */
async function newPassword() {
    document.querySelector(".newPass").addEventListener("submit", async function(e) {
        e.preventDefault();

        if(!validate()) return;

        let data = {};
        if(localStorage.getItem("emailPassword") !== null) {
            data = {
                email: localStorage.getItem("emailPassword"),
                otp: localStorage.getItem("otpPass"),
                new_password: document.getElementById("new_password").value,
                new_password_confirm: document.getElementById("new_password_confirm").value,
            }
        } else {
            data = {
                phone: localStorage.getItem("phonePassword"),
                otp: localStorage.getItem("otpPass"),
                new_password: document.getElementById("new_password").value,
                new_password_confirm: document.getElementById("new_password_confirm").value,
            }
        }

        const URL = 'http://127.0.0.1:4000/users/reset/';
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if(response.ok) {
                Toast('success', result.mensaje);
                localStorage.clear();
                document.querySelector(".newPass").reset();

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else
                Errores(result);
        } catch(e) {
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

    // Si el backend devuelve: "error": "mensaje"
    if (typeof errores.error === "string") {
        Toast('error', errores.error);
        return;
    }

    // Si es error en non_field_errors: ["mensaje"]
    if (errores.error.non_field_errors && Array.isArray(errores.error.non_field_errors)) {
        Toast('error', errores.error.non_field_errors[0]);
        return;
    }

    // Error estándar con arreglo
    const primerError = Object.keys(errores.error)[0];
    const message = errores.error[primerError][0];

    Toast('error', message);
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
document.addEventListener("DOMContentLoaded", function() {
    otpDigits();
    otpPassword();
    resendOTP();
});

let code = "";


/* ================================= LOADER ================================= */
function showLoader() {
    document.querySelector(".loader-overlay").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".loader-overlay").style.display = "none";
}


/* ================================= OTP FOCUS ================================= */
function otpDigits() {
    const digits = document.querySelectorAll(".otp-digit");

    digits.forEach((input, index) => {
        // Al escribir pasa a la siguiente
        input.addEventListener("input", () => {
            if(input.value.length === 1 && index < digits.length - 1)
                digits[index + 1].focus();
        });


        // Al borrar, regresa a la anterior
        input.addEventListener("keydown", (e) => {
            if(e.key === "Backspace" && input.value === "" && index > 0)
                digits[index - 1].focus();
        });
    });

    digits[0].focus();
}


/* ================================= VALIDACIONES ================================= */
function validate() {
    const digits = document.querySelectorAll(".otp-digit");
    code = "";

    for(let input of digits) {
        if(input.value === "" || !/^\d$/.test(input.value)) {
            Toast('error', 'Por favor, escribe todas las cifras de tu código correctamente');
            return false;
        }
        code += input.value;
    }

    if(code !== localStorage.getItem("otpPass")) {
        Toast('error', 'Lo siento, el código OTP es incorrecto');
        return false;
    }

    if(checkOTPExp()) {
        Toast('error', 'Lo siento, el código OTP ha expirado');
        return false;
    }

    return true;
}


/* ================================= OTP CONTRASEÑA ================================= */
// EXPIRATION
function checkOTPExp() {
    const startTime = localStorage.getItem("otpTime");
    if(!startTime) return true;

    const now = Date.now();
    const elapsedMinutes = (now - parseInt(startTime)) / (1000 * 60);

    return elapsedMinutes >= 9
}

function otpPassword() {
    document.querySelector(".otpPassword").addEventListener("submit", function(e) {
        e.preventDefault();

        if(!validate()) return;

        Toast('success', 'Código OTP verificado exitosamente');
        setTimeout(() => {
            window.location.href = 'newPass.html';
        }, 2000);
    });
}


/* ================================= BACKEND OTP REENVIAR ================================= */
async function resendOTP() {
    document.querySelector('.resend').addEventListener("click", async() => {
        const phone = localStorage.getItem("phonePassword") || "";
        const email = localStorage.getItem("emailPassword") || "";

        const data = {
            phone: phone,
            email: email,
        }

        const URL = 'https://pc-msusers-990940385728.us-central1.run.app/users/password/otp/';
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
                Toast('success', result.mensaje);

                if(result.otp)
                    localStorage.setItem("otpPass", result.otp);
                
                localStorage.setItem("otpTime", Date.now());
            } else
                Toast('error', result.error);
        } catch(e) {
            hideLoader();
            Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
        }
    });
}


/* ================================= ERRORES ================================= */
function Errores(errores) {
    let mensaje = "";

    if(typeof errores.error === "string")
        mensaje = errores.error;
    else
        mensaje = "Ocurrió un error inesperado";

    if(errores.sugerencia)
        mensaje += ` — ${errores.sugerencia}`;

    Toast("error", mensaje);
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
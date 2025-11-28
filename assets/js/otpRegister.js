document.addEventListener("DOMContentLoaded", function() {
    otpDigits();
    otpRegister();
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

    return true;
}


/* ================================= BACKEND OTP REGISTRO ================================= */
async function otpRegister() {
    document.querySelector(".otpRegister").addEventListener("submit", async function(e) {
        e.preventDefault();

        if(!validate()) return;

        const data = {
            temporal_id: localStorage.getItem("temporal_id"),
            otp: code,
        }

        const URL = 'http://127.0.0.1:4000/users/register/otp/';
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
                document.querySelector(".otpRegister").reset();

                setTimeout(() => {
                    window.location.href = 'completeReg.html';
                }, 2000);
            } else
                Errores(result);
        } catch(e) {
            hideLoader();
            Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
        }
    });
}


/* ================================= BACKEND OTP REENVIAR ================================= */
async function resendOTP() {
    document.querySelector(".resend").addEventListener("click", async() => {
        const phone = localStorage.getItem("phone") || "";
        const email = localStorage.getItem("email") || "";

        const data = {
            phone: phone,
            email: email,
        }
        
        const URL = 'http://127.0.0.1:4000/users/register/otpresend/';
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
                if(result.temporal_id)
                    localStorage.setItem("temporal_id", result.temporal_id);
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
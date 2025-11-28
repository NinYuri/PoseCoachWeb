document.addEventListener("DOMContentLoaded", function() {
    passwordVisibility();
    options();
    login();
    registerUser();
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
    const password = document.getElementById("password");
    const iconPass = document.querySelector(".pass");
    const confPassword = document.getElementById("confirm_password");
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


/* ================================= OPCIONES ================================= */
// Lista de países - PHONE
const countries = [
    { code: "+52", iso: "MX", name: "México", flag: "🇲🇽" },
    { code: "+1",  iso: "US", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "+57", iso: "CO", name: "Colombia", flag: "🇨🇴" },
    { code: "+34", iso: "ES", name: "España", flag: "🇪🇸" },
    { code: "+51", iso: "PE", name: "Perú", flag: "🇵🇪" },
    { code: "+56", iso: "CL", name: "Chile", flag: "🇨🇱" },
    { code: "+54", iso: "AR", name: "Argentina", flag: "🇦🇷" }
];

function options() {
    const form = document.querySelector(".registerForm")
    const container = document.querySelector(".register");
    const emailOpt = document.querySelector(".email-opt");
    const telephoneOpt = document.querySelector(".telephone-opt");

    emailOpt.addEventListener("click", () => {
        emailOpt.classList.add("selected");
        telephoneOpt.classList.remove("selected");

        container.innerHTML = `
            <i class="fa-solid fa-envelope icon"></i>
            <input type="email" id="email" name="email" placeholder="Correo Electrónico">
        `;
        form.reset();
    });

    telephoneOpt.addEventListener("click", () => {
        telephoneOpt.classList.add("selected");
        emailOpt.classList.remove("selected");

        // Options dinámicos
        let countryOptions = "";
        countries.forEach(c => {
            countryOptions += 
                `<option value="${c.code}" data-flag="${c.flag}">
                    ${c.code}
                </option>`;
        });

        container.innerHTML = `
            <i class="fa-solid fa-phone icon"></i>
            <select class="country-select" id="country-code">
                ${countryOptions}
            </select>
            <input type="tel" id="phone" name="phone" placeholder="Número Telefónico">
        `;

        // Actualizar flag display
        const countrySelect = document.getElementById("country-code");
        updateFlagDisplay(countrySelect);

        countrySelect.addEventListener('change', function() {
            updateFlagDisplay(this);
        });

        form.reset();
    });
}

function updateFlagDisplay(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const flag = selectedOption.getAttribute('data-flag');

    // Actualizar la visualización de la bandera
    let flagDisplay = selectElement.parentNode.querySelector('.flag-display');
    if (!flagDisplay) {
        flagDisplay = document.createElement('span');
        flagDisplay.className = 'flag-display';
        selectElement.parentNode.insertBefore(flagDisplay, selectElement);
    }
    flagDisplay.textContent = flag;
}


/* ================================= LOGIN ================================= */
function login() {
    document.querySelector(".login").addEventListener("click", () => {
        window.location.href = 'index.html';
    });
}


/* ================================= VALIDACIONES ================================= */
function validate() {
    const email = document.getElementById("email") ? document.getElementById("email").value : null;
    const phone = document.getElementById("phone") ? document.getElementById("phone").value : null;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (email !== null) {
        if (email === "" || email.trim() === "") {
            Toast('error', 'Por favor, escribe tu correo electrónico para continuar');
            return false;
        }
        if (!emailRegex.test(email)) {
            Toast('error', 'Por favor, ingresa un correo electrónico válido');
            return false;
        }
    }

    if (phone !== null) {
        if (phone === "" || phone.trim() === "") {
            Toast('error', 'Por favor, escribe tu número telefónico para continuar');
            return false;
        }
        if (!validPhone(phone)) {
            Toast('error', 'Por favor, ingresa un número telefónico válido');
            return false;
        }
        if(phone.length > 10) {
            Toast('error', 'Por favor, ingresa un número telefónico válido')
            return false;
        }
    }

    if(password === "" || password.trim() === "") {
        Toast('error', 'Por favor, escribe tu contraseña');
        return false;
    } else if (password.length < 8) {
        Toast('error', 'La contraseña debe tener al menos 8 caracteres');
        return false;
    }

    if(confirmPassword === "" || confirmPassword.trim() === "") {
        Toast('error', 'Por favor, confirma tu contraseña');
        return false;
    }

    if(password !== confirmPassword) {
        Toast('error', 'Lo siento, las contraseñas no coinciden');
        return false;
    }

    return true;
}

function validPhone(phone) {
    const regex = /^\+?[0-9\s-]{10,20}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    return regex.test(phone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
}


/* ================================= BACKEND REGISTRO ================================= */
async function registerUser() {
    document.querySelector(".registerForm").addEventListener("submit", async function(e) {
        e.preventDefault();

        if(!validate()) return;
        
        const countryCode = document.getElementById("country-code") ? document.getElementById("country-code").value : "";
        const phone = document.getElementById("phone") ? document.getElementById("phone").value : ""

        const data = {
            phone: countryCode + phone,
            email: document.getElementById("email") ? document.getElementById("email").value : "",
            password: document.getElementById("password").value,
            confirm_password: document.getElementById("confirm_password").value,
        }

        const URL = 'http://127.0.0.1:4000/users/register/initial/';
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
            
                localStorage.setItem("temporal_id", result.temporal_id);

                if(data.email) {
                    localStorage.setItem("email", data.email);
                    localStorage.removeItem("phone");
                }
                if(data.phone) {
                    localStorage.setItem("phone", data.phone);
                    localStorage.removeItem("email");
                }
                
                document.querySelector(".registerForm").reset();

                setTimeout(() => {
                    window.location.href = 'otpRegister.html';
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
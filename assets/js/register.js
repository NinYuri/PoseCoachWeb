document.addEventListener("DOMContentLoaded", function() {
    passwordVisibility();
    options();
});


/* ================================= CONTRASEÑA ================================= */
function passwordVisibility() {
    const password = document.getElementById("password")
    const iconPass = document.querySelector(".pass")
    const confPassword = document.getElementById("confirm_password")
    const iconConf = document.querySelector(".conf-pass")

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
            <div class="phone-field">
                <i class="fa-solid fa-phone icon"></i>
                <select class="country-select" id="country-code">
                    ${countryOptions}
                </select>
                <input type="tel" id="phone" name="phone" placeholder="Número Telefónico">
            </div>
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


/* ================================= BACKEND REGISTRO ================================= */
async function registerUser() {
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
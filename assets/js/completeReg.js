document.addEventListener("DOMContentLoaded", function() {
    datePicker();
    closeDate();
    gender();
    completeRegister();
});

let dateBirth = "";


/* ================================= LOADER ================================= */
function showLoader() {
    document.querySelector(".loader-overlay").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".loader-overlay").style.display = "none";
}


/* ============================== FECHA DE NACIMIENTO ============================== */
function formatDateBackend(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} / ${monthName} / ${year}`;
}

function datePicker() {
    const datepicker = document.querySelector(".datepicker");
    const dateInput = document.getElementById("date_birth");
    const yearInput = document.querySelector(".year-input");
    const monthInput = document.querySelector(".month-input");
    const cancel = document.querySelector(".cancel");
    const select = document.querySelector(".apply");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const dates = document.querySelector(".dates");

    let selectedDate = new Date();
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth();

    if(!datepicker || !dateInput) return;

    dateInput.addEventListener("click", () => {
        datepicker.hidden = false;
    });

    dateInput.addEventListener("input", () => {
        if(dateInput.value.trim() === "")
            dateBirth = "";
    });

    cancel.addEventListener("click", () => {
        datepicker.hidden = true;
    });

    select.addEventListener("click", () => {
        dateInput.value = formatDate(selectedDate);
        dateBirth = formatDateBackend(selectedDate);

        datepicker.hidden = true;
    });

    // Next month
    next.addEventListener('click', () => {
        if (month === 11) year++;
        month = (month + 1) % 12;
        displayDates();
    });

    // Previous month
    prev.addEventListener('click', () => {
        if (month === 0) year--;
        month = (month - 1 + 12) % 12;
        displayDates();
    });

    monthInput.addEventListener('change', () => {
        month = monthInput.selectedIndex;
        displayDates();
    });

    yearInput.addEventListener('change', () => {
        year = yearInput.value;
        displayDates();
    });

    const updateYearMonth = () => {
        monthInput.selectedIndex = month;
        yearInput.value = year;
    }

    const handleDateClick = (e) => {
        const button = e.target;

        const selected = dates.querySelector('.selected');
        selected && selected.classList.remove('selected');

        button.classList.add('selected');
        selectedDate = new Date(year, month, parseInt(button.textContent));
    }

    // Render the dates in the calendar interface
    const displayDates = () => {
        updateYearMonth();
        dates.innerHTML = "";

        // Last week of previous month
        const lastOfPrevMonth = new Date(year, month, 0);
        for(let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
            const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;

            const button = createButton(text, true, false);
            dates.appendChild(button);
        }

        const lastOfMonth = new Date(year, month + 1, 0);
        for(let i = 1; i <= lastOfMonth.getDate(); i++) {
            const isToday = 
                selectedDate.getDate() === i &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month;

            const button = createButton(i, false, isToday);
            button.addEventListener('click', handleDateClick);
            dates.appendChild(button);
        }

        // First week of next month
        const firstOfNextMonth = new Date(year, month + 1, 1);
        for(let i = firstOfNextMonth.getDay(); i < 7; i++) {
            const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;

            const button = createButton(text, true, false);
            dates.appendChild(button);
        }
    };

    const createButton = (text, isDisabled = false, isToday = false) => {
        const button = document.createElement('button');
        button.type = "button";
        button.textContent = text;
        button.disabled = isDisabled;
        button.classList.toggle('today', isToday);
        return button;
    };

    displayDates();
}

function closeDate() {
    document.addEventListener("click", (e) => {
        const datepicker = document.querySelector(".datepicker");
        const dateInput = document.getElementById("date_birth");

        if(!datepicker || !dateInput) return;
        if (datepicker.hidden) return;
        if (datepicker.contains(e.target) || dateInput.contains(e.target)) return;

        datepicker.hidden = true;
    });
}


/* ================================= OPCIONES ================================= */
// GENDER
function gender() {
    const sexSelect = document.getElementById("sex");

    sexSelect.addEventListener("change", function() {
        if(this.value === "")
            this.classList.remove("selected");
        else
            this.classList.add("selected");
    });
}

// GOAL | EQUIPMENT | EXPERIENCE
function trainSelect() {
    const goalSelect = document.getElementById("goal");
    const expSelect = document.getElementById("experience");
    const equipSelect = document.getElementById("equipment");
    
    goalSelect.addEventListener("change", function() {
        if(this.value === "")
            this.classList.remove("selected");
        else
            this.classList.add("selected");
    });

    expSelect.addEventListener("change", function() {
        if(this.value === "")
            this.classList.remove("selected");
        else
            this.classList.add("selected");
    });

    equipSelect.addEventListener("change", function() {
        if(this.value === "")
            this.classList.remove("selected");
        else
            this.classList.add("selected");
    });
}


/* ================================= VALIDACIONES ================================= */
async function validate() {
    const username = document.getElementById("username").value;
    const date_birth = dateBirth;
    const sex = document.getElementById("sex").value;
    const height = document.getElementById("height").value;

    const userRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

    if(username === "" || username.trim() === "") {
        Toast('error', 'Por favor, escribe tu nombre antes de continuar');
        return false;
    }
    if(username.trim().length < 5) {
        Toast('error', 'Tu nombre de usuario debe tener al menos 5 caracteres');
        return false;
    }
    if(username.trim().length > 20) {
        Toast('error', 'Tu nombre de usuario es demasiado largo');
        return false;
    }
    if(!userRegex.test(username)) {
        Toast('error', 'Tu nombre de usuario sólo puede contener letras y números');
        return false;
    }
        
    const result = await verifyUsername(username);
    if(!result.available) {
        Toast('error', result.mensaje);
        return false;
    }

    if(date_birth === "" || date_birth.trim() === "") {
        Toast('error', 'Por favor, ingresa tu fecha de nacimiento antes de continuar');
        return false;
    } else {
        const res = valDateBirth(date_birth);

        if(!res.valido) {
            Toast('error', res.mensaje);
            return false;
        }
    }

    if(sex === "" || sex.trim() === "") {
        Toast('error', 'Por favor, selecciona tu género antes de continuar');
        return false;
    }

    if(height === "" || height.trim() === "") {
        Toast('error', 'Por favor, escribe tu altura antes de continuar');
        return false;
    } else {
        const heightNum = parseInt(height);

        if(heightNum < 140 || heightNum > 200) {
            Toast('error', 'Lo siento, tu altura debe estar entre 140 cm y 200 cm');
            return false;
        }
    }

    return true;
}

function valDateBirth(fechaStr) {
    const fecha = new Date(fechaStr);
    const today = new Date();
    
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 85);

    const maxDate = today;

    if(fecha < minDate || fecha > maxDate) {
        return {
            valido: false,
            mensaje: "La fecha seleccionada es imposible"
        };
    }

    return { valido: true };
}

function trainValidate() {
    const goal = document.getElementById("goal").value;
    const experience = document.getElementById("experience").value;
    const equipment = document.getElementById("equipment").value;

    if(goal === "" || goal.trim() === "") {
        Toast('error', 'Por favor, selecciona tu objetivo para poder crear tu cuenta');
        return false;
    }
    if(experience === "" || experience.trim() === "") {
        Toast('error', 'Por favor, selecciona tu experiencia para poder crear tu cuenta');
        return false;
    }
    if(equipment === "" || equipment.trim() === "") {
        Toast('error', 'Por favor, selecciona tu equipo para poder crear tu cuenta');
        return false;
    }

    return true;
}


/* ================================= BACKEND REGISTRO ================================= */
// USERNAME
async function verifyUsername(username) {
    const URL = 'https://pc-msusers-990940385728.us-central1.run.app/users/register/username/';

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({username})
        });

        const data = await response.json();

        return {
            available: data.available,
            mensaje: data.mensaje            
        };
    } catch(e) {
        return {
            available: false,
            mensaje: "Error de conexión"
        };
    }
}

async function completeRegister() {
    document.querySelector(".personalInfo").addEventListener("submit", async function(e) {
        e.preventDefault();

        if(!(await validate())) return;

        const data = {
            temporal_id: localStorage.getItem("temporal_id"),
            username: document.getElementById("username").value,
            sex: document.getElementById("sex").value == "Masculino" ? "M" : "F",
            date_birth: dateBirth,
            height: parseInt(document.getElementById("height").value),
        }

        const section = document.querySelector(".right-section");
        section.innerHTML = '';

        section.innerHTML = `
            <img src="./assets/images/LogoPC.webp" alt="Logo">

            <h1>COMPLETA TU PERFIL</h1>
            <p>Arma tu <span>estilo </span> de entrenamiento</p>

            <div class="container">
                <form method="post" class="trainingInfo" novalidate>
                    <div class="input-container">
                        <i class="fa-solid fa-bullseye icon"></i>
                        <select class="info" id="goal" name="goal">
                            <option value="" disabled selected class="placeholder">Objetivo</option>
                            <option value="tonificar" class="options">Tonificar</option>
                            <option value="perder_peso" class="options">Perder peso</option>
                            <option value="ganar_musculo" class="options">Ganar músculo</option>
                            <option value="mantener_forma" class="options">Mantenerme en forma</option>
                        </select>

                        <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
                    </div>

                    <div class="input-container second">
                        <i class="fa-solid fa-chart-line icon"></i>
                        <select class="info" id="experience" name="experience">
                            <option value="" disabled selected class="placeholder">Experiencia</option>
                            <option value="principiante" class="options">Principiante</option>
                            <option value="intermedio" class="options">Intermedio</option>
                            <option value="avanzado" class="options">Avanzado</option>
                        </select>

                        <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
                    </div>

                    <div class="input-container second">
                        <i class="fa-solid fa-dumbbell icon"></i>
                        <select class="info" id="equipment" name="equipment">
                            <option value="" disabled selected class="placeholder">Equipo</option>
                            <option value="mancuernas" class="options">Mancuernas</option>
                            <option value="cuerpo" class="options">Sólo mi cuerpo</option>
                            <option value="bandas" class="options">Bandas de resistencia</option>
                            <option value="gimnasio" class="options">Máquinas de gimnasio</option>
                        </select>

                        <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
                    </div>

                    <button class="completeReg" type="submit">
                        <div class="bttn-line left"></div>
                        <span class="label">CREAR CUENTA</span>
                        <div class="bttn-line right"></div>
                    </button>
            </div>
        `;

        trainSelect();

        document.querySelector(".completeReg").addEventListener("click", async() => {
            document.querySelector(".trainingInfo").addEventListener("submit", async function(e) {
                e.preventDefault();

                if(!trainValidate()) return;

                Object.assign(data, {
                    goal: document.getElementById("goal").value,
                    experience: document.getElementById("experience").value,
                    equipment: document.getElementById("equipment").value
                });

                const URL = 'https://pc-msusers-990940385728.us-central1.run.app/users/register/complete/';
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
                        document.querySelector(".trainingInfo").reset();
                        localStorage.clear();
                        
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    } else
                        Errores(result);
                } catch(e) {
                    hideLoader();
                    Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
                }
            });
        });        
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
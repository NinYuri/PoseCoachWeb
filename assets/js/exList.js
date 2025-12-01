document.addEventListener("DOMContentLoaded", function() {
    username();
    navOptions();
    checkOptions();
    filterSearch();
    buttons();    
});


/* ================================= VARIABLES ================================= */
// Filters
const FILTER_OPTIONS = {
    equipment: [
        { value: "mancuernas", label: "Mancuernas" },
        { value: "cuerpo", label: "Sólo mi cuerpo" },
        { value: "bandas", label: "Bandas de resistencia" },
        { value: "gimnasio", label: "Máquinas de gimnasio" }
    ],

    difficulty: [
        { value: "principiante", label: "Principiante" },
        { value: "intermedio", label: "Intermedio" },
        { value: "avanzado", label: "Avanzado" }
    ],

    muscles: [
        { value: "pierna", label: "Pierna" },
        { value: "gluteo", label: "Glúteo" },
        { value: "pecho", label: "Pecho" },
        { value: "espalda", label: "Espalda" },
        { value: "hombros", label: "Hombros" },
        { value: "brazos", label: "Brazos" },
        { value: "abdomen", label: "Abdomen" },
        { value: "cuerpo_completo", label: "Cuerpo Completo" }
    ]
};

let selectedValues = [];
let currentBtn = null;

// Backend
const ENDPOINTS = {
    equipment: "http://127.0.0.1:8000/exercises/equipment/?equipment=",
    muscles: "http://127.0.0.1:8000/exercises/muscle-group/?muscle_group=",
    difficulty: "http://127.0.0.1:8000/exercises/difficulty/?difficulty="
}

// Pagination
let currentPage = 1;
let itemsPerPage = 6;
let exercises = [];
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const tbody = document.getElementById("exercise-body");

// Table
const diffClass = {
    "Principiante": "prin",
    "Intermedio": "int",
    "Avanzado": "adv"
};

const equipClass = {
    "Mancuernas": `<i class="fa-solid fa-dumbbell"></i>`,
    "Sólo mi cuerpo": `<i class="fa-solid fa-person"></i>`,
    "Bandas de resistencia": `<img src="./assets/images/Band.webp" alt="Band"></img>`,
    "Máquinas de gimnasio": `<img src="./assets/images/Gym.webp" alt="Gym">`
}


/* ================================= LOADER ================================= */
function showLoader() {
    document.querySelector(".loader-overlay").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".loader-overlay").style.display = "none";
}


/* ================================= USERNAME ================================= */
function username() {
    const user = document.querySelector(".navbar h1");
    user.innerHTML = `${localStorage.getItem("username")}`
}


/* ================================= NAV OPTIONS ================================= */
async function navOptions() {
    const home = document.querySelector(".nav-image");
    const create = document.querySelector(".create");
    const list = document.querySelector(".list");
    const logout = document.querySelector(".logout");

    home.addEventListener("click", () => {
        window.location.href = "home.html";
    });

    create.addEventListener("click", () => {
        window.location.href = "exercises.html";
    });

    list.addEventListener("click", () => {
        window.location.href = "exList.html";
    });

    logout.addEventListener("click", async () => {
        showLoader();

        const URL = 'http://127.0.0.1:4000/users/logout/';
        const data = {
            refresh_token: localStorage.getItem("refresh_token")
        }

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if(response.ok) {
                Toast('success', '¡Nos vemos después!');
                localStorage.clear();

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                hideLoader();
                Errores(result);
            }
        } catch(e) {
            hideLoader();
            Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
        }
    });
}


/* ================================= CHECK OPTIONS ================================= */
function checkOptions() {
    const buttons = document.querySelectorAll(".filter-btn");
    const selectedOpt = document.querySelector(".selected-opt");

    // Carga Inicial
    const defaultBtn = document.querySelector('[data-type="equipment"]');
    if(defaultBtn) {
        defaultBtn.classList.add("select");
        currentBtn = defaultBtn;
        loadOptions("equipment");
    }

    // Botones Click
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;

            if(currentBtn && currentBtn !== btn)
                currentBtn.classList.remove("select");

            btn.classList.add("select");
            currentBtn = btn;

            loadOptions(type);
            filterSearch();
        });
    });

    function loadOptions(type) {
        const options = FILTER_OPTIONS[type] || [];
        selectedOpt.innerHTML = "";

        options.forEach(opt => {
            const label = document.createElement("label");
            label.classList.add("option");

            label.innerHTML = `
                <input type="checkbox" value="${opt.value}" class="filter-check" data-type="${type}" />
                <span class="circle"></span>
                <span class="text">${opt.label}</span>
            `;

            selectedOpt.appendChild(label);
        });

        selectedOpt.querySelectorAll(".filter-check").forEach(check => {
            check.addEventListener("change", () => {
                updateSelectedValues();
                fetchFiltered();
            });
        });
    }
}

function updateSelectedValues() {
    const checks = document.querySelectorAll(".filter-check:checked");
    selectedValues = Array.from(checks).map(c => c.value);
}


/* ================================= PAGINATION ================================= */
function paintCurrentPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = exercises.slice(start, end);
    
    renderTable(paginated);
}


/* ================================= PREV Y NEXT ================================= */
function updateButtons() {
    const totalPages = Math.ceil(exercises.length / itemsPerPage);

    if(currentPage === 1)
        prevBtn.classList.add("disabled");
    else
        prevBtn.classList.remove("disabled");

    if(currentPage === totalPages)
        nextBtn.classList.add("disabled");
    else
        nextBtn.classList.remove("disabled");
}

function buttons() {
    prevBtn.addEventListener("click", () => {
        if(currentPage > 1) {
            currentPage--;
            paintCurrentPage();
            updateButtons();
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(exercises.length / itemsPerPage);

        if(currentPage < totalPages) {
            currentPage++;
            paintCurrentPage();
            updateButtons();
        }
    });
}


/* ================================= TABLE ================================= */
function renderTable(data) {
    tbody.innerHTML = "";

    data.forEach(ex => {
        const colorDif = diffClass[ex.difficulty_display] || "";
        const equipIcon = equipClass[ex.equipment_display] || "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${ex.name}</td>
            <td>${ex.muscle_group_display}</td>
            <td>${equipIcon}${ex.equipment_display}</td>
            <td><span class="dif-label ${colorDif}">${ex.difficulty_display}</span></td>
        `;

        tbody.appendChild(tr);
    });
}


/* ================================= BACKEND ================================= */
// All
async function filterSearch() {
    showLoader();

    try {
        const URL = "http://127.0.0.1:8000/exercises/all/";

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if(response.ok) {
            exercises = result;
            currentPage = 1;
            paintCurrentPage();
            updateButtons();
        } else
            Errores(result);
    } catch(e) {
        Toast('error', 'Error de conexión. Por favor, intenta de nuevo más tarde');
    }

    hideLoader();
}

// Filters
async function fetchFiltered() {
    if(!currentBtn) return;
    
    const type = currentBtn.dataset.type;
    const baseURL = ENDPOINTS[type];
    const query = selectedValues.join(",");

    let finalUrl = "";
    if(query === "")
        finalUrl = "http://127.0.0.1:8000/exercises/all/";
    else
        finalUrl = baseURL + query;

    showLoader();

    try {
        const response = await fetch(finalUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if(response.ok) {
            exercises = result;
            currentPage = 1;
            paintCurrentPage();
            updateButtons();
        } else
            Errores(result);
    } catch(e) {
        Toast('error', 'Error de conexión. Por favor, intenta de nuevo más tarde');
    }
    hideLoader();
}


/* ================================= ERRORES ================================= */
function Errores(errores) {
    if(!errores || !errores.error) {
        Toast('error', 'Ocurrió un error inesperado' + errores.error);
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
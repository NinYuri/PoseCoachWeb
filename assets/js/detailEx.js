document.addEventListener("DOMContentLoaded", function() {
    username();
    navOptions();
    arrowBack();
    getExercise().then(() => pencilEdit());
    updateEx();
    deleteEx();
});


// VARIABLES
const baseURL = "https://pc-msexercises-990940385728.us-central1.run.app/exercises/";
const id = new URLSearchParams(window.location.search).get("id");
let URL = baseURL + id + "/";


/* ================================= LOADER ================================= */
function showLoader() {
    document.querySelector(".loader-overlay").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".loader-overlay").style.display = "none";
}


/* ================================= USER ================================= */
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

        const URL = 'https://pc-msusers-990940385728.us-central1.run.app/users/logout/';
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


/* ================================= ARROW BACK ================================= */
function arrowBack() {
    document.querySelector(".arrow").addEventListener("click", () => {
        window.location.href = "exList.html";
    });
}


/* ================================= EDIT ICONS ================================= */
function pencilEdit() {
    // Name
    const nameContainer = document.querySelector(".exName");
    const name = document.querySelector(".name");
    const prevName = document.querySelector(".name p").textContent;

    nameContainer.addEventListener("click", () => {
        const isEditing = nameContainer.classList.contains("cancel");

        if(!isEditing) {
            nameContainer.classList.add("cancel");
            nameContainer.innerHTML = `<i class="fa-solid fa-x"></i>`;
            name.innerHTML = `<input type="text" placeholder="${prevName}">`;
        } else {
            nameContainer.classList.remove("cancel");
            nameContainer.innerHTML = `<i class="fa-solid fa-pencil pencilName"></i>`;
            name.innerHTML = `<p>${prevName}</p>`;
        }
    });

    // Muscle group
    const muscleContainer = document.querySelector(".exPrinMusc");
    const prinMuscle = document.querySelector(".prin-muscle");
    const prevMuscle = document.querySelector(".prin-muscle p").textContent;

    muscleContainer.addEventListener("click", () => {
        const isEditing = muscleContainer.classList.contains("cancel");

        if(!isEditing) {
            muscleContainer.classList.add("cancel");
            muscleContainer.innerHTML = `<i class="fa-solid fa-x"></i>`;
            prinMuscle.innerHTML = `
                <select class="selector" id="muscleGroup" name="muscleGroup">
                    <option value="" disabled selected class="placeholder">${prevMuscle}</option>
                    <option value="pierna" class="options">Pierna</option>
                    <option value="gluteo" class="options">Glúteo</option>
                    <option value="pecho" class="options">Pecho</option>
                    <option value="espalda" class="options">Espalda</option>
                    <option value="hombros" class="options">Hombros</option>
                    <option value="brazos" class="options">Brazos</option>
                    <option value="abdomen" class="options">Abdomen</option>
                    <option value="cuerpo_completo" class="options">Cuerpo Completo</option>
                </select>

                <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
            `;
            innerOptions();
        } else {
            muscleContainer.classList.remove("cancel");
            muscleContainer.innerHTML = `<i class="fa-solid fa-pencil pencilPrinmus"></i>`;
            prinMuscle.innerHTML = `<p>${prevMuscle}</p>`;
        }
    });

    // Secondary muscles
    const secContainer = document.querySelector(".exSecMuscles");
    const secMuscles = document.querySelector(".second-muscle");
    const prevSec = document.querySelector(".second-muscle p").textContent;

    const cleaned = prevSec.replace(" y ", ", ");
    const prevSecArray = cleaned.split(",").map(m => m.trim());

    secContainer.addEventListener("click", () => {
        const isEditing = secContainer.classList.contains("cancel");
        if(!isEditing) {
            secContainer.classList.add("cancel");
            secContainer.innerHTML = `<i class="fa-solid fa-x"></i>`;

            secMuscles.innerHTML = `
                <select class="selector" id="secMuscleGroup" name="secMuscleGroup" multiple>
                    <option value="pierna">Pierna</option>
                    <option value="gluteo">Glúteo</option>
                    <option value="pecho">Pecho</option>
                    <option value="espalda">Espalda</option>
                    <option value="hombros">Hombros</option>
                    <option value="brazos">Brazos</option>
                    <option value="abdomen">Abdomen</option>
                    <option value="cuerpo_completo">Cuerpo Completo</option>
                </select>
            `;

            setPreviousSelections(prevSecArray);
        } 
        else {
            secContainer.classList.remove("cancel");
            secContainer.innerHTML = `<i class="fa-solid fa-pencil pencilSecMus"></i>`;
            secMuscles.innerHTML = `<p>${prevSec}</p>`;
            //const selectedValues = getMultipleSelected();
        }
    });

    // Difficulty
    const difContainer = document.querySelector(".exDifficulty");
    const difficulty = document.querySelector(".difficulty");
    const prevDiff = document.querySelector(".difficulty p").textContent;

    difContainer.addEventListener("click", () => {
        const isEditing = difContainer.classList.contains("cancel");

        if(!isEditing) {
            difContainer.classList.add("cancel");
            difContainer.innerHTML = `<i class="fa-solid fa-x"></i>`;
            difficulty.innerHTML = `
                <select class="selector" id="diffGroup" name="diffGroup">
                    <option value="" disabled selected class="placeholder">${prevDiff}</option>
                    <option value="principiante" class="options">Principiante</option>
                    <option value="intermedio" class="options">Intermedio</option>
                    <option value="avanzado" class="options">Avanzado</option>
                </select>

                <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
            `;
            innerOptions();
        } else {
            difContainer.classList.remove("cancel");
            difContainer.innerHTML = `<i class="fa-solid fa-pencil pencilDiff"></i>`;
            difficulty.innerHTML = `<p>${prevDiff}</p>`;
        }
    });

    // Equipment
    const equipContainer = document.querySelector(".exEquipment");
    const equipment = document.querySelector(".equip");
    const prevEquip = document.querySelector(".equip p").textContent;

    equipContainer.addEventListener("click", () => {
        const isEditing = equipContainer.classList.contains("cancel");

        if(!isEditing) {
            equipContainer.classList.add("cancel");
            equipContainer.innerHTML = `<i class="fa-solid fa-x"></i>`;
            equipment.innerHTML = `
                <select class="selector" id="equipGroup" name="equipGroup">
                    <option value="" disabled selected class="placeholder">${prevEquip}</option>
                    <option value="mancuernas" class="options">Mancuernas</option>
                    <option value="cuerpo" class="options">Sólo mi cuerpo</option>
                    <option value="bandas" class="options">Bandas de resistencia</option>
                    <option value="gimnasio" class="options">Máquinas de gimnasio</option>
                </select>

                <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
            `;
            innerOptions();
        } else {
            equipContainer.classList.remove("cancel");
            equipContainer.innerHTML = `<i class="fa-solid fa-pencil pencilEquip"></i>`;
            equipment.innerHTML = `<p>${prevEquip}</p>`;
        }
    });

    // Image
    const editButton = document.querySelector(".edImage");

    if(editButton) {
        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.style.display = "none";
        document.body.appendChild(imageInput);

        const imageContainer = document.querySelector(".image");

        editButton.addEventListener("click", () => {
            imageInput.click();
        });

        imageInput.addEventListener("change", () => {
            validateAndPreviewImage(imageInput, imageContainer);
        });
    }
}

function validateAndPreviewImage(input, container) {
    const file = input.files[0];

    if(!file) {
        Toast('error', 'Por favor, selecciona una imagen');
        return false;
    }

    if(file.size > 5 * 1024 * 1024) {
        Toast('error', 'La imagen no puede pesar más de 5MB');
        input.value = "";
        return false;
    }

    const validExtensions = ["jpg","jpeg","png","gif","webp"];
    const ext = file.name.split(".").pop().toLowerCase();

    if(!validExtensions.includes(ext)) {
        Toast('error', 'Formato no válido. Solo se permiten JPG, PNG, GIF y WEBP');
        input.value = "";
        return false;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        container.style.backgroundImage = `url('${e.target.result}')`;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";

        container.innerHTML = "";
    };

    reader.readAsDataURL(file);

    return true;
}

function setPreviousSelections(prevArr) {
    const select = document.getElementById("secMuscleGroup");
    if (!select) return;

    [...select.options].forEach(op => {
        if (prevArr.includes(op.textContent)) {
            op.selected = true;
        }
    });
}

function getMultipleSelected() {
    const select = document.getElementById("secMuscleGroup");
    if (!select) return [];

    const selected = [];
    [...select.selectedOptions].forEach(op => selected.push(op.textContent));

    return selected;
}

function innerOptions() {
    const prinMuscle = document.getElementById("muscleGroup");
    const diff = document.getElementById("diffGroup");
    const equip = document.getElementById("equipGroup");

    if(prinMuscle) {
        prinMuscle.addEventListener("change", function() {
            this.classList.toggle("selected", this.value !== "");
        });
    }

    if(diff) {
        diff.addEventListener("change", function() {
            this.classList.toggle("selected", this.value !== "");
        });
    }

    if(equip) {
        equip.addEventListener("change", function() {
            this.classList.toggle("selected", this.value !== "");
        });
    }
}


/* ================================= VALIDACIONES ================================= */
function validateName(name) {
    const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

    if(name === "" || name.trim() === "") {
        Toast('error', 'Por favor, escribe el nuevo nombre del ejercicio');
        return false;
    }
    if(name.trim().length < 4) {
        Toast('error', 'El nombre del ejercicio debe tener al menos 4 caracteres');
        return false;
    }
    if(name.trim().length > 100) {
        Toast('error', 'El nombre del ejercicio no puede tener más de 100 caracteres');
        return false;
    }
    if(!nameRegex.test(name)) {
        Toast('error',  'El nombre del ejercicio sólo puede contener letras y números');
        return false;
    }
}


/* ================================= BACKEND ================================= */
// EXERCISE OVERVIEW
async function getExercise() {
    const name = document.querySelector(".name");
    const prinMuscle = document.querySelector(".prin-muscle");
    const secondMuscle = document.querySelector(".second-muscle");
    const difficulty = document.querySelector(".difficulty");
    const equipment = document.querySelector(".equip");
    const image = document.querySelector(".image");

    showLoader();

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        if(response.ok) {
            const secMuscles = result.secondary_muscles;
            let musclesText = "";

            if(secMuscles.length === 1)
                musclesText = secMuscles[0];
            else if(secMuscles.length === 2)
                musclesText = secMuscles[0] + " y " + secMuscles[1];
            else
                musclesText = secMuscles.slice(0, -1).join(", ") + " y " + secMuscles[secMuscles.length - 1];

            name.innerHTML = `<p>${result.name}</p>`;
            prinMuscle.innerHTML = `<p>${result.muscle_group_display}</p>`;
            secondMuscle.innerHTML = `<p>${musclesText}</p>`;
            difficulty.innerHTML = `<p>${result.difficulty_display}</p>`;
            equipment.innerHTML = `<p>${result.equipment_display}</p>`;
            image.innerHTML = `<img src="${result.image_url}" alt="Image">`
        } else
            Errores(result);
    } catch(e) {
        Toast('error', 'Error de conexión. Por favor, intenta de nuevo más tarde');
    }

    hideLoader();
}

// UPDATE
async function updateEx() {
    document.querySelector(".updateBtn").addEventListener("click", async() => {
        const data = new FormData();

        /* ----------------------------- Name ----------------------------- */
        const nameInput = document.querySelector(".name input");
        if(nameInput) {
            const newName = nameInput.value.trim();
            if(!validateName(newName)) return;

            data.append("name", newName);
        }


        /* --------------------------- Muscle Group --------------------------- */
        const mainSelect = document.getElementById("muscleGroup");
        if(mainSelect && mainSelect.value !== "")
            data.append("muscle_group", mainSelect.value);


        /* -------------------------- Secondary Group -------------------------- */
        const secSelect = document.getElementById("secMuscleGroup");
        if(secSelect) {
            const selected = [...secSelect.selectedOptions].map(o => o.value);
            if(selected.length > 0)
                selected.forEach(m => data.append("secondary_muscles", m));
        }


        /* --------------------------- Difficulty --------------------------- */
        const diffSelect = document.getElementById("diffGroup");
        if(diffSelect && diffSelect.value !== "")
            data.append("difficulty", diffSelect.value);


        /* --------------------------- Equipment --------------------------- */
        const equipSelect = document.getElementById("equipGroup");
        if(equipSelect && equipSelect.value !== "") {
            data.append("equipment", equipSelect.value);
        }


        /* --------------------------- Image --------------------------- */
        const imageInput = document.querySelector("input[type='file']");
        if (imageInput && imageInput.files.length > 0) {
            data.append("image", imageInput.files[0]);
        }

        /* --------------------------- PATCH --------------------------- */
        try {
            const response = await fetch(URL, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: data
            });

            const result = await response.json();

            if(response.ok) {
                Toast('success', '¡El ejercicio ha sido actualizado correctamente!');
                setTimeout(() => location.reload(), 2000);
            } else
                Errores(result);
        } catch(e) {
            Toast("error", 'Error de conexión. Por favor, intenta de nuevo más tarde');
        }

        hideLoader();
    });
}

// DELETE
async function deleteEx() {
    document.querySelector(".deleteBtn").addEventListener("click", async() => {
        showLoader();

        try {
            const response = await fetch(URL, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            if(response.ok) {
                Toast('success', 'El ejercicio ha sido eliminado correctamente');
                
                setTimeout(() => {
                    window.location.href = 'exList.html';
                }, 2000);
            } else {
                const result = await response.json();
                Errores(result);
            }
        } catch(e) {
            Toast('error', 'Error de conexión. Por favor, intenta de nuevo más tarde');
        }

        hideLoader();
    });
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
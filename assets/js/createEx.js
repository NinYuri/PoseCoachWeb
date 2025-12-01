document.addEventListener("DOMContentLoaded", function() {
    username();
    navOptions();
    back();
    options();
    nextPage();
});

let idealAngles = {};
let mistakesList = [];


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


/* ================================= ARROW BACK ================================= */
function back() {
    document.querySelector(".arrow").addEventListener("click", () => {
        window.location.href = 'exercises.html';    
    });
}


/* ================================= OPTIONS ================================= */
// DIFFICULTY | EQUIPMENT
function options() {
    const diffSelect = document.getElementById("difficulty");
    const equipSelect = document.getElementById("equipment");

    diffSelect.addEventListener("change", function() {
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

// JOINT
function innerOptions() {
    const artSelect = document.getElementById("joints");
    
    if (!artSelect) return;

    artSelect.addEventListener("change", function() {
        if(this.value === "")
            this.classList.remove("selected");
        else
            this.classList.add("selected");
    });
}


/* ================================= VALIDACIONES ================================= */
function validate() {
    const name = document.getElementById("exercise").value;
    const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

    const difficulty = document.getElementById("difficulty").value;
    const equipment = document.getElementById("equipment").value;
    const musclePrin = document.querySelector('input[name="prin-group"]:checked');
    const principal = document.querySelector('input[name="prin-group"]:checked')?.value;
    const secundarios = [...document.querySelectorAll('input[name="sec-group"]:checked')].map(i => i.value);

    if(name === "" || name.trim() === "") {
        Toast('error', 'Por favor, escribe el nombre del ejercicio');
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

    if(difficulty === "" || difficulty.trim() === "") {
        Toast('error', 'Por favor, selecciona la dificultad del ejercicio');
        return false;
    }

    if(equipment === "" || equipment.trim() === "") {
        Toast('error', 'Por favor, selecciona el equipo necesario para el ejercicio');
        return false;
    }

    if(!musclePrin) {
        Toast('error', 'Por favor, selecciona un grupo muscular principal');
        return false;
    }
    if(secundarios.includes(principal)) {
        Toast('error', 'El grupo principal no puede estar también en secundarios');
        return false;
    }

    if(!validateImage())
        return false;

    return true;
}

// Imagen
const triggerUpload = document.getElementById("trigger-upload");
const imageInput = document.getElementById("image-input");
const previewImage = document.getElementById("preview-img");

triggerUpload.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    validateImage()
});

function validateImage() {
    const file = imageInput.files[0];

    if(!file) {
        Toast('error', 'Por favor, selecciona una imagen para el ejercicio');
        return false;
    }

    // Validar tamaño
    if(file.size > 5 * 1024 * 1024) {
        Toast('error', 'La imagen no puede pesar más de 5MB');
        imageInput.value = "";
        return false;
    }

    // Validar extensión 
    const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const ext = file.name.split(".").pop().toLowerCase();

    if(!validExtensions.includes(ext)) {
        Toast('error', 'Formato no válido. Los formatos permitidos se encuentran listados en la imagen');
        imageInput.value = "";
        return false;
    }

    // Prev imagen
    const reader = new FileReader();
    const message = document.querySelector(".load-image h2");

    reader.onload = (e) => {
        previewImage.src = e.target.result;
        message.innerHTML = `CAMBIAR IMAGEN`; 
    };
    reader.readAsDataURL(file);

    return true;
}


/* ================================= BOTONES AÑADIR ================================= */
function addAngle() {
    document.querySelector(".newAng").addEventListener("click", (e) => {
        e.preventDefault();

        const jointSelect = document.getElementById("joints");
        const joint = jointSelect.value;
        const angleInput = document.getElementById("angle");
        const angle = angleInput.value;

        if(joint === "") {
            Toast('error', 'Por favor, selecciona la articulación');
            return;
        }

        if(angle === "") {
            Toast('error', 'Por favor, escribe el ángulo correcto en el que debe encontrarse');
            return;
        }
        const angleNum = parseInt(angle, 10);
        if(Number.isNaN(angleNum) || angleNum < 0 || angleNum > 180) {
            Toast('error', 'Lo siento, el ángulo debe encontrarse entre 0° y 180°');
            return;
        }

        const existed = idealAngles.hasOwnProperty(joint);

        idealAngles[joint] = angleNum;

        if(existed)
            Toast('info', 'Ángulo actualizado correctamente');
        else
            Toast('info', 'Ángulo agregado');

        const container = document.querySelector(".angles-list");
        container.innerHTML = "";
        for(const key in idealAngles)
            container.innerHTML += `<p><strong>${capitalize(key)}:</strong> ${idealAngles[key]}°</p>`;

        angleInput.value = "";
        jointSelect.classList.remove("selected");
        jointSelect.selectedIndex = 0;
    });
}

function addMistake() {
    document.querySelector(".newMist").addEventListener("click", (e) => {
        e.preventDefault();

        const mistakeInput = document.getElementById("mistakes");
        const mistake = mistakeInput.value;
        const mistRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

        if(mistake === "" || mistake.trim() === "") {
            Toast('error', 'Debes escribir el texto del error habitual');
            return;
        }
        if(!mistRegex.test(mistake)) {
            Toast('error', 'El error sólo puede contener letras y números');
            return;
        }

        const exists = mistakesList.some(
            m => m.toLowerCase() === mistake.toLowerCase()
        );
        if(exists) {
            Toast('info', 'Lo siento, este error ya se encuentra registrado');
            mistakeInput.value = "";
            return;
        }

        mistakesList.push(mistake);
        const container = document.querySelector(".mistakes-list");
        container.innerHTML = "";
        mistakesList.forEach(m => {
            container.innerHTML += `<p>• ${m}</p>`;
        });

        mistakeInput.value = "";
    });
}

function capitalize(s){
    if(!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}


/* ================================= NEXT - BACKEND ================================= */
async function nextPage() {
    document.querySelector(".next").addEventListener("click", async () => {
        if(!validate()) return;
        
        // Texto inner html
        const container = document.querySelector(".background");
        const diffText = document.querySelector("#difficulty option:checked").textContent;
        const equipText = document.querySelector("#equipment option:checked").textContent;
        const mainMuscleInput = document.querySelector('input[name="prin-group"]:checked');
        const mainMuscleText = mainMuscleInput.closest('.muscle-opt').querySelector('.text').textContent;
        const secMuscleInputs = [...document.querySelectorAll('input[name="sec-group"]:checked')];
        const secMusclesOpt = secMuscleInputs.map(input =>
            input.closest('.muscle-opt').querySelector('.text').textContent
        );
        const secMusclesText = secMusclesOpt.join(", ");

        // Backend
        const exercise = document.getElementById("exercise").value;
        const secondaryMuscles = [...document.querySelectorAll('input[name="sec-group"]:checked')].map(input => input.value);
        const file = document.getElementById("image-input").files[0];

        const formData = new FormData();
        formData.append("name", exercise.charAt(0).toUpperCase() + exercise.slice(1));
        formData.append("muscle_group", document.querySelector('input[name="prin-group"]:checked').value);
        formData.append("secondary_muscles", JSON.stringify(secondaryMuscles));
        formData.append("difficulty", document.getElementById("difficulty").value);
        formData.append("equipment", document.getElementById("equipment").value);
        formData.append("image", file);

        // URL de la imagen
        let previewUrl = URL.createObjectURL(file);

        container.innerHTML = '';
        container.innerHTML = `
            <div class="cont-both">
                <div class="first">
                    <div class="image-selected">
                        <img src="${previewUrl}" alt="Image selected">
                    </div>
                
                    <div class="info-selected">
                        <p><span>Nombre del Ejercicio: </span>${formData.get("name")}</p>
                        <p><span>Dificultad: </span>${diffText}</p>
                        <p><span>Equipo: </span>${equipText}</p>
                        <p><span>Grupo Principal: </span>${mainMuscleText}</p>
                        <p><span>Grupo Secundario: </span>${secMusclesText}</p>
                    </div>
                </div>

                <div class="second">
                    <h1>ÁNGULOS IDEALES DEL EJERCICIO *</h1>
                    <p>Selecciona la <span class="detail">articulación</span> y el <span class="detail">ángulo ideal</span> que debe mantener durante la ejecución</p>

                    <div class="both artic">
                        <div class="input-container half">
                            <select class="selector" id="joints">
                                <option value="" disabled selected class="placeholder">Articulación</option>
                                <!-- Articulaciones Superiores -->
                                <option value="cuello" class="options">Cuello</option>
                                <option value="hombro" class="options">Hombro</option>
                                <option value="codo" class="options">Codo</option>
                                <option value="muñeca" class="options">Muñeca</option>
                                <!-- Tronco -->
                                <option value="torso" class="options">Torso</option>
                                <option value="cadera" class="options">Cadera</option>
                                <!-- Piernas -->
                                <option value="rodilla" class="options">Rodilla</option>
                                <option value="tobillo" class="options">Tobillo</option>
                            </select>

                            <span class="select-arrow"><i class="fa-solid fa-caret-down"></i></span>
                        </div>

                        <div class="input-container half">
                            <img src="./assets/images/Angle.webp" alt="Angle" class="angle">
                            <input type="number" id="angle" name="angle" placeholder="Ángulo Ideal (°)" min="0" max="180">
                        </div>
                    </div>

                    <div class="both list">
                        <div class="angles-list">
                        </div>

                        <div class="butAdd half">
                            <button class="btn add newAng">
                                <div class="more">
                                    <i class="fa-solid fa-plus"></i>
                                </div>
                                
                                <div class="text">Añadir</div>
                            </button>
                        </div>
                    </div>

                    <h1>ERRORES HABITUALES *</h1>
                    <p>Agrega los errores más frecuentes que la <span class="detail">postura incorrecta</span> podría presentar</p>

                    <div class="input-container">
                        <input type="text" id="mistakes" name="mistakes" placeholder="Ej. Cadera demasiado baja">
                    </div>

                    <div class="both list">
                        <div class="mistakes-list">
                        </div>

                        <div class="butAdd">
                            <button class="btn add newMist">
                                <div class="more">
                                    <i class="fa-solid fa-plus"></i>
                                </div>
                                
                                <div class="text">Añadir</div>
                            </button>
                        </div>
                    </div>

                    <button class="createButton" type="submit">
                        <div class="bttn-line left"></div>
                        <span class="label">CREAR</span>
                        <div class="bttn-line right"></div>
                    </button>
                </div>
            </div>`

        innerOptions();
        addAngle();
        addMistake();

        document.querySelector(".createButton").addEventListener("click", async(e) => {
            e.preventDefault();

            const joint = document.getElementById("joints").value;
            const angle = document.getElementById("angle").value;
            const mistake = document.getElementById("mistakes").value;
            const mistRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

            // Un ángulo
            if(joint !== "" && angle !== "") {
                const angleNum = parseInt(angle, 10);

                if(Number.isNaN(angleNum) || angleNum < 0 || angleNum > 180) {
                    Toast('error', 'Lo siento, el ángulo debe encontrarse entre 0° y 180°');
                    return;
                }
                idealAngles[joint] = angleNum;
            }
            // Un error
            if(mistake.trim() !== "") {
                if(mistRegex.test(mistake))
                    mistakesList.push(mistake);
                else {
                    Toast('error', 'El error debe contener sólo letras y números');
                    return;
                }     
            }

            if(Object.keys(idealAngles).length === 0) {
                Toast("error", "Lo siento, debes agregar al menos un ángulo ideal");
                return;
            }
            if(mistakesList.length === 0) {
                Toast("error", "Lo siento, debes agregar al menos un error habitual");
                return;
            }

            formData.append("ideal_angles", JSON.stringify(idealAngles));
            formData.append("common_mistakes", JSON.stringify(mistakesList));

            const URL = 'http://127.0.0.1:8000/exercises/all/';
            try {
                showLoader();

                const response = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    },
                    body: formData
                });

                const result = await response.json();
                hideLoader();

                if(response.ok) {
                    Toast('success', '¡Ejercicio creado con éxito!');
                    window.URL.revokeObjectURL(previewUrl); 

                    setTimeout(() => {
                        window.location.href = 'exercises.html';
                    }, 2000);                    
                } else {
                    Errores({ error: result });
                    return;
                }
            } catch(e) {
                hideLoader();
                Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
            }
        });
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
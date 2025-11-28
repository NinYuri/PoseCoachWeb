document.addEventListener("DOMContentLoaded", function() {
    username();
    navOptions();
    back();
    options();
    nextPage();
});


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
    const create = document.querySelector(".create");
    const logout = document.querySelector(".logout");

    create.addEventListener("click", () => {
        window.location.href = "exercises.html";
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
// DIFFICULTY
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


/* ================================= VALIDACIONES ================================= */
function validate() {
    const name = document.getElementById("exercise").value;
    const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

    const difficulty = document.getElementById("difficulty").value;
    const equipment = document.getElementById("equipment").value;
    const musclePrin = document.querySelector('input[name="prin-group"]:checked');

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


/* ================================= NEXT - BACKEND ================================= */
async function nextPage() {
    document.querySelector(".next").addEventListener("click", async () => {
        if(!validate()) return;

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
        formData.append("ideal_angles", JSON.stringify({ rodilla: 90 }));
        formData.append("common_mistakes", JSON.stringify(["Rodilla pasa la punta del pie"]));

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

            if(!response.ok) {
                Errores({ error: result });
                return;
            } 
            Toast('success', '¡Ejercicio creado con éxito!');
            resetForm();
        } catch(e) {
            hideLoader();
            Toast('error', 'Error de conexión. Por favor, inténtalo de nuevo más tarde');
        }
    });
}

function resetForm() {
    document.getElementById("exercise").value = "";
    document.getElementById("difficulty").value = "";
    document.getElementById("equipment").value = "";

    const prin = document.querySelector('input[name="prin-group"]:checked');
    if(prin) prin.checked = false;

    document.querySelectorAll('input[name="sec-group"]').forEach(ch => {
        ch.checked = false;
    });

    const imageInput = document.getElementById("image-input");
    const previewImage = document.getElementById("preview-img");

    imageInput.value = "";
    previewImage.src = "./assets/images/Load.webp";

    // Eliminar estilos visuales
    document.querySelectorAll(".input-container .selector").forEach(opt => {
        opt.classList.remove("selected");
    });
    document.querySelectorAll(".muscle-opt").forEach(opt => {
        opt.classList.remove("selected");
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
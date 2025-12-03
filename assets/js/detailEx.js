document.addEventListener("DOMContentLoaded", function() {
    username();
    navOptions();
    arrowBack();
    getExercise();
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
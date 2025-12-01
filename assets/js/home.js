document.addEventListener("DOMContentLoaded", function() {
    username();
    navOptions();
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
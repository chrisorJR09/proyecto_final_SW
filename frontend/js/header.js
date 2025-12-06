document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("headerUserArea");

    if (header) {
        const usuario = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        if (usuario && token) {
            header.innerHTML = `
                <span class="small-link">Hola, <strong>${usuario}</strong></span>
                <a href="#" class="small-link" id="logoutBtn">Cerrar sesión</a>
            `;

            document.getElementById("logoutBtn").addEventListener("click", () => {
                localStorage.clear();
                window.location.replace("inicio.html");
            });
        }
    }

    //alida
    const adminLink = document.getElementById("adminLink");
    const rol = localStorage.getItem("rol");

    if (rol === "1") {
        adminLink.style.display = "inline-block";
    }

});

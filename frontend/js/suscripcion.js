// /js/suscripcion.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newsletterForm");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value.trim();

        if (!correo) {
            mensaje.textContent = "Por favor ingresa un correo.";
            mensaje.style.color = "red";
            return;
        }

        try {
            const res = await fetch("https://proyectofinalsw.onrender.com/api/suscripciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ correo })
            });

            const data = await res.json();

            if (res.ok) {
                mensaje.textContent = "¡Te has suscrito correctamente! Revisa tu correo.";
                mensaje.style.color = "green";
                form.reset();
            } else {
                mensaje.textContent = data.error || "Ocurrió un error.";
                mensaje.style.color = "red";
            }
        } catch (error) {
            mensaje.textContent = "Error de conexión con el servidor.";
            mensaje.style.color = "red";
            console.error(error);
        }
    });
});

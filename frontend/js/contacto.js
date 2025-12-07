// public/js/contacto.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("email").value.trim();
        const numero = document.getElementById("telefono").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();
        
        // Validación básica
        if (!nombre || !correo || !mensaje || !numero) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        try {
            const response = await fetch("https://proyectofinalsw.onrender.com/api/contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, correo, mensaje, numero })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                form.reset(); // limpiar el formulario
            } else {
                alert(data.error || "Ocurrió un error al enviar el mensaje.");
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("No se pudo enviar el mensaje. Intenta de nuevo más tarde.");
        }
    });
});

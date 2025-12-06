const form = document.getElementById('resetForm');
const msg = document.getElementById('msg');



form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('email').value;

    // Guardar el correo para usarlo después
    localStorage.setItem("email", correo);

    const res = await fetch("http://localhost:3000/sesion/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo })
    });

    const data = await res.json();
    msg.textContent = data.message || data.error;
});
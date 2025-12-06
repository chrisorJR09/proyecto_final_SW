const msg = document.getElementById('msg');

// Extraer token de la URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (!token) {
    msg.textContent = "Token no válido o faltante.";
    throw new Error("Token faltante");
}

// 1️⃣ Validar token con el backend
async function validarToken() {
    const res = await fetch(`http://localhost:3000/sesion/resetPassword/${token}`);
    const data = await res.json();

    if (!res.ok) {
        msg.textContent = data.message;
        document.getElementById("passwordForm").style.display = "none";
    } else {
        msg.textContent = "Token válido. Ingresa tu nueva contraseña.";
    }
}

validarToken();

// 2️⃣ Enviar nueva contraseña
const form = document.getElementById('passwordForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nvoPassword = document.getElementById('password').value;

    const res = await fetch("http://localhost:3000/sesion/setNewPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nvoPassword })
    });

    const data = await res.json();
    msg.textContent = data.message || data.error;
});
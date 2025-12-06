const API_URL = "http://localhost:3000"; // Cambia el puerto si tu backend usa otro

function recargarCaptcha() {
    fetch(`${API_URL}/sesion/captcha`)
        .then(res => res.text())
        .then(svg => {
            document.getElementById("captchaImage").src =
                "data:image/svg+xml;base64," + btoa(svg);
        });
}

function registrar() {
    const data = {
        userName: document.getElementById("userName").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        captcha: document.getElementById("captchaInput").value
    };
    console.log(data.captcha);

    fetch(`${API_URL}/sesion/newUser`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("mensaje").innerText =
            data.mensaje || data.message || JSON.stringify(data);

        if (data.mensaje) {
            document.getElementById("mensaje").style.color = "green";
        } else {
            document.getElementById("mensaje").style.color = "red";
        }
    });
}

window.onload = recargarCaptcha;
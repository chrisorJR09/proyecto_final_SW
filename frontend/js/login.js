const API_URL = "https://proyectofinalsw.onrender.com"; // Cambia el puerto si tu backend usa otro
//const API_URL = "https://proyectofinalsw.onrender.com"; // Cambia el puerto si tu backend usa otro

function recargarCaptcha() {
    fetch(`${API_URL}/sesion/captcha`)
        .then(res => res.text())
        .then(svg => {
            document.getElementById("captchaImage").src =
                "data:image/svg+xml;base64," + btoa(svg);
        });
}

function iniciarSesion(event) {
    event.preventDefault();

     if (validaUsuario()) {
        return;
    }

    const datos = {
        user: document.getElementById("usernameL").value, // ← CORREGIDO
        password: document.getElementById("passwordL").value,
        captcha: document.getElementById("captchaL").value
    };

    fetch(`${API_URL}/sesion/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
        .then(data => {

            // Mostrar mensaje
            document.getElementById("mensaje").innerText =
                data.message?.exito || data.Error || JSON.stringify(data);

            // Colores según éxito
            if (data.message?.exito) {
                document.getElementById("mensaje").style.color = "green";
                console.log(data);
                localStorage.setItem("token", data.token);
                localStorage.setItem("rol", data.role);
                localStorage.setItem("usuario", data.usuario);

                setTimeout(() => {
                    window.location.href = "/index.html";
                }, 1500);

            } else {
                document.getElementById("mensaje").style.color = "red";
                recargarCaptcha();
            }
        });
}


function validaUsuario(){
    const user=localStorage.getItem("usuario");
    if(user){
        alert("El usuario tiene sesión activa");
        return true;
    }

    return false;
}


window.onload = recargarCaptcha;
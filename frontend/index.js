


/* Header Dinamico */

const sectionh = document.getElementById('divH')
const header = document.createElement('header');

/* Insertamos el header dinamico */
header.innerHTML += `
    <h2>TecnoMex</h2>

    <div id="navegadero">
         
        <div id="mH">
            <nav>
                <ul class="nav-links">
                    <li><a href="#inicio" id="iniBtn">Inicio</a></li>
                    <li><a href="#productos" id="proBtn">Productos</a></li>
                    <li><a href="#ofertas" id="ofeBtn"p>Ofertas</a></li>
                    <li><a href="#contacto" id="conBtn">Contacto</a></li>
                    
                </ul>
            </nav>
        </div>  

        <div id="logs">
            
            <button class="enters logged" id="logBtn">login</button>
            <button class="enters logged" id="signBtn">Registrarse</button>

        </div>
        

    </div>
    
    
    
`;
sectionh.appendChild(header);

/* Footer Dinamico*/
const sectionf = document.getElementById('divF')
const footer = document.createElement('footer');

footer.innerHTML += `
        <ul class="horList">
            <div>
                <h2>Marca</h2>
            </div>
            <div>
                <h2>Ubicacion</h2>
            </div>
            <div>
                <a href="#nosotros" id=nosBtn>
                <h2>Nosotros</h2>
                </a>
            </div>
        </ul>
`;

sectionf.appendChild(footer);


/* FUNCION QUE CONTROLA LAS SECCIONES */
function controlarSecciones(IDprox) {
    
    const allSections = document.querySelectorAll('main section');

    allSections.forEach(section => {
        section.classList.remove('activo');
    });

    const targetSection = document.getElementById(IDprox);
    
    if (targetSection) {
        targetSection.classList.add('activo');
    }
}

const loginBtn = document.getElementById("logBtn");
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        controlarSecciones('formLgn');
    });
}

const formBtn = document.getElementById("signBtn");
if (formBtn) {
    formBtn.addEventListener('click', (e) => {
        e.preventDefault();
        controlarSecciones('formReg');
    });
}

const Inicio = document.getElementById("iniBtn");
if (Inicio) {
    Inicio.addEventListener('click', (e) => {
        e.preventDefault();
        
        let mandar = Inicio.getAttribute('href');

        const idSeccion = mandar.substring(1);
        
        controlarSecciones(idSeccion);
    });
}

const productos = document.getElementById("proBtn");
if (productos) {
    productos.addEventListener('click', (e) => {
        e.preventDefault();
        let mandar = productos.getAttribute('href');
        const idSeccion = mandar.substring(1);
        
        controlarSecciones(idSeccion);
    });
}

const ofertas = document.getElementById("ofeBtn");
if (ofertas) {
    ofertas.addEventListener('click', (e) => {
        e.preventDefault();
        let mandar = ofertas.getAttribute('href');
        const idSeccion = mandar.substring(1);
        
        controlarSecciones(idSeccion);
    });
}

const contacto = document.getElementById("conBtn");
if (contacto) {
    contacto.addEventListener('click', (e) => {
        e.preventDefault();
        let mandar = contacto.getAttribute('href');

        const idSeccion = mandar.substring(1);
        
        controlarSecciones(idSeccion);
    });
}

const nosotros = document.getElementById("nosBtn");
if (nosotros) {
    nosotros.addEventListener('click', (e) => {
        e.preventDefault();
        let mandar = nosotros.getAttribute('href');

        const idSeccion = mandar.substring(1);
        
        controlarSecciones(idSeccion);
    });
}

const formBtn2 = document.getElementById("regBtn");
if (formBtn2) {
    formBtn2.addEventListener('click', (e) => {
        e.preventDefault();
        let mandar = formBtn2.getAttribute('href');

        const idSeccion = mandar.substring(1);
        
        controlarSecciones(idSeccion);
    });
}






/*Parte de mandar datos del login al backend*/
const API_URL = "http://localhost:3000";
function recargarCaptcha() {
    fetch(`${API_URL}/sesion/captcha`)
        .then(res => res.text())
        .then(svg => {
            document.getElementById("captchaImageL").src =
                "data:image/svg+xml;base64," + btoa(svg);
        });
}

function iniciarSesion() {
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
            } else {
                document.getElementById("mensaje").style.color = "red";
                recargarCaptcha();
            }
        });
    }

    // Generar CAPTCHA al cargar la página
    recargarCaptcha();

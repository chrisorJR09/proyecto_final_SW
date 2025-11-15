
/*  */
/* getelementsByTagName devuelve un array de elementos entonces usamos querySelector para agarrar el primer header */

const sectionh = document.getElementById('divH')
const header = document.createElement('header');

/* Insertamos el header dinamico */
header.innerHTML += `
    <h2>Mi Título</h2>
    <div>
        /* Login */
        <button class="enters" id="logBtn">login</button>
        /* Registrar */
        <button class="enters" id="signBtn">Registrarse</button>
    </div>
    
`;

sectionh.appendChild(header);

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
                <h2>Carrera</h2>
            </div>
        </ul>
`;

sectionf.appendChild(footer);



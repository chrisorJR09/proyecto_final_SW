const API = "https://proyectofinalsw.onrender.com/api/tienda";

// Mostrar en pantalla
function render(data) {
    const cont = document.getElementById("resultado");
    cont.innerHTML = "";

    if (!data || data.length === 0) {
        cont.innerHTML = "<p>No hay resultados.</p>";
        return;
    }

    data.forEach(p => {
        cont.innerHTML += `
            <div class="producto">
                <h3>${p.nombre}</h3>
                <p>Precio: $${p.precio}</p>
                <p>Oferta: ${p.oferta ? "$" + p.oferta : "Sin oferta"}</p>
                <p>Categoría: ${p.categoria}</p>
                <p>Stock: ${p.stock}</p>
            </div>
        `;
    });
}

// ------------------ APIS ------------------

function getPublic() {
    fetch(`${API}/public`)
        .then(r => r.json())
        .then(render);
}

function getOrdenPrecio() {
    fetch(`${API}/orden/precio`)
        .then(r => r.json())
        .then(render);
}

function filtrarPrecio() {
    const min = document.getElementById("min").value;
    const max = document.getElementById("max").value;

    fetch(`${API}/filtro/precio?min=${min}&max=${max}`)
        .then(r => r.json())
        .then(render);
}

function filtrarCategoria() {
    const cat = document.getElementById("categoria").value;

    fetch(`${API}/filtro/categoria/${cat}`)
        .then(r => r.json())
        .then(render);
}

function getOfertas() {
    fetch(`${API}/filtro/ofertas`)
        .then(r => r.json())
        .then(render);
}

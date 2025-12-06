const API_URL = "http://localhost:3000/api/administrador";

// GET ------------------------------------------------------------------------
async function getProductos() {
    const res = await fetch(API_URL);
    const data = await res.json();
    document.getElementById("productos").textContent = JSON.stringify(data, null, 2);
}

// POST -----------------------------------------------------------------------
async function crearProducto() {
    const nuevo = {
        categoria: document.getElementById("c_categoria").value,
        nombre: document.getElementById("c_nombre").value,
        precio: document.getElementById("c_precio").value,
        oferta: document.getElementById("c_oferta").value,
        descripcion: document.getElementById("c_descripcion").value,
        stock: document.getElementById("c_stock").value,
        imagen: document.getElementById("c_imagen").value
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
    });

    const data = await res.json();
    document.getElementById("create_res").textContent = JSON.stringify(data, null, 2);
}

// PUT ------------------------------------------------------------------------
async function actualizarProducto() {
    const id = document.getElementById("u_id").value;

    const producto = {
        categoria: document.getElementById("u_categoria").value,
        nombre: document.getElementById("u_nombre").value,
        precio: document.getElementById("u_precio").value,
        oferta: document.getElementById("u_oferta").value,
        descripcion: document.getElementById("u_descripcion").value,
        stock: document.getElementById("u_stock").value,
        imagen: document.getElementById("u_imagen").value
    };

    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

    const data = await res.json();
    document.getElementById("update_res").textContent = JSON.stringify(data, null, 2);
}

// DELETE ---------------------------------------------------------------------
async function eliminarProducto() {
    const id = document.getElementById("d_id").value;

    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    document.getElementById("delete_res").textContent = JSON.stringify(data, null, 2);
}

// CAMBIAR STOCK ---------------------------------------------------------------
async function cambiarStock() {
    const id = document.getElementById("s_id").value;
    const stock = document.getElementById("s_stock").value;

    const res = await fetch(`${API_URL}/cambiarStock/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock })
    });

    const data = await res.json();
    document.getElementById("stock_res").textContent = JSON.stringify(data, null, 2);
}

const URL_BACKEND = 'https://proyectofinalsw.onrender.com';

async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        renderProductos(datos.datos);

    } catch (error) {
        console.log("Error al obtener productos:", error);
    }
}

async function obtenerPorCategoria(categoria) {
    try {
        const respuesta = await fetch(`${API_URL}?categoria=${categoria}`);
        const datos = await respuesta.json();
        renderProductos(datos.datos);

    } catch (error) {
        console.log("Error al filtrar por categoría:", error);
    }
}

async function obtenerPorPrecio(min, max) {
    try {
        const respuesta = await fetch(`${API_URL}?min=${min}&max=${max}`);
        const datos = await respuesta.json();
        renderProductos(datos.datos);

    } catch (error) {
        console.log("Error al filtrar por precio:", error);
    }
}

async function obtenerOfertas() {
    try {
        const respuesta = await fetch(`${API_URL}/ofertas`);
        const datos = await respuesta.json();
        renderProductos(datos.datos);

    } catch (error) {
        console.log("Error al obtener ofertas:", error);
    }
}

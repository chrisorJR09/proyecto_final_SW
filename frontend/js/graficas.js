const ctxCategoria = document.getElementById("graficaCategoria");
const ctxGenerales = document.getElementById("graficaGenerales");
const ctxInventario = document.getElementById("graficaInventario");

// Contenedores
const categoriaSection = document.getElementById("categoriaSection");
const generalesSection = document.getElementById("generalesSection");
const inventarioSection = document.getElementById("inventarioSection");

const API_BASE_URL = "http://localhost:3000"; 

async function cargarDatosCategoria() {
    const respuesta = await fetch("http://localhost:3000/api/ventas_producto");
    const data = await respuesta.json();

    // Ordenar por mayor venta para obtener la categoría top
    const topCategoria = data.reduce((max, item) =>
        item.cantidad_vendida > max.cantidad_vendida ? item : max
    );

    // Obtener total vendido (sumar cantidades)
    const totalVendido = data.reduce((sum, item) => sum + item.cantidad_vendida, 0);

    // Cantidad de categorías
    const totalCategorias = data.length;

    // Insertar en tarjetas HTML
    document.querySelector("#categoriaSection .stat-card:nth-child(1) .stat-value").textContent =
        topCategoria.categoria;

    document.querySelector("#categoriaSection .stat-card:nth-child(2) .stat-value").textContent =
        totalVendido;

    document.querySelector("#categoriaSection .stat-card:nth-child(3) .stat-value").textContent =
        totalCategorias;
}

async function cargarDatosInventario() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/inventario_grafica");
        const data = await respuesta.json();

        // Detectar automáticamente el nombre del campo
        const obtenerCantidad = (item) => item.cantidad ?? item.stock ?? 0;

        // 1. Productos en stock (sumar todos)
        const totalStock = data.reduce((sum, item) => sum + obtenerCantidad(item), 0);

        // 2. Stock más bajo (>0)
        const productosConStock = data.filter(item => obtenerCantidad(item) > 0);
        const stockMasBajo =
            productosConStock.length > 0
                ? Math.min(...productosConStock.map(item => obtenerCantidad(item)))
                : 0;

        // 3. Productos agotados (=0)
        const agotados = data.filter(item => obtenerCantidad(item) === 0).length;

        // Insertar en las tarjetas
        document.querySelector("#inventarioSection .stat-card:nth-child(1) .stat-value").textContent =
            totalStock;

        document.querySelector("#inventarioSection .stat-card:nth-child(2) .stat-value").textContent =
            stockMasBajo;

        document.querySelector("#inventarioSection .stat-card:nth-child(3) .stat-value").textContent =
            agotados;

    } catch (error) {
        console.error("Error cargando inventario:", error);
    }
}

async function cargarVentasGenerales() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/ventas_generales");
        const data = await respuesta.json();

        // 1. Ventas Totales
        const ventasTotales = data.reduce((sum, venta) => sum + venta.total, 0);

        // 2. Total de Transacciones = cantidad de registros
        const transaccionesTotales = data.length;

        // 3. Ticket Promedio
        const ticketPromedio =
            transaccionesTotales > 0
                ? (ventasTotales / transaccionesTotales).toFixed(2)
                : 0;

        // Insertar en las tarjetas
        document.querySelector("#generalesSection .stat-card:nth-child(1) .stat-value")
            .textContent = `$${ventasTotales.toLocaleString()}`;

        document.querySelector("#generalesSection .stat-card:nth-child(2) .stat-value")
            .textContent = transaccionesTotales.toLocaleString();

        document.querySelector("#generalesSection .stat-card:nth-child(3) .stat-value")
            .textContent = `$${Number(ticketPromedio).toLocaleString()}`;

    } catch (error) {
        console.error("Error cargando ventas generales:", error);
    }
}



// =========================
//   Mostrar / Ocultar
// =========================
function mostrarCategoria() {
    categoriaSection.style.display = "block";
    generalesSection.style.display = "none";
    inventarioSection.style.display = "none";
}

function mostrarGenerales() {
    categoriaSection.style.display = "none";
    generalesSection.style.display = "block";
    inventarioSection.style.display = "none";
}

function mostrarInventario() {
    categoriaSection.style.display = "none";
    generalesSection.style.display = "none";
    inventarioSection.style.display = "block";
}



//   Gráfica Categoría
async function obtenerDatosCategoria() {
    const respuesta = await fetch(`${API_BASE_URL}/api/ventas_producto`)
    return await respuesta.json();
}

async function generarGraficaCategoria() {
    const datos = await obtenerDatosCategoria();

    const labels = datos.map(item => item.categoria);
    const cantidades = datos.map(item => Number(item.cantidad_vendida));

    new Chart(ctxCategoria, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Stock Total",
                    data: cantidades,
                    backgroundColor: "rgba(54,162,235)"
                }
            ]
        }
    });
}


//   Gráfica Generales
let graficaGeneral = null;

async function obtenerVentasPorPeriodo(fechaInicio, fechaFin) {
    const respuesta = await fetch(`${API_BASE_URL}/api/ventas_generales?inicio=${fechaInicio}&fin=${fechaFin}`);
    return await respuesta.json();
}

async function generarGraficaGenerales() {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    if (!fechaInicio || !fechaFin) {
        alert("Selecciona ambas fechas");
        return;
    }

    const datos = await obtenerVentasPorPeriodo(fechaInicio, fechaFin);

    const ventasPorDia = {};

    datos.forEach(item => {
        if (!ventasPorDia[item.fecha]) ventasPorDia[item.fecha] = 0;
        ventasPorDia[item.fecha] += Number(item.total);
    });

    const labels = Object.keys(ventasPorDia);
    const cantidades = Object.values(ventasPorDia);

    if (graficaGeneral) graficaGeneral.destroy();

    graficaGeneral = new Chart(ctxGenerales, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total vendido por día",
                data: cantidades,
                backgroundColor: "rgba(255,159,64)"
            }]
        }
    });
}

// =========================
//     Gráfica Inventario
// =========================
async function generarGraficaInventario() {
    const respuesta = await fetch(`${API_BASE_URL}/api/inventario_grafica`);
    const datos = await respuesta.json();

    const labels = datos.map(item => item.producto);
    const cantidades = datos.map(item => Number(item.stock));

    new Chart(ctxInventario, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Inventario en Stock",
                data: cantidades,
                backgroundColor: "rgba(75,192,192)"
            }]
        }
    });
}


async function cargarReporteExistencias() {
    const contenedor = document.getElementById("ReporteExistencias");
    contenedor.innerHTML = "<h3>Cargando reporte...</h3>";

    try {
        const respuesta = await fetch("http://localhost:3000/api/productos");
        const productos = await respuesta.json();

        // Agrupar productos por categoría
        const categorias = productos.reduce((acc, prod) => {
            if (!acc[prod.categoria]) acc[prod.categoria] = [];
            acc[prod.categoria].push(prod);
            return acc;
        }, {});

        let html = `
            <h2>Reporte de Existencias por Producto</h2>
            
        `;

        // Construir cada categoría
        for (const categoria in categorias) {

            html += `
                <h3 style="margin-top:25px;">${categoria}</h3>
                <table border="1" cellpadding="8" style="border-collapse: collapse; width:100%;">
                    <tr style="background:#f2f2f2;">
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                    </tr>
            `;

            categorias[categoria].forEach(p => {

                const estado =
                    p.stock === 0
                        ? `<span style="color:red; font-weight:bold;">Agotado</span>`
                        : p.stock <= 5
                            ? `<span style="color:#c77900; font-weight:bold;">Stock Bajo</span>`
                            : `<span style="color:green; font-weight:bold;">En Stock</span>`;

                html += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.nombre}</td>
                        <td>$${Number(p.precio).toLocaleString()}</td>
                        <td>${p.stock}</td>
                        <td>${estado}</td>
                    </tr>
                `;
            });

            html += `</table>`;
        }

        contenedor.innerHTML = html;

    } catch (error) {
        console.error("Error cargando el reporte:", error);
        contenedor.innerHTML = "<p>Error cargando el reporte.</p>";
    }
}




// =========================
//       Eventos
// =========================
document.getElementById("btnFiltrar").addEventListener("click", generarGraficaGenerales);

generarGraficaCategoria();
generarGraficaInventario();

cargarVentasGenerales();
cargarDatosCategoria();
cargarDatosInventario();
cargarVentasGenerales();


function mostrarReporte() {
    categoriaSection.style.display = "none";
    generalesSection.style.display = "none";
    inventarioSection.style.display = "none";

    document.getElementById("ReporteExistenciasSection").style.display = "block";

    cargarReporteExistencias();
}



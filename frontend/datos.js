const ctxCategoria = document.getElementById("graficaCategoria");
const ctxGenerales = document.getElementById("graficaGenerales");
const ctxInventario = document.getElementById("graficaInventario");

// Contenedores
const categoriaSection = document.getElementById("categoriaSection");
const generalesSection = document.getElementById("generalesSection");
const inventarioSection = document.getElementById("inventarioSection");

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

// =========================
//   Gráfica Categoría
// =========================
async function obtenerDatosCategoria() {
    const respuesta = await fetch(`https://proyectofinalsw.onrender.com/api/ventas_producto`);
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
                    label: "Ventas Totales",
                    data: cantidades,
                    backgroundColor: "rgba(54,162,235)"
                }
            ]
        }
    });
}

// =========================
//   Gráfica Generales
// =========================
let graficaGeneral = null;

async function obtenerVentasPorPeriodo(fechaInicio, fechaFin) {
    const respuesta = await fetch(`https://proyectofinalsw.onrender.com/api/ventas_generales?inicio=${fechaInicio}&fin=${fechaFin}`);
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
    const respuesta = await fetch(`https://proyectofinalsw.onrender.com/api/inventario_grafica`);
    const datos = await respuesta.json();

    const labels = datos.map(item => item.producto);
    const cantidades = datos.map(item => item.cantidad);

    new Chart(ctxInventario, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Inventario",
                data: cantidades,
                backgroundColor: "rgba(75,192,192)"
            }]
        }
    });
}

// =========================
//       Eventos
// =========================
document.getElementById("btnFiltrar").addEventListener("click", generarGraficaGenerales);

generarGraficaCategoria();
generarGraficaInventario();

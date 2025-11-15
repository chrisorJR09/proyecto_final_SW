const ctx = document.getElementById("grafica");

async function obtenerDatos() {
    const respuesta = await fetch("http://localhost:3000/api/ventas_producto");
    return await respuesta.json();
}

async function generarGrafica() {
    const datos = await obtenerDatos();

    const labels = datos.map(item => item.categoria);

    // AQUÍ ESTABA EL ERROR
    const cantidades = datos.map(item => Number(item.cantidad_vendida));

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Ventas Totales",
                    data: cantidades,
                    backgroundColor: "rgba(54, 162, 235)",
                    borderColor: "rgba(54, 162, 235)",
                    borderWidth: 1
                }
            ]
        }
    });
}

generarGrafica();

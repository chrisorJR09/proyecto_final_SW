//checkout.js
const API_BASE_URL = "http://localhost:3000";

// Mostrar campos adicionales según método
const extraPago = document.getElementById("extra-pago");

document.querySelectorAll("input[name='pago']").forEach(opcion => {
    opcion.addEventListener("change", () => {
        let tipo = opcion.value;

        if (tipo === "tarjeta") {
            extraPago.innerHTML = `
                <label>Número de Tarjeta</label>
                <input type="text" maxlength="16" required>

                <label>Fecha de Expiración</label>
                <input type="month" required>

                <label>CVV</label>
                <input type="text" maxlength="3" required>
            `;
        } else if (tipo === "transferencia") {
            extraPago.innerHTML = `
                <p><strong>Cuenta Bancaria:</strong> 1234 5678 9012</p>
                <p>Envia comprobante a <b>pagos@mitienda.com</b></p>
            `;
        } else if (tipo === "oxxo") {
            extraPago.innerHTML = `
                <p>Se te generará un código para pagar en Oxxo.</p>
            `;
        }
    });
});


// ====================================
// PROCESAR COMPRA + GENERAR TICKET PDF
// ====================================

document.getElementById("checkout-form").addEventListener("submit", async function(e){
    e.preventDefault();

    const carrito = JSON.parse(localStorage.getItem("carrito_tienda")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    // Datos del formulario
    const orden = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        ciudad: document.getElementById("ciudad").value,
        codigo_postal: document.getElementById("codigo_postal").value,
        pais: document.getElementById("pais").value,
        metodo: document.querySelector("input[name='pago']:checked").value,
        productos: carrito
    };

    document.getElementById("procesando").classList.remove("oculto");

    try {
        // 1️⃣ Registrar venta en backend
        const ventaRes = await fetch(`${API_BASE_URL}/api/ventas/procesar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productos: carrito })
        });

        const venta = await ventaRes.json();

        if (!ventaRes.ok) {
            alert("Error al registrar venta: " + venta.mensaje);
            document.getElementById("procesando").classList.add("oculto");
            return;
        }

        // ID generado en la BD
        orden.id_venta = venta.id_venta;

        // 2️⃣ GENERAR PDF DEL TICKET
        const ticketRes = await fetch(`${API_BASE_URL}/api/ticket/generar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orden)
        });

        if (!ticketRes.ok) {
            alert("Error al generar ticket PDF");
            document.getElementById("procesando").classList.add("oculto");
            return;
        }

        // Descargar PDF
        const blob = await ticketRes.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket_${orden.id_venta}.pdf`;
        link.click();

        // 3️⃣ Vaciar carrito
        localStorage.removeItem("carrito_tienda");

        // 4️⃣ Mostrar resultado
        document.getElementById("procesando").classList.add("oculto");
        document.getElementById("resultado").classList.remove("oculto");
        document.getElementById("resultado").innerHTML = `
            <h2>¡Pago completado!</h2>
            <p>Venta registrada (#${orden.id_venta})</p>
            <p>Se ha descargado tu ticket en PDF 📄</p>
            <a href="wishlistManager.html">Volver a la tienda</a>
        `;

    } catch (error) {
        console.error(error);
        alert("Error inesperado al procesar la compra");
        document.getElementById("procesando").classList.add("oculto");
    }
});
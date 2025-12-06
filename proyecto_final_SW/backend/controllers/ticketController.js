/* controllers/ticketController.js */

const PDFDocument = require("pdfkit");
const path = require("path");

const generarTicket = (req, res) => {
    const { 
        nombre, 
        email, 
        telefono, 
        direccion, 
        ciudad,
        codigo_postal,
        pais,
        metodo, 
        productos,
        cupon = null,
        subtotal,  // ✅ Recibir desde el frontend
        impuesto,  // ✅ Monto del impuesto ya calculado
        impuesto_porcentaje = 16,  // ✅ Solo para mostrar el %
        envio = 0,  // ✅ Costo de envío del frontend
        total,  // ✅ Total ya calculado
        metodo_envio = "Envío estándar",
        empleado = "Sistema", 
        id_venta = Date.now()
    } = req.body;

    // Calcular total de unidades
    const totalUnidades = productos.reduce((sum, p) => sum + p.cantidad, 0);

    // Cupón (si aplica)
    let descuentoCupon = 0;
    if (cupon && cupon.descuento) {
        descuentoCupon = subtotal * (cupon.descuento / 100);
    }

    // Total final (usar el que viene del frontend si no hay cupón)
    const totalFinal = total || (subtotal + impuesto - descuentoCupon + envio);

    // Fecha y hora
    const fechaActual = new Date();
    const fecha = fechaActual.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const hora = fechaActual.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ticket_${id_venta}.pdf`);

    const doc = new PDFDocument({
        size: [300, 700],
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
    });

    doc.pipe(res);

    // LOGO
    const logoPath = path.join(__dirname, "../uploads/logo.png");
    try {
        doc.image(logoPath, 110, 20, { width: 80 });
        doc.moveDown(5);
    } catch {
        doc.moveDown(1);
    }

    // EMPRESA
    doc
        .fontSize(20)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("TecnoMex", { align: "center" });

    doc
        .fontSize(10)
        .fillColor("#666")
        .font("Helvetica-Oblique")
        .text('"Todo lo que necesitas en un solo click."', { align: "center" });

    doc.moveDown(0.5);

    // TITULO
    doc
        .fontSize(16)
        .fillColor("#ffd700")
        .font("Helvetica-Bold")
        .text("TICKET DE COMPRA", { align: "center" });

    doc
        .fontSize(9)
        .fillColor("#444")
        .font("Helvetica")
        .text(`Venta No.: ${id_venta}`, { align: "center" });

    doc.moveDown(0.3);

    // FECHA
    doc
        .text(`Fecha: ${fecha}`, { align: "center" })
        .text(`Hora: ${hora}`, { align: "center" });

    doc.moveDown(1);

    // LINEA
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .lineWidth(2)
        .strokeColor("#ffd700")
        .stroke();

    doc.moveDown(1);

    // CLIENTE
    doc
        .fontSize(11)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("DATOS DEL CLIENTE", { underline: true });

    doc
        .fontSize(10)
        .fillColor("black")
        .font("Helvetica")
        .text(`Nombre: ${nombre}`)
        .text(`Email: ${email}`)
        .text(`Teléfono: ${telefono}`)
        .text(`Dirección: ${direccion}`)
        .text(`Ciudad: ${ciudad}`)
        .text(`Código Postal: ${codigo_postal}`)
        .text(`País: ${pais}`)
        .text(`Método de pago: ${metodo.toUpperCase()}`)
        .text(`Método de envío: ${metodo_envio}`);

    doc.moveDown(1);

    // EMPLEADO
    doc
        .fontSize(10)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text(`Atendido por: ${empleado}`);

    doc.moveDown(1);

    // LINEA
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .dash(3, { space: 2 })
        .strokeColor("#d1d5db")
        .stroke();
    doc.undash();

    doc.moveDown(1);

    // PRODUCTOS
    doc
        .fontSize(11)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("PRODUCTOS", { underline: true });

    productos.forEach((p) => {
        const precioTotal = p.precio * p.cantidad;

        doc
            .fontSize(10)
            .fillColor("black")
            .font("Helvetica")
            .text(`${p.nombre}`);

        doc
            .fontSize(9)
            .fillColor("#666")
            .text(`${p.cantidad} x $${p.precio.toFixed(2)}`);

        doc
            .fontSize(10)
            .fillColor("black")
            .text(`$${precioTotal.toFixed(2)}`, { align: "right" });

        doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // TOTALES
    doc
        .fontSize(10)
        .fillColor("black")
        .font("Helvetica")
        .text(`Subtotal: $${subtotal.toFixed(2)}`);

    // ✅ Usar el impuesto que viene del frontend
    doc
        .text(`IVA (${impuesto_porcentaje.toFixed(0)}%):`, 20, doc.y)
        .text(`$${impuesto.toFixed(2)}`, 220, doc.y, { width: 60, align: "right" });

    if (descuentoCupon > 0) {
        doc
            .fillColor("#10b981")
            .text(`Cupón (${cupon.codigo} -${cupon.descuento}%): -$${descuentoCupon.toFixed(2)}`);
    }

    // ✅ Usar el envío que viene del frontend
    doc
        .fillColor("black")
        .text(`Envío: ${envio === 0 ? "GRATIS" : `$${envio.toFixed(2)}`}`)
        .text(`Productos Totales: ${totalUnidades}`);

    doc.moveDown(1);

    // TOTAL FINAL
    doc
        .fontSize(14)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("TOTAL:")

        .fontSize(16)
        .fillColor("#ffd700")
        .text(`$${totalFinal.toFixed(2)}`, { align: "right" });

    doc.moveDown(1);

    // FOOTER
    doc
        .fontSize(10)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("¡Gracias por su compra!", { align: "center" });

    doc
        .fontSize(8)
        .fillColor("#666")
        .font("Helvetica")
        .text("TecnoMex - La mejor tienda de tecnología", { align: "center" })
        .text("Av. Universidad 940, Aguascalientes, AGS", { align: "center" })
        .text("Tel: +52 (449) 123-4567", { align: "center" })
        .text("contacto@tecnomex.com", { align: "center" });

    doc.end();
};

module.exports = { generarTicket };
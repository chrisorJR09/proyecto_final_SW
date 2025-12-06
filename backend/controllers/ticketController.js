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
        envio = 0
    } = req.body;

    // Calcular subtotal
    const subtotal = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

    // IVA (16%)
    const iva = subtotal * 0.16;

    // Descuento por cupón (si existe)
    let descuentoCupon = 0;
    if (cupon && cupon.descuento) {
        descuentoCupon = subtotal * (cupon.descuento / 100);
    }

    // Total final
    const totalFinal = subtotal + iva - descuentoCupon + envio;

    // Fecha y hora actual
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

    // Configurar cabeceras
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ticket_${Date.now()}.pdf`);

    // --- ESTILO TICKET ---
    const doc = new PDFDocument({
        size: [300, 700], // tamaño tipo recibo
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
    });

    doc.pipe(res);

    // --- LOGO (si existe) ---
    const logoPath = path.join(__dirname, "../uploads/logo.png");
    try {
        doc.image(logoPath, 110, 20, { width: 80 }); // Logo centrado
        doc.moveDown(5);
    } catch (error) {
        console.log("Logo no encontrado, continuando sin él");
        doc.moveDown(1);
    }

    // --- ENCABEZADO DE LA EMPRESA ---
    doc
        .fontSize(20)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("TecnoMex", { align: "center" });

    doc.moveDown(0.3);

    doc
        .fontSize(10)
        .fillColor("#666")
        .font("Helvetica-Oblique")
        .text('"Todo lo que necesitas en un solo click."', { align: "center" });

    doc.moveDown(0.5);

    // --- TICKET DE COMPRA ---
    doc
        .fontSize(16)
        .fillColor("#ffd700")
        .font("Helvetica-Bold")
        .text("TICKET DE COMPRA", { align: "center" });

    doc.moveDown(0.5);

    // --- FECHA Y HORA ---
    doc
        .fontSize(9)
        .fillColor("#444")
        .font("Helvetica")
        .text(`Fecha: ${fecha}`, { align: "center" })
        .text(`Hora: ${hora}`, { align: "center" });

    doc.moveDown(0.8);

    // Línea decorativa
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .lineWidth(2)
        .strokeColor("#ffd700")
        .stroke();

    doc.moveDown(1);

    // --- DATOS CLIENTE ---
    doc
        .fontSize(11)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("DATOS DEL CLIENTE", { underline: true });

    doc.moveDown(0.5);

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
        .text(`Método de pago: ${metodo.toUpperCase()}`);

    doc.moveDown(1);

    // Línea separadora
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .dash(3, { space: 2 })
        .strokeColor("#d1d5db")
        .stroke();
    doc.undash();

    doc.moveDown(1);

    // --- PRODUCTOS ---
    doc
        .fontSize(11)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("PRODUCTOS", { underline: true });

    doc.moveDown(0.5);

    productos.forEach((p) => {
        const precioTotal = p.precio * p.cantidad;
        
        doc
            .fontSize(10)
            .fillColor("black")
            .font("Helvetica")
            .text(`${p.nombre}`, 20, doc.y, { continued: false });
        
        doc
            .fontSize(9)
            .fillColor("#666")
            .text(`  ${p.cantidad} x $${p.precio.toFixed(2)}`, 20, doc.y)
            .fontSize(10)
            .fillColor("black")
            .text(`$${precioTotal.toFixed(2)}`, 220, doc.y - 10, { width: 60, align: "right" });
        
        doc.moveDown(0.3);
    });

    doc.moveDown(0.5);

    // Línea separadora
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .dash(3, { space: 2 })
        .strokeColor("#d1d5db")
        .stroke();
    doc.undash();

    doc.moveDown(1);

    // --- TOTALES ---
    const totalY = doc.y;

    doc
        .fontSize(10)
        .fillColor("black")
        .font("Helvetica")
        .text(`Subtotal:`, 20, totalY)
        .text(`$${subtotal.toFixed(2)}`, 220, totalY, { width: 60, align: "right" });

    doc.moveDown(0.5);

    doc
        .text(`IVA (16%):`, 20, doc.y)
        .text(`$${iva.toFixed(2)}`, 220, doc.y, { width: 60, align: "right" });

    doc.moveDown(0.5);

    // Cupón (si existe)
    if (cupon && descuentoCupon > 0) {
        doc
            .fillColor("#10b981")
            .text(`Cupón (${cupon.codigo} -${cupon.descuento}%):`, 20, doc.y)
            .text(`-$${descuentoCupon.toFixed(2)}`, 220, doc.y, { width: 60, align: "right" });
        
        doc.moveDown(0.5);
    }

    // Envío
    doc
        .fillColor("black")
        .text(`Envío:`, 20, doc.y)
        .text(envio === 0 ? "GRATIS" : `$${envio.toFixed(2)}`, 220, doc.y, { width: 60, align: "right" });

    doc.moveDown(1);

    // Línea separadora para total
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .lineWidth(1.5)
        .strokeColor("#0b2f23")
        .stroke();

    doc.moveDown(0.8);

    // TOTAL FINAL
    doc
        .fontSize(14)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text(`TOTAL:`, 20, doc.y)
        .fontSize(16)
        .fillColor("#ffd700")
        .text(`$${totalFinal.toFixed(2)}`, 220, doc.y, { width: 60, align: "right" });

    // Calcular espacio restante para centrar el footer
    const alturaTotal = 600;
    const espacioRestante = alturaTotal - doc.y - 120; // 120 es aprox. altura del footer
    
    if (espacioRestante > 0) {
        doc.moveDown(espacioRestante / 12); // Convertir a "líneas"
    } else {
        doc.moveDown(1);
    }

    // Línea decorativa final
    doc
        .moveTo(20, doc.y)
        .lineTo(280, doc.y)
        .lineWidth(2)
        .strokeColor("#ffd700")
        .stroke();

    doc.moveDown(1);

    // --- MENSAJE FINAL ---
    doc
        .fontSize(10)
        .fillColor("#0b2f23")
        .font("Helvetica-Bold")
        .text("¡Gracias por su compra!", { align: "center" });

    doc.moveDown(0.5);

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
/* controllers/ticketController.js */

const PDFDocument = require("pdfkit");

const generarTicket = (req, res) => {
    const { nombre, email, telefono, direccion, metodo, productos } = req.body;

    // Calcular subtotal
    const subtotal = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

    // Calcular IVA (16%)
    const iva = subtotal * 0.16;

    // Total final
    const totalFinal = subtotal + iva;

    // Configurar cabeceras para descargar PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");

    const doc = new PDFDocument();

    doc.pipe(res);

    // Título
    doc.fontSize(20).text("TICKET DE COMPRA", { align: "center" });
    doc.moveDown();

    // Datos del cliente
    doc.fontSize(14).text(`Cliente: ${nombre}`);
    doc.text(`Correo: ${email}`);
    doc.text(`Teléfono: ${telefono}`);
    doc.text(`Dirección: ${direccion}`);
    doc.text(`Método de pago: ${metodo}`);
    doc.moveDown();

    // Lista de productos
    doc.fontSize(16).text("Productos:", { underline: true });
    doc.moveDown(0.5);

    productos.forEach(p => {
        doc.fontSize(13).text(`• ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`);
    });

    doc.moveDown();

    // DESGLOSE DE TOTALES
    doc.fontSize(14).text(`Subtotal: $${subtotal.toFixed(2)}`);
    doc.text(`IVA (16%): $${iva.toFixed(2)}`);
    doc.fontSize(16).text(`TOTAL: $${totalFinal.toFixed(2)}`, { underline: true });

    doc.end();
};

module.exports = { generarTicket };

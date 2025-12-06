// ============================================= 
// CHECKOUT.JS - VERSIÓN CON LOCAL STORAGE
// ============================================= 
const API_BASE_URL = "http://localhost:3000";
const extraPago = document.getElementById("extra-pago");

// Cargar carritoManager si no está disponible
if (typeof carritoManager === 'undefined') {
    console.error('carritoManager no está disponible');
}

const tarifas = {
    MX: { impuesto: 0.16, envio: 150 },
    US: { impuesto: 0.08, envio: 25 },
    ES: { impuesto: 0.21, envio: 18 }
};

const monedas = {
    MX: { simbolo: "MXN $", locale: "es-MX" },
    US: { simbolo: "USD $", locale: "en-US" },
    ES: { simbolo: "€", locale: "es-ES" }
};

function formatCurrency(valor, pais) {
    const { locale } = monedas[pais];
    return valor.toLocaleString(locale, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

// ============================================= 
// CARGAR CARRITO DESDE LOCAL STORAGE
// ============================================= 
function cargarCarrito() {
    if (typeof carritoManager !== 'undefined') {
        return carritoManager.obtenerCarrito();
    }
    // Fallback por si carritoManager no está cargado
    const carrito = localStorage.getItem('carrito_tienda');
    return carrito ? JSON.parse(carrito) : [];
}

// ============================================= 
// MOSTRAR DESGLOSE DE PRODUCTOS EN EL RESUMEN
// ============================================= 
function mostrarDesgloseProductos(carrito, pais) {
    const contenedorDesktop = document.getElementById("productos-resumen");
    const contenedorMobile = document.getElementById("productos-resumen-mobile");
    
    let html = '';
    
    if (carrito.length === 0) {
        html = '<p style="color: #999; text-align: center; padding: 20px;">No hay productos en el carrito</p>';
    } else {
        carrito.forEach(item => {
            // Determinar el precio a usar (con oferta o sin oferta)
            const precioUnitario = Number(item.precio_unitario) || Number(item.precio) || 0;
            const precioOriginal = Number(item.precio_original) || Number(item.precio) || 0;
            const oferta = Number(item.oferta) || 0;
            const estaEnOferta = item.esta_en_oferta || (oferta !== 0 && oferta < precioOriginal);
            const subtotalItem = precioUnitario * item.cantidad;
            
            html += `
                <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: 10px;">
                        <div style="flex: 1;">
                            <strong style="display: block; margin-bottom: 5px; font-size: 0.95em;">${item.nombre}</strong>
                            <div style="font-size: 0.85em; color: #666; margin-bottom: 3px;">
                                ${estaEnOferta ? 
                                    `<div style="color: #e74c3c;">
                                        <span style="text-decoration: line-through; color: #999;">$${formatCurrency(precioOriginal, pais)}</span>
                                        → <strong style="color: #e74c3c;">$${formatCurrency(precioUnitario, pais)}</strong>
                                        <span style="font-size: 0.85em; font-weight: bold;">¡EN OFERTA!</span>
                                    </div>` 
                                    : 
                                    `<span style="color: #333;">$${formatCurrency(precioUnitario, pais)}</span>`
                                }
                                <div style="margin-top: 3px; color: #555;">
                                    <strong>Cantidad:</strong> ${item.cantidad}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right; font-weight: bold; font-size: 0.95em;">
                            $${formatCurrency(subtotalItem, pais)}
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    if (contenedorDesktop) contenedorDesktop.innerHTML = html;
    if (contenedorMobile) contenedorMobile.innerHTML = html;
}

// ============================================= 
// ACTUALIZAR TOTALES
// ============================================= 
function actualizarTotales() {
    const carrito = cargarCarrito();
    
    // Calcular subtotal usando precio_unitario (que ya considera ofertas)
    let subtotal = carrito.reduce((acc, item) => {
        const precio = Number(item.precio_unitario) || Number(item.precio) || 0;
        return acc + (precio * item.cantidad);
    }, 0);
    
    const pais = document.getElementById("pais").value || "MX";
    const { impuesto, envio } = tarifas[pais];
    const montoImpuesto = subtotal * impuesto;
    const total = subtotal + montoImpuesto + envio;
    
    // Actualizar UI Desktop
    document.getElementById("subtotal").innerText = formatCurrency(subtotal, pais);
    document.getElementById("impuesto").innerText = formatCurrency(montoImpuesto, pais);
    document.getElementById("envio").innerText = formatCurrency(envio, pais);
    document.getElementById("total").innerText = formatCurrency(total, pais);
    
    // Actualizar UI Mobile
    if (document.getElementById("subtotal-mobile")) {
        document.getElementById("subtotal-mobile").innerText = formatCurrency(subtotal, pais);
        document.getElementById("impuesto-mobile").innerText = formatCurrency(montoImpuesto, pais);
        document.getElementById("envio-mobile").innerText = formatCurrency(envio, pais);
        document.getElementById("total-mobile").innerText = formatCurrency(total, pais);
    }
    
    // ⭐ MOSTRAR DESGLOSE DE PRODUCTOS
    mostrarDesgloseProductos(carrito, pais);
    
    return { 
        subtotal, 
        montoImpuesto, 
        envio, 
        total, 
        pais, 
        impuesto_porcentaje: impuesto * 100,
        carrito 
    };
}

// Llamar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    actualizarTotales();
});

document.getElementById("pais").addEventListener("change", () => {
    actualizarTotales();
});

// ==================================== 
// MOSTRAR CAMPOS SEGÚN MÉTODO DE PAGO
// ==================================== 
document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const metodo = this.value;
        
        if (metodo === 'tarjeta') {
            extraPago.innerHTML = `
                <div class="formulario-tarjeta">
                    <h3>Datos de la Tarjeta</h3>
                    <label>Número de Tarjeta</label>
                    <input type="text" id="numero_tarjeta" maxlength="19" placeholder="1234 5678 9012 3456" required>
                    
                    <label>Nombre en la Tarjeta</label>
                    <input type="text" id="nombre_tarjeta" placeholder="JUAN PEREZ" required style="text-transform: uppercase;">
                    
                    <div class="fila-tarjeta">
                        <div>
                            <label>Fecha de Vencimiento</label>
                            <input type="text" id="fecha_vencimiento" maxlength="5" placeholder="MM/AA" required>
                        </div>
                        <div>
                            <label>CVV</label>
                            <input type="text" id="cvv" maxlength="4" placeholder="123" required>
                        </div>
                    </div>
                    
                    <div class="tarjetas-aceptadas">
                        <span>Aceptamos:</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" style="height: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style="height: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" style="height: 20px;">
                    </div>
                </div>
            `;
            
            // Formatear número de tarjeta
            document.getElementById('numero_tarjeta').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
            
            // Formatear fecha MM/AA
            document.getElementById('fecha_vencimiento').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
            
            // Solo números en CVV
            document.getElementById('cvv').addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
            
        } else if (metodo === 'transferencia') {
            extraPago.innerHTML = `
                <div class="formulario-transferencia">
                    <h3>Datos para Transferencia Bancaria</h3>
                    <div class="datos-bancarios">
                        <p><strong>Banco:</strong> BBVA Bancomer</p>
                        <p><strong>Beneficiario:</strong> TecnoMex S.A. de C.V.</p>
                        <p><strong>CLABE:</strong> 012180001234567890</p>
                        <p><strong>Cuenta:</strong> 0123456789</p>
                        <p><strong>RFC:</strong> TMX123456ABC</p>
                    </div>
                    
                    <div class="instrucciones-transferencia">
                        <h4>Instrucciones:</h4>
                        <ol>
                            <li>Realiza la transferencia por el monto total</li>
                            <li>Usa como referencia tu número de orden</li>
                            <li>Envía tu comprobante de pago</li>
                        </ol>
                    </div>
                    
                    <label>Comprobante de Transferencia (Opcional)</label>
                    <input type="file" id="comprobante_transferencia" accept="image/*,.pdf">
                    
                    <div class="aviso-transferencia">
                        Tu pedido se procesará una vez confirmemos tu pago (24-48 hrs)
                    </div>
                </div>
            `;
            
        } else if (metodo === 'oxxo') {
            const totales = actualizarTotales();
            extraPago.innerHTML = `
                <div class="formulario-oxxo">
                    <h3>Pago en OXXO</h3>
                    <div class="info-oxxo">
                        <div class="logo-oxxo">
                            <svg viewBox="0 0 200 60" style="width: 120px; height: auto;">
                                <text x="10" y="40" font-family="Arial Black" font-size="35" fill="#EC0000" font-weight="bold">OXXO</text>
                            </svg>
                        </div>
                        
                        <div class="monto-pagar">
                            <p>Monto a pagar:</p>
                            <h2>$${totales.total.toFixed(2)} ${monedas[totales.pais].simbolo}</h2>
                        </div>
                        
                        <div class="referencia-oxxo">
                            <p><strong>Referencia de pago:</strong></p>
                            <p class="codigo-referencia">${generarReferenciaOxxo()}</p>
                        </div>
                    </div>
                    
                    <div class="instrucciones-oxxo">
                        <h4>¿Cómo pagar en OXXO?</h4>
                        <ol>
                            <li>Acude a cualquier tienda OXXO</li>
                            <li>Indica al cajero que harás un pago de servicio</li>
                            <li>Proporciona la referencia de pago</li>
                            <li>Realiza el pago en efectivo</li>
                            <li>Conserva tu comprobante</li>
                        </ol>
                    </div>
                    
                    <div class="aviso-oxxo">
                        Tu pedido se procesará en 24-48 hrs después de confirmar tu pago
                    </div>
                </div>
            `;
        }
    });
});

// Generar referencia OXXO simulada
function generarReferenciaOxxo() {
    return Math.random().toString().slice(2, 16);
}

// ==================================== 
// PROCESAR COMPRA + GENERAR TICKET PDF
// ==================================== 
document.getElementById("checkout-form").addEventListener("submit", async function(e){
    e.preventDefault();
    
    // Cargar carrito desde localStorage
    const carrito = cargarCarrito();
    
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    
    const totales = actualizarTotales();
    const metodoPago = document.querySelector("input[name='pago']:checked");
    
    if (!metodoPago) {
        alert('Por favor selecciona un método de pago');
        return;
    }
    
    // Validar campos según método de pago
    if (metodoPago.value === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numero_tarjeta');
        const nombreTarjeta = document.getElementById('nombre_tarjeta');
        const fechaVencimiento = document.getElementById('fecha_vencimiento');
        const cvv = document.getElementById('cvv');
        
        if (!numeroTarjeta || !nombreTarjeta || !fechaVencimiento || !cvv) {
            alert('Por favor completa todos los datos de la tarjeta');
            return;
        }
        
        if (numeroTarjeta.value.replace(/\s/g, '').length < 13) {
            alert('Número de tarjeta inválido');
            return;
        }
        
        if (cvv.value.length < 3) {
            alert('CVV inválido');
            return;
        }
    }
    
    // ⭐ VALIDAR QUE LOS TOTALES SEAN NÚMEROS VÁLIDOS
    if (isNaN(totales.subtotal) || isNaN(totales.montoImpuesto) || isNaN(totales.envio) || isNaN(totales.total)) {
        console.error('Totales inválidos:', totales);
        alert('Error al calcular los totales. Por favor recarga la página.');
        return;
    }
    
    // Preparar productos con el formato correcto para el backend
    const productosParaVenta = carrito.map(item => {
    const precioUnitario = Number(item.precio_unitario) || Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 1;
    
    return {
        producto_id: item.id,
        id: item.id, // Por si acaso
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        nombre: item.nombre,
        imagen: item.imagen,
        categoria: item.categoria || 'Sin categoría', // ⭐ Incluir categoría
        precio_original: Number(item.precio_original) || Number(item.precio) || 0,
        oferta: Number(item.oferta) || 0,
        esta_en_oferta: item.esta_en_oferta || false
    };
})
    
    // ⭐ VALIDAR QUE TODOS LOS PRODUCTOS TENGAN PRECIOS VÁLIDOS
    const productosInvalidos = productosParaVenta.filter(p => isNaN(p.precio_unitario) || p.precio_unitario <= 0);
    if (productosInvalidos.length > 0) {
        console.error('Productos con precios inválidos:', productosInvalidos);
        alert('Algunos productos tienen precios inválidos. Por favor recarga la página.');
        return;
    }
    
    // Crear el objeto orden con TODOS los datos necesarios
    const orden = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        ciudad: document.getElementById("ciudad").value,
        codigo_postal: document.getElementById("codigo_postal").value,
        pais: totales.pais,
        metodo: metodoPago.value,
        productos: productosParaVenta,
        moneda: monedas[totales.pais].simbolo,
        subtotal: parseFloat(totales.subtotal.toFixed(2)),
        impuesto: parseFloat(totales.montoImpuesto.toFixed(2)),
        impuesto_porcentaje: totales.impuesto_porcentaje,
        envio: parseFloat(totales.envio.toFixed(2)),
        total: parseFloat(totales.total.toFixed(2))
    };
    
    console.log('Orden a enviar:', orden); // Para debug
    console.log('Total a enviar:', orden.total, typeof orden.total); // Verificar tipo
    
    document.getElementById("procesando").classList.remove("oculto");
    document.getElementById("checkout-form").style.display = "none";
    
    try {
        // 1. Registrar venta
        const ventaRes = await fetch(`${API_BASE_URL}/api/ventas/procesar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orden)
        });
        
        const venta = await ventaRes.json();
        console.log('Respuesta del servidor:', venta); // Para debug
        
        if (!ventaRes.ok) {
            alert("Error al registrar venta: " + (venta.mensaje || 'Error desconocido'));
            console.error('Detalles del error:', venta);
            document.getElementById("procesando").classList.add("oculto");
            document.getElementById("checkout-form").style.display = "block";
            return;
        }
        
        orden.id_venta = venta.id_venta;
        
        // 2. Generar ticket PDF
        const ticketRes = await fetch(`${API_BASE_URL}/api/ticket/generar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orden)
        });
        
        if (!ticketRes.ok) {
            console.warn("Error al generar ticket PDF, pero la venta se registró correctamente");
        } else {
            const blob = await ticketRes.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ticket_${orden.id_venta}.pdf`;
            link.click();
        }
        
        // 3. VACIAR CARRITO DE LOCAL STORAGE
        if (typeof carritoManager !== 'undefined') {
            carritoManager.vaciarCarrito();
        } else {
            localStorage.removeItem('carrito_tienda');
        }
        
        // Mensaje según método de pago
        let mensajeExtra = '';
        if (metodoPago.value === 'transferencia') {
            mensajeExtra = '<p>Envía tu comprobante de pago a: pagos@tecnomex.com</p>';
        } else if (metodoPago.value === 'oxxo') {
            mensajeExtra = '<p>Realiza tu pago en cualquier tienda OXXO con la referencia proporcionada</p>';
        }
        
        // Mostrar mensaje final
        document.getElementById("procesando").classList.add("oculto");
        document.getElementById("resultado").classList.remove("oculto");
        document.getElementById("resultado").innerHTML = `
            <h2>¡Pago completado!</h2>
            <p>Venta registrada (#${orden.id_venta})</p>
            <p>Se ha descargado tu ticket en PDF 📄</p>
            ${mensajeExtra}
            <a href="productos.html" class="btn-volver">Volver a la tienda</a>
        `;
        
    } catch (error) {
        console.error('Error completo:', error);
        alert("Error inesperado al procesar la compra: " + error.message);
        document.getElementById("procesando").classList.add("oculto");
        document.getElementById("checkout-form").style.display = "block";
    }
});
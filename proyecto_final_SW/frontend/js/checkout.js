const API_BASE_URL = "http://localhost:3000";

const extraPago = document.getElementById("extra-pago");

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

function actualizarTotales() {
    const carrito = JSON.parse(localStorage.getItem("carrito_tienda")) || [];
    let subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const pais = document.getElementById("pais").value || "MX";
    const { impuesto, envio } = tarifas[pais];

    const montoImpuesto = subtotal * impuesto;
    const total = subtotal + montoImpuesto + envio;

    document.getElementById("subtotal").innerText = formatCurrency(subtotal, pais);
    document.getElementById("impuesto").innerText = formatCurrency(montoImpuesto, pais);
    document.getElementById("envio").innerText = formatCurrency(envio, pais);
    document.getElementById("total").innerText = formatCurrency(total, pais);

    return { 
        subtotal, 
        montoImpuesto, 
        envio, 
        total, 
        pais, 
        impuesto_porcentaje: impuesto * 100 
    };
}

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

    const carrito = JSON.parse(localStorage.getItem("carrito_tienda")) || [];
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const totales = actualizarTotales();
    const metodoPago = document.querySelector("input[name='pago']:checked").value;

    // Validar campos según método de pago
    if (metodoPago === 'tarjeta') {
        const numeroTarjeta = document.getElementById('numero_tarjeta').value;
        const nombreTarjeta = document.getElementById('nombre_tarjeta').value;
        const fechaVencimiento = document.getElementById('fecha_vencimiento').value;
        const cvv = document.getElementById('cvv').value;

        if (!numeroTarjeta || !nombreTarjeta || !fechaVencimiento || !cvv) {
            alert('Por favor completa todos los datos de la tarjeta');
            return;
        }

        // Validación básica de tarjeta
        if (numeroTarjeta.replace(/\s/g, '').length < 13) {
            alert('Número de tarjeta inválido');
            return;
        }

        if (cvv.length < 3) {
            alert('CVV inválido');
            return;
        }
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
        metodo: metodoPago,
        productos: carrito,
        moneda: monedas[totales.pais].simbolo,
        subtotal: totales.subtotal,
        impuesto: totales.montoImpuesto,
        impuesto_porcentaje: totales.impuesto_porcentaje,
        envio: totales.envio,
        total: totales.total
    };

    document.getElementById("procesando").classList.remove("oculto");

    try {
        // Registrar venta
        const ventaRes = await fetch(`${API_BASE_URL}/api/ventas/procesar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orden)
        });

        const venta = await ventaRes.json();

        if (!ventaRes.ok) {
            alert("Error al registrar venta: " + venta.mensaje);
            document.getElementById("procesando").classList.add("oculto");
            return;
        }

        orden.id_venta = venta.id_venta;

        // Generar ticket PDF
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

        const blob = await ticketRes.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket_${orden.id_venta}.pdf`;
        link.click();

        // Vaciar carrito
        localStorage.removeItem("carrito_tienda");

        // Mensaje según método de pago
        let mensajeExtra = '';
        if (metodoPago === 'transferencia') {
            mensajeExtra = '<p>Envía tu comprobante de pago a: pagos@tecnomex.com</p>';
        } else if (metodoPago === 'oxxo') {
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
            <a href="productos.html">Volver a la tienda</a>
        `;

    } catch (error) {
        console.error(error);
        alert("Error inesperado al procesar la compra");
        document.getElementById("procesando").classList.add("oculto");
    }
});
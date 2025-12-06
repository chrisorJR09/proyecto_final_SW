/* carritoManager.js - Manejo del carrito con soporte de ofertas */

class CarritoManager {
    constructor() {
        this.storageKey = 'carrito_tienda';
    }

    // Obtener carrito del Local Storage
    obtenerCarrito() {
        const carrito = localStorage.getItem(this.storageKey);
        return carrito ? JSON.parse(carrito) : [];
    }

    // Guardar carrito en Local Storage
    guardarCarrito(carrito) {
        localStorage.setItem(this.storageKey, JSON.stringify(carrito));
        this.actualizarUI();
    }

    // Agregar producto al carrito con validación de stock desde la BD
    async agregarProducto(producto) {
        try {

            //validación de usuario con login 
            const token=localStorage.getItem("token");
            if(!token){
                alert("Por favor inicia sesión para agregar productos al carrito");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/productos/${producto.id}`);
            const productoDB = await response.json();

            const carrito = this.obtenerCarrito();
            let item = carrito.find(p => p.id === producto.id);

            // Determinar el precio a usar (oferta o precio normal)
            const precioFinal = Number(productoDB.oferta) !== 0 
                ? Number(productoDB.oferta) 
                : Number(productoDB.precio);
            const estaEnOferta = Number(productoDB.oferta) !== 0;

            if (item) {
                if (item.cantidad >= productoDB.stock) {
                    alert(`Solo hay ${productoDB.stock} unidades disponibles`);
                    return;
                }
                item.cantidad++;
                // Actualizar precios por si cambiaron
                item.precio_unitario = precioFinal;
                item.precio_original = Number(productoDB.precio);
                item.oferta = estaEnOferta ? Number(productoDB.oferta) : 0;
                item.esta_en_oferta = estaEnOferta;
            } else {
<<<<<<< HEAD
                carrito.push({
                    ...producto,
                    cantidad: 1,
                    stock: productoDB.stock,
                    precio: Number(productoDB.precio),
                });
            }
=======
            carrito.push({
                id: productoDB.id,
                nombre: productoDB.nombre,
                descripcion: productoDB.descripcion,
                imagen: productoDB.imagen,
                categoria: productoDB.categoria, // ⭐ Asegúrate de incluir esto
                cantidad: 1,
                stock: productoDB.stock,
                precio_unitario: precioFinal,
                precio_original: Number(productoDB.precio),
                oferta: estaEnOferta ? Number(productoDB.oferta) : 0,
                esta_en_oferta: estaEnOferta
            });
        }
>>>>>>> develop

            this.guardarCarrito(carrito);
            alert(`✅ ${productoDB.nombre} agregado al carrito`);

        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            alert("Error al agregar producto al carrito");
        }
    }

    // Actualizar cantidad
    async actualizarCantidad(idProducto, nuevaCantidad) {
        const carrito = this.obtenerCarrito();
        const item = carrito.find(p => p.id === idProducto);

        if (!item) return;

        if (nuevaCantidad <= 0) {
            this.eliminarProducto(idProducto);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/productos/${idProducto}`);
            const productoDB = await response.json();

            if (nuevaCantidad > productoDB.stock) {
                alert(`No puedes agregar más de ${productoDB.stock} unidades`);
                return;
            }

            item.cantidad = nuevaCantidad;

            // Actualizar precios por si cambiaron
            const precioFinal = Number(productoDB.oferta) !== 0 
                ? Number(productoDB.oferta) 
                : Number(productoDB.precio);
            const estaEnOferta = Number(productoDB.oferta) !== 0;

            item.precio_unitario = precioFinal;
            item.precio_original = Number(productoDB.precio);
            item.oferta = estaEnOferta ? Number(productoDB.oferta) : 0;
            item.esta_en_oferta = estaEnOferta;

            this.guardarCarrito(carrito);
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        }
    }

    eliminarProducto(productoId) {
        let carrito = this.obtenerCarrito();
        carrito = carrito.filter(item => item.id !== productoId);
        this.guardarCarrito(carrito);
        return carrito;
    }

    vaciarCarrito() {
        localStorage.removeItem(this.storageKey);
        this.actualizarUI();
    }

    contarItems() {
        const carrito = this.obtenerCarrito();
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    }

    calcularTotal() {
        const carrito = this.obtenerCarrito();
        return carrito.reduce((acc, item) => {
            const precio = item.precio_unitario || item.precio || 0;
            return acc + (precio * item.cantidad);
        }, 0);
    }

    // Obtener desglose detallado del carrito
    obtenerDesglose() {
        const carrito = this.obtenerCarrito();
        return carrito.map(item => ({
            ...item,
            subtotal: item.precio_unitario * item.cantidad,
            descuento: item.esta_en_oferta ? (item.precio_original - item.precio_unitario) * item.cantidad : 0
        }));
    }

    // Finalizar compra
    async finalizarCompra() {
        const carrito = this.obtenerCarrito();
        
        if (carrito.length === 0) {
            throw new Error('El carrito está vacío');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/ventas/procesar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productos: carrito })
            });

            if (!response.ok) throw new Error('Error al procesar la venta');

            const resultado = await response.json();
            this.vaciarCarrito();
            return resultado;

        } catch (error) {
            console.error('Error al finalizar compra:', error);
            throw error;
        }
    }

    actualizarUI() {
        const contador = document.getElementById('carrito-contador');
        if (contador) contador.textContent = this.contarItems();
    }
}

/* -------------------------------------------
   FUNCIÓN GLOBAL (fuera de la clase)
------------------------------------------- */
async function procesarVenta() {
    const carrito = carritoManager.obtenerCarrito();

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    try {
        const respuesta = await fetch(`${API_BASE_URL}/api/ventas/procesar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productos: carrito })
        });

        const data = await respuesta.json();
        console.log("Venta procesada:", data);

        if (!respuesta.ok) {
            alert("Error: " + data.mensaje);
            return;
        }

        alert("Venta registrada exitosamente. Ticket #" + data.id_venta);

        carritoManager.vaciarCarrito();
        if (typeof mostrarCarrito === 'function') {
            mostrarCarrito();
        }

    } catch (error) {
        console.error("Error al procesar venta:", error);
        alert("Error al procesar la venta");
    }
}

// Instancia global
const carritoManager = new CarritoManager();

// Exportación opcional
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarritoManager;
}
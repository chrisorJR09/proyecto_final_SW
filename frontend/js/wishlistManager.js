/* wishlistManager.js - Manejo del Wishlist en Local Storage */

class WishlistManager {
    constructor() {
        this.storageKey = 'wishlist_tienda';
    }

    // Obtener wishlist del Local Storage
    obtenerWishlist() {
        const wishlist = localStorage.getItem(this.storageKey);
        return wishlist ? JSON.parse(wishlist) : [];
    }

    // Guardar wishlist en Local Storage
    guardarWishlist(wishlist) {
        localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
        this.actualizarUI();
    }

    // Agregar producto al wishlist
    agregarProducto(producto) {
        const wishlist = this.obtenerWishlist();
        
        // Verificar si el producto ya existe
        const existe = wishlist.some(item => item.id === producto.id);
        
        if (!existe) {
            wishlist.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                categoria: producto.categoria,
                imagen: producto.imagen,
                fechaAgregado: new Date().toISOString()
            });
            
            this.guardarWishlist(wishlist);
            return { agregado: true, mensaje: 'Producto agregado al wishlist' };
        }
        
        return { agregado: false, mensaje: 'El producto ya está en el wishlist' };
    }

    // Eliminar producto del wishlist
    eliminarProducto(productoId) {
        let wishlist = this.obtenerWishlist();
        wishlist = wishlist.filter(item => item.id !== productoId);
        this.guardarWishlist(wishlist);
        return wishlist;
    }

    // Verificar si un producto está en el wishlist
    estaEnWishlist(productoId) {
        const wishlist = this.obtenerWishlist();
        return wishlist.some(item => item.id === productoId);
    }

    // Toggle producto (agregar/eliminar)
    toggleProducto(producto) {
        if (this.estaEnWishlist(producto.id)) {
            this.eliminarProducto(producto.id);
            return { accion: 'eliminado', mensaje: 'Producto eliminado del wishlist' };
        } else {
            return this.agregarProducto(producto);
        }
    }

    // Vaciar wishlist
    vaciarWishlist() {
        localStorage.removeItem(this.storageKey);
        this.actualizarUI();
    }

    // Contar items en el wishlist
    contarItems() {
        return this.obtenerWishlist().length;
    }

    // Mover producto del wishlist al carrito
    moverAlCarrito(productoId) {
        const wishlist = this.obtenerWishlist();
        const producto = wishlist.find(item => item.id === productoId);
        
        if (producto) {
            // Agregar al carrito (asumiendo que carritoManager está disponible)
            if (typeof carritoManager !== 'undefined') {
                carritoManager.agregarProducto(producto);
            }
            
            // Eliminar del wishlist
            this.eliminarProducto(productoId);
            
            return { exito: true, mensaje: 'Producto movido al carrito' };
        }
        
        return { exito: false, mensaje: 'Producto no encontrado' };
    }

    // Actualizar UI (contador del wishlist)
    actualizarUI() {
        const contador = document.getElementById('wishlist-contador');
        if (contador) {
            contador.textContent = this.contarItems();
        }

        // Actualizar iconos de corazón en productos
        const botonesWishlist = document.querySelectorAll('[data-producto-id]');
        botonesWishlist.forEach(boton => {
            const productoId = parseInt(boton.dataset.productoId);
            if (this.estaEnWishlist(productoId)) {
                boton.classList.add('en-wishlist');
            } else {
                boton.classList.remove('en-wishlist');
            }
        });
    }
}

// Crear instancia global
const wishlistManager = new WishlistManager();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WishlistManager;
}
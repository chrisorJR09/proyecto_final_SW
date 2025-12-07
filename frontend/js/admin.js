const API_URL = "https://proyectofinalsw.onrender.com/api/administrador";
const API_BASE_URL = "https://proyectofinalsw.onrender.com";

// GET ------------------------------------------------------------------------
async function getProductos() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        const container = document.getElementById("productos");
        container.innerHTML = ''; // Limpiar contenido previo
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="no-products">No hay productos disponibles</p>';
            return;
        }
        
        // Crear grid de cards
        const grid = document.createElement('div');
        grid.className = 'products-grid';
        
        data.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const precioOriginal = parseFloat(producto.precio);
            const precioOferta = producto.oferta ? parseFloat(producto.oferta) : null;
            const tieneOferta = precioOferta && precioOferta < precioOriginal;
            
            card.innerHTML = `
                <div class="product-card-header">
                    <span class="product-id">ID: ${producto.id}</span>
                    <span class="product-category">${producto.categoria}</span>
                </div>
                
                <div class="product-image">
                    <img src="${API_BASE_URL}/uploads/${producto.imagen}" 
                         alt="${producto.nombre}" 
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/280x220?text=Sin+Imagen';">
                    ${producto.stock <= 5 && producto.stock > 0 ? '<span class="badge-low-stock">Stock Bajo</span>' : ''}
                    ${producto.stock === 0 ? '<span class="badge-out-stock">Agotado</span>' : ''}
                </div>
                
                <div class="product-card-body">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion}</p>
                    
                    <div class="product-price-section">
                        ${tieneOferta ? `
                            <span class="price-original">$${precioOriginal.toFixed(2)}</span>
                            <span class="price-offer">$${precioOferta.toFixed(2)}</span>
                            <span class="discount-badge">-${Math.round((1 - precioOferta/precioOriginal) * 100)}%</span>
                        ` : `
                            <span class="price-current">$${precioOriginal.toFixed(2)}</span>
                        `}
                    </div>
                    
                    <div class="product-stock">
                        <span class="stock-label">Stock:</span>
                        <span class="stock-value ${producto.stock <= 5 ? 'stock-low' : ''}">${producto.stock} unidades</span>
                    </div>
                </div>
                
                <div class="product-card-actions">
                    <button class="btn-card btn-edit" onclick="prepararEdicion(${producto.id})">
                        <svg width="5" height="5" fill="currentColor" viewBox="0 0 10 10">

                        </svg>
                        Editar
                    </button>
                    <button class="btn-card btn-delete" onclick="eliminarProductoRapido(${producto.id})">
                        <svg width="5" height="5" fill="currentColor" viewBox="0 0 10 10">
                            
                        </svg>
                        Eliminar
                    </button>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        container.appendChild(grid);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById("productos").innerHTML = '<p class="error-message">Error al cargar los productos</p>';
    }
}

// Función para preparar edición (pre-llenar formulario)
function prepararEdicion(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(producto => {
            document.getElementById("u_id").value = producto.id;
            document.getElementById("u_categoria").value = producto.categoria;
            document.getElementById("u_nombre").value = producto.nombre;
            document.getElementById("u_precio").value = producto.precio;
            document.getElementById("u_oferta").value = producto.oferta || '';
            document.getElementById("u_descripcion").value = producto.descripcion;
            document.getElementById("u_stock").value = producto.stock;
            document.getElementById("u_imagen").value = producto.imagen;
            
            // Scroll al formulario de actualización
            document.getElementById("form-actualizar").scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Resaltar formulario brevemente
            const form = document.getElementById("form-actualizar");
            form.style.border = '2px solid #ffd700';
            setTimeout(() => {
                form.style.border = '';
            }, 2000);
        })
        .catch(error => {
            alert('Error al cargar el producto para edición');
            console.error(error);
        });
}

// Función para eliminar rápidamente desde la card
async function eliminarProductoRapido(id) {
    if (!confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        
        const data = await res.json();
        
        if (res.ok) {
            alert('Producto eliminado exitosamente');
            getProductos(); // Recargar la lista
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    }
}

// POST -----------------------------------------------------------------------
async function crearProducto() {
    const nuevo = {
        categoria: document.getElementById("c_categoria").value,
        nombre: document.getElementById("c_nombre").value,
        precio: document.getElementById("c_precio").value,
        oferta: document.getElementById("c_oferta").value,
        descripcion: document.getElementById("c_descripcion").value,
        stock: document.getElementById("c_stock").value,
        imagen: document.getElementById("c_imagen").value
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevo)
        });

        const data = await res.json();
        
        if (res.ok) {
            document.getElementById("create_res").textContent = ' Producto creado exitosamente: ' + JSON.stringify(data, null, 2);
            document.getElementById("form-crear").reset(); // Limpiar formulario
            getProductos(); // Recargar la lista
        } else {
            document.getElementById("create_res").textContent = ' Error: ' + JSON.stringify(data, null, 2);
        }
    } catch (error) {
        document.getElementById("create_res").textContent = 'Error de conexión: ' + error.message;
    }
}

// PUT ------------------------------------------------------------------------
async function actualizarProducto() {
    const id = document.getElementById("u_id").value;

    const producto = {
        categoria: document.getElementById("u_categoria").value,
        nombre: document.getElementById("u_nombre").value,
        precio: document.getElementById("u_precio").value,
        oferta: document.getElementById("u_oferta").value,
        descripcion: document.getElementById("u_descripcion").value,
        stock: document.getElementById("u_stock").value,
        imagen: document.getElementById("u_imagen").value
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        const data = await res.json();
        
        if (res.ok) {
            document.getElementById("update_res").textContent = ' Producto actualizado exitosamente: ' + JSON.stringify(data, null, 2);
            document.getElementById("form-actualizar").reset(); // Limpiar formulario
            getProductos(); // Recargar la lista
        } else {
            document.getElementById("update_res").textContent = ' Error: ' + JSON.stringify(data, null, 2);
        }
    } catch (error) {
        document.getElementById("update_res").textContent = 'Error de conexión: ' + error.message;
    }
}

// DELETE ---------------------------------------------------------------------
async function eliminarProducto() {
    const id = document.getElementById("d_id").value;

    if (!confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        
        if (res.ok) {
            document.getElementById("delete_res").textContent = ' Producto eliminado exitosamente: ' + JSON.stringify(data, null, 2);
            document.getElementById("d_id").value = ''; // Limpiar input
            getProductos(); // Recargar la lista
        } else {
            document.getElementById("delete_res").textContent = ' Error: ' + JSON.stringify(data, null, 2);
        }
    } catch (error) {
        document.getElementById("delete_res").textContent = ' Error de conexión: ' + error.message;
    }
}

// CAMBIAR STOCK ---------------------------------------------------------------
async function cambiarStock() {
    const id = document.getElementById("s_id").value;
    const stock = document.getElementById("s_stock").value;

    try {
        const res = await fetch(`${API_URL}/cambiarStock/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock })
        });

        const data = await res.json();
        
        if (res.ok) {
            document.getElementById("stock_res").textContent = 'Stock actualizado exitosamente: ' + JSON.stringify(data, null, 2);
            document.getElementById("s_id").value = '';
            document.getElementById("s_stock").value = '';
            getProductos(); // Recargar la lista
        } else {
            document.getElementById("stock_res").textContent = 'Error: ' + JSON.stringify(data, null, 2);
        }
    } catch (error) {
        document.getElementById("stock_res").textContent = 'Error de conexión: ' + error.message;
    }
}
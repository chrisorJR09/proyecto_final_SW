// const API_BASE_URL = "https://proyectofinalsw.onrender.com"

// async function cargarProductos() {
//     const container = document.getElementById("productos-container");

//     try {
//         const respuesta = await fetch("${API_BASE_URL}/api/productos");
//         const productos = await respuesta.json();

//         console.log("Productos desde la API:", productos);

//         if (!Array.isArray(productos)) {
//             container.innerHTML = "<p style='color:red'>La API no regresó un arreglo.</p>";
//             return;
//         }

//         container.innerHTML = "";

//         productos.forEach(prod => {
//             container.innerHTML += `
//                 <div class="producto-card">
//                     <img src="${API_BASE_URL}/uploads/${prod.imagen}"
//                          alt="${prod.nombre}"
//                          onerror="this.src='https://via.placeholder.com/150?text=Sin+Imagen'">

//                     <h3>${prod.nombre}</h3>
//                     <p class="descripcion">${prod.descripcion}</p>
//                     <p class="precio">$${Number(prod.precio).toFixed(2)}</p>

//                     <div class="acciones">
//                         <button onclick='agregarAlCarrito(${JSON.stringify(prod)})' class="btn-carrito">
//                             🛒 Agregar
//                         </button>

//                         <button class="btn-wishlist"
//                                 data-producto-id="${prod.id}"
//                                 onclick='toggleWishlist(${JSON.stringify(prod)})'>
//                             🤍
//                         </button>
//                     </div>
//                 </div>
//             `;
//         });

//     } catch (error) {
//         console.error("Error al cargar productos:", error);
//         container.innerHTML = `<p style="color: red;">Error al cargar los productos.</p>`;
//     }
// }

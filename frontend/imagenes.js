const form = document.getElementById("formProducto");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = new FormData(form);

    const res = await fetch("http://localhost:3000/api/productos", {
        method: "POST",
        body: datos
    });

    const data = await res.json();
    console.log(data);
});

const res = await fetch("http://localhost:3000/api/productos");
const productos = await res.json();

productos.forEach(p => {
    const img = document.createElement("img");
    img.src = "http://localhost:3000/uploads/" + p.imagen;
    img.width = 200;
    document.body.appendChild(img);
});

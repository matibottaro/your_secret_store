let productos = JSON.parse(localStorage.getItem("productos")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarProductos(){
    localStorage.setItem("productos", JSON.stringify(productos));
}

function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function login(){
    if(document.getElementById("password").value === "1234"){
        document.getElementById("panel").style.display="block";
        renderAdmin();
    } else {
        alert("Contraseña incorrecta");
    }
}

function agregarProducto(){
    let nuevo = {
        id: Date.now(),
        nombre: nombre.value,
        precio: Number(precio.value),
        descripcion: descripcion.value,
        categoria: categoria.value,
        destacado: destacado.checked,
        activo: true,
        colores: []
    };
    productos.push(nuevo);
    guardarProductos();
    renderAdmin();
}

function renderAdmin(){
    let cont = document.getElementById("lista");
    if(!cont) return;
    cont.innerHTML="";

    productos.forEach(p=>{
        cont.innerHTML+=`
        <div class="card">
        <strong>${p.nombre}</strong> - $${p.precio}<br>
        <button onclick="agregarColor(${p.id})">Agregar Color</button>
        <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        ${renderColores(p)}
        </div>
        `;
    });
}

function eliminarProducto(id){
    productos = productos.filter(p=>p.id!==id);
    guardarProductos();
    renderAdmin();
}

function agregarColor(id){
    let nombreColor = prompt("Nombre del color:");
    let imagen = prompt("Ruta imagen (ej: images/rosa.jpg)");

    let nuevoColor = {
        nombre:nombreColor,
        imagen:imagen,
        stock:{XS:0,S:0,M:0,L:0,XL:0}
    };

    let p=productos.find(x=>x.id===id);
    p.colores.push(nuevoColor);
    guardarProductos();
    renderAdmin();
}

function renderColores(p){
    let html="";
    p.colores.forEach(c=>{
        html+=`
        <div>
        <strong>${c.nombre}</strong>
        ${Object.keys(c.stock).map(t=>`
        ${t}: <input type="number" value="${c.stock[t]}"
        onchange="editarStock(${p.id},'${c.nombre}','${t}',this.value)">
        `).join(" ")}
        </div>
        `;
    });
    return html;
}

function editarStock(id,color,talle,valor){
    let p=productos.find(x=>x.id===id);
    let c=p.colores.find(x=>x.nombre===color);
    c.stock[talle]=Number(valor);
    guardarProductos();
}

function renderProductos(){
    let cont = document.getElementById("productos");
    if(!cont) return;
    cont.innerHTML="";

    productos.filter(p=>p.activo).forEach(p=>{
        cont.innerHTML+=`
        <div class="card">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <p>$${p.precio}</p>
        ${p.colores.map(c=>{
            let agotado = Object.values(c.stock).every(s=>s===0);
            return `
            <div>
            <strong>${agotado?"(AGOTADO) ":""}${c.nombre}</strong><br>
            ${Object.keys(c.stock).map(t=>`
            <button ${c.stock[t]===0?"disabled":""}
            onclick="agregarCarrito(${p.id},'${c.nombre}','${t}')">
            ${t}
            </button>
            `).join("")}
            </div>
            `;
        }).join("")}
        </div>
        `;
    });

    renderCarrito();
}

function agregarCarrito(id,color,talle){
    let p=productos.find(x=>x.id===id);
    carrito.push({nombre:p.nombre,precio:p.precio,color,talle});
    guardarCarrito();
    renderCarrito();
}

function renderCarrito(){
    let cont=document.getElementById("carrito");
    if(!cont) return;
    cont.innerHTML="";
    let total=0;

    carrito.forEach(c=>{
        total+=c.precio;
        cont.innerHTML+=`${c.nombre} - ${c.color} - ${c.talle} - $${c.precio}<br>`;
    });

    document.getElementById("total").innerText=total;
}

function finalizarCompra(){
    let total=0;
    let mensaje="Hola! Quiero confirmar mi pedido:%0A%0A";

    carrito.forEach(c=>{
        mensaje+=`${c.nombre} - ${c.color} - ${c.talle} - $${c.precio}%0A`;
        total+=c.precio;
    });

    mensaje+=`%0ATotal: $${total}%0A`;
    mensaje+=`Voy a pagar por transferencia BROU.`;

    window.open(`https://wa.me/59891699794?text=${mensaje}`);
}

renderProductos();



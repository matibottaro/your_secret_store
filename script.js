let productos = JSON.parse(localStorage.getItem("productos")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let descuento = 0;
let filtroActual="Todos";

function guardar(){
    localStorage.setItem("productos",JSON.stringify(productos));
    localStorage.setItem("carrito",JSON.stringify(carrito));
    localStorage.setItem("pedidos",JSON.stringify(pedidos));
}

function render(){
    const cont=document.getElementById("productos");
    const dest=document.getElementById("destacados");
    cont.innerHTML="";
    dest.innerHTML="";

    productos.forEach(p=>{
        if(!p.activo) return;

        let html = crearProductoHTML(p);

        if(p.destacado){
            dest.innerHTML+=html;
        }

        if(filtroActual==="Todos" || p.categoria===filtroActual){
            cont.innerHTML+=html;
        }
    });

    actualizarCarrito();
}

function crearProductoHTML(p){
    let html=`<div class="producto">
    <h3>${p.nombre}</h3>
    <p>${p.descripcion}</p>
    <p>$${p.precio}</p>`;

    p.colores.forEach(c=>{
        let totalStock=Object.values(c.stock).reduce((a,b)=>a+b,0);
        html+=`<p class="${totalStock===0?'agotado':''}">
        ${totalStock===0?'(AGOTADO) ':''}${c.nombre}</p><div class="talles">`;

        for(let t in c.stock){
            html+=`<button ${c.stock[t]===0?'disabled':''}
            onclick="agregar('${p.id}','${c.nombre}','${t}')">${t}</button>`;
        }

        html+="</div>";
    });

    html+="</div>";
    return html;
}

function agregar(id,color,talle){
    let p=productos.find(x=>x.id==id);
    let c=p.colores.find(x=>x.nombre==color);
    if(c.stock[talle]>0){
        carrito.push({nombre:p.nombre,precio:p.precio,color,talle});
        c.stock[talle]--;
        guardar();
        render();
    }
}

function aplicarCupon(){
    if(document.getElementById("cupon").value==="SECRET10"){
        descuento=0.10;
        alert("Descuento aplicado 10%");
        actualizarCarrito();
    }
}

function actualizarCarrito(){
    let cont=document.getElementById("carrito-items");
    cont.innerHTML="";
    let total=0;

    carrito.forEach(p=>{
        cont.innerHTML+=`<p>${p.nombre} - ${p.color} - ${p.talle} - $${p.precio}</p>`;
        total+=p.precio;
    });

    total=total-(total*descuento);
    document.getElementById("total").innerText=total;
}

function finalizarCompra(){
    let total=0;
    let mensaje="Hola! Pedido:%0A%0A";

    carrito.forEach(p=>{
        mensaje+=`• ${p.nombre} - ${p.color} - ${p.talle} - $${p.precio}%0A`;
        total+=p.precio;
    });

    total=total-(total*descuento);
    mensaje+=`%0ATotal: $${total}%0ATransferencia BROU.%0ACuenta: 00000000`;

    pedidos.push({carrito,total,fecha:new Date()});
    carrito=[];
    guardar();
    window.open(`https://wa.me/59891699794?text=${mensaje}`);
    render();
}

function filtrar(cat){
    filtroActual=cat;
    render();
}

render();

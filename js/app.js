let productos = [];
let carrito = [];
let productoActual = null;
let cantidadDetalle = 1;


/* =========================================
   CARGAR PRODUCTOS DESDE JSON
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        const respuesta = await fetch("data/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        productos = await respuesta.json();

        mostrarProductos();

    } catch (error) {

        console.error("Error cargando productos:", error);

        const contenedor = document.getElementById("productos");

        if (contenedor) {
            contenedor.innerHTML = `
                <p style="text-align:center;">
                    No se pudo cargar el catálogo.
                </p>
            `;
        }

    }

});


/* =========================================
   MOSTRAR PRODUCTOS
========================================= */

function mostrarProductos(lista = productos) {

    const contenedor = document.getElementById("productos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    lista.forEach(producto => {

        const tarjeta = document.createElement("article");

        tarjeta.className = "producto";

        tarjeta.innerHTML = `
            <img 
                src="images/${producto.imagen}" 
                alt="${producto.nombre}"
                loading="lazy"
            >

            <div class="producto-info">

                <h3>${producto.nombre}</h3>

                <p>${producto.descripcion}</p>

                <div class="precios">

                    <span>
                        Menudeo:
                        <strong>$${producto.menudeo}</strong>
                    </span>

                    <span>
                        Mayoreo:
                        <strong>$${producto.mayoreo}</strong>
                    </span>

                </div>

                <div class="flecha">
                    ➜
                </div>

            </div>
        `;

        tarjeta.addEventListener("click", () => {
            abrirProducto(producto.id);
        });

        contenedor.appendChild(tarjeta);

    });

}


/* =========================================
   FILTRAR CATEGORÍAS
========================================= */

function filtrar(categoria, boton) {

    document
        .querySelectorAll(".categorias button")
        .forEach(btn => btn.classList.remove("activa"));

    if (boton) {
        boton.classList.add("activa");
    }

    if (categoria === "Todos") {

        mostrarProductos(productos);

    } else {

        const filtrados = productos.filter(
            producto => producto.categoria === categoria
        );

        mostrarProductos(filtrados);

    }

}


/* =========================================
   MODAL PRODUCTO
========================================= */

function abrirProducto(id) {

    const producto = productos.find(
        producto => producto.id === id
    );

    if (!producto) return;

    productoActual = producto;
    cantidadDetalle = 1;

    document.getElementById("detalleImagen").src =
        `images/${producto.imagen}`;

    document.getElementById("detalleImagen").alt =
        producto.nombre;

    document.getElementById("detalleNombre").textContent =
        producto.nombre;

    document.getElementById("detalleDescripcion").textContent =
        producto.descripcion;

    document.getElementById("detalleMenudeo").textContent =
        `$${producto.menudeo}`;

    document.getElementById("detalleMayoreo").textContent =
        `$${producto.mayoreo}`;

    document.getElementById("cantidadDetalle").textContent =
        cantidadDetalle;

    document
        .getElementById("modalProducto")
        .classList.add("abierto");

}


function cerrarProducto() {

    document
        .getElementById("modalProducto")
        .classList.remove("abierto");

}


/* =========================================
   CANTIDAD DEL PRODUCTO
========================================= */

function cambiarCantidad(valor) {

    cantidadDetalle += valor;

    if (cantidadDetalle < 1) {
        cantidadDetalle = 1;
    }

    document.getElementById("cantidadDetalle").textContent =
        cantidadDetalle;

}


/* =========================================
   AGREGAR DESDE EL MODAL
========================================= */

function agregarDesdeDetalle() {

    if (!productoActual) return;

    const existente = carrito.find(
        item => item.id === productoActual.id
    );

    if (existente) {

        existente.cantidad += cantidadDetalle;

    } else {

        carrito.push({
            ...productoActual,
            cantidad: cantidadDetalle
        });

    }

    cerrarProducto();

    actualizarCarrito();

    abrirCarrito();

}


/* =========================================
   ACTUALIZAR CARRITO
========================================= */

function actualizarCarrito() {

    const contenedor = document.getElementById("carritoItems");

    const contador = document.getElementById("contador");

    const totalElemento = document.getElementById("total");

    if (!contenedor || !contador || !totalElemento) {
        return;
    }

    contenedor.innerHTML = "";

    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

        contador.textContent = "0";

        totalElemento.textContent = "$0";

        return;
    }


    let total = 0;
    let cantidadTotal = 0;


    carrito.forEach(item => {

        const subtotal =
            item.menudeo * item.cantidad;

        total += subtotal;

        cantidadTotal += item.cantidad;


        const elemento = document.createElement("div");

        elemento.className = "carrito-item";

        elemento.innerHTML = `

            <div class="carrito-item-info">

                <strong>
                    ${item.nombre}
                </strong>

                <span>
                    $${item.menudeo} c/u
                </span>

            </div>


            <div class="carrito-controles">

                <button
                    onclick="cambiarCarrito(${item.id}, -1)"
                >
                    −
                </button>

                <span>
                    ${item.cantidad}
                </span>

                <button
                    onclick="cambiarCarrito(${item.id}, 1)"
                >
                    +
                </button>

                <button
                    class="eliminar"
                    onclick="eliminarProducto(${item.id})"
                >
                    🗑️
                </button>

            </div>


            <div class="carrito-subtotal">

                $${subtotal}

            </div>

        `;

        contenedor.appendChild(elemento);

    });


    contador.textContent = cantidadTotal;

    totalElemento.textContent =
        `$${total}`;

}


/* =========================================
   ABRIR / CERRAR CARRITO
========================================= */

function abrirCarrito() {

    document
        .getElementById("carrito")
        .classList.add("abierto");

}


function cerrarCarrito() {

    document
        .getElementById("carrito")
        .classList.remove("abierto");

}


/* =========================================
   CAMBIAR CANTIDAD DEL CARRITO
========================================= */

function cambiarCarrito(id, cantidad) {

    const producto = carrito.find(
        item => item.id === id
    );

    if (!producto) return;

    producto.cantidad += cantidad;

    if (producto.cantidad <= 0) {

        carrito = carrito.filter(
            item => item.id !== id
        );

    }

    actualizarCarrito();

}


/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function eliminarProducto(id) {

    carrito = carrito.filter(
        item => item.id !== id
    );

    actualizarCarrito();

}


/* =========================================
   CHECKOUT
========================================= */

function abrirCheckout() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;
    }


    const resumen = document.getElementById("resumen");

    if (!resumen) return;


    let html = "";
    let total = 0;


    carrito.forEach(item => {

        const subtotal =
            item.menudeo * item.cantidad;

        total += subtotal;

        html += `
            <div class="resumen-item">

                <span>
                    ${item.nombre}
                    x${item.cantidad}
                </span>

                <strong>
                    $${subtotal}
                </strong>

            </div>
        `;

    });


    html += `
        <div class="resumen-total">

            <span>Total</span>

            <strong>
                $${total}
            </strong>

        </div>
    `;


    resumen.innerHTML = html;


    document
        .getElementById("checkout")
        .classList.add("abierto");


    cerrarCarrito();

}


function cerrarCheckout() {

    document
        .getElementById("checkout")
        .classList.remove("abierto");

}


/* =========================================
   ENVIAR PEDIDO POR WHATSAPP
========================================= */

function enviarPedido(event) {

    event.preventDefault();


    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;
    }


    const cliente =
        document.getElementById("cliente").value.trim();

    const telefonoCliente =
        document.getElementById("telefono").value.trim();

    const observaciones =
        document.getElementById("observaciones").value.trim();


    let mensaje =
        "Hola, quiero realizar el siguiente pedido:%0A%0A";


    let total = 0;


    carrito.forEach(item => {

        const subtotal =
            item.menudeo * item.cantidad;

        total += subtotal;


        mensaje +=
            `• ${item.nombre} | Cantidad: ${item.cantidad} | Precio: $${item.menudeo} | Subtotal: $${subtotal}%0A`;

    });


    mensaje +=
        `%0ATotal aproximado: $${total}%0A%0A`;


    mensaje +=
        `Nombre: ${cliente}%0A`;

    mensaje +=
        `Teléfono: ${telefonoCliente}%0A`;


    if (observaciones) {

        mensaje +=
            `Observaciones: ${observaciones}%0A`;

    }


    const telefonoNegocio =
        "523221340289";


    const url =
        `https://wa.me/${telefonoNegocio}?text=${mensaje}`;


    window.open(url, "_blank");


}


/* =========================================
   MÚSICA
========================================= */

const musica =
    document.getElementById("musica");

const botonMusica =
    document.getElementById("botonMusica");


function controlarMusica() {

    if (!musica || !botonMusica) {
        return;
    }


    if (musica.paused) {

        musica.play();

        botonMusica.textContent =
            "🔊 Música";

        botonMusica.classList.add("sonando");

    } else {

        musica.pause();

        botonMusica.textContent =
            "🎵 Música";

        botonMusica.classList.remove("sonando");

    }

}

/* =========================================
   ADMINISTRADOR - REGALOS & DETALLES
========================================= */

let productos = [];
let productoEditando = null;


/* =========================================
   INICIO
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});


/* =========================================
   CARGAR PRODUCTOS
========================================= */

async function cargarProductos() {

    try {

        const respuesta = await fetch("../data/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        productos = await respuesta.json();

        mostrarProductosAdmin();

    } catch (error) {

        console.error("Error cargando productos:", error);

        const contenedor =
            document.getElementById("listaProductos");

        if (contenedor) {

            contenedor.innerHTML = `
                <p class="error">
                    No se pudo cargar el catálogo.
                </p>
            `;

        }

    }

}


/* =========================================
   MOSTRAR PRODUCTOS
========================================= */

function mostrarProductosAdmin() {

    const contenedor =
        document.getElementById("listaProductos");

    if (!contenedor) return;

    contenedor.innerHTML = "";


    productos.forEach(producto => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "admin-producto";


        tarjeta.innerHTML = `

            <img
                src="../images/${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="admin-producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.categoria}
                </p>

                <div class="admin-precios">

                    <span>
                        Menudeo:
                        <strong>
                            $${producto.menudeo}
                        </strong>
                    </span>

                    <span>
                        Mayoreo:
                        <strong>
                            $${producto.mayoreo}
                        </strong>
                    </span>

                </div>

            </div>

            <div class="admin-acciones">

                <button
                    type="button"
                    onclick="editarProducto(${producto.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    onclick="eliminarProducto(${producto.id})"
                >
                    🗑️ Eliminar
                </button>

            </div>

        `;


        contenedor.appendChild(tarjeta);

    });

}


/* =========================================
   NUEVO PRODUCTO
========================================= */

function nuevoProducto() {

    productoEditando = null;

    limpiarFormulario();

    const titulo =
        document.getElementById("tituloFormulario");

    if (titulo) {
        titulo.textContent =
            "Nuevo producto";
    }

    const formulario =
        document.getElementById("formProducto");

    if (formulario) {

        formulario.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   EDITAR PRODUCTO
========================================= */

function editarProducto(id) {

    const producto =
        productos.find(
            producto => producto.id === id
        );

    if (!producto) return;


    productoEditando = id;


    document.getElementById("nombre").value =
        producto.nombre;

    document.getElementById("categoria").value =
        producto.categoria;

    document.getElementById("descripcion").value =
        producto.descripcion;

    document.getElementById("menudeo").value =
        producto.menudeo;

    document.getElementById("mayoreo").value =
        producto.mayoreo;

    document.getElementById("imagen").value =
        producto.imagen;


    const titulo =
        document.getElementById("tituloFormulario");

    if (titulo) {

        titulo.textContent =
            "Editar producto";

    }


    const formulario =
        document.getElementById("formProducto");

    if (formulario) {

        formulario.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   GUARDAR PRODUCTO
========================================= */

function guardarProducto(event) {

    event.preventDefault();


    const nombre =
        document.getElementById("nombre").value.trim();

    const categoria =
        document.getElementById("categoria").value.trim();

    const descripcion =
        document.getElementById("descripcion").value.trim();

    const menudeo =
        Number(document.getElementById("menudeo").value);

    const mayoreo =
        Number(document.getElementById("mayoreo").value);

    const imagen =
        document.getElementById("imagen").value.trim();


    if (
        !nombre ||
        !categoria ||
        !descripcion ||
        !imagen ||
        isNaN(menudeo) ||
        isNaN(mayoreo)
    ) {

        alert(
            "Completa todos los campos antes de guardar."
        );

        return;

    }


    /* =====================================
       EDITAR EXISTENTE
    ===================================== */

    if (productoEditando !== null) {

        const producto =
            productos.find(
                producto =>
                    producto.id === productoEditando
            );


        if (producto) {

            producto.nombre =
                nombre;

            producto.categoria =
                categoria;

            producto.descripcion =
                descripcion;

            producto.menudeo =
                menudeo;

            producto.mayoreo =
                mayoreo;

            producto.imagen =
                imagen;

        }


    }

    /* =====================================
       CREAR NUEVO
    ===================================== */

    else {

        const nuevoId =
            productos.length > 0
                ? Math.max(
                    ...productos.map(
                        producto => producto.id
                    )
                ) + 1
                : 1;


        productos.push({

            id: nuevoId,

            categoria: categoria,

            nombre: nombre,

            descripcion: descripcion,

            menudeo: menudeo,

            mayoreo: mayoreo,

            imagen: imagen

        });

    }


    mostrarProductosAdmin();

    descargarJSON();

    limpiarFormulario();


    productoEditando = null;


    const titulo =
        document.getElementById("tituloFormulario");

    if (titulo) {

        titulo.textContent =
            "Nuevo producto";

    }


    alert(
        "Producto actualizado. Se generó el nuevo productos.json."
    );

}


/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function eliminarProducto(id) {

    const producto =
        productos.find(
            producto => producto.id === id
        );

    if (!producto) return;


    const confirmar =
        confirm(
            `¿Seguro que quieres eliminar "${producto.nombre}"?`
        );


    if (!confirmar) return;


    productos =
        productos.filter(
            producto => producto.id !== id
        );


    mostrarProductosAdmin();

    descargarJSON();

}


/* =========================================
   LIMPIAR FORMULARIO
========================================= */

function limpiarFormulario() {

    const formulario =
        document.getElementById("formProducto");

    if (!formulario) return;

    formulario.reset();

    productoEditando = null;

}


/* =========================================
   GENERAR JSON
========================================= */

function descargarJSON() {

    const contenido =
        JSON.stringify(
            productos,
            null,
            2
        );


    const archivo =
        new Blob(
            [contenido],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(archivo);


    const enlace =
        document.createElement("a");


    enlace.href = url;

    enlace.download =
        "productos.json";


    document.body.appendChild(enlace);

    enlace.click();

    document.body.removeChild(enlace);


    URL.revokeObjectURL(url);

}


/* =========================================
   EXPORTAR JSON MANUALMENTE
========================================= */

function exportarJSON() {

    descargarJSON();

}


/* =========================================
   BUSCAR PRODUCTOS
========================================= */

function buscarProductos() {

    const buscador =
        document.getElementById("buscador");

    if (!buscador) return;


    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    if (!texto) {

        mostrarProductosAdmin();

        return;

    }


    const resultados =
        productos.filter(producto => {

            return (

                producto.nombre
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.categoria
                    .toLowerCase()
                    .includes(texto)

                ||

                producto.descripcion
                    .toLowerCase()
                    .includes(texto)

            );

        });


    const contenedor =
        document.getElementById("listaProductos");

    if (!contenedor) return;


    contenedor.innerHTML = "";


    resultados.forEach(producto => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "admin-producto";


        tarjeta.innerHTML = `

            <img
                src="../images/${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="admin-producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.categoria}
                </p>

                <div class="admin-precios">

                    <span>
                        Menudeo:
                        <strong>
                            $${producto.menudeo}
                        </strong>
                    </span>

                    <span>
                        Mayoreo:
                        <strong>
                            $${producto.mayoreo}
                        </strong>
                    </span>

                </div>

            </div>

            <div class="admin-acciones">

                <button
                    type="button"
                    onclick="editarProducto(${producto.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    onclick="eliminarProducto(${producto.id})"
                >
                    🗑️ Eliminar
                </button>

            </div>

        `;


        contenedor.appendChild(tarjeta);

    });

}

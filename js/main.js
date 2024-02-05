const contenedor = document.querySelector("#cartas-productos")
const inputBuscar = document.querySelector("input[type=search]")
const imgChango = document.querySelector("img.img-chango")

const chango = carritoAlmacenado()

function carritoAlmacenado() {
    return JSON.parse(localStorage.getItem("carrito")) || []
}

function crearCardProducto(producto) {
    return `<div class="col">
                <div class="card">
                    <h2 class="card-header text-center fs-1">${producto.nombre.toUpperCase()}</h2>
                    <img src="${producto.imagen}" class="card-img-top imagen-carta prod1"></img>
                    <div class="card-body">
                        <p class="card-text">$ ${producto.precio.toLocaleString("es-AR")}</p>
                        <button id=${producto.codigo} class="btn btn-primary btn-producto">Agregar al carrito</button>
                    </div>
                </div>
            </div>`
}

function crearErrorBusqueda() {
    return `<div class="alert alert-danger">No hay producto que coincida con la busqueda</div>`
}

function activarClickEnBotones() {
    const botonesComprar = document.querySelectorAll("button.btn-producto")

    for (let boton of botonesComprar) {
        boton.addEventListener("click", () => {
            const productoSeleccionado = productos.find((producto) => producto.codigo === parseInt(boton.id))


            if (chango.find((producto) => producto.codigo === productoSeleccionado.codigo)) {
                const cantProd = chango.find((art) => art.codigo === productoSeleccionado.codigo)
                cantProd.cantidad++
            } else {
                chango.push(productoSeleccionado)
            }
            localStorage.setItem("carrito", JSON.stringify(chango))
        })
    }
}



function cargarProductos(array) {
    if (array.length > 0) {
        contenedor.innerHTML = ""

        array.forEach((producto) => {
            contenedor.innerHTML += crearCardProducto(producto)
        })
        activarClickEnBotones()
    }
}


cargarProductos(productos)

inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && inputBuscar.value.trim() !== "") {
        const resultado = productos.filter((producto) => producto.nombre.toUpperCase().includes(inputBuscar.value.trim().toUpperCase()))
        if (resultado.length > 0) {
            cargarProductos(resultado)
        } else {
            contenedor.innerHTML = crearErrorBusqueda()
        }
    }
})

inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
        cargarProductos(productos)
    }
})

imgChango.addEventListener("mousemove", () => {
    if (chango.length > 0) {
        imgChango.title = chango.length + " producto(s) en el carrito"
    }
})

imgChango.addEventListener("click", () => {
    location.href = "chango.html"
})




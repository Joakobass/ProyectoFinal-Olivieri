const contenedor = document.querySelector("#cartas-productos")
const inputBuscar = document.querySelector("input[type=search]")
const imgChango = document.querySelector("img.img-chango")
const URL = "js/articulos.json"
const productos = []
const chango = carritoAlmacenado()

obtenerArticulos() // función principal
mostrarNotChango()

function carritoAlmacenado() {
    return JSON.parse(localStorage.getItem("carrito")) ?? []
}

function mostrarNotChango() {
    if (chango.length > 0) {
        const not = document.getElementById("not-chango")
        not.classList.remove("oculto")
        not.textContent = chango.length
    }
}

function crearCardProducto({ nombre, imagen, precio, codigo }) {
    return `<div class="col">
                <div class="card">
                    <div class="card-header">
                        <h2 class="text-center text-title">${nombre.toUpperCase()}</h2>
                    </div>
                    <img src="${imagen}" class="card-img-top imagen-carta prod1"></img>
                    <div class="card-body">
                        <p class="card-text">$ ${precio.toLocaleString("es-AR")}</p>
                        <button id=${codigo} class="btn btn-primary btn-producto">Agregar al carrito</button>
                    </div>
                </div>
            </div>`
}

function crearErrorBusqueda() {
    return `<div class="alert alert-danger">No hay producto 
            que coincida con la busqueda</div>`
}

function activarClickEnBotones() {
    const botonesComprar = document.querySelectorAll("button.btn-producto")

    for (let boton of botonesComprar) {
        boton.addEventListener("click", () => {
            const productoSeleccionado = productos.find((producto) => producto.codigo === parseInt(boton.id))
            boton.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin fa-rotate-180 fa-lg" style="color: #ffffff;"></i>`
            setTimeout(() => {
                boton.textContent = "Agregar al carito"
                notificar(`${productoSeleccionado.nombre.toUpperCase()} agregado al carrito`)
            }, 400)

            if (chango.find((producto) => producto.codigo === productoSeleccionado.codigo)) {
                const cantProd = chango.find((art) => art.codigo === productoSeleccionado.codigo)
                cantProd.cantidad++
            } else {
                chango.push(productoSeleccionado)
                setTimeout(() => mostrarNotChango(), 400)

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

function obtenerArticulos() {
    fetch(URL)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("No se pudo completar la carga de los productos (" + response.status + ")")
            }
        })
        .then((data) => productos.push(...data))
        .then(() => cargarProductos(productos))
        .catch((error) => {
            contenedor.innerHTML = retornarErrorCargaProductos()
            console.error(error)
        })
}

function retornarErrorCargaProductos() {

    return `<div class="alert alert-danger">Se ha producido un error al cargar los productos. Por favor, intenta más tarde</div>`
}

inputBuscar.addEventListener("input", () => {

    inputBuscar.value.trim() === "" && cargarProductos(productos)
    const resultado = productos.filter((producto) => producto.nombre.toUpperCase().includes(inputBuscar.value.trim().toUpperCase()))
    resultado.length > 0 ? cargarProductos(resultado) : contenedor.innerHTML = crearErrorBusqueda()
}
)

imgChango.addEventListener("mousemove", () => {

    if (chango.length > 0) {
        imgChango.title = chango.length + " producto(s) en el carrito"
    }
})

imgChango.addEventListener("click", () => {
    chango.length > 0 ? location.href = "chango.html" : notificar("Tiene que haber al menos 1 producto para ver el carrito")
})

function notificar(mensaje) {
    Toastify({
        text: mensaje,
        duration: 2000,
        gravity: "top",
        position: "center",
        style: {
            background: "#00d700",
            color: "#36066a"
        }
    }).showToast()
}




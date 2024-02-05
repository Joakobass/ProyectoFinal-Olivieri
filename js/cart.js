//FALTA CREAR BOTON DE COMPRAR.

const tablaCart = document.querySelector("div.container-chango")
const imgChango = document.querySelector("img.img-chango")
const carritoVacio = document.getElementById("chango-vacio")

let idProducto = 0

const cart = carritoAlmacenado()

function carritoAlmacenado() {
    return JSON.parse(localStorage.getItem("carrito"))
}

function crearFilaProducto(producto) {
    return `<div id="prod${idProducto++}" class="prod-chango">
                <img class="caja img-box" src="${producto.imagen}" alt="producto seleccionado">
                <h3 class="caja name-box">${producto.nombre}</h3>
                <p class="caja cantidad">${producto.cantidad}</p>
                <p class="caja precio">$ ${(producto.cantidad * producto.precio).toLocaleString("es-AR")}</p>
                <button id="${producto.codigo}" class="caja delete">⛔</button>
            </div>`
}

imgChango.addEventListener("mousemove", () => {
    if (cart.length > 0) {
        imgChango.title = cart.length + " producto(s) en el carrito"
    }
})

function comprar() {
    const btnComprar = document.querySelector("button.comprar")

    btnComprar.addEventListener("click", () => {
        
        tablaCart.innerHTML =   `<div>
                                    <h4 class="alert alert-success alerta-compra">Muchas gracias por comprar en Tukson Growshop!</h4>
                                </div>`

        localStorage.clear()
    })

}
function sumarTotal() {
    let total = 0
    cart.forEach((prod) => {
        total += (prod.cantidad * prod.precio)
    })
    return total
}

function activarBotonBorrar() {
    const btnDelete = document.querySelectorAll("button.caja.delete")

    for (let boton of btnDelete) {
        boton.addEventListener("click", () => {
            const articuloSeleccionado = cart.findIndex((producto) => producto.codigo === parseInt(boton.id))
            const prodChango = document.querySelectorAll("div.prod-chango")
            const artAborrar = document.getElementById(prodChango[articuloSeleccionado].id)
            artAborrar.remove()
            cart.splice(articuloSeleccionado, 1)
            localStorage.setItem("carrito", JSON.stringify(cart))
            location.reload()
        })
    }
}



if (cart.length > 0) {

    carritoVacio.remove()
    cart.forEach((articulo) => tablaCart.innerHTML += crearFilaProducto(articulo))

    tablaCart.innerHTML += `<h2 class="suma-total">TOTAL $</h2>
                            <button class="comprar btn btn-primary">Comprar</button>`
    const suma = document.querySelector("h2.suma-total")
    suma.innerHTML += sumarTotal().toLocaleString("es-Ar")

    activarBotonBorrar()
    comprar()

}





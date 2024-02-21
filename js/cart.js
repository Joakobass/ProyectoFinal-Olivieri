const tablaCart = document.querySelector("div.container-chango")
const imgChango = document.querySelector("img.img-chango")
const carritoVacio = document.getElementById("chango-vacio")
const cart = carritoAlmacenado()
let idProducto = 0

crearCarrito()

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
    const btnComprar = document.querySelector("button.compra")

    btnComprar.addEventListener("click", () => alertaComprar())
}

function sumarTotal() {

    let total = 0
    cart.forEach((prod) => total += (prod.cantidad * prod.precio))
    return total

}

function activarBotonBorrar() {
    const btnDelete = document.querySelectorAll("button.caja.delete")

    for (let boton of btnDelete) {
        boton.addEventListener("click", () => {

            const indiceProductoABorrar = cart.findIndex((producto) => producto.codigo === parseInt(boton.id))
            const producto = cart.find((articulo) => articulo.codigo === parseInt(boton.id))
            const prodChango = document.querySelectorAll("div.prod-chango")
            const artAborrar = document.getElementById(prodChango[indiceProductoABorrar].id)

            if (producto.cantidad !== 1) {
                producto.cantidad--
                const cantNueva = prodChango[indiceProductoABorrar].children[2]
                const precio = prodChango[indiceProductoABorrar].children[3]
                cantNueva.textContent = producto.cantidad
                precio.textContent = "$ " + (producto.cantidad * producto.precio).toLocaleString()
            } else {

                artAborrar.remove()
                cart.splice(indiceProductoABorrar, 1)
                notificar(`${producto.nombre.toUpperCase()} ha sido eliminado del carrito`)
            }
            localStorage.setItem("carrito", JSON.stringify(cart))

            const textoSuma = document.getElementById("suma-cart")
            textoSuma.textContent = `TOTAL $ ${sumarTotal().toLocaleString()}`

            cart.length <= 0 && crearAdvertenciaCarroVacio()
        })
    }
}

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

function alertaComprar() {
    Swal.fire({
        title: "¿Está seguro que desea confirmar la compra?",
        icon: "question",
        showCancelButton: true,
        showCloseButton: true
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            Swal.fire({
                text: "Gracias por comprar y confiar en nosotros",
                icon: "success",
                title: "Tukson Growshop"
            })
            localStorage.removeItem("carrito")
            const containerCart = document.querySelector("div.container-chango")
            containerCart.innerHTML = `<div class="alert alert-success">
                                        <p>La compra se ha
                                        efectuado satisfactoriamente.</p>
                                        <p>En 5 segundos seras redirigido a la página de productos</p>
                                        </div>`
            setTimeout(() => location.href = "index.html", 5000)
        }
    });

}

function crearCarrito() {
    if (cart !== null) {

        if (cart.length > 0) {
            cart.forEach((articulo) => tablaCart.innerHTML += crearFilaProducto(articulo))
            tablaCart.innerHTML += `<div id="totales">
                                <h2 id="suma-cart" class="suma-total">TOTAL $ ${sumarTotal().toLocaleString()}</h2>
                                <button class="compra btn btn-primary">Comprar</button>
                                </div>`

            activarBotonBorrar()

            comprar()
        }
    } else {
        document.getElementById("chango-vacio").classList.remove("mostrar-advertencia")
    }
}

function crearAdvertenciaCarroVacio() {

    document.getElementById("totales").classList.add("mostrar-advertencia")
    document.getElementById("chango-vacio").classList.remove("mostrar-advertencia")
}

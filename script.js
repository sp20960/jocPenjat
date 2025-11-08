// GUARDAMOS TODAS LAS CONSTANTES Y VARIABLES GLOBALES QUE UTILIZAREMOS
const diccionarioPalabras = ["amor", "amistad", "alegría", "aventura", "belleza", "cielo", "camino", "destino", 
    "esfuerzo", "esperanza", "familia", "fuerza", "gracia", "hogar", "honor", "ilusión", 
    "justicia", "libertad", "luz", "mar", "naturaleza", "nube", "paz", "perdón"];
const palabraOculta = diccionarioPalabras[Math.floor(Math.random() * diccionarioPalabras.length)].toUpperCase();
const numeroIntentos = document.getElementById('numero-intentos');
const campoPalabraAdivinar = document.querySelector('.palabra-adivinar');
const abecedario = document.querySelector('.abecedario');
const numeroErrores = document.getElementById('numero-errores');
const letras = document.querySelectorAll('.letra:not(.error .correcto)');
const modalNombreUsuario = document.getElementById('container-jugador');
let nombreUsuario = "";
const mensajeError = document.getElementById('mensaje-error');
const formularioNombre = document.getElementById('formulario-nombre');
const inputUsuario = document.getElementById('nombre-usuario');
const letrasCorrectas = [];
const botonGanar = document.querySelector('.modal-ganar button');
const botonPerder = document.querySelector('.modal-perder button');
let ranking = JSON.parse(localStorage.getItem("ranking")) || {"jugadores": []};
let cronometroIniciado = false;
let intervalo;
let segundosTotales = 0;
// FUNCIONES

console.log(palabraOculta);

// FUNCION PARA RELLENAR CON GUIONES BAJOS EL CONTENEDOR DONDE SE IRA PONIENDO LAS LETRAS DE LA PALABRA OCULTA
function llenarCampoPalabraAdivinar() {
    // GUARDO LA LONGITUD DE LA PALABRA OCULTA PARA EL FOR

    let longitudPalabraOculta = palabraOculta.length;
    /* EN ESTE FOR HAGO QUE POR CADA ITERACIÓN SE TENGA QUE CREAR UN ELEMENTO "p", DESPUES ESTA "p" APPEND DE EL CONTENEDOR DE LA PALABRA ADVIINAR Y PARA FINALIZAR LA
        "p" TENDRA COMO TEXTO UN GUIÓN BAJO.
    */
    for (let i = 0; i < longitudPalabraOculta; i++){
        let elemento = document.createElement('p') // Creo un elemento p
        campoPalabraAdivinar.append(elemento); // El elemento p lo anido al contenedor de la palabra oculta
        elemento.innerText = "_";
    }
}


function verificarLongitud() {
    if (inputUsuario.value.trim().length > 8 || inputUsuario.value.trim().length <= 2) {
        mensajeError.textContent = "Ha de contener un mínimo de 3 letras y un maximo de 6";
        return false;
    }
    
    return true;
}

function esObligatorio() {
    if (inputUsuario.value.trim().length === 0) {
        mensajeError.textContent = "El campo es obligatorio"
        return false;
    }

    return true;
}

// FUNCION PARA INCIIAR EL CRONOMETRO
function iniciarCronometro() {
    cronometroIniciado = true; //Indico que el coronometro ya esta iniciado para no vovler a iniciarlo
    intervalo = setInterval(() => {
        segundosTotales++; // Incremento los segundos por cada segundo que pasa
        let horas = Math.floor(segundosTotales / 3600); 
        let minutos = Math.floor((segundosTotales % 3600) / 60);
        let segundos = segundosTotales % 60;
        /* Todo esto lo he buscado por internet y lo que hace es que tengo separado con spans los segundos, horas  y minutos que tienes su propio id
            luego modifico el contenido con el resultado de las operaciones hechas anteriormente guardadas en variables, sobre estas variables las convierto en strig para
            poder aplicar el metodo padStart que te permite rellenar con 0 dando la longitud del string, y el valor con el que quieres rellenar
        */
        document.getElementById("horas").textContent = horas.toString().padStart(2, '0');
        document.getElementById("minutos").textContent = minutos.toString().padStart(2, '0');
        document.getElementById("segundos").textContent = segundos.toString().padStart(2, '0');

    }, 1000) 
}

// FUNCION PARA DETENER EL CRONOMETRO
function detenerCronometro() {
    // Paro el cronometro y incido que el cronometro esta en false para poder inciarlo otra vez en la siguiente partida
    clearInterval(intervalo);
    cronometroIniciado = false;
}

// FUNCION PARA ACTUALIZAR LOS NÚMERO DE ERRORES Y NÚMERO DE INTENTOS
function actualizarErrores() {
    // Incremento los errores
    numeroErrores.innerText = +numeroErrores.innerText + 1;

    // Decremento los intentos 
    numeroIntentos.innerText = +numeroIntentos.innerText - 1;

    // Si el número de errores es igual a 4 pierdes
    if(+numeroErrores.innerText === 4) {
        perder();
    }

}

// FUNCION PARA VERIFICAR LA LETRA
function verificarLetra(letra) {
    // Verificamos si la letra que hemos seleccionado es null
    if (letra !== null) {
        let existeLetra = palabraOculta.indexOf(letra.innerText); //Guardamos el resultado de indexOf si la letra seleccionada esta en palabraOculta
        (existeLetra > -1) ? letraCorrecta(letra) : letraIncorrecta(letra);  // Si el indexOf devuelve mas que un -1 quiere decir que la letra es correcta sino incorrecta
    }
    
}

// FUNCION CUANDO LA LETRA ES CORRECTA
function letraCorrecta(letraIntroducida){
    letraIntroducida.classList.add('correcto') //A la letra le aplicamos el estilo de correcto (fondo en verde)
     //Meto la letra en el array de letras correctas
    
    let campoPalabraAdivinar = document.querySelectorAll('.palabra-adivinar p'); //Guardo en un node list las p que hay en el contenedor de palabra oculta
    // Iteramos el la palabra oculta transofrmada en un array de caracteres
    Array.from(palabraOculta).forEach((letraPalabraOculta, indice) => {
        if (letraPalabraOculta === letraIntroducida.innerText) {
            campoPalabraAdivinar[indice].innerText = letraIntroducida.innerText 
            letrasCorrectas.push(letraIntroducida.innerText);
        }
    });
    
    // Si la longitud del array de letras correctas es la misma que la palabra oculta, el usuario ha ganado
    if (letrasCorrectas.length === palabraOculta.length) {
        ganar();
    }
}

// FUNCION LETRA INCORRECTA
function letraIncorrecta(letra) {
    // Verificamos que la letra que hemos elegido no sea una que ya hemos introducido anteriormente
    if (!letra.classList.contains('incorrecto')){
        letra.classList.add('incorrecto'); // Le aplicamos el estilo de incorrecto (fondo rojo)
        actualizarErrores();
    }
}

function ganar() {
    guardarResultado("ganado");
    detenerCronometro();
    document.querySelector(".ganar").classList.add("visible") // Añadimos la clase visivle al modal de ganar.
}

function perder() {
    detenerCronometro();
    document.querySelector(".perder").classList.add("visible") // Añadimos la clase visivle al modal de perder.
}

// FUNCIÓN PARA GUARDAR RESULTADO
function guardarResultado(estado) {
    let indiceUsuario;
    let existeUsuario = false;

    ranking.jugadores.forEach((usuario, index) => { // Comprobamos si existe el usuario haciendo un foreach al ranking
        if(usuario.nombre === nombreUsuario) {
            indiceUsuario = index;
            existeUsuario = true;
        };  //Si el nombre que hay en el ranking coincide con el que ha introducido el usuario devolvemos true
    });
    // Si no existe el usuario hacemos un push al array ranking con la información de la partida realizada
    if (!existeUsuario) {
        ranking.jugadores.push({"nombre":nombreUsuario, "estado":estado, "palabra":palabraOculta, "numeroErrores":+numeroErrores.textContent, "tiempo":segundosTotales});
        localStorage.setItem("ranking", JSON.stringify(ranking));
        return;
    }

    let marcaAnterior = ranking.jugadores[indiceUsuario].tiempo;
    console.log(marcaAnterior);
    if(marcaAnterior > segundosTotales) {
        ranking.jugadores[indiceUsuario].palabra = palabraOculta;
        ranking.jugadores[indiceUsuario].numeroErrores = +numeroErrores.textContent;
        ranking.jugadores[indiceUsuario].tiempo = segundosTotales;
        localStorage.setItem("ranking", JSON.stringify(ranking));
    } 
}


// EVENTOS
abecedario.addEventListener('click', (e) => {
    
    if(!cronometroIniciado) {
        iniciarCronometro();
    }

    if (e.target.classList.contains('letra')
        && !e.target.classList.contains('error')
        && !e.target.classList.contains('correcto')){

        verificarLetra(e.target);
    }

})

botonGanar.addEventListener('click', () => {
    location.reload();
})

botonPerder.addEventListener('click', () => {
    location.reload();
})

formularioNombre.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (verificarLongitud() & esObligatorio()){
        modalNombreUsuario.style.display = "none";
        nombreUsuario = inputUsuario.value
        formularioNombre.reset();
    }
})

llenarCampoPalabraAdivinar();


// GUARDAMOS TODAS LAS CONSTANTES Y VARIABLES GLOBALES QUE UTILIZAREMOS
const palabraOculta = "BUSCAR";
const numeroIntentos = document.getElementById('numero-intentos');
const campoPalabraAdivinar = document.querySelector('.palabra-adivinar');
const abecedario = document.querySelector('.abecedario');
const numeroErrores = document.getElementById('numero-errores');
const letras = document.querySelectorAll('.letra:not(.error .correcto)');
const modalNombreUsuario = document.getElementById('container-jugador');
const formularioNombre = document.getElementById('formulario-nombre');
const nombreUsuario = document.getElementById('nombre-usuario').value
const letrasCorrectas = [];
const botonGanar = document.querySelector('.modal-ganar button');
const botonPerder = document.querySelector('.modal-perder button');
let ranking = JSON.parse(localStorage.getItem("ranking")) || {"jugadores":[]};
let cronometroIniciado = false;
let intervalo;
let segundosTotales = 0;
console.log(ranking);

// FUNCIONES

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

// FUNCION PARA INCIIAR EL CRONOMETRO
function iniciarCronometro() {
    cronometroIniciado = true; //Indico que el coronometro ya esta iniciado para no vovler a iniciarlo
    intervalo = setInterval(() => {
        segundosTotales++; // Incremento los segundos por cada segundo que pasa
        let horas = Math.floor(segundosTotales / 3600); 
        let minutos = Math.floor((segundosTotales % 3600) / 60);
        let segundos = segundosTotales % 60;

        document.getElementById("horas").textContent = horas.toString().padStart(2, '0');
        document.getElementById("minutos").textContent = minutos.toString().padStart(2, '0');
        document.getElementById("segundos").textContent = segundos.toString().padStart(2, '0');

    }, 1000) 
}

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

}

function verificarLetra(letra) {
    let letraSeleccionada = letra.innerText;

    // Verificamos si la letra que hemos seleccionado es null
    if (letraSeleccionada !== null) {
        let indice = palabraOculta.indexOf(letraSeleccionada); //Guardamos el resultado de indexOf si la letra seleccionada esta en palabraOculta
        (indice > -1) ? palabraCorrecta(letra, indice) : palabraIncorrecta(letra);  // Si el indexOf devuelve mas que un -1 quiere decir que la letra es correcta sino incorrecta
    }
    
}

function palabraCorrecta(letraIntroducida, posicion){
    letraIntroducida.classList.add('correcto') //A la letra le aplicamos el estilo de correcto (fondo en verde)
    letrasCorrectas.push(letraIntroducida); //Meto la letra en el array de letras correctas
    
    let letrasIntroducidas = document.querySelectorAll('.palabra-adivinar p'); //Guardo en un node list las p que hay en el contenedor de palabra oculta
    // Iteramos el node list para poder colocar la letra que hemos seleccionado en la posición que le toca
    letrasIntroducidas.forEach((letraActual, indice) => {
        if (indice === posicion) { //Si el indice que es la posicion que se encuentra la letra que hemos encontrado coincide con en indice del node list que hemos guardado
            letraActual.innerText = letraIntroducida.innerText // El texto de la "p" que originalmente es una barra baja se cambiara por la letra que hemos introducido
        }
    });
    
    // Si la longitud del array de letras correctas es la misma que la palabra oculta, el usuario ha ganado
    if (letrasCorrectas.length === palabraOculta.length) {
        ganar();
    }
}

function palabraIncorrecta(letra) {
    // Verificamos que la letra que hemos elegido no sea una que ya hemos introducido anteriormente
    if (!letra.classList.contains('incorrecto')){

        letra.classList.add('incorrecto'); // Le aplicamos el estilo de incorrecto (fondo rojo)


        if (+numeroErrores.innerText === 3){
            actualizarErrores();
            perder();
        } else {
            actualizarErrores();
        } 
    }
}

function ganar() {
    guardarResultado("ganado");
    detenerCronometro();
    document.querySelector(".ganar").classList.add("visible")
}

function perder() {
    guardarResultado("perdido");
    detenerCronometro();
    document.querySelector(".perder").classList.add("visible")
}

function guardarResultado(estado) {
    let existeUsuario = ranking.jugadores.forEach((usuario, index) => {
        if(usuario.nombre === nombreUsuario) return index;
    })
    if (!existeUsuario) {
        ranking.jugadores.push({"usuario":nombreUsuario, "estado":estado, "palabra":palabraOculta, "numeroErrores":numeroErrores, "tiempo":segundosTotales});
        localStorage.setItem("ranking", JSON.stringify(ranking));
    } else {

    }

console.log(ranking);
}

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
    modalNombreUsuario.style.display = "none"
})

llenarCampoPalabraAdivinar();
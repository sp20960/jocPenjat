// GUARDAMOS TODAS LAS CONSTANTES Y VARIABLES GLOBALES QUE UTILIZAREMOS
const palabraOculta = "BUSCAR";
const numeroIntentos = document.getElementById('numero-intentos');
const campoPalabraAdivinar = document.querySelector('.palabra-adivinar');
const abecedario = document.querySelector('.abecedario');
const numeroErrores = document.getElementById('numero-errores');
const letras = document.querySelectorAll('.letra:not(.error .correcto)');
const letrasCorrectas = [];
const botonGanar = document.querySelector('.modal-ganar button');
const botonPerder = document.querySelector('.modal-perder button');
let cronometroIniciado = false;
let intervalo;


// FUNCIONES

// FUNCION PARA RELLENAR CON GUIONES BAJOS EL CONTENEDOR DONDE SE IRA PONIENDO LAS LETRAS DE LA PALABRA OCULTA
function llenarCampoPalabraAdivinar() {
    // GUARDO LA LONGITUD DE LA PALABRA OCULTA PARA EL FOR
    let longitudPalabraOculta = palabraOculta.length;
    /* EN EESTE FOR HAGO QUE POR CADA ITERACIÓN SE TENGA QUE CREAR UN ELEMENTO "p", DESPUES COLGARA DE EL CONTENEDOR DE LA PALABRA ADVIINAR Y PARA FINALIZAR LA
        "p" TENDRA COMO TEXTO UN GUIÓN BAJO.
    */
    for (let i = 0; i < longitudPalabraOculta; i++){
        let elemento = document.createElement('p')
        campoPalabraAdivinar.append(elemento);
        elemento.innerText = "_";
    }
}

// FUNCION PARA INCIIAR EL CRONOMETRO
function iniciarCronometro() {
    cronometroIniciado = true;
    let segundosTotales = 0;
    intervalo = setInterval(() => {
        segundosTotales++;
        let horas = Math.floor(segundosTotales / 3600);
        let minutos = Math.floor((segundosTotales % 3600) / 60);
        let segundos = segundosTotales % 60;

        document.getElementById("horas").textContent = horas.toString().padStart(2, '0');
        document.getElementById("minutos").textContent = minutos.toString().padStart(2, '0');
        document.getElementById("segundos").textContent = segundos.toString().padStart(2, '0');

    }, 1000) 
}

function detenerCronometro() {
    clearInterval(intervalo);
    cronometroIniciado = false;
}

function actualizarErrores(numeroActualErrores) {
    numeroErrores.innerText = numeroActualErrores + 1;

    let intentosActuales = +numeroIntentos.innerText;
    numeroIntentos.innerText = intentosActuales -1;

}

function verificarLetra(letra) {
    let letraSeleccionada = letra.innerText;

    if (letraSeleccionada !== null) {
        let indice = palabraOculta.indexOf(letraSeleccionada);
        (indice > -1) ? palabraCorrecta(letra, indice) : palabraIncorrecta(letra); 
    }
    
}

function palabraCorrecta(letraIntroducida, posicion){
    letraIntroducida.classList.add('correcto')
    letrasCorrectas.push(letraIntroducida);
    
    let letrasIntroducidas = document.querySelectorAll('.palabra-adivinar p');
    letrasIntroducidas.forEach((letraActual, indice) => {
        if (indice === posicion) {
            letraActual.innerText = letraIntroducida.innerText
        }
    });

    
    if (letrasCorrectas.length === palabraOculta.length) {
        ganar();
    }
}

function palabraIncorrecta(letra) {
    if (!letra.classList.contains('incorrecto')){

        letra.classList.add('incorrecto');

         let numeroActualErrores = +numeroErrores.innerText;

        if (numeroActualErrores === 3){
            actualizarErrores(numeroActualErrores);
            perder();
        } else {
            actualizarErrores(numeroActualErrores);
        } 
    }
}

function ganar() {
    detenerCronometro();
    document.querySelector(".ganar").classList.add("visible")
}

function perder() {
    detenerCronometro();
    document.querySelector(".perder").classList.add("visible")
}

abecedario.addEventListener('click', (e) => {
    if (e.target.classList.contains('letra')
        && !e.target.classList.contains('error')
        && !e.target.classList.contains('correcto')){

        verificarLetra(e.target);
    }

    if(!cronometroIniciado) {
        iniciarCronometro();
    }
})

botonGanar.addEventListener('click', () => {
    location.reload();
})

botonPerder.addEventListener('click', () => {
    location.reload();
})


llenarCampoPalabraAdivinar();
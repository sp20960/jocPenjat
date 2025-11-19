// =======================
// VARIABLES GLOBALES
// =======================

// URL de donde saco las palabras del juego
const urlPalabrasEndpoint = "http://localhost:3000/palabras";

// Palabra que el usuario tiene que adivinar
let palabraOculta = "";

// Elementos del DOM que voy a usar durante la partida
const numeroIntentos = document.getElementById('numero-intentos');
const campoPalabraAdivinar = document.querySelector('.palabra-adivinar');
const abecedario = document.querySelector('.abecedario');
const numeroErrores = document.getElementById('numero-errores');
const letras = document.querySelectorAll('.letra:not(.error .correcto)');

// Elementos del modal del nombre del jugador
const modalNombreUsuario = document.getElementById('container-jugador');
let nombreUsuario = "";
const mensajeError = document.getElementById('mensaje-error');
const formularioNombre = document.getElementById('formulario-nombre');
const inputUsuario = document.getElementById('nombre-usuario');

// Array para guardar las letras correctas
const letrasCorrectas = [];

// Botones de ganar y perder
const botonGanar = document.querySelector('.modal-ganar button');
const botonPerder = document.querySelector('.modal-perder button');

// Ranking guardado en localStorage
let ranking = JSON.parse(localStorage.getItem("ranking")) || {"jugadores": []};

// Variables del cronómetro y temporizador
let cronometroIniciado = false;
let temporizadorIniciado = false;
let intervaloCronometro;
let intervaloTemporizador;
let segundosTotales = 0;


// =======================
// FUNCIONES DEL JUEGO
// =======================

// Rellena los guiones de la palabra que hay que adivinar
function llenarCampoPalabraAdivinar() {
    let longitudPalabraOculta = palabraOculta.length;

    // Por cada letra creo una etiqueta <p> con un guion bajo
    for (let i = 0; i < longitudPalabraOculta; i++){
        let elemento = document.createElement('p')
        campoPalabraAdivinar.append(elemento);
        elemento.innerText = "_";
    }
}

// Pinta el leaderboard del ranking
function llenarLeaderBoard(){
    let leaderboard = document.getElementById('leaderboard');
    
    // Ordeno por errores y tiempo
    ranking.jugadores.sort((a, b) =>
        a.numeroErrores - b.numeroErrores ||
        a.tiempo - b.tiempo
    );

    // Si hay jugadores los muestro, si no un mensaje
    if(ranking.jugadores.length != 0){
        leaderboard.innerHTML = ranking.jugadores
        .map((jugador) => 
            `
            <p>Nombre: ${jugador.nombre} ------------ Palabra: ${jugador.palabra} ----------- Errores: ${jugador.numeroErrores} ----------- Tiempo: ${jugador.tiempo}
            `
        ).join("")
    } else {
        leaderboard.innerHTML="<p>No hay jugadores registrados<p>"
    }
}

// Comprueba que el nombre tenga entre 3 y 8 letras
function verificarLongitud() {
    if (inputUsuario.value.trim().length > 8 || inputUsuario.value.trim().length <= 2) {
        mensajeError.textContent = "Ha de contener un mínimo de 3 letras y un maximo de 6";
        return false;
    }
    return true;
}

// Comprueba que el campo no esté vacío
function esObligatorio() {
    if (inputUsuario.value.trim().length === 0) {
        mensajeError.textContent = "El campo es obligatorio"
        return false;
    }
    return true;
}

// Elige una palabra random según la temática seleccionada
async function elegirPalabraOculta(tematica){
    fetch(urlPalabrasEndpoint)
    .then((resolve) => resolve.json())
    .then((datos) => {
        let palabras = datos[tematica];
        palabraOculta = palabras[Math.floor(Math.random() * palabras.length)].toUpperCase();
        console.log(palabraOculta);
        llenarCampoPalabraAdivinar();
    })
    .catch((error) => console.log(error))
}

// Inicia el cronómetro
function iniciarCronometro() {
    cronometroIniciado = true;

    intervaloCronometro = setInterval(() => {
        segundosTotales++;

        // Cálculo de horas, minutos y segundos
        let horas = Math.floor(segundosTotales / 3600); 
        let minutos = Math.floor((segundosTotales % 3600) / 60);
        let segundos = segundosTotales % 60;

        // Pinto el tiempo en pantalla
        document.getElementById("horas").textContent = horas.toString().padStart(2, '0');
        document.getElementById("minutos").textContent = minutos.toString().padStart(2, '0');
        document.getElementById("segundos").textContent = segundos.toString().padStart(2, '0');

    }, 1000);
}

// Inicia el temporizador de cada turno
function iniciarTemporizador(){
    temporizadorIniciado = true;
    document.querySelector('#temporizador span').innerText = "10";
    reiniciarTemporizador();

    intervaloTemporizador = setInterval(() => {
        let segundosTemporizador = document.querySelector('#temporizador span');

        // Si llega a 0 se cuenta como fallo
        if(+segundosTemporizador.innerText === 0){
            actualizarErrores();
            iniciarTemporizador();
        }

        // Le resto un segundo
        segundosTemporizador.innerText = +segundosTemporizador.innerText - 1;
    }, 1000);
}

// Detiene el cronómetro
function detenerCronometro() {
    clearInterval(intervaloCronometro);
    cronometroIniciado = false;
}

// Reinicia el temporizador
function reiniciarTemporizador(){
    clearInterval(intervaloTemporizador);
    temporizadorIniciado = false;
}

// Actualiza los errores y los intentos
function actualizarErrores() {
    numeroErrores.innerText = +numeroErrores.innerText + 1;
    numeroIntentos.innerText = +numeroIntentos.innerText - 1;

    // Si llega a 6 errores pierde
    if(+numeroErrores.innerText === 6) {
        perder();
    }
}

// Comprueba si la letra pulsada es correcta o no
function verificarLetra(letra) {
    if (letra !== null) {
        // Busco la letra en la palabra oculta
        let existeLetra = palabraOculta.indexOf(letra.innerText);
        (existeLetra > -1) ? letraCorrecta(letra) : letraIncorrecta(letra);
    }
}

// Si la letra es correcta
function letraCorrecta(letraIntroducida){
    letraIntroducida.classList.add('correcto');

    let campoPalabraAdivinar = document.querySelectorAll('.palabra-adivinar p');

    // Pongo la letra en su posición correspondiente
    Array.from(palabraOculta).forEach((letraPalabraOculta, indice) => {
        if (letraPalabraOculta === letraIntroducida.innerText) {
            campoPalabraAdivinar[indice].innerText = letraIntroducida.innerText;
            letrasCorrectas.push(letraIntroducida.innerText);
        }
    });

    // Si el número de aciertos es igual al tamaño de la palabra → gana
    if (letrasCorrectas.length === palabraOculta.length) {
        ganar();
    }
}

// Si la letra es incorrecta
function letraIncorrecta(letra) {
    if (!letra.classList.contains('incorrecto')){
        letra.classList.add('incorrecto');
        actualizarErrores();
    }
}

// Cuando gana el jugador
function ganar() {
    guardarResultado("ganado");
    detenerCronometro();
    document.querySelector(".ganar").classList.add("visible");
}

// Cuando pierde el jugador
function perder() {
    detenerCronometro();
    document.querySelector(".perder").classList.add("visible");
}

// Guarda el resultado en el ranking
function guardarResultado(estado) {
    let indiceUsuario;
    let existeUsuario = false;

    // Compruebo si el usuario ya existe
    ranking.jugadores.forEach((usuario, index) => {
        if(usuario.nombre === nombreUsuario) {
            indiceUsuario = index;
            existeUsuario = true;
        }
    });

    // Si no existe, lo creo
    if (!existeUsuario) {
        ranking.jugadores.push({
            "nombre":nombreUsuario,
            "estado":estado,
            "palabra":palabraOculta,
            "numeroErrores":+numeroErrores.textContent,
            "tiempo":segundosTotales
        });
        localStorage.setItem("ranking", JSON.stringify(ranking));
        return;
    }

    // Si existe, comparo si su nueva marca es mejor
    let marcaAnterior = ranking.jugadores[indiceUsuario].tiempo;
    let erroresAnterior = ranking.jugadores[indiceUsuario].numeroErrores;

    if(marcaAnterior > segundosTotales && erroresAnterior > +numeroErrores.textContent) {
        ranking.jugadores[indiceUsuario].palabra = palabraOculta;
        ranking.jugadores[indiceUsuario].numeroErrores = +numeroErrores.textContent;
        ranking.jugadores[indiceUsuario].tiempo = segundosTotales;
        localStorage.setItem("ranking", JSON.stringify(ranking));
    } 
}


// =======================
// EVENTOS DEL JUEGO
// =======================

// Evento al pulsar una letra del abecedario
abecedario.addEventListener('click', (e) => {
    
    // Reinicio el temporizador de turno
    reiniciarTemporizador();

    // Inicio cronómetro si no está iniciado
    if(!cronometroIniciado) {
        iniciarCronometro();
    }

    // Inicio temporizador de turno si no está iniciado
    if(!temporizadorIniciado) {
        iniciarTemporizador();
    }

    // Verifico que la letra pulsada es válida
    if (e.target.classList.contains('letra')
        && !e.target.classList.contains('error')
        && !e.target.classList.contains('correcto')){

        verificarLetra(e.target);
    }
})

// Botones del modal de ganar/perder
botonGanar.addEventListener('click', () => {
    location.reload();
})

botonPerder.addEventListener('click', () => {
    location.reload();
})

// Evento para enviar el nombre del jugador
formularioNombre.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (verificarLongitud() & esObligatorio()){
        elegirPalabraOculta(document.getElementById('tematica-palabras').value);
        modalNombreUsuario.style.display = "none";
        nombreUsuario = inputUsuario.value
        formularioNombre.reset();
    }
});

// Relleno el ranking al cargar la página
llenarLeaderBoard();

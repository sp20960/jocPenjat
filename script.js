const palabraOculta = "BUSCAR";
const numeroIntentos = document.getElementById('numero-intentos');
const campoPalabraAdivinar = document.querySelector('.palabra-adivinar');
const abecedario = document.querySelector('.abecedario ')
const numeroErrores = document.getElementById('numero-errores');
const letras = document.querySelectorAll('.letra:not(.error .correcto)');
const letrasCorrectas = [];


function llenarCampoPalabraAdivinar() {
    let longitudPalabraOculta = palabraOculta.length;
    for (let i = 0; i < longitudPalabraOculta; i++){
        let elemento = document.createElement('p')
        campoPalabraAdivinar.append(elemento);
        elemento.innerText = "_";
    }
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

        if (numeroActualErrores === 4){
            perder();
        } else {
            numeroErrores.innerText = numeroActualErrores + 1;

            let intentosActuales = +numeroIntentos.innerText;
            numeroIntentos.innerText = intentosActuales -1;
        }
        
    }
    
}


function ganar() {

}

function perder() {

}
llenarCampoPalabraAdivinar();

abecedario.addEventListener('click', (e) => {
    if (e.target.classList.contains('letra')
        && !e.target.classList.contains('error')
        && !e.target.classList.contains('correcto')){

        verificarLetra(e.target);
    }
})
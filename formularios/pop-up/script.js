const button = document.querySelector("button");
const contenidorPopUp = document.querySelector(".contenidor-popup");
const tancaPopUp = document.querySelector(".tanca-popup");
const form = document.getElementById("form");
const usuario = document.getElementById("usuario");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rePassowrd = document.getElementById("password2");

// Funciones
function mostrarError(input, missatge) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const label = formControl.querySelector("label");
  const small = formControl.querySelector("small");
  small.innerText = label.innerText + " " + missatge;
}

function mostrarCorrecto(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control correcto";
}

function esMailValid(input) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(String(input.value.trim().toLowerCase()))) {
    mostrarCorrecto(input);
    return true;
  } else {
    mostrarError(input, "Email no és valid");
  }
}

function esObligatorio(inputArray) {
  let numeroCorrecto = 0;
  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      mostrarError(input, "És obligatorio");
    } else {
      mostrarCorrecto(input);
      numeroCorrecto += 1;
    }
  });
  if (numeroCorrecto === inputArray.length) {
    return true;
  } else {
    return false;
  }
}

function comprovaLongitud(inputArray) {
  let numeroCorrecto = 0;
  inputArray.forEach((elemento) => {
    if (elemento.input.value.length < elemento.min) {
      mostrarError(
        elemento.input,
        `ha de tenir almenys ${elemento.min} caràcters`
      );
    } else if (elemento.input.value.length > elemento.max) {
      mostrarError(
        elemento.input,
        `ha de tenir ${elemento.max} caràcters com a màxix`
      );
    } else {
      mostrarCorrecto(elemento.input);
      numeroCorrecto += 1;
    }
  });

  if (numeroCorrecto === inputArray.length) {
    return true;
  }
}

function comprovaContrasenyesIguals(input1, input2) {
  if (input1.value != input2.value) {
    mostrarError(input2, "Les contrasenyes han de ser idèntiques");
  } else {
    return true;
  }
}

function llenarDatosUsuario() {
  const nombreUsuario = document.getElementById("nombre-usuario");
  const emailUsuario = document.getElementById("mail-usuario");
  const contraseñaUsuario = document.getElementById("contraseña-usuario");

  nombreUsuario.innerText = "Nombre usuario: " + usuario.value;
  emailUsuario.innerText = "Corre electronico: " + email.value;
  contraseñaUsuario.innerText = "Contraseña: " + password.value;
}

// Eventos

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let controlObligatorio = null;
  let controlLongitud = null;
  let controlIgual = null;
  let controlMail = null;

  controlObligatorio = esObligatorio([usuario, email, password, rePassowrd]);
  controlLongitud = comprovaLongitud([
    { input: usuario, min: 3, max: 8 },
    { input: password, min: 6, max: 16 },
  ]);
  controlIgual = comprovaContrasenyesIguals(password, rePassowrd);
  controlMail = esMailValid(email);

  if (controlObligatorio && controlLongitud && controlIgual && controlMail) {
    contenidorPopUp.style.display = "none";
    llenarDatosUsuario();
  }
});

button.addEventListener("click", () => {
  contenidorPopUp.style.display = "block";
});

tancaPopUp.addEventListener("click", () => {
  contenidorPopUp.style.display = "none";
});

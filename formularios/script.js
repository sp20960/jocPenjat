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
  //return re.test(String(email).toLowerCase)

  if (re.test(String(input.value.trim().toLowerCase()))) {
    mostrarCorrecto(input);
  } else {
    mostrarError(input, "Email no és valid");
  }
}

function esObligatorio(inputArray) {
  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      mostrarError(input, "És obligatorio");
    } else {
      mostrarCorrecto(input);
    }
  });
}

function comprovaLongitud(inputArray) {
  inputArray.forEach((elemento) => {
    if (elemento.input.value.length < elemento.min) {
      mostrarError(elemento.input, `ha de tenir almenys ${elemento.min} caràcters`);
    } else if (elemento.input.value.length > elemento.max) {
      mostrarError(elemento.input, `ha de tenir ${elemento.max} caràcters com a màxix`);
    } else {
      mostrarCorrecto(elemento.input);
    }
  });
}

function comprovaContrasenyesIguals(input1, input2) {
  if (input1.value != input2.value) {
    mostrarError(input2, "Les contrasenyes han de ser idèntiques");
  }
}

// Eventos

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //   if (usuario.value === '') {
  //     mostrarError(usuario, 'El nom d\'usuari es obligatori')
  //   } else {
  //     mostrarCorrecto(usuario);
  //   }

  // if (email.value === '') {
  //   mostrarError(usuario, 'El nom d\'usuari es obligatori')
  // } else if(!esMailValid(email.value)) {
  //   mostrarCorrecto(email, '');
  // } else {
  //   mostrarCorrecto(email)
  // }

  //   if (password.value === '') {
  //     mostrarError(usuario, 'El nom d\'usuari es obligatori')
  //   } else {
  //     mostrarCorrecto(usuario);
  //   }

  //   if (rePassowrd.value === '') {
  //     mostrarError(usuario, 'El nom d\'usuari es obligatori')
  //   } else {
  //     mostrarCorrecto(usuario);
  //   }

  esObligatorio([usuario, email, password, rePassowrd]);
  comprovaLongitud([
    {
      "input":usuario,
      "min":3,
      "max":8
    },
    {
      "input":password,
      "min":6,
      "max":16
    }
  ]);
  comprovaContrasenyesIguals(password, rePassowrd);
  esMailValid(email);
});

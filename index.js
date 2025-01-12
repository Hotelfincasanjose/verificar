// Importar SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmOE2v0IQUL80NV2OkzrlAeK_73u3BLU0",
  authDomain: "registro-hotel-deb85.firebaseapp.com",
  databaseURL: "https://registro-hotel-deb85-default-rtdb.firebaseio.com",
  projectId: "registro-hotel-deb85",
  storageBucket: "registro-hotel-deb85.appspot.com",
  messagingSenderId: "122625030325",
  appId: "1:122625030325:web:2c32f582ef1c29eb0126fc",
  measurementId: "G-1VD0GZQ5T2"
};


const app = initializeApp(firebaseConfig);

// Obtener la base de datos
const db = getDatabase(app);

// Función para verificar si el número de identificación está registrado
function checkRegistration() {
  const id = document.getElementById("numeroIdentificacion").value;
  document.getElementById("status").style.display = "block";
  // Crear la referencia a la base de datos para el número de identificación
  const userRef = ref(db, 'users/' + id);

  // Verificar si el número de identificación existe
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      // Si está registrado, comprobar si aceptó los términos
      const userData = snapshot.val();
      if (userData.termsAccepted) {
        document.getElementById("status").innerText = "Ya está registrado y aceptó los términos.";
        document.getElementById("check-form").style.display = "none"; // Ocultar formulario de verificación
        document.getElementById("terms-form").style.display = "none"; // Asegurarse de que el formulario de términos esté oculto
      } else {
        // Si no aceptó los términos, mostrar formulario de términos
        document.getElementById("status").innerText = "Está registrado pero no aceptó los términos. Por favor, lea y acepte los términos.";
        document.getElementById("check-form").style.display = "none"; // Ocultar formulario de verificación
        document.getElementById("terms-form").style.display = "block"; // Mostrar formulario de términos
      }
    } else {
      // Si no está registrado
      document.getElementById("status").innerText = "Número de identificación no encontrado. No se puede proceder sin estar registrado.";
      document.getElementById("check-form").style.display = "none"; // Ocultar formulario de verificación
      document.getElementById("terms-form").style.display = "none"; // Asegurarse de que el formulario de términos esté oculto
    }
  }).catch((error) => {
    console.error("Error al obtener los datos: ", error);
    document.getElementById("status").innerText = "Hubo un problema al verificar los datos.";
  });
}

// Función para guardar los datos y la aceptación de términos
function sendData() {
  const id = document.getElementById("numeroIdentificacion").value;
  const firma = document.getElementById("firma").value;
  const termsAccepted = document.getElementById("terms-checkbox").checked;

  if (termsAccepted) {
    // Referencia a la base de datos para actualizar los datos del usuario
    const userRef = ref(db, 'users/' + id);

    // Actualizar la información del usuario con los nuevos datos
    update(userRef, {
      termsAccepted: termsAccepted,
      firma: firma,
      timestamp: new Date().toISOString() // Registrar la fecha y hora del consentimiento
    }).then(function() {
      alert("Términos aceptados correctamente");
      window.location.href = "https://www.instagram.com"; // Redirige a Instagram
    }).catch(function(error) {
      console.error("Error al actualizar los datos: ", error);
      alert("Hubo un problema al enviar los datos");
    });
  } else {
    alert("Debe aceptar los términos para continuar.");
  }
}

window.sendData = sendData;
window.checkRegistration = checkRegistration;
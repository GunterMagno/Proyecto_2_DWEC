let db;

// Abrir base de datos IndexedDB y crear object store si es necesario
// --- ELIMINADO para que alumnos implementen ---
// const request = indexedDB.open("CRM_Database", 1);

// request.onerror = function(event) {
//     console.error("Error abriendo IndexedDB", event);
// };

// request.onsuccess = function(event) {
//     db = event.target.result;
//     fetchClients(); // Cargar clientes almacenados
// };

// request.onupgradeneeded = function(event) {
//     db = event.target.result;
//     if(!db.objectStoreNames.contains('clients')) {
//         const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
//         objectStore.createIndex('name', 'name', { unique: false });
//         objectStore.createIndex('email', 'email', { unique: true });
//         objectStore.createIndex('phone', 'phone', { unique: false });
//     }
// };

// --- VALIDACIONES ---
// TODO: Implementad validaciones usando expresiones regulares y eventos 'onblur'
// Elimina el código de validación y manejo de clases visuales para que ellos lo desarrollen
const form = document.getElementById('client-form');
const addBtn = document.getElementById('add-btn');
const inputs = form.querySelectorAll('input');

// --- Validaciones y activación botón ---
// Dejar el botón siempre deshabilitado. Que alumnos lo activen cuando validen campos
// addBtn.disabled = true; 

inputs.forEach(input => {
    // Quitar manejo de eventos 'blur' para validación (alumnos deben hacerlo)
    // input.addEventListener('blur', e => { ... });
});

// --- AGREGAR CLIENTE ---
// TODO: Implementar la función que capture los datos y los agregue a IndexedDB
form.addEventListener('submit', e => {
    e.preventDefault();
    // Código para agregar cliente eliminado para valoración
});

// --- LISTADO DINÁMICO ---
// TODO: Implementar función para mostrar clientes guardados en IndexedDB
function fetchClients() {
    // Código eliminado para que alumnos implementen mecanismo de lectura
}

// --- EDITAR CLIENTE ---
window.editClient = function(id) {
    // Código eliminado para implementación del alumno
};

// --- ELIMINAR CLIENTE ---
window.deleteClient = function(id) {
    // Código eliminado para implementación del alumno
};


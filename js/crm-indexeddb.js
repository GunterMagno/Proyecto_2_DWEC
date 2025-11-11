let db;

// Abrir base de datos IndexedDB y crear object store si es necesario
const request = indexedDB.open("CRM_Database", 1);

objectStore.onupgradeneeded

request.onerror = function(event) {
    console.error("Error abriendo IndexedDB", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("✅ Base de datos abierta correctamente");
    fetchClients(); // Cargar clientes almacenados
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if(!db.objectStoreNames.contains('clients')) {
        const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('phone', 'phone', { unique: false });
    }
};

// --- VALIDACIONES ---
// TODO: Implementad validaciones usando expresiones regulares y events 'onblur'
// Elimina el código de validación y manejo de clases visuales para que ellos lo desarrollen
const form = document.getElementById('client-form');
const addBtn = document.getElementById('add-btn');
const inputs = form.querySelectorAll('input');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9\s\-()+]{7,15}$/;

// --- Validaciones y activación botón ---
// Dejar el botón siempre deshabilitado. Que alumnos lo activen cuando validen campos
addBtn.disabled = true;

inputs.forEach(input => {
    // Quitar manejo de eventos 'blur' para validación (alumnos deben hacerlo)
    input.addEventListener('blur', e => {
        switch (input.id) {
            case 'name':
                if (!nameRegex.test(input.value)) {
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
                break;
            case 'email':
                if (!emailRegex.test(input.value)) {
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
                break;
            case 'phone':
                if (!phoneRegex.test(input.value)) {
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
                break;
        }
        // Verificar si todos los campos son válidos
        addBtn.disabled = !form.checkValidity();
    });
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


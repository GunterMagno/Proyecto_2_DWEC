let db;

// Abrir base de datos IndexedDB
const request = indexedDB.open("CRM_Database", 1);
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

const form = document.getElementById('client-form');
const addBtn = document.getElementById('add-btn');
const inputs = form.querySelectorAll('input');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'\.\-]{3,}$/;
const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

// --- Validaciones y activación botón ---

addBtn.disabled = true;

// Función para verificar si todos los campos son válidos con REGEX
function validateFields() {
    const nameValid = nameRegex.test(nameInput.value);
    const emailValid = emailRegex.test(emailInput.value);
    const phoneValid = phoneRegex.test(phoneInput.value);
    
    addBtn.disabled = !(nameValid && emailValid && phoneValid);
}

// Validar NOMBRE mientras escribes
nameInput.addEventListener('input', e => {
    const isValid = nameRegex.test(nameInput.value);
    
    if (nameInput.value.length > 0) {
        if (isValid) {
            nameInput.classList.remove('invalid');
            nameInput.classList.add('valid');
        } else {
            nameInput.classList.add('invalid');
            nameInput.classList.remove('valid');
        }
    } else {
        nameInput.classList.remove('invalid', 'valid');
    }
    validateFields();
});

// Validar EMAIL mientras escribes
emailInput.addEventListener('input', e => {
    const isValid = emailRegex.test(emailInput.value);
    
    if (emailInput.value.length > 0) {
        if (isValid) {
            emailInput.classList.remove('invalid');
            emailInput.classList.add('valid');
        } else {
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
        }
    } else {
        emailInput.classList.remove('invalid', 'valid');
    }
    validateFields();
});

// Validar TELÉFONO mientras escribes (auto-formatear)
phoneInput.addEventListener('input', e => {
    // Quitar todo lo que no sea dígito
    let digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    
    // Formatear 3-3-4
    if (digits.length > 6) {
        phoneInput.value = digits.slice(0,3) + '-' + digits.slice(3,6) + '-' + digits.slice(6);
    } else if (digits.length > 3) {
        phoneInput.value = digits.slice(0,3) + '-' + digits.slice(3);
    } else {
        phoneInput.value = digits;
    }
    
    const isValid = phoneRegex.test(phoneInput.value);
    
    if (phoneInput.value.length > 0) {
        if (isValid) {
            phoneInput.classList.remove('invalid');
            phoneInput.classList.add('valid');
        } else {
            phoneInput.classList.add('invalid');
            phoneInput.classList.remove('valid');
        }
    } else {
        phoneInput.classList.remove('invalid', 'valid');
    }
    validateFields();
});

// --- AGREGAR CLIENTE ---
// TODO: Implementar la función que capture los datos y los agregue a IndexedDB
form.addEventListener('submit', e => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    // Validar que todos los campos cumplan con el regex
    if (!nameRegex.test(name) || !emailRegex.test(email) || !phoneRegex.test(phone)) {
        alert('Por favor, completa todos los campos correctamente');
        return;
    }
    
    const transaction = db.transaction(['clients'], 'readwrite');
    const objectStore = transaction.objectStore('clients');
    
    const client = {
        name: name,
        email: email,
        phone: phone
    };
    
    // Verificar si estamos editando o agregando
    const clientId = addBtn.dataset.clientId;
    
    if (clientId) {
        // ACTUALIZAR cliente existente
        client.id = parseInt(clientId);
        const request = objectStore.put(client);
        
        request.onsuccess = function() {
            console.log('✅ Cliente actualizado correctamente');
            form.reset();
            addBtn.disabled = true;
            addBtn.textContent = 'Agregar Cliente';
            delete addBtn.dataset.clientId;
            fetchClients();
        };
        
        request.onerror = function() {
            alert('Error al actualizar cliente. Verifica que el email sea único.');
            console.error('Error:', request.error);
        };
    } else {
        // AGREGAR nuevo cliente
        const request = objectStore.add(client);
        
        request.onsuccess = function() {
            console.log('✅ Cliente agregado correctamente');
            form.reset();
            addBtn.disabled = true;
            fetchClients();
        };
        
        request.onerror = function() {
            alert('Error al agregar cliente. Verifica que el email sea único.');
            console.error('Error:', request.error);
        };
    }
});

// --- LISTADO DINÁMICO ---
// TODO: Implementar función para mostrar clientes guardados en IndexedDB
function fetchClients() {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = ''; // Limpiar lista
    
    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.getAll();
    
    request.onsuccess = function() {
        const clients = request.result;
        if (clients.length === 0) {
            clientList.innerHTML = '<li style="text-align: center; color: #999;">No hay clientes registrados</li>';
            return;
        }
        
        clients.forEach(client => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>
                    <strong>${client.name}</strong> - ${client.email} - ${client.phone}
                </span>
                <div class="actions">
                    <button type="button" onclick="editClient(${client.id})">Editar</button>
                    <button type="button" onclick="deleteClient(${client.id})" style="background: #ff6b6b; color: white;">Eliminar</button>
                </div>
            `;
            clientList.appendChild(li);
        });
    };
    
    request.onerror = function() {
        console.error('Error al obtener clientes:', request.error);
    };
}

// --- EDITAR CLIENTE ---
window.editClient = function(id) {
    const transaction = db.transaction(['clients'], 'readonly');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.get(id);
    
    request.onsuccess = function() {
        const client = request.result;
        if (client) {
            nameInput.value = client.name;
            emailInput.value = client.email;
            phoneInput.value = client.phone;
            
            // Cambiar el botón a "Actualizar"
            addBtn.textContent = 'Actualizar Cliente';
            addBtn.disabled = false;
            
            // Guardar el ID para actualización
            addBtn.dataset.clientId = id;
            
            // Scroll al formulario
            form.scrollIntoView({ behavior: 'smooth' });
        }
    };
};

// --- ELIMINAR CLIENTE ---
window.deleteClient = function(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        return;
    }
    
    const transaction = db.transaction(['clients'], 'readwrite');
    const objectStore = transaction.objectStore('clients');
    const request = objectStore.delete(id);
    
    request.onsuccess = function() {
        console.log('✅ Cliente eliminado correctamente');
        fetchClients(); // Recargar lista
    };
    
    request.onerror = function() {
        alert('Error al eliminar cliente');
        console.error('Error:', request.error);
    };
};


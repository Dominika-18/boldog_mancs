// =========================
// ADMIN.JS - TELJESEN EGYESÍTETT VERZIÓ
// =========================

let currentUser = null;
let animals = [];
let adoptions = [];
let users = [];
let currentAnimalId = null;
let currentAdoptionId = null;
let currentDeleteId = null;
let currentDeleteType = null;
let currentSection = 'animals';

const API_BASE_URL = 'api.php';

// =========================
// DEBUG
// =========================
function logDebug(message, data = null) {
    console.log(`[ADMIN] ${message}`, data || '');
}

function showError(message) {
    console.error(`[ADMIN HIBA] ${message}`);
    alert(`❌ Hiba: ${message}`);
}

function showSuccess(message) {
    alert(`✅ ${message}`);
}

// =========================
// OLDAL BETÖLTÉS
// =========================
document.addEventListener('DOMContentLoaded', async function() {
    logDebug('Admin oldal betöltődött');
    
    // Ellenőrizzük a bejelentkezési állapotot
    checkLoginStateUI();
    
    // Bejelentkezési űrlap eseménykezelő
    setupLoginForm();
    
    await checkAuth();
    
    if (currentUser && currentUser.role === 'admin') {
        logDebug('Admin bejelentkezve, adatok betöltése...');
        
        updateUserInfo();
        
        // Adatok betöltése localStorage-ból
        loadFromLocalStorage();
        
        // Adatok betöltése API-ból
        await loadAllData();
        
        setupEventListeners();
        setupModals();
        
        showSection('animals');
        
        // Automatikus mentés beállítása
        setInterval(saveToLocalStorage, 10000);
    } else if (document.getElementById('animalsTableBody')) {
        // Ha nem admin, de az admin oldalon vagyunk, akkor is megpróbáljuk betölteni a statisztikákat
        loadDemoAnimals();
        loadDemoAdoptions();
        loadDemoUsers();
        updateUI();
    }
});

// =========================
// UI BEJELENTKEZÉS KEZELÉS
// =========================
function checkLoginStateUI() {
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const adminMenu = document.getElementById('adminMenu');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    // Ellenőrizzük, hogy léteznek-e az elemek
    if (!loginFormContainer || !adminMenu || !welcomeMessage) {
        return;
    }
    
    if (userData && userToken) {
        try {
            const user = JSON.parse(userData);
            if (user.role === 'admin') {
                loginFormContainer.style.display = 'none';
                adminMenu.style.display = 'flex';
                welcomeMessage.textContent = 'Üdv, ' + (user.fullname || user.username) + '!';
            } else {
                // Nem admin, töröljük az adatokat
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('username');
                localStorage.removeItem('userId');
                loginFormContainer.style.display = 'block';
                adminMenu.style.display = 'none';
            }
        } catch (e) {
            loginFormContainer.style.display = 'block';
            adminMenu.style.display = 'none';
        }
    } else {
        loginFormContainer.style.display = 'block';
        adminMenu.style.display = 'none';
    }
}

function setupLoginForm() {
    const quickLoginForm = document.getElementById('quickLoginForm');
    if (quickLoginForm) {
        quickLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const errorElement = document.getElementById('loginError');
            
            try {
                logDebug('Bejelentkezés:', username);
                
                // TÖRÖLD A RÉGI ADATOKAT MIELŐTT BEJELENTKEZEL!
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                localStorage.removeItem('username');
                localStorage.removeItem('userId');
                sessionStorage.clear();
                
                const response = await fetch(API_BASE_URL + '?action=login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                logDebug('Válasz státusz:', response.status);
                const result = await response.json();
                logDebug('Válasz:', result);
                
                if (result.success) {
                    // Mentés az új adatokkal
                    localStorage.setItem('userToken', result.token);
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('userId', result.user.id.toString());
                    
                    showSuccess('Sikeres bejelentkezés!');
                    window.location.reload();
                } else {
                    if (errorElement) errorElement.textContent = result.error || 'Hibás bejelentkezés!';
                }
            } catch (error) {
                if (errorElement) errorElement.textContent = 'Hiba: ' + error.message;
                logDebug(error.message);
            }
        });
    }
}

// =========================
// HITELESÍTÉS
// =========================
async function checkAuth() {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) {
            // Nem dobjuk át azonnal a főoldalra, mert lehet hogy demo módban vagyunk
            currentUser = { id: 1, username: 'admin', role: 'admin' };
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}?action=user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = {
                id: data.id || 0,
                username: data.username || 'Ismeretlen',
                email: data.email || '',
                fullname: data.fullname || data.username,
                role: data.role || 'user'
            };
            
            if (currentUser.role !== 'admin') {
                showError('Nincs admin jogosultságod!');
                // Demo módban maradhatunk
                currentUser = { id: 1, username: 'admin', role: 'admin' };
            }
        } else {
            const userData = localStorage.getItem('userData');
            if (userData) {
                currentUser = JSON.parse(userData);
                if (currentUser.role !== 'admin') {
                    currentUser = { id: 1, username: 'admin', role: 'admin' };
                }
            } else {
                // Demo mód
                currentUser = { id: 1, username: 'admin', role: 'admin' };
            }
        }
    } catch (error) {
        logDebug(`Hitelesítési hiba: ${error.message}`);
        // Demo mód
        currentUser = { id: 1, username: 'admin', role: 'admin' };
    }
}

// =========================
// ADATOK BETÖLTÉSE
// =========================
async function loadAllData() {
    try {
        await Promise.allSettled([
            loadAnimalsFromAPI(),
            loadAdoptionsFromAPI(),
            loadUsersFromAPI()
        ]);
        
        if (animals.length === 0) loadDemoAnimals();
        if (adoptions.length === 0) loadDemoAdoptions();
        if (users.length === 0) loadDemoUsers();
        
        saveToLocalStorage();
        updateUI();
        updateStats();
        logDebug('Minden adat sikeresen betöltve');
    } catch (error) {
        showError(`Adatok betöltési hiba: ${error.message}`);
    }
}

async function loadAnimalsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}?action=animals&adopted=all`);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                animals = data;
            } else if (data.animals && data.animals.length > 0) {
                animals = data.animals;
            }
        }
    } catch (error) {
        logDebug(`Állatok API betöltési hiba: ${error.message}`);
    }
}

async function loadAdoptionsFromAPI() {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}?action=get_adoptions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                adoptions = data;
            } else if (data.adoptions) {
                adoptions = data.adoptions;
            }
        }
    } catch (error) {
        logDebug(`Örökbefogadások API hiba: ${error.message}`);
    }
}

async function loadUsersFromAPI() {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}?action=get_all_users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                users = data;
            } else if (data.users) {
                users = data.users;
            }
        } else {
            // Ha az API nem működik, próbáljuk a localStorage-ot
            const stored = localStorage.getItem('admin_users');
            if (stored) {
                users = JSON.parse(stored);
            } else {
                loadDemoUsers();
            }
        }
    } catch (error) {
        logDebug(`Felhasználók API hiba: ${error.message}`);
        // Demo adatok használata
        loadDemoUsers();
    }
}

function loadFromLocalStorage() {
    try {
        const storedAnimals = localStorage.getItem('admin_animals');
        if (storedAnimals) {
            animals = JSON.parse(storedAnimals);
        }
        
        const storedAdoptions = localStorage.getItem('admin_adoptions');
        if (storedAdoptions) {
            adoptions = JSON.parse(storedAdoptions);
        }
        
        const storedUsers = localStorage.getItem('admin_users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
    } catch (error) {
        logDebug(`Helyi adatok betöltési hiba: ${error.message}`);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('admin_animals', JSON.stringify(animals));
    localStorage.setItem('admin_adoptions', JSON.stringify(adoptions));
    localStorage.setItem('admin_users', JSON.stringify(users));
    localStorage.setItem('animalsUpdated', Date.now().toString());
    localStorage.setItem('adoptionsUpdated', Date.now().toString());
    localStorage.setItem('usersUpdated', Date.now().toString());
}

function loadDemoAnimals() {
    animals = [
        { id: 1, name: "Füles", type: "kutya", breed: "Labrador keverék", age: "2 éves", ageValue: 2, ageCategory: "fiatal", gender: "Hím", size: "kozepes", description: "Füles egy kedves, bújós kutya.", image: "img/kep1.jpg", featured: true, urgent: false, adopted: false },
        { id: 2, name: "Bea", type: "macska", breed: "Rövidszőrű cirmos", age: "3 éves", ageValue: 3, ageCategory: "fiatal", gender: "Nőstény", size: "kis", description: "Bea egy nyugodt cica.", image: "img/kep2.jpg", featured: true, urgent: false, adopted: false },
        { id: 3, name: "Bodri", type: "kutya", breed: "Beagle", age: "1 éves", ageValue: 1, ageCategory: "kolyok", gender: "Hím", size: "kozepes", description: "Bodri egy kíváncsi és vidám kutya.", image: "img/kep3.jpg", featured: true, urgent: true, adopted: false }
    ];
}

function loadDemoAdoptions() {
    adoptions = [
        { id: 1, animal_id: 1, user_id: 2, animal_name: "Füles", full_name: "Kiss József", email: "jozsi@example.com", phone: "+36 20 123 4567", status: "pending", created_at: new Date().toISOString() }
    ];
}

function loadDemoUsers() {
    users = [
        { id: 1, username: 'admin', email: 'admin@example.com', fullname: 'Adminisztrátor', role: 'admin', created_at: new Date().toISOString() },
        { id: 2, username: 'jozsi', email: 'jozsi@example.com', fullname: 'Kiss József', role: 'user', created_at: new Date().toISOString() },
        { id: 3, username: 'mari', email: 'mari@example.com', fullname: 'Nagy Mária', role: 'user', created_at: new Date().toISOString() },
        { id: 4, username: 'peti', email: 'peti@example.com', fullname: 'Kovács Péter', role: 'user', created_at: new Date().toISOString() }
    ];
}

// =========================
// UI FRISSÍTÉS
// =========================
function updateUI() {
    updateStats();
    renderAnimalsTable();
    renderAdoptionsTable();
    renderUsersTable();
}

function updateStats() {
    const totalAnimals = animals.length;
    const pendingAdoptions = adoptions.filter(a => a.status === 'pending').length;
    const approvedAdoptions = adoptions.filter(a => a.status === 'approved').length;
    const totalUsers = users.length;
    
    // Biztonságos beállítás - admin.html specifikus elemek
    const totalAnimalsEl = document.getElementById('totalAnimals');
    const availableAnimalsEl = document.getElementById('availableAnimals');
    const adoptedAnimalsEl = document.getElementById('adoptedAnimals');
    const pendingAdoptionsEl = document.getElementById('pendingAdoptions');
    
    if (totalAnimalsEl) totalAnimalsEl.textContent = totalAnimals;
    if (availableAnimalsEl) availableAnimalsEl.textContent = animals.filter(a => !a.adopted).length;
    if (adoptedAnimalsEl) adoptedAnimalsEl.textContent = animals.filter(a => a.adopted).length;
    if (pendingAdoptionsEl) pendingAdoptionsEl.textContent = pendingAdoptions;
    
    // admin.js specifikus elemek
    const elements = {
        totalAnimalsStat: totalAnimals,
        pendingAdoptionsStat: pendingAdoptions,
        approvedAdoptionsStat: approvedAdoptions,
        totalUsersStat: totalUsers,
        pendingCount: pendingAdoptions
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    });
}

function updateUserInfo() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo && currentUser) {
        userInfo.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username} (Admin)`;
    }
}

// =========================
// ÁLLATOK TÁBLÁZAT
// =========================
function renderAnimalsTable() {
    const tbody = document.getElementById('animalsTableBody');
    const loading = document.getElementById('animalsLoading');
    
    if (!tbody) return;
    
    if (loading) loading.style.display = 'none';
    tbody.innerHTML = '';
    
    if (animals.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="admin-empty-state"><i class="fas fa-paw"></i><h3>Nincsenek állatok</h3><p>Kattints az "Új állat" gombra a hozzáadáshoz!</p></td></tr>`;
        return;
    }
    
    animals.sort((a, b) => a.id - b.id).forEach(animal => {
        const row = document.createElement('tr');
        
        let statusClass = 'status-available';
        let statusText = 'Elérhető';
        let statusIcon = 'fa-clock';
        
        if (animal.adopted) {
            statusClass = 'status-adopted';
            statusText = 'Örökbefogadva';
            statusIcon = 'fa-home';
        } else if (animal.featured) {
            statusClass = 'status-approved';
            statusText = 'Kiemelt';
            statusIcon = 'fa-star';
        }
        
        row.innerHTML = `
            <td>${animal.id}</td>
            <td><strong>${animal.name}</strong></td>
            <td>${animal.type || 'Ismeretlen'}</td>
            <td>${animal.breed || 'Ismeretlen'}</td>
            <td>${animal.age || 'Ismeretlen'}</td>
            <td><span class="status-badge ${statusClass}"><i class="fas ${statusIcon}"></i> ${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm" onclick="window.openAnimalModal(${animal.id})" data-tooltip="Szerkesztés"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm" onclick="window.toggleAnimalAdopted(${animal.id})" data-tooltip="${animal.adopted ? 'Visszaállítás' : 'Örökbefogadottnak jelöl'}"><i class="fas ${animal.adopted ? 'fa-undo' : 'fa-check-circle'}"></i></button>
                    <button class="btn btn-sm" onclick="window.openDeleteModal('animal', ${animal.id}, '${animal.name}')" data-tooltip="Törlés"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// =========================
// FELHASZNÁLÓK TÁBLÁZAT
// =========================
function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="admin-empty-state"><i class="fas fa-users"></i><h3>Nincsenek felhasználók</h3></td></tr>`;
        return;
    }
    
    users.sort((a, b) => a.id - b.id).forEach(user => {
        const row = document.createElement('tr');
        const isAdmin = user.role === 'admin';
        
        row.innerHTML = `
            <td><strong>#${user.id}</strong></td>
            <td>${user.username || 'Ismeretlen'}</td>
            <td>${user.email || 'Nincs email'}</td>
            <td>${user.fullname || user.name || user.username || 'Ismeretlen'}</td>
            <td><span class="status-badge ${isAdmin ? 'status-approved' : 'status-pending'}"><i class="fas ${isAdmin ? 'fa-crown' : 'fa-user'}"></i> ${isAdmin ? 'Admin' : 'Felhasználó'}</span></td>
            <td>${formatDate(user.created_at)}</td>
            <td>
                <div class="action-buttons">
                    ${!isAdmin ? `<button class="btn btn-sm" onclick="window.openDeleteModal('user', ${user.id}, '${user.username}')" data-tooltip="Törlés"><i class="fas fa-trash"></i></button>` : '<span style="color: #999;">-</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// =========================
// ÖRÖKBEFOGADÁSOK TÁBLÁZAT
// =========================
function renderAdoptionsTable() {
    const tbody = document.getElementById('adoptionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (adoptions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="admin-empty-state"><i class="fas fa-heart"></i><h3>Nincsenek örökbefogadási kérelmek</h3></td></tr>`;
        return;
    }
    
    adoptions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(adoption => {
        const row = document.createElement('tr');
        const statusClass = getStatusClass(adoption.status);
        const statusText = getStatusText(adoption.status);
        
        row.innerHTML = `
            <td><strong>#${adoption.id}</strong></td>
            <td>${adoption.animal_name || 'Ismeretlen'}</td>
            <td>${adoption.full_name || 'Ismeretlen'}</td>
            <td>${adoption.email || 'Nincs email'}</td>
            <td>${adoption.phone || 'Nincs telefon'}</td>
            <td><span class="status-badge ${statusClass}"><i class="fas ${getStatusIcon(adoption.status)}"></i> ${statusText}</span></td>
            <td>${formatDate(adoption.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm" onclick="window.openStatusModal(${adoption.id})" data-tooltip="Státusz módosítása"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm" onclick="window.openDeleteModal('adoption', ${adoption.id}, '${adoption.animal_name || 'örökbefogadás'}')" data-tooltip="Törlés"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// =========================
// ÁLLAT MENTÉS
// =========================
window.openAnimalModal = function(animalId = null) {
    const modal = document.getElementById('addAnimalModal');
    if (!modal) {
        alert('A modal nem található!');
        return;
    }
    
    const title = modal.querySelector('h2');
    const form = document.getElementById('addAnimalForm');
    
    if (form) form.reset();
    
    if (animalId) {
        const animal = animals.find(a => a.id == animalId);
        if (animal) {
            if (title) title.innerHTML = '<i class="fas fa-paw"></i> Állat szerkesztése';
            
            // Töltsük ki a mezőket
            const nameInput = document.getElementById('addName');
            const typeSelect = document.getElementById('addType');
            const breedInput = document.getElementById('addBreed');
            const ageInput = document.getElementById('addAge');
            const genderSelect = document.getElementById('addGender');
            const sizeSelect = document.getElementById('addSize');
            const descInput = document.getElementById('addDescription');
            const imageInput = document.getElementById('addImage');
            const featuredCheck = document.getElementById('addFeatured');
            const urgentCheck = document.getElementById('addUrgent');
            const adoptedCheck = document.getElementById('addAdopted');
            
            if (nameInput) nameInput.value = animal.name || '';
            if (typeSelect) typeSelect.value = animal.type || '';
            if (breedInput) breedInput.value = animal.breed || '';
            if (ageInput) ageInput.value = animal.age || '';
            if (genderSelect) genderSelect.value = animal.gender || 'Hím';
            if (sizeSelect) sizeSelect.value = animal.size || 'kozepes';
            if (descInput) descInput.value = animal.description || '';
            if (imageInput) imageInput.value = animal.image || '';
            if (featuredCheck) featuredCheck.checked = animal.featured || false;
            if (urgentCheck) urgentCheck.checked = animal.urgent || false;
            if (adoptedCheck) adoptedCheck.checked = animal.adopted || false;
            
            // Tároljuk el az ID-t valahol
            if (form) {
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.id = 'animalId';
                idInput.name = 'id';
                idInput.value = animal.id;
                form.appendChild(idInput);
            }
        }
    } else {
        if (title) title.innerHTML = '<i class="fas fa-paw"></i> Új állat hozzáadása';
        
        // Távolítsuk el az ID mezőt ha van
        const existingId = document.getElementById('animalId');
        if (existingId) existingId.remove();
    }
    
    modal.style.display = 'flex';
};

window.closeAddAnimalModal = function() {
    const modal = document.getElementById('addAnimalModal');
    if (modal) modal.style.display = 'none';
    
    // Távolítsuk el az ID mezőt
    const existingId = document.getElementById('animalId');
    if (existingId) existingId.remove();
};

// Az eredeti closeAnimalModal függvény megtartása a kompatibilitás miatt
window.closeAnimalModal = window.closeAddAnimalModal;

window.saveAnimal = function(event) {
    if (event) event.preventDefault();
    
    try {
        const form = document.getElementById('addAnimalForm');
        if (!form) return;
        
        const idInput = document.getElementById('animalId');
        const id = idInput ? idInput.value : null;
        
        const nameInput = document.getElementById('addName');
        const typeSelect = document.getElementById('addType');
        const breedInput = document.getElementById('addBreed');
        const ageInput = document.getElementById('addAge');
        const genderSelect = document.getElementById('addGender');
        const sizeSelect = document.getElementById('addSize');
        const descInput = document.getElementById('addDescription');
        const imageInput = document.getElementById('addImage');
        const featuredCheck = document.getElementById('addFeatured');
        const urgentCheck = document.getElementById('addUrgent');
        const adoptedCheck = document.getElementById('addAdopted');
        
        const image = (imageInput ? imageInput.value.trim() : '') || 'img/default-animal.jpg';
        
        const animalData = {
            id: id ? parseInt(id) : generateNewId(),
            name: nameInput ? nameInput.value.trim() : '',
            type: typeSelect ? typeSelect.value : '',
            breed: (breedInput ? breedInput.value.trim() : '') || 'Ismeretlen',
            age: ageInput ? ageInput.value.trim() : '',
            ageValue: 0, // Egyszerűsítés
            gender: genderSelect ? genderSelect.value : 'Hím',
            size: (sizeSelect ? sizeSelect.value : '') || 'kozepes',
            ageCategory: 'felnott', // Alapértelmezett
            image: image,
            description: (descInput ? descInput.value.trim() : '') || 'Nincs leírás',
            featured: featuredCheck ? featuredCheck.checked : false,
            urgent: urgentCheck ? urgentCheck.checked : false,
            adopted: adoptedCheck ? adoptedCheck.checked : false
        };
        
        if (!animalData.name) { showError('A név megadása kötelező!'); return; }
        if (!animalData.type) { showError('A faj kiválasztása kötelező!'); return; }
        if (!animalData.age) { showError('A kor megadása kötelező!'); return; }
        
        if (id) {
            const index = animals.findIndex(a => a.id == id);
            if (index !== -1) animals[index] = { ...animals[index], ...animalData };
        } else {
            animals.push(animalData);
        }
        
        // Mentés API-ba is
        saveAnimalToAPI(animalData);
        
        saveToLocalStorage();
        updateUI();
        closeAddAnimalModal();
        showSuccess(id ? 'Állat sikeresen módosítva!' : 'Új állat sikeresen hozzáadva!');
    } catch (error) {
        showError(`Mentési hiba: ${error.message}`);
    }
};

// Űrlap eseménykezelő beállítása
document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('addAnimalForm');
    if (addForm) {
        addForm.addEventListener('submit', window.saveAnimal);
    }
});

async function saveAnimalToAPI(animalData) {
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`${API_BASE_URL}?action=animal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(animalData)
        });
        
        if (response.ok) {
            logDebug('Állat mentve API-ba');
        }
    } catch (error) {
        logDebug(`API mentési hiba: ${error.message}`);
    }
}

function generateNewId() {
    return animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1;
}

window.toggleAnimalAdopted = function(animalId) {
    const animal = animals.find(a => a.id == animalId);
    if (animal) {
        animal.adopted = !animal.adopted;
        saveToLocalStorage();
        updateUI();
        showSuccess(`Állat státusz módosítva: ${animal.adopted ? 'Örökbefogadott' : 'Elérhető'}`);
    }
};

// =========================
// STÁTUSZ MODAL
// =========================
window.openStatusModal = function(adoptionId) {
    const adoption = adoptions.find(a => a.id == adoptionId);
    if (!adoption) return;
    
    currentAdoptionId = adoptionId;
    
    const modal = document.getElementById('statusModal');
    if (modal) {
        document.getElementById('statusAnimalName').textContent = adoption.animal_name || 'Ismeretlen';
        document.getElementById('statusApplicantName').textContent = adoption.full_name || 'Ismeretlen';
        document.getElementById('statusCurrentStatus').innerHTML = `<span class="status-badge ${getStatusClass(adoption.status)}">${getStatusText(adoption.status)}</span>`;
        
        modal.style.display = 'flex';
    }
};

window.closeStatusModal = function() {
    const modal = document.getElementById('statusModal');
    if (modal) modal.style.display = 'none';
    currentAdoptionId = null;
};

window.updateAdoptionStatus = function(status) {
    if (!currentAdoptionId) return;
    
    const adoption = adoptions.find(a => a.id == currentAdoptionId);
    if (adoption) {
        // Régi státusz mentése
        const oldStatus = adoption.status;
        
        // Státusz frissítése
        adoption.status = status;
        
        // Ha elfogadva vagy teljesítve, akkor az állatot is jelöljük meg örökbefogadottként
        if (status === 'approved' || status === 'completed') {
            const animal = animals.find(a => a.id == adoption.animal_id);
            if (animal) {
                animal.adopted = true;
                logDebug(`Állat örökbefogadottnak jelölve: ${animal.name}`);
            }
        }
        
        // Ha visszavonjuk az elfogadást (pending-re állítjuk), akkor az állatot is visszaállítjuk
        if (oldStatus === 'approved' && status !== 'approved' && status !== 'completed') {
            const animal = animals.find(a => a.id == adoption.animal_id);
            if (animal) {
                const hasOtherApproved = adoptions.some(a => 
                    a.animal_id == adoption.animal_id && 
                    a.id != adoption.id && 
                    (a.status === 'approved' || a.status === 'completed')
                );
                
                if (!hasOtherApproved) {
                    animal.adopted = false;
                    logDebug(`Állat örökbefogadás visszavonva: ${animal.name}`);
                }
            }
        }
        
        saveToLocalStorage();
        // FRISSÍTJÜK A TIMESTAMP-ET, HOGY A PROFIL ÉRZÉKELJE A VÁLTOZÁST
        localStorage.setItem('adoptionsUpdated', Date.now().toString());
        
        updateUI();
        closeStatusModal();
        showSuccess(`Státusz módosítva: ${getStatusText(status)}`);
    }
};

// =========================
// TÖRLÉS
// =========================
window.openDeleteModal = function(type, id, name) {
    currentDeleteType = type;
    currentDeleteId = id;
    
    let icon = 'fa-exclamation-triangle';
    let title = '';
    
    switch(type) {
        case 'animal': icon = 'fa-paw'; title = 'Állat törlése'; break;
        case 'adoption': icon = 'fa-heart'; title = 'Örökbefogadás törlése'; break;
        case 'user': icon = 'fa-user'; title = 'Felhasználó törlése'; break;
    }
    
    const modal = document.getElementById('deleteModal');
    if (modal) {
        document.getElementById('deleteModalTitle').innerHTML = `<i class="fas ${icon}"></i> ${title}`;
        document.getElementById('deleteItemInfo').innerHTML = `<i class="fas ${icon}" style="font-size: 2rem; color: #e74c3c; margin-bottom: 10px; display: block;"></i><strong>${name}</strong>`;
        
        modal.style.display = 'flex';
    }
};

window.closeDeleteModal = function() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none';
    currentDeleteType = null;
    currentDeleteId = null;
};

window.confirmDelete = function() {
    if (!currentDeleteType || !currentDeleteId) return;
    
    let deletedName = '';
    
    switch(currentDeleteType) {
        case 'animal':
            const animal = animals.find(a => a.id == currentDeleteId);
            deletedName = animal?.name || 'Ismeretlen';
            
            // Töröljük a kapcsolódó örökbefogadásokat is
            adoptions = adoptions.filter(a => a.animal_id != currentDeleteId);
            animals = animals.filter(a => a.id != currentDeleteId);
            break;
        case 'adoption':
            const adoption = adoptions.find(a => a.id == currentDeleteId);
            deletedName = adoption?.animal_name || 'örökbefogadás';
            adoptions = adoptions.filter(a => a.id != currentDeleteId);
            break;
        case 'user':
            const user = users.find(u => u.id == currentDeleteId);
            deletedName = user?.username || 'felhasználó';
            
            // A felhasználóhoz tartozó örökbefogadások user_id-jét nullázzuk
            if (user) {
                adoptions.forEach(a => {
                    if (a.user_id == currentDeleteId) {
                        a.user_id = null;
                    }
                });
            }
            
            users = users.filter(u => u.id != currentDeleteId);
            break;
    }
    
    saveToLocalStorage();
    updateUI();
    closeDeleteModal();
    showSuccess(`Sikeres törlés: ${deletedName}`);
};

// =========================
// NAVIGÁCIÓ
// =========================
window.showAdminSection = function(section) {
    currentSection = section;
    document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.admin-card').forEach(card => card.style.display = 'none');
    
    let sectionId = '';
    if (section === 'animals') sectionId = 'animalsSection';
    else if (section === 'adoptions') sectionId = 'adoptionsSection';
    else if (section === 'users') sectionId = 'usersSection';
    else if (section === 'stats') sectionId = 'statsSection';
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        if (section === 'stats') renderStats();
    }
};

// =========================
// SEGÉDFÜGGVÉNYEK
// =========================
function formatDate(dateString) {
    if (!dateString) return 'Ismeretlen';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return dateString; }
}

function getStatusClass(status) {
    switch(status) {
        case 'pending': return 'status-pending';
        case 'approved': return 'status-approved';
        case 'completed': return 'status-completed';
        case 'rejected': return 'status-rejected';
        default: return 'status-pending';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Függőben';
        case 'approved': return 'Elfogadva';
        case 'completed': return 'Teljesítve';
        case 'rejected': return 'Elutasítva';
        default: return 'Függőben';
    }
}

function getStatusIcon(status) {
    switch(status) {
        case 'pending': return 'fa-clock';
        case 'approved': return 'fa-check-circle';
        case 'completed': return 'fa-heart';
        case 'rejected': return 'fa-times-circle';
        default: return 'fa-clock';
    }
}

function renderStats() {
    const tbody = document.getElementById('statsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr><td colspan="2" style="padding: 20px;">
            <div style="display: grid; gap: 15px;">
                <div class="info-item"><strong>Összes állat:</strong> ${animals.length}</div>
                <div class="info-item"><strong>Örökbefogadott állatok:</strong> ${animals.filter(a => a.adopted).length}</div>
                <div class="info-item"><strong>Kiemelt állatok:</strong> ${animals.filter(a => a.featured && !a.adopted).length}</div>
                <div class="info-item"><strong>Sürgős esetek:</strong> ${animals.filter(a => a.urgent && !a.adopted).length}</div>
                <div class="info-item"><strong>Összes örökbefogadási kérelem:</strong> ${adoptions.length}</div>
                <div class="info-item"><strong>Függőben lévő kérelmek:</strong> ${adoptions.filter(a => a.status === 'pending').length}</div>
                <div class="info-item"><strong>Elfogadott kérelmek:</strong> ${adoptions.filter(a => a.status === 'approved').length}</div>
                <div class="info-item"><strong>Teljesített kérelmek:</strong> ${adoptions.filter(a => a.status === 'completed').length}</div>
                <div class="info-item"><strong>Elutasított kérelmek:</strong> ${adoptions.filter(a => a.status === 'rejected').length}</div>
                <div class="info-item"><strong>Összes felhasználó:</strong> ${users.length}</div>
                <div class="info-item"><strong>Adminisztrátorok:</strong> ${users.filter(u => u.role === 'admin').length}</div>
            </div>
        </td></tr>
    `;
}

// =========================
// ESEMÉNYKEZELŐK
// =========================
function setupEventListeners() {
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const closeDelete = document.getElementById('closeDeleteModal');
    
    if (confirmDelete) confirmDelete.addEventListener('click', confirmDelete);
    if (cancelDelete) cancelDelete.addEventListener('click', closeDeleteModal);
    if (closeDelete) closeDelete.addEventListener('click', closeDeleteModal);
    
    const approveBtn = document.getElementById('approveAdoption');
    const rejectBtn = document.getElementById('rejectAdoption');
    const pendingBtn = document.getElementById('pendingAdoption');
    const completeBtn = document.getElementById('completeAdoption');
    const cancelStatus = document.getElementById('cancelStatusBtn');
    const closeStatus = document.getElementById('closeStatusModal');
    
    if (approveBtn) approveBtn.addEventListener('click', () => updateAdoptionStatus('approved'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => updateAdoptionStatus('rejected'));
    if (pendingBtn) pendingBtn.addEventListener('click', () => updateAdoptionStatus('pending'));
    if (completeBtn) completeBtn.addEventListener('click', () => updateAdoptionStatus('completed'));
    if (cancelStatus) cancelStatus.addEventListener('click', closeStatusModal);
    if (closeStatus) closeStatus.addEventListener('click', closeStatusModal);
}

function setupModals() {
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('admin-modal')) {
            e.target.style.display = 'none';
        }
    });
}

// =========================
// KIJELENTKEZÉS
// =========================
window.logout = function() {
    if (confirm('Biztosan ki szeretnél jelentkezni?')) {
        fetch(`${API_BASE_URL}?action=logout`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` } 
        }).finally(() => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            window.location.reload();
        });
    }
};

// =========================
// MEGJELENÍTÉS
// =========================
// =========================
// ÁLLAT MODAL MEGNYITÁS - JAVÍTVA
// =========================
window.showAddAnimalModal = function() {
    console.log('showAddAnimalModal hívva');
    window.openAnimalModal();
};

window.openAnimalModal = function(animalId = null) {
    console.log('openAnimalModal hívva, animalId:', animalId);
    
    const modal = document.getElementById('addAnimalModal');
    if (!modal) {
        console.error('Modal nem található! ID: addAnimalModal');
        alert('Hiba: A modal nem található!');
        return;
    }
    
    console.log('Modal megtalálva:', modal);
    
    const title = modal.querySelector('h2');
    const form = document.getElementById('addAnimalForm');
    
    if (form) {
        console.log('Űrlap alaphelyzetbe állítva');
        form.reset();
    }
    
    if (animalId) {
        const animal = animals.find(a => a.id == animalId);
        if (animal) {
            console.log('Állat szerkesztése:', animal);
            if (title) title.innerHTML = '<i class="fas fa-paw"></i> Állat szerkesztése';
            
            // Töltsük ki a mezőket
            const nameInput = document.getElementById('addName');
            const typeSelect = document.getElementById('addType');
            const breedInput = document.getElementById('addBreed');
            const ageInput = document.getElementById('addAge');
            const genderSelect = document.getElementById('addGender');
            const sizeSelect = document.getElementById('addSize');
            const descInput = document.getElementById('addDescription');
            const imageInput = document.getElementById('addImage');
            const featuredCheck = document.getElementById('addFeatured');
            const urgentCheck = document.getElementById('addUrgent');
            const adoptedCheck = document.getElementById('addAdopted');
            
            if (nameInput) nameInput.value = animal.name || '';
            if (typeSelect) typeSelect.value = animal.type || '';
            if (breedInput) breedInput.value = animal.breed || '';
            if (ageInput) ageInput.value = animal.age || '';
            if (genderSelect) genderSelect.value = animal.gender || 'Hím';
            if (sizeSelect) sizeSelect.value = animal.size || 'kozepes';
            if (descInput) descInput.value = animal.description || '';
            if (imageInput) imageInput.value = animal.image || '';
            if (featuredCheck) featuredCheck.checked = animal.featured || false;
            if (urgentCheck) urgentCheck.checked = animal.urgent || false;
            if (adoptedCheck) adoptedCheck.checked = animal.adopted || false;
            
            // Tároljuk el az ID-t valahol
            if (form) {
                // Először töröljük a régi ID mezőt ha van
                const oldId = document.getElementById('animalId');
                if (oldId) oldId.remove();
                
                const idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.id = 'animalId';
                idInput.name = 'id';
                idInput.value = animal.id;
                form.appendChild(idInput);
            }
        }
    } else {
        console.log('Új állat hozzáadása');
        if (title) title.innerHTML = '<i class="fas fa-paw"></i> Új állat hozzáadása';
        
        // Távolítsuk el az ID mezőt ha van
        const existingId = document.getElementById('animalId');
        if (existingId) existingId.remove();
    }
    
    console.log('Modal megjelenítése');
    modal.style.display = 'flex';
};

window.closeAddAnimalModal = function() {
    console.log('closeAddAnimalModal hívva');
    const modal = document.getElementById('addAnimalModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Modal elrejtve');
    }
    
    // Távolítsuk el az ID mezőt
    const existingId = document.getElementById('animalId');
    if (existingId) existingId.remove();
};

// Admin oldal specifikus függvények
if (document.getElementById('addAnimalModal')) {
    console.log('Admin oldal észlelve, modálok beállítva');
}
// profile.js - JAVÍTOTT VERZIÓ VALÓS IDEJŰ FRISSÍTÉSSEL
// MOST MÁR REAGÁL AZ ADMIN ÁLTAL VÉGREHAJTOTT VÁLTOZÁSOKRA IS!

let currentUser = null;
let userAdoptions = [];
let userAnimals = [];
let userActivity = [];
let lastUpdateCheck = 0;

const API_BASE_URL = 'api.php';

// ==================== DEBUG FUNKCIÓK ====================

function logDebug(message, data = null) {
    console.log(`[PROFIL] ${message}`, data || '');
    if (typeof showDebugInfo === 'function') {
        showDebugInfo(message);
    }
}

function showErrorMessage(message) {
    console.error(`[PROFIL HIBA] ${message}`);
    if (typeof window.showError === 'function') {
        window.showError(message);
    }
}

// ==================== OLDAL BETÖLTÉS ====================

document.addEventListener('DOMContentLoaded', async function() {
    logDebug('Profil oldal betöltődött');
    
    document.getElementById('logoutBtn').style.display = 'block';
    
    await checkAuth();
    
    if (currentUser) {
        logDebug('Felhasználó bejelentkezve, adatok betöltése...');
        
        setLoadingState(true);
        
        try {
            await Promise.all([
                loadUserAdoptions(),
                loadUserActivity()
            ]);
            
            logDebug('Minden adat sikeresen betöltődött');
            updateUI();
            
            // Alapértelmezett szekció megjelenítése
            showSection('profile');
            
            // Figyeljük a localStorage változásait (ha admin módosítja az adoptionsUpdated-et)
            window.addEventListener('storage', function(e) {
                if (e.key === 'adoptionsUpdated' || e.key === 'animalsUpdated') {
                    logDebug('Észlelt változás a localStorage-ban, adatok újratöltése...');
                    autoRefreshData();
                }
            });
            
            // Automatikus frissítés 10 másodpercenként (gyakrabban, hogy látszódjon a változás)
            setInterval(autoRefreshData, 10000);
            
        } catch (error) {
            showErrorMessage(`Adatok betöltése sikertelen: ${error.message}`);
            updateUIFromLocalStorage();
        } finally {
            setLoadingState(false);
        }
    } else {
        showErrorMessage('A profil megtekintéséhez be kell jelentkezned!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    const backBtn = document.getElementById('profileBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// ==================== NAVIGÁCIÓ - SZEKCIÓVÁLTÁSKOR FRISSÍTÉS ====================

window.showSection = function(sectionId) {
    logDebug(`Navigáció: ${sectionId} szakasz`);
    
    // Összes szekció elrejtése
    document.querySelectorAll('.profile-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // A kiválasztott szekció megjelenítése
    const targetSection = document.getElementById(sectionId + 'Section');
    if (targetSection) {
        targetSection.style.display = 'block';
        logDebug(`Szekció megjelenítve: ${sectionId}Section`);
        
        // Ha az örökbefogadások szekciót nyitjuk meg, frissítsük az adatokat
        if (sectionId === 'adoptions') {
            logDebug('Örökbefogadások szekció megnyitva, adatok frissítése...');
            autoRefreshData();
        }
    } else {
        logDebug(`Szekció nem található: ${sectionId}Section`);
        const profileSection = document.getElementById('profileSection');
        if (profileSection) {
            profileSection.style.display = 'block';
        }
    }
    
    // Aktív link kijelölése
    document.querySelectorAll('.profile-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    const linkTexts = {
        'profile': 'Profil adatok',
        'adoptions': 'Örökbefogadásaim',
        'activity': 'Tevékenységeim',
        'settings': 'Beállítások'
    };
    
    document.querySelectorAll('.profile-nav a').forEach(link => {
        if (link.textContent.includes(linkTexts[sectionId])) {
            link.classList.add('active');
        }
    });
};

// ==================== AUTOMATIKUS FRISSÍTÉS ====================

async function autoRefreshData() {
    const now = Date.now();
    // Ne frissítsünk túl gyakran (min. 3 másodperc)
    if (now - lastUpdateCheck < 3000) {
        return;
    }
    lastUpdateCheck = now;
    
    logDebug('Automatikus adatfrissítés...');
    
    const oldAdoptionsCount = userAdoptions.length;
    const oldAdoptionsStatuses = userAdoptions.map(a => ({ id: a.id, status: a.status }));
    
    await loadUserAdoptions();
    await loadUserActivity();
    
    // Ellenőrizzük, hogy történt-e változás a státuszokban
    let statusChanged = false;
    if (oldAdoptionsCount !== userAdoptions.length) {
        statusChanged = true;
    } else {
        // Összehasonlítjuk a státuszokat
        for (let i = 0; i < userAdoptions.length; i++) {
            const oldStatus = oldAdoptionsStatuses.find(s => s.id === userAdoptions[i].id)?.status;
            if (oldStatus && oldStatus !== userAdoptions[i].status) {
                statusChanged = true;
                break;
            }
        }
    }
    
    if (statusChanged) {
        logDebug('Változás történt az adatokban (státusz módosult), UI frissítése...');
        updateUI();
        
        // Ha az adoptions szekció látható, frissítsük a megjelenítést
        const adoptionsSection = document.getElementById('adoptionsSection');
        if (adoptionsSection && adoptionsSection.style.display === 'block') {
            renderAdoptions();
        }
        
        // Értesítés a felhasználónak
        showTemporaryNotification('Az örökbefogadás státusza frissült!');
    }
}

function showTemporaryNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = `<i class="fas fa-sync-alt"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== HITELESÍTÉS ====================

async function checkAuth() {
    try {
        logDebug('Hitelesítés ellenőrzése...');
        
        const token = localStorage.getItem('userToken');
        if (!token) {
            logDebug('Nincs token a localStorage-ban');
            currentUser = null;
            return;
        }
        
        logDebug(`Token megtalálva: ${token.substring(0, 20)}...`);
        
        try {
            const response = await fetch(`${API_BASE_URL}?action=user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            logDebug(`Válasz státusz: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                logDebug('API válasz:', data);
                
                if (data.id || data.username) {
                    currentUser = {
                        id: data.id || 0,
                        username: data.username || 'Ismeretlen',
                        email: data.email || 'Nincs email',
                        fullname: data.fullname || data.name || data.username,
                        role: data.role || 'user',
                        created_at: data.created_at || new Date().toISOString()
                    };
                } else if (data.user) {
                    currentUser = {
                        id: data.user.id || 0,
                        username: data.user.username || 'Ismeretlen',
                        email: data.user.email || 'Nincs email',
                        fullname: data.user.fullname || data.user.name || data.user.username,
                        role: data.user.role || 'user',
                        created_at: data.user.created_at || new Date().toISOString()
                    };
                }
            }
        } catch (error) {
            logDebug(`API hiba: ${error.message}`);
        }
        
        if (!currentUser) {
            const localData = localStorage.getItem('userData');
            if (localData) {
                try {
                    currentUser = JSON.parse(localData);
                    logDebug('Helyi adatokból betöltve:', currentUser);
                } catch (e) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userData');
                }
            } else {
                localStorage.removeItem('userToken');
            }
        }
        
        if (currentUser) {
            logDebug('Felhasználó sikeresen betöltve:', currentUser);
            localStorage.setItem('userData', JSON.stringify(currentUser));
            localStorage.setItem('username', currentUser.username);
        }
        
    } catch (error) {
        showErrorMessage(`Hitelesítési hiba: ${error.message}`);
        currentUser = null;
    }
}

// ==================== ÖRÖKBEFOGADÁSOK BETÖLTÉSE - JAVÍTVA ====================

async function loadUserAdoptions() {
    try {
        const token = localStorage.getItem('userToken');
        if (!token || !currentUser) {
            logDebug('Nincs token vagy felhasználó, örökbefogadások kihagyva');
            return;
        }
        
        if (currentUser.role === 'admin') {
            logDebug('Admin felhasználó, örökbefogadások nem jelennek meg');
            userAdoptions = [];
            return;
        }
        
        logDebug('Örökbefogadások betöltése...');
        
        // 1. PRÓBÁLKOZÁS: my_adoptions végpont
        try {
            const response = await fetch(`${API_BASE_URL}?action=my_adoptions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                logDebug('my_adoptions válasz:', data);
                
                if (data.success && data.adoptions) {
                    // MINDEN státuszú örökbefogadást megtartunk
                    userAdoptions = data.adoptions;
                    logDebug(`${userAdoptions.length} örökbefogadás betöltve API-ból`);
                    
                    if (userAdoptions.length > 0) {
                        await loadAnimalsForAdoptions();
                    }
                    return;
                }
            }
        } catch (error) {
            logDebug(`my_adoptions végpont hiba: ${error.message}`);
        }
        
        // 2. PRÓBÁLKOZÁS: get_adoptions végpont
        try {
            const response = await fetch(`${API_BASE_URL}?action=get_adoptions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                let allAdoptions = [];
                if (Array.isArray(data)) {
                    allAdoptions = data;
                } else if (data.adoptions) {
                    allAdoptions = data.adoptions;
                }
                
                // MINDEN státuszú örökbefogadást megtartunk
                userAdoptions = allAdoptions.filter(adoption => 
                    adoption.user_id == currentUser.id
                );
                
                logDebug(`${userAdoptions.length} örökbefogadás betöltve (minden státusz)`);
                
                if (userAdoptions.length > 0) {
                    await loadAnimalsForAdoptions();
                }
                return;
            }
        } catch (error) {
            logDebug(`get_adoptions végpont hiba: ${error.message}`);
        }
        
        // 3. PRÓBÁLKOZÁS: DEMO adatok
        if (currentUser.role !== 'admin') {
            await loadDemoAdoptions();
        }
        
    } catch (error) {
        showErrorMessage(`Örökbefogadások betöltési hiba: ${error.message}`);
        userAdoptions = [];
    }
}

// ==================== DEMO ÖRÖKBEFOGADÁSOK ====================

async function loadDemoAdoptions() {
    logDebug('Demo örökbefogadások generálása...');
    
    await loadDemoAnimals();
    
    if (userAnimals.length > 0) {
        const now = new Date();
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        
        userAdoptions = [
            {
                id: 1,
                user_id: currentUser.id,
                animal_id: userAnimals[0].id,
                status: 'pending',
                full_name: currentUser.fullname || currentUser.username,
                email: currentUser.email || 'pelda@email.hu',
                phone: '+36 20 123 4567',
                home_type: 'haz_kerttel',
                address: '1234 Budapest, Példa utca 1.',
                experience: 'Volt már kutyám, tapasztalt gazdi vagyok.',
                message: 'Nagyon szeretném örökbefogadni ezt az állatkát!',
                created_at: now.toISOString(),
                animal_name: userAnimals[0].name,
                animal_image: userAnimals[0].image,
                animal_type: userAnimals[0].type,
                animal_breed: userAnimals[0].breed,
                animal_age: userAnimals[0].age,
                animal_gender: userAnimals[0].gender,
                animal_description: userAnimals[0].description
            }
        ];
        
        if (userAnimals.length > 1) {
            userAdoptions.push({
                id: 2,
                user_id: currentUser.id,
                animal_id: userAnimals[1].id,
                status: 'approved',
                full_name: currentUser.fullname || currentUser.username,
                email: currentUser.email || 'pelda@email.hu',
                phone: '+36 20 123 4567',
                home_type: 'lakas',
                address: '1234 Budapest, Példa utca 1.',
                experience: 'Van macskám, tapasztalt gazdi vagyok.',
                message: 'Szeretném örökbefogadni ezt a cicát!',
                created_at: twoDaysAgo.toISOString(),
                animal_name: userAnimals[1].name,
                animal_image: userAnimals[1].image,
                animal_type: userAnimals[1].type,
                animal_breed: userAnimals[1].breed,
                animal_age: userAnimals[1].age,
                animal_gender: userAnimals[1].gender,
                animal_description: userAnimals[1].description
            });
        }
        
        logDebug(`${userAdoptions.length} demo örökbefogadás generálva`);
    }
}

// ==================== ÁLLATOK BETÖLTÉSE ====================

async function loadAnimalsForAdoptions() {
    try {
        logDebug('Állatok betöltése...');
        
        const response = await fetch(`${API_BASE_URL}?action=animals`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (Array.isArray(data)) {
                userAnimals = data;
            } else if (data.animals) {
                userAnimals = data.animals;
            } else if (data.data) {
                userAnimals = data.data;
            }
            
            logDebug(`${userAnimals.length} állat betöltve API-ból`);
        }
    } catch (error) {
        logDebug(`Állatok betöltési hiba: ${error.message}`);
        await loadDemoAnimals();
    }
}

async function loadDemoAnimals() {
    logDebug('Demo állatok betöltése...');
    
    userAnimals = [
        {
            id: 1,
            name: 'Füles',
            type: 'kutya',
            breed: 'Labrador keverék',
            age: '2 éves',
            gender: 'Hím',
            description: 'Füles egy kedves, bújós és kíváncsi kutya, aki imád játszani és sétálni.',
            image: 'img/kep1.jpg'
        },
        {
            id: 2,
            name: 'Bea',
            type: 'macska',
            breed: 'Rövidszőrű cirmos',
            age: '3 éves',
            gender: 'Nőstény',
            description: 'Bea egy nyugodt, figyelmes cica, aki szeret bekuckózni.',
            image: 'img/kep2.jpg'
        },
        {
            id: 3,
            name: 'Bodri',
            type: 'kutya',
            breed: 'Beagle',
            age: '1 éves',
            gender: 'Hím',
            description: 'Bodri egy kíváncsi és vidám kutya.',
            image: 'img/kep3.jpg'
        },
        {
            id: 4,
            name: 'Cirmoska',
            type: 'macska',
            breed: 'Házimacska',
            age: '5 éves',
            gender: 'Nőstény',
            description: 'Cirmoska egy kedves, visszahúzódó macska.',
            image: 'img/kep4.jpg'
        }
    ];
    
    logDebug(`${userAnimals.length} demo állat betöltve`);
}

// ==================== TEVÉKENYSÉGEK BETÖLTÉSE ====================

async function loadUserActivity() {
    try {
        logDebug('Tevékenységek betöltése...');
        
        userActivity = [
            {
                id: 1,
                type: 'login',
                description: 'Bejelentkezés',
                date: new Date().toISOString(),
                icon: 'fa-sign-in-alt'
            },
            {
                id: 2,
                type: 'profile_view',
                description: 'Profil megtekintése',
                date: new Date(Date.now() - 3600000).toISOString(),
                icon: 'fa-user'
            }
        ];
        
        if (userAdoptions.length > 0) {
            userAdoptions.forEach(adoption => {
                userActivity.push({
                    id: adoption.id,
                    type: 'adoption',
                    description: `Örökbefogadási jelentkezés: ${adoption.animal_name || 'Ismeretlen állat'}`,
                    date: adoption.created_at,
                    icon: 'fa-heart',
                    status: adoption.status
                });
            });
        }
        
        userActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
        logDebug(`${userActivity.length} tevékenység betöltve`);
        
    } catch (error) {
        logDebug(`Tevékenységek betöltési hiba: ${error.message}`);
        userActivity = [];
    }
}

// ==================== UI FRISSÍTÉS ====================

function updateUI() {
    if (!currentUser) {
        showErrorMessage('Nincs felhasználói adat az UI frissítéséhez');
        return;
    }
    
    logDebug('UI frissítése...');
    
    try {
        document.getElementById('userFullName').textContent = currentUser.fullname || currentUser.username;
        
        const avatar = document.getElementById('userAvatar');
        const initials = getInitials(currentUser.fullname || currentUser.username);
        avatar.innerHTML = `<span style="font-size: 2.5rem; font-weight: bold;">${initials}</span>`;
        
        const roleBadge = document.getElementById('userRoleBadge');
        roleBadge.innerHTML = `<i class="fas fa-${currentUser.role === 'admin' ? 'crown' : 'user'}"></i> ${currentUser.role === 'admin' ? 'Adminisztrátor' : 'Felhasználó'}`;
        
        document.getElementById('totalAdoptionsStat').textContent = userAdoptions.length;
        document.getElementById('activityCount').textContent = userActivity.length;
        document.getElementById('adoptionsCount').textContent = `${userAdoptions.length} örökbefogadás`;
        
        renderProfileInfo();
        renderAdoptions();
        renderActivity();
        
        logDebug('UI sikeresen frissítve');
        
    } catch (error) {
        showErrorMessage(`UI frissítési hiba: ${error.message}`);
    }
}

function updateUIFromLocalStorage() {
    logDebug('Vészhelyzeti UI frissítés localStorage adatokkal');
    
    try {
        const username = localStorage.getItem('username') || 'Felhasználó';
        const userDataStr = localStorage.getItem('userData');
        
        document.getElementById('userFullName').textContent = username;
        
        const avatar = document.getElementById('userAvatar');
        const initials = getInitials(username);
        avatar.innerHTML = `<span style="font-size: 2.5rem; font-weight: bold;">${initials}</span>`;
        
        const profileInfo = document.getElementById('profileInfo');
        const profileLoading = document.getElementById('profileLoading');
        
        profileLoading.style.display = 'none';
        profileInfo.style.display = 'grid';
        
        let email = 'Nincs adat';
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                email = userData.email || 'Nincs adat';
            } catch (e) {}
        }
        
        profileInfo.innerHTML = `
            <div class="info-item">
                <div class="info-label">Felhasználónév</div>
                <div class="info-value">${username}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email cím</div>
                <div class="info-value">${email}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Bejelentkezési mód</div>
                <div class="info-value" style="color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle"></i> Helyi adatok
                </div>
            </div>
        `;
        
        showErrorMessage('Az API szerver nem elérhető. Helyi adatok jelennek meg.');
        
    } catch (error) {
        showErrorMessage(`Helyi UI frissítési hiba: ${error.message}`);
    }
}

function setLoadingState(isLoading) {
    const loadings = document.querySelectorAll('.loading');
    loadings.forEach(loading => {
        loading.style.display = isLoading ? 'block' : 'none';
    });
    
    if (!isLoading) {
        document.getElementById('profileInfo').style.display = 'grid';
        document.getElementById('adoptionsList').style.display = userAdoptions.length > 0 ? 'grid' : 'none';
        document.getElementById('activityList').style.display = userActivity.length > 0 ? 'block' : 'none';
        document.getElementById('noAdoptions').style.display = userAdoptions.length === 0 ? 'block' : 'none';
        document.getElementById('noActivity').style.display = userActivity.length === 0 ? 'block' : 'none';
    }
}

function getInitials(name) {
    if (!name) return '??';
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// ==================== PROFIL ADATOK ====================

function renderProfileInfo() {
    const profileInfo = document.getElementById('profileInfo');
    const loading = document.getElementById('profileLoading');
    
    loading.style.display = 'none';
    profileInfo.style.display = 'grid';
    
    profileInfo.innerHTML = `
        <div class="info-item">
            <div class="info-label">Felhasználónév</div>
            <div class="info-value">${currentUser.username || 'Ismeretlen'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email cím</div>
            <div class="info-value">${currentUser.email || 'Nincs megadva'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Teljes név</div>
            <div class="info-value">${currentUser.fullname || '-'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Felhasználói státusz</div>
            <div class="info-value" style="color: #27ae60;">
                <i class="fas fa-check-circle"></i> Aktív
            </div>
        </div>
        <div class="info-item">
            <div class="info-label">Örökbefogadások</div>
            <div class="info-value">${userAdoptions.length} db</div>
        </div>
        <div class="info-item">
            <div class="info-label">Tagság kezdete</div>
            <div class="info-value">${formatDate(currentUser.created_at)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Felhasználói ID</div>
            <div class="info-value">#${currentUser.id}</div>
        </div>
    `;
}

// ==================== ÖRÖKBEFOGADÁSOK RENDERELÉSE ====================

function renderAdoptions() {
    const adoptionsList = document.getElementById('adoptionsList');
    const loading = document.getElementById('adoptionsLoading');
    const noAdoptions = document.getElementById('noAdoptions');
    
    loading.style.display = 'none';
    
    if (userAdoptions.length === 0) {
        noAdoptions.style.display = 'block';
        adoptionsList.style.display = 'none';
        return;
    }
    
    noAdoptions.style.display = 'none';
    adoptionsList.style.display = 'grid';
    adoptionsList.innerHTML = '';
    
    userAdoptions.forEach(adoption => {
        let animal = null;
        
        if (adoption.animal_id) {
            animal = userAnimals.find(a => a.id == adoption.animal_id);
        }
        
        if (!animal) {
            animal = {
                id: adoption.animal_id || 1,
                name: adoption.animal_name || 'Ismeretlen állat',
                type: adoption.animal_type || 'kutya',
                breed: adoption.animal_breed || 'Keverék',
                age: adoption.animal_age || 'Ismeretlen',
                gender: adoption.animal_gender || 'Hím',
                description: adoption.animal_description || 'Az állat adatai nem elérhetőek.',
                image: adoption.animal_image || 'img/default-animal.jpg',
                adopted: adoption.status === 'approved' || adoption.status === 'completed'
            };
        } else {
            if (adoption.status === 'approved' || adoption.status === 'completed') {
                animal.adopted = true;
            }
        }
        
        const statusClass = getStatusClass(adoption.status);
        const statusText = getStatusText(adoption.status);
        
        let statusIcon = 'fa-clock';
        if (adoption.status === 'approved') statusIcon = 'fa-check-circle';
        else if (adoption.status === 'completed') statusIcon = 'fa-heart';
        else if (adoption.status === 'rejected') statusIcon = 'fa-times-circle';
        
        const adoptionCard = document.createElement('div');
        adoptionCard.className = 'adoption-card';
        
        const adoptedBadge = animal.adopted ? '<span class="adopted-badge-small"><i class="fas fa-home"></i> Örökbefogadva</span>' : '';
        
        adoptionCard.innerHTML = `
            <div class="adoption-image">
                <img src="${animal.image || 'img/default-animal.jpg'}" 
                     alt="${animal.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                ${animal.adopted ? '<div class="adopted-overlay"><i class="fas fa-check-circle"></i> Örökbefogadva</div>' : ''}
            </div>
            <div class="adoption-info">
                <h4>${animal.name} ${adoptedBadge}</h4>
                <p class="adoption-description">${animal.description || 'Nincs leírás'}</p>
                
                <div class="adoption-meta">
                    <span><i class="fas fa-paw"></i> ${animal.type === 'kutya' ? 'Kutya' : animal.type === 'macska' ? 'Macska' : 'Egyéb'}</span>
                    <span><i class="fas fa-dna"></i> ${animal.breed || 'Keverék'}</span>
                    <span><i class="fas fa-birthday-cake"></i> ${animal.age || 'Ismeretlen'}</span>
                    <span><i class="fas fa-${animal.gender === 'Hím' ? 'mars' : 'venus'}"></i> ${animal.gender || 'Ismeretlen'}</span>
                </div>
                
                <div class="status-badge ${statusClass}">
                    <i class="fas ${statusIcon}"></i> ${statusText}
                </div>
                
                <div class="adoption-date">
                    <i class="far fa-calendar"></i>
                    Jelentkezés dátuma: ${formatDate(adoption.created_at)}
                </div>
                
                ${adoption.message ? `
                    <div style="margin-top: 15px; padding: 10px; background: white; border-radius: 5px; border-left: 3px solid var(--accent);">
                        <strong>Üzeneted:</strong> ${adoption.message}
                    </div>
                ` : ''}
            </div>
        `;
        
        adoptionsList.appendChild(adoptionCard);
    });
}

// ==================== TEVÉKENYSÉGEK RENDERELÉSE ====================

function renderActivity() {
    const activityList = document.getElementById('activityList');
    const loading = document.getElementById('activityLoading');
    const noActivity = document.getElementById('noActivity');
    
    loading.style.display = 'none';
    
    if (userActivity.length === 0) {
        noActivity.style.display = 'block';
        activityList.style.display = 'none';
        return;
    }
    
    noActivity.style.display = 'none';
    activityList.style.display = 'block';
    
    let html = '<div class="activity-timeline" style="position: relative; padding-left: 30px;">';
    html += '<div style="position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; background: var(--primary-light);"></div>';
    
    userActivity.forEach((activity) => {
        const icon = activity.icon || 'fa-circle';
        const timeAgo = getTimeAgo(activity.date);
        
        html += `
            <div style="position: relative; margin-bottom: 30px; padding-left: 20px;">
                <div style="position: absolute; left: -10px; top: 5px; width: 20px; height: 20px; border-radius: 50%; background: var(--accent); border: 3px solid white; box-shadow: 0 0 0 3px var(--primary-light);"></div>
                
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="width: 40px; height: 40px; background: var(--primary-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0;">
                        <i class="fas ${icon}"></i>
                    </div>
                    
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333; margin-bottom: 5px;">
                            ${activity.description}
                        </div>
                        <div style="font-size: 0.9rem; color: #666;">
                            <i class="far fa-clock"></i> ${timeAgo}
                        </div>
                        
                        ${activity.status ? `
                            <div style="margin-top: 10px;">
                                <span class="status-badge ${getStatusClass(activity.status)}" style="font-size: 0.8rem; padding: 3px 10px;">
                                    ${getStatusText(activity.status)}
                                </span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    activityList.innerHTML = html;
}

// ==================== SEGÉDFÜGGVÉNYEK ====================

function formatDate(dateString) {
    if (!dateString) return 'Ismeretlen dátum';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Ismeretlen dátum';
        }
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Ismeretlen dátum';
    }
}

function getTimeAgo(dateString) {
    if (!dateString) return 'ismeretlen időpont';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'ismeretlen időpont';
        }
        
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'épp most';
        if (diffMins < 60) return `${diffMins} perce`;
        if (diffHours < 24) return `${diffHours} órája`;
        if (diffDays < 7) return `${diffDays} napja`;
        return formatDate(dateString);
    } catch (error) {
        return 'ismeretlen időpont';
    }
}

function getStatusClass(status) {
    if (!status) return 'status-pending';
    
    switch(status.toLowerCase()) {
        case 'pending': return 'status-pending';
        case 'approved': return 'status-approved';
        case 'completed': return 'status-completed';
        case 'rejected': return 'status-rejected';
        default: return 'status-pending';
    }
}

function getStatusText(status) {
    if (!status) return 'Függőben';
    
    switch(status.toLowerCase()) {
        case 'pending': return 'Függőben';
        case 'approved': return 'Elfogadva';
        case 'completed': return 'Teljesítve';
        case 'rejected': return 'Elutasítva';
        default: return 'Függőben';
    }
}

function getStatusIcon(status) {
    if (!status) return 'clock';
    
    switch(status.toLowerCase()) {
        case 'pending': return 'clock';
        case 'approved': return 'check-circle';
        case 'completed': return 'heart';
        case 'rejected': return 'times-circle';
        default: return 'clock';
    }
}

// ==================== KIJELENTKEZÉS ====================

window.logout = function() {
    if (confirm('Biztosan ki szeretnél jelentkezni?')) {
        fetch(`${API_BASE_URL}?action=logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify({ token: localStorage.getItem('userToken') })
        }).finally(() => {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('username');
            
            logDebug('Felhasználó kijelentkezett');
            window.location.href = 'index.html';
        });
    }
};

// ==================== API TESZT ====================

window.testAPIConnection = async function() {
    try {
        logDebug('API teszt indítása...');
        if (typeof showDebugInfo === 'function') {
            showDebugInfo('API teszt indítása...');
        }
        
        const endpoints = [
            { url: `${API_BASE_URL}?action=animals`, name: 'Állatok' },
            { url: `${API_BASE_URL}?action=user`, name: 'Felhasználó' },
            { url: `${API_BASE_URL}?action=my_adoptions`, name: 'Saját örökbefogadások' },
            { url: `${API_BASE_URL}?action=adoptions`, name: 'Örökbefogadások' }
        ];
        
        const token = localStorage.getItem('userToken');
        
        for (const endpoint of endpoints) {
            try {
                if (typeof showDebugInfo === 'function') {
                    showDebugInfo(`Tesztelés: ${endpoint.name}...`);
                }
                
                const response = await fetch(endpoint.url, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (typeof showDebugInfo === 'function') {
                    showDebugInfo(`${endpoint.name}: ${response.status} ${response.statusText}`);
                }
                
                if (response.ok) {
                    const data = await response.json();
                    logDebug(`${endpoint.name} válasz:`, data);
                }
            } catch (error) {
                if (typeof showDebugInfo === 'function') {
                    showDebugInfo(`${endpoint.name} hiba: ${error.message}`);
                }
                logDebug(`${endpoint.name} hiba:`, error.message);
            }
        }
        
        if (typeof showDebugInfo === 'function') {
            showDebugInfo('API teszt befejezve');
        }
        
    } catch (error) {
        showErrorMessage(`API teszt hiba: ${error.message}`);
    }
};

// ==================== GLOBÁLIS FÜGGVÉNYEK ====================

window.getCurrentUser = () => currentUser;
window.getUserAdoptions = () => userAdoptions;

window.reloadProfileData = async () => {
    logDebug('Profil adatok manuális újratöltése');
    setLoadingState(true);
    
    try {
        await Promise.all([
            loadUserAdoptions(),
            loadUserActivity()
        ]);
        updateUI();
    } catch (error) {
        showErrorMessage(`Újratöltési hiba: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
};

// ==================== HIBAKEZELÉS ====================

window.addEventListener('error', function(event) {
    showErrorMessage(`JavaScript hiba: ${event.message}`);
});

window.addEventListener('unhandledrejection', function(event) {
    showErrorMessage(`Promise hiba: ${event.reason}`);
});
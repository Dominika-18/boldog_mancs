// =========================
// FAVORITES.JS - KEDVENCEK KEZELÉSE (ADATBÁZIS ALAPÚ, VALÓS IDEJŰ)
// =========================

let userFavorites = [];
let favoritesInitialized = false;

const API_BASE_URL = 'api.php';

// =========================
// KEDVENCEK BETÖLTÉSE
// =========================
async function loadUserFavorites() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        userFavorites = [];
        updateFavoriteUI();
        return [];
    }
    
    try {
        console.log('❤️ Kedvencek betöltése...');
        
        const response = await fetch(`${API_BASE_URL}?action=favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.favorites) {
                userFavorites = data.favorites;
                console.log(`✅ ${userFavorites.length} kedvenc betöltve`);
            } else {
                userFavorites = [];
            }
        } else {
            console.error('❌ Kedvencek betöltési hiba:', response.status);
            userFavorites = [];
        }
    } catch (error) {
        console.error('❌ Kedvencek betöltési hiba:', error);
        userFavorites = [];
    }
    
    updateFavoriteUI();
    
    return userFavorites;
}

// =========================
// UI FRISSÍTÉSEK
// =========================
function updateFavoriteUI() {
    updateFavoriteButtons();
    updateFavoriteCount();
    updateFavoritesPage();
}

function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const animalId = btn.getAttribute('data-animal-id');
        if (!animalId) return;
        
        const isFav = userFavorites.some(fav => fav.animal_id == animalId);
        
        if (isFav) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.title = 'Eltávolítás a kedvencekből';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.title = 'Hozzáadás a kedvencekhez';
        }
    });
}

function updateFavoriteCount() {
    const countElements = document.querySelectorAll('.favorite-count, #favoriteCount, #headerFavoriteCount, #favoritesTotalCount');
    countElements.forEach(el => {
        el.textContent = userFavorites.length;
    });
    
    const headerCounter = document.getElementById('favoritesCounter');
    if (headerCounter) {
        headerCounter.style.display = userFavorites.length > 0 ? 'inline-block' : 'none';
    }
}

function updateFavoritesPage() {
    const container = document.getElementById('favoritesAnimals');
    if (!container) return;
    
    const loading = document.getElementById('favoritesLoading');
    const noFavorites = document.getElementById('noFavorites');
    
    if (loading) loading.style.display = 'none';
    
    if (userFavorites.length === 0) {
        if (noFavorites) noFavorites.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    if (noFavorites) noFavorites.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';
    
    userFavorites.forEach(fav => {
        const animal = fav.animal;
        const card = document.createElement('div');
        card.className = 'animal-card fade-in';
        
        card.innerHTML = `
            <div class="animal-image">
                <img src="${animal.image || 'img/default-animal.jpg'}" alt="${animal.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=${animal.name}'">
                <button class="favorite-btn active" data-animal-id="${animal.id}" onclick="event.stopPropagation(); toggleFavorite(${animal.id})">
                    <i class="fas fa-heart"></i>
                </button>
                ${animal.urgent ? '<div class="urgent-label"><i class="fas fa-exclamation-triangle"></i> Sürgős!</div>' : ''}
            </div>
            <div class="animal-info">
                <h3>${animal.name}</h3>
                <div class="animal-features">
                    <span class="feature"><i class="fas fa-paw"></i> ${animal.type === 'kutya' ? 'Kutya' : animal.type === 'macska' ? 'Macska' : 'Egyéb'}</span>
                    <span class="feature"><i class="fas fa-dna"></i> ${animal.breed || 'Ismeretlen'}</span>
                    <span class="feature"><i class="fas fa-birthday-cake"></i> ${animal.age || '?'}</span>
                </div>
                <div class="animal-actions">
                    <button class="adopt-btn" onclick="window.startAdoption(${animal.id})">
                        <i class="fas fa-heart"></i> Örökbefogadás
                    </button>
                    <button class="details-btn" onclick="window.showAnimalDetails(${animal.id})">
                        <i class="fas fa-info-circle"></i> Részletek
                    </button>
                </div>
                <div class="favorite-date">
                    <i class="far fa-clock"></i> Kedvencek között: ${formatFavoriteDate(fav.created_at)}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function formatFavoriteDate(dateString) {
    if (!dateString) return 'ismeretlen';
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'ma';
        if (diffDays === 1) return 'tegnap';
        if (diffDays < 7) return `${diffDays} napja`;
        return date.toLocaleDateString('hu-HU');
    } catch {
        return 'ismeretlen';
    }
}

// =========================
// KEDVENC ÁLLAPOT ELLENŐRZÉSE
// =========================
function isFavorite(animalId) {
    return userFavorites.some(fav => fav.animal_id == animalId);
}

// =========================
// KEDVENC HOZZÁADÁSA
// =========================
async function addFavorite(animalId) {
    const token = localStorage.getItem('userToken');
    if (!token) {
        showNotification('Kedvencek mentéséhez be kell jelentkezned!', 'warning');
        if (window.showModal) window.showModal('loginModal');
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}?action=favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ animal_id: animalId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadUserFavorites();
            showNotification('❤️ Állat a kedvencekhez adva!', 'success');
            return true;
        } else if (data.already_exists) {
            showNotification('Már a kedvenceid között van!', 'info');
            return false;
        } else {
            showNotification(data.error || 'Hiba a mentés során', 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ Kedvenc hozzáadási hiba:', error);
        showNotification('Hálózati hiba történt', 'error');
        return false;
    }
}

// =========================
// KEDVENC ELTÁVOLÍTÁSA
// =========================
async function removeFavorite(animalId) {
    const token = localStorage.getItem('userToken');
    if (!token) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}?action=favorite&animal_id=${animalId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadUserFavorites();
            showNotification('💔 Állat eltávolítva a kedvencekből', 'success');
            return true;
        } else {
            showNotification(data.error || 'Hiba az eltávolítás során', 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ Kedvenc eltávolítási hiba:', error);
        showNotification('Hálózati hiba történt', 'error');
        return false;
    }
}

// =========================
// KEDVENC ÁLLAPOT VÁLTÁSA
// =========================
async function toggleFavorite(animalId) {
    if (isFavorite(animalId)) {
        return await removeFavorite(animalId);
    } else {
        return await addFavorite(animalId);
    }
}

// =========================
// KEDVENC GOMBOK HOZZÁADÁSA AZ ÁLLAT KÁRTYÁKHOZ
// =========================
function addFavoriteButtonsToAnimals() {
    document.querySelectorAll('.animal-card').forEach(card => {
        const animalImage = card.querySelector('.animal-image');
        if (!animalImage) return;
        
        if (card.querySelector('.favorite-btn')) return;
        
        const adoptBtn = card.querySelector('.adopt-btn');
        if (!adoptBtn) return;
        
        const onclickAttr = adoptBtn.getAttribute('onclick');
        if (!onclickAttr) return;
        
        const match = onclickAttr.match(/startAdoption\((\d+)\)/);
        if (!match) return;
        
        const animalId = parseInt(match[1]);
        const isFav = isFavorite(animalId);
        
        const favBtn = document.createElement('button');
        favBtn.className = `favorite-btn ${isFav ? 'active' : ''}`;
        favBtn.setAttribute('data-animal-id', animalId);
        favBtn.setAttribute('onclick', `event.stopPropagation(); toggleFavorite(${animalId})`);
        favBtn.innerHTML = isFav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        favBtn.title = isFav ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez';
        
        animalImage.appendChild(favBtn);
    });
}

// =========================
// ÉRTESÍTÉS MEGJELENÍTÉSE
// =========================
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.favorite-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `favorite-notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 25px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        border-radius: 50px;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =========================
// CSS STÍLUSOK HOZZÁADÁSA
// =========================
function addFavoriteStyles() {
    if (document.getElementById('favorite-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'favorite-styles';
    style.textContent = `
        .favorite-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: #ccc;
            transition: all 0.3s ease;
        }
        
        .favorite-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        
        .favorite-btn.active {
            color: #e74c3c;
            background: white;
        }
        
        .favorite-btn.active i {
            animation: heartBeat 0.3s ease;
        }
        
        .favorite-count-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #e74c3c;
            color: white;
            font-size: 0.7rem;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .favorite-date {
            margin-top: 10px;
            font-size: 0.8rem;
            color: #999;
            text-align: right;
        }
        
        @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .favorite-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
        }
    `;
    document.head.appendChild(style);
}

// =========================
// AUTOMATIKUS FRISSÍTÉS
// =========================
let favoritePollingInterval = null;

function startFavoritePolling() {
    if (favoritePollingInterval) clearInterval(favoritePollingInterval);
    
    favoritePollingInterval = setInterval(async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return;
        
        await loadUserFavorites();
    }, 10000);
}

// =========================
// INICIALIZÁLÁS
// =========================
async function initFavorites() {
    if (favoritesInitialized) return;
    
    console.log('❤️ Kedvencek inicializálása...');
    
    addFavoriteStyles();
    
    await loadUserFavorites();
    
    window.addEventListener('storage', (e) => {
        if (e.key === 'userToken' || e.key === 'userData') {
            setTimeout(loadUserFavorites, 100);
        }
    });
    
    const observer = new MutationObserver(() => {
        addFavoriteButtonsToAnimals();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    setTimeout(addFavoriteButtonsToAnimals, 500);
    
    startFavoritePolling();
    
    favoritesInitialized = true;
    console.log('✅ Kedvencek inicializálva');
}

// =========================
// GLOBÁLIS FÜGGVÉNYEK
// =========================
window.toggleFavorite = toggleFavorite;
window.loadUserFavorites = loadUserFavorites;
window.isFavorite = isFavorite;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFavorites, 1000);
});
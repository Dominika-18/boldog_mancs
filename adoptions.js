let allAdoptions = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadAdoptions();
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.status;
            renderAdoptions();
        });
    });
});

async function checkAdminAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
            alert('Nincs admin jogosultságod!');
            window.location.href = 'index.html';
        }
    } catch (e) {
        window.location.href = 'index.html';
    }
}

async function loadAdoptions() {
    const grid = document.getElementById('adoptionsGrid');
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><h3>Betöltés...</h3></div>';
    
    try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('api.php?action=adoptions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            allAdoptions = await response.json();
            updateStats();
            renderAdoptions();
        } else {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Hiba történt a betöltés során</h3></div>';
        }
    } catch (error) {
        console.error('Hiba:', error);
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Hiba történt a betöltés során</h3></div>';
    }
}

function updateStats() {
    document.getElementById('totalCount').textContent = allAdoptions.length;
    document.getElementById('pendingCount').textContent = allAdoptions.filter(a => a.status === 'pending').length;
    document.getElementById('approvedCount').textContent = allAdoptions.filter(a => a.status === 'approved').length;
    document.getElementById('rejectedCount').textContent = allAdoptions.filter(a => a.status === 'rejected').length;
}

function renderAdoptions() {
    const grid = document.getElementById('adoptionsGrid');
    
    let filtered = allAdoptions;
    if (currentFilter !== 'all') {
        filtered = allAdoptions.filter(a => a.status === currentFilter);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>Nincs megjeleníthető örökbefogadás</h3><p>A kiválasztott szűrővel nem található kérelem.</p></div>';
        return;
    }
    
    grid.innerHTML = filtered.map(adoption => `
        <div class="adoption-card">
            <div class="card-header status-${adoption.status}">
                <span><strong>#${adoption.id}</strong> - ${formatDate(adoption.created_at)}</span>
                <span class="badge">${getStatusText(adoption.status)}</span>
            </div>
            <div class="card-body">
                <div class="animal-info">
                    <div class="animal-image">
                        <img src="${adoption.animal_image || 'img/kep1.jpg'}" alt="${adoption.animal_name}" onerror="this.src='img/kep1.jpg'">
                    </div>
                    <div class="animal-details">
                        <h4>${adoption.animal_name || 'Ismeretlen'}</h4>
                        <p>${adoption.animal_type || 'Állat'}</p>
                    </div>
                </div>
                
                <div class="applicant-info">
                    <div class="info-row">
                        <span class="info-label">Jelentkező:</span>
                        <span class="info-value"><strong>${adoption.full_name}</strong></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${adoption.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Telefon:</span>
                        <span class="info-value">${adoption.phone}</span>
                    </div>
                    ${adoption.user_username ? `
                    <div class="info-row">
                        <span class="info-label">Felhasználó:</span>
                        <span class="info-value">${adoption.user_username}</span>
                    </div>
                    ` : ''}
                    ${adoption.home_type ? `
                    <div class="info-row">
                        <span class="info-label">Lakás típusa:</span>
                        <span class="info-value">${adoption.home_type}</span>
                    </div>
                    ` : ''}
                    ${adoption.address ? `
                    <div class="info-row">
                        <span class="info-label">Cím:</span>
                        <span class="info-value">${adoption.address}</span>
                    </div>
                    ` : ''}
                </div>
                
                ${adoption.experience ? `
                <div class="message-box">
                    <h5><i class="fas fa-paw"></i> Tapasztalat:</h5>
                    <p>${adoption.experience}</p>
                </div>
                ` : ''}
                
                ${adoption.message ? `
                <div class="message-box">
                    <h5><i class="fas fa-envelope"></i> Üzenet:</h5>
                    <p>${adoption.message}</p>
                </div>
                ` : ''}
                
                ${adoption.status === 'pending' ? `
                <div class="card-actions">
                    <button class="btn-approve" onclick="updateStatus(${adoption.id}, 'approved')">
                        <i class="fas fa-check"></i> Elfogadás
                    </button>
                    <button class="btn-reject" onclick="updateStatus(${adoption.id}, 'rejected')">
                        <i class="fas fa-times"></i> Elutasítás
                    </button>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    if (!dateString) return 'Ismeretlen';
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Függőben';
        case 'approved': return 'Elfogadva';
        case 'rejected': return 'Elutasítva';
        default: return status;
    }
}

async function updateStatus(id, status) {
console.log('updateStatus hívva - ID:', id, 'típus:', typeof id, 'státusz:', status);

if (!id) {
alert('❌ HIBA: Az örökbefogadás ID-ja hiányzik! (ID: ' + id + ')');
return;
}
if (!confirm(`Biztosan ${status === 'approved' ? 'elfogadod' : 'elutasítod'} ezt a jelentkezést?`)) {
return;
}

try {
const token = localStorage.getItem('userToken');
const response = await fetch(`api.php?action=adoptions&id=${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
});

// DEBUG: Írd ki a válasz státuszát és típusát
console.log('Válasz státusz:', response.status);
console.log('Válasz content-type:', response.headers.get('content-type'));

// Ha nem JSON, olvasd be szövegként
const text = await response.text();
console.log('Válasz szöveg:', text);

try {
    const result = JSON.parse(text);
    console.log('Parsolt JSON:', result);
    
    if (result.success) {
        alert(`✅ Jelentkezés ${status === 'approved' ? 'elfogadva' : 'elutasítva'}!`);
        loadAdoptions();
    } else {
        alert('❌ Hiba: ' + result.error);
    }
} catch (e) {
    console.error('Nem JSON válasz:', text);
    alert('❌ Szerverhiba: ' + text.substring(0, 100));
}
} catch (error) {
console.error('Hiba:', error);
alert('❌ Hiba történt a művelet során');
}
}

// Kijelentkezés
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

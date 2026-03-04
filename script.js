// =========================
// GLOBÁLIS VÁLTOZÓK
// =========================
let currentAnimal = null;
let currentSlide = 0;
let slideInterval;
let currentUser = null;
let animals = [];
let blogPosts = [];
let allUsers = [];
let slideshowInitialized = false;

// Szűrési változók - JAVÍTVA
let activeFilters = {
    faj: 'all',
    nem: 'all-nem',
    kor: 'all-kor',
    meret: 'all-meret'
};

// =========================
// MODAL KEZELÉS
// =========================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// =========================
// SLIDESHOW
// =========================
function initSlideshow() {
    if (slideshowInitialized) return;
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    const next = document.querySelector('.slideshow-arrow.next');
    const prev = document.querySelector('.slideshow-arrow.prev');
    
    if (slides.length === 0) {
        console.log('⚠️ Nincsenek slide-ok');
        return;
    }
    
    console.log(`🖼️ Slideshow inicializálás, ${slides.length} slide`);
    
    preloadImages();
    
    if (next) {
        next.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            changeSlide(1);
        });
    }
    
    if (prev) {
        prev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            changeSlide(-1);
        });
    }
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(i);
        });
    });
    
    setupTouchEvents();
    
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', pauseSlideshow);
        slideshow.addEventListener('mouseleave', resumeSlideshow);
    }
    
    startSlideshowInterval();
    slideshowInitialized = true;
    
    console.log('✅ Slideshow inicializálva');
}

function preloadImages() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        const bgImage = window.getComputedStyle(slide).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const url = bgImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
            if (url && url !== 'none') {
                const img = new Image();
                img.src = url;
            }
        }
    });
}

function setupTouchEvents() {
    const slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeSlide(1);
            } else {
                changeSlide(-1);
            }
        }
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    
    if (!slides.length) return;
    
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    restartSlideshowInterval();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    
    if (!slides.length || index < 0 || index >= slides.length) return;
    
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    
    restartSlideshowInterval();
}

function startSlideshowInterval() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 6000);
}

function restartSlideshowInterval() {
    clearInterval(slideInterval);
    startSlideshowInterval();
}

function pauseSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function resumeSlideshow() {
    if (!slideInterval) {
        startSlideshowInterval();
    }
}

// =========================
// NAVIGÁCIÓ
// =========================
function setupNavigation() {
    console.log('🧭 Navigáció beállítása...');
    
    document.querySelectorAll('nav .nav-link, .footer-links .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (pageId) showPage(pageId);
        });
    });
    
    document.querySelectorAll('.slideshow .slideshow-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pageId = btn.dataset.slidePage;
            if (pageId) {
                showPage(pageId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    document.querySelectorAll('.text-center a, .btn').forEach(link => {
        if (link.textContent.includes('Összes állat') || 
            link.textContent.includes('összes állat') ||
            link.textContent.includes('Összes állat megtekintése')) {
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showPage('adoption');
                
                setTimeout(() => {
                    const adoptionSection = document.getElementById('adoption');
                    if (adoptionSection) {
                        adoptionSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            });
        }
    });
    
    console.log('✅ Navigáció beállítva');
}

window.showPage = function(pageId) {
    console.log('📄 Navigáció oldalra:', pageId);
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        document.querySelectorAll('nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
        
        if (pageId === 'adoption') {
            if (typeof renderFilteredAnimals === 'function') {
                renderFilteredAnimals();
            }
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
        
    } else {
        console.error('❌ Nem található oldal:', pageId);
    }
};
// =========================
// API FUNKCIÓK
// =========================
async function loadAnimalsFromAPI() {
    try {
        console.log('🐾 Állatok betöltése API-ból...');
        
        const response = await fetch('api.php?action=animals&adopted=all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiAnimals = await response.json();
        
        if (Array.isArray(apiAnimals) && apiAnimals.length > 0) {
            animals = apiAnimals;
            console.log(`✅ Állatok betöltve API-ból: ${animals.length} db`);
        } else {
            console.warn('⚠️ API üres választ adott, demo adatok használata');
            animals = getDemoAnimals();
            console.log(`✅ Demo állatok betöltve: ${animals.length} db`);
        }
        
        return animals;
    } catch (error) {
        console.error('❌ Állatok betöltési hiba:', error);
        animals = getDemoAnimals();
        return animals;
    }
}

// =========================
// DEMO ÁLLATOK - JAVÍTVA (MEGFELELŐ MEZŐKKEL)
// =========================
function getDemoAnimals() {
    return [
        { id: 1, name: "Füles", type: "kutya", breed: "Labrador keverék", age: "2 éves", ageValue: 2, ageCategory: "fiatal", gender: "Hím", size: "kozepes", description: "Füles egy kedves, bújós és kíváncsi kutya.", image: "img/kep1.jpg", featured: true, urgent: false, adopted: false },
        { id: 2, name: "Bea", type: "macska", breed: "Rövidszőrű cirmos", age: "3 éves", ageValue: 3, ageCategory: "fiatal", gender: "Nőstény", size: "kis", description: "Bea egy nyugodt, figyelmes cica.", image: "img/kep2.jpg", featured: true, urgent: false, adopted: false },
        { id: 3, name: "Bodri", type: "kutya", breed: "Beagle", age: "1 éves", ageValue: 1, ageCategory: "kolyok", gender: "Hím", size: "kozepes", description: "Bodri egy kíváncsi és vidám kutya.", image: "img/kep3.jpg", featured: true, urgent: true, adopted: false },
        { id: 4, name: "Cirmoska", type: "macska", breed: "Házimacska", age: "5 éves", ageValue: 5, ageCategory: "felnott", gender: "Nőstény", size: "kozepes", description: "Cirmoska egy kedves, visszahúzódó macska.", image: "img/kep4.jpg", featured: false, urgent: false, adopted: true },
        { id: 5, name: "Bátor", type: "kutya", breed: "Terrier keverék", age: "3 éves", ageValue: 3, ageCategory: "fiatal", gender: "Hím", size: "kozepes", description: "Bátor fegyelmezett és figyelmes kutya.", image: "img/kep5.jpg", featured: false, urgent: false, adopted: false },
        { id: 6, name: "Bundás", type: "macska", breed: "Cirmos", age: "2 éves", ageValue: 2, ageCategory: "fiatal", gender: "Hím", size: "kozepes", description: "Bundás egy játékos és aktív fiatal macska.", image: "img/kep6.jpg", featured: false, urgent: true, adopted: false }
    ];
}

// =========================
// SZŰRÉS - TELJESEN JAVÍTVA
// =========================

// =========================
// SZŰRŐK BEÁLLÍTÁSA
// =========================
function setupFilters() {
    console.log('🔧 Szűrők beállítása...');
    
    const filterDropdownBtn = document.getElementById('filterDropdownBtn');
    const filterDropdownContent = document.getElementById('filterDropdownContent');
    
    if (!filterDropdownBtn || !filterDropdownContent) {
        console.error('❌ Szűrő elemek nem találhatók!');
        return;
    }
    
    // Dropdown nyitás/zárás
    filterDropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterDropdownBtn.classList.toggle('active');
        filterDropdownContent.classList.toggle('show');
        console.log('Dropdown toggled');
    });
    
    // Szűrő opciók kezelése
    document.querySelectorAll('.filter-dropdown-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const filterType = this.dataset.filterType;
            const filterValue = this.dataset.filterValue;
            
            console.log(`Szűrő kattintás: ${filterType} = ${filterValue}`);
            
            // Először töröljük az aktív osztályt az összes ilyen típusú opcióról
            document.querySelectorAll(`.filter-dropdown-option[data-filter-type="${filterType}"]`).forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Aktuális opció aktiválása
            this.classList.add('active');
            
            // Szűrő érték frissítése
            activeFilters[filterType] = filterValue;
            
            console.log('Aktív szűrők:', activeFilters);
            
            // Állatok újraszűrése
            filterAnimals();
            
            // Dropdown bezárása (opcionális)
            filterDropdownBtn.classList.remove('active');
            filterDropdownContent.classList.remove('show');
        });
    });
    
    // "Összes" opciók aktiválása alapból
    document.querySelectorAll('.filter-dropdown-option[data-filter-value="all"], .filter-dropdown-option[data-filter-value="all-nem"], .filter-dropdown-option[data-filter-value="all-kor"], .filter-dropdown-option[data-filter-value="all-meret"]').forEach(opt => {
        opt.classList.add('active');
    });
    
    // Összes szűrő törlése gomb
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            resetFilters();
        });
    }
    
    // Kattintás a dokumentumra - dropdown bezárása
    document.addEventListener('click', (e) => {
        if (filterDropdownBtn && filterDropdownContent) {
            if (!filterDropdownBtn.contains(e.target) && !filterDropdownContent.contains(e.target)) {
                filterDropdownBtn.classList.remove('active');
                filterDropdownContent.classList.remove('show');
            }
        }
    });
    
    console.log('✅ Szűrők beállítva');
}

// =========================
// ÁLLATOK SZŰRÉSE
// =========================
function filterAnimals() {
    console.log('Szűrés indítása...');
    
    // Összes állat betöltése
    let filteredAnimals = [...animals];
    
    // Faj szűrés
    if (activeFilters.faj !== 'all') {
        filteredAnimals = filteredAnimals.filter(animal => {
            return animal.type === activeFilters.faj;
        });
    }
    
    // Nem szűrés
    if (activeFilters.nem !== 'all-nem') {
        filteredAnimals = filteredAnimals.filter(animal => {
            if (activeFilters.nem === 'him') {
                return animal.gender === 'Hím';
            } else if (activeFilters.nem === 'nosteny') {
                return animal.gender === 'Nőstény';
            }
            return true;
        });
    }
    
    // Kor szűrés
    if (activeFilters.kor !== 'all-kor') {
        filteredAnimals = filteredAnimals.filter(animal => {
            // Számold ki az életkort években
            let ageInYears = 0;
            if (animal.age) {
                const ageMatch = animal.age.match(/(\d+)/);
                if (ageMatch) {
                    ageInYears = parseInt(ageMatch[1]);
                }
            }
            
            // Ha van ageValue, használjuk azt
            if (animal.ageValue) {
                ageInYears = animal.ageValue;
            }
            
            // Kor kategóriák
            if (activeFilters.kor === 'kolyok') {
                return ageInYears <= 1;
            } else if (activeFilters.kor === 'fiatal') {
                return ageInYears > 1 && ageInYears <= 4;
            } else if (activeFilters.kor === 'felnott') {
                return ageInYears > 4 && ageInYears <= 8;
            } else if (activeFilters.kor === 'idos') {
                return ageInYears > 8;
            }
            
            return true;
        });
    }
    
    // Méret szűrés
    if (activeFilters.meret !== 'all-meret') {
        filteredAnimals = filteredAnimals.filter(animal => {
            return animal.size === activeFilters.meret;
        });
    }
    
    console.log(`Szűrés eredménye: ${filteredAnimals.length} állat`);
    
    // Találatok számának frissítése
    const filterCount = document.getElementById('filterCount');
    if (filterCount) {
        filterCount.textContent = filteredAnimals.length;
    }
    
    // Nincs találat üzenet megjelenítése/elrejtése
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = filteredAnimals.length === 0 ? 'block' : 'none';
    }
    
    // Állatok megjelenítése
    renderAnimals('adoptionAnimals', filteredAnimals);
    
    return filteredAnimals;
}

// =========================
// SZŰRŐK ALAPHELYZETBE ÁLLÍTÁSA
// =========================
function resetFilters() {
    console.log('Szűrők alaphelyzetbe állítása...');
    
    // Szűrők visszaállítása
    activeFilters = {
        faj: 'all',
        nem: 'all-nem',
        kor: 'all-kor',
        meret: 'all-meret'
    };
    
    // Aktív osztályok eltávolítása minden opcióról
    document.querySelectorAll('.filter-dropdown-option').forEach(opt => {
        opt.classList.remove('active');
    });
    
    // "Összes" opciók aktiválása
    document.querySelectorAll('.filter-dropdown-option[data-filter-value="all"], .filter-dropdown-option[data-filter-value="all-nem"], .filter-dropdown-option[data-filter-value="all-kor"], .filter-dropdown-option[data-filter-value="all-meret"]').forEach(opt => {
        opt.classList.add('active');
    });
    
    // Összes állat megjelenítése
    filterAnimals();
    
    console.log('✅ Szűrők alaphelyzetben');
}

// =========================
// RENDERELÉS MÓDOSÍTÁSA
// =========================
function renderFilteredAnimals() {
    filterAnimals();
}

// =========================
// BLOG FUNKCIÓK
// =========================
async function loadBlogPostsFromAPI() {
    try {
        const response = await fetch('api.php?action=blog');
        if (!response.ok) throw new Error('Hiba a blog betöltésekor');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            blogPosts = data;
        } else {
            blogPosts = getDemoBlogPosts();
        }
    } catch (error) {
        console.error('Blog betöltési hiba:', error);
        blogPosts = getDemoBlogPosts();
    }
    renderBlogPosts();
}

function getDemoBlogPosts() {
    return [
        { 
            id: 1, 
            title: "Rekord számú örökbefogadás!", 
            excerpt: "Szeptemberben 25 állat talált örökbefogadót.", 
            content: "Szeptemberben rekordot döntöttünk: 25 állat talált új otthonra!",
            image: "img/blog1.jpg", 
            date: "2026-01-11T10:30:00", 
            author: "Dominika",
            created_at: "2026-01-11T10:30:00"
        },
        { 
            id: 2, 
            title: "Új menhelyi program indult!", 
            excerpt: "Bevezetjük a 'Menhelyi Napok' programot.", 
            content: "Elindítottuk a 'Menhelyi Napok' programot.",
            image: "img/blog2.jpg", 
            date: "2025-11-15T14:20:00", 
            author: "Jázmin",
            created_at: "2025-11-15T14:20:00"
        },
        { 
            id: 3, 
            title: "Télire készülünk", 
            excerpt: "Téli takarókat gyűjtünk az állatok számára.", 
            content: "A tél közeledtével megkezdtük a téli gyűjtést.",
            image: "img/blog3.jpg", 
            date: "2025-11-28T09:15:00", 
            author: "Leila",
            created_at: "2025-11-28T09:15:00"
        }
    ];
}

function renderBlogPosts() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    newsGrid.innerHTML = '';
    
    blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'news-card fade-in';
        
        const formattedDate = formatBlogDate(post.date || post.created_at);
        
        postElement.innerHTML = `
            <div class="news-image">
                <img src="${post.image || 'img/blog1.jpg'}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Blog'">
            </div>
            <div class="news-content">
                <h3>${post.title}</h3>
                <p>${post.excerpt || post.content?.substring(0, 100) || ''}...</p>
                <div class="news-meta">
                    <span class="news-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    <span class="news-author"><i class="far fa-user"></i> ${post.author || 'Boldog Mancs'}</span>
                </div>
            </div>
        `;
        newsGrid.appendChild(postElement);
    });
}

function formatBlogDate(dateString) {
    if (!dateString) return 'Ismeretlen dátum';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ismeretlen dátum';
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

// =========================
// FELHASZNÁLÓK BETÖLTÉSE
// =========================
async function loadAllUsers() {
    try {
        console.log('👥 Felhasználók betöltése...');
        
        const storedUsers = localStorage.getItem('admin_users');
        if (storedUsers) {
            allUsers = JSON.parse(storedUsers);
            console.log(`✅ Felhasználók betöltve localStorage-ból: ${allUsers.length} db`);
        }
        
        const token = localStorage.getItem('userToken');
        const response = await fetch('api.php?action=get_all_users', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
            const data = await response.json();
            let apiUsers = [];
            
            if (Array.isArray(data)) {
                apiUsers = data;
            } else if (data.users) {
                apiUsers = data.users;
            }
            
            if (apiUsers.length > 0) {
                const apiIds = apiUsers.map(u => u.id);
                const localOnly = allUsers.filter(u => !apiIds.includes(u.id));
                allUsers = [...apiUsers, ...localOnly];
                console.log(`✅ Felhasználók betöltve API-ból: ${apiUsers.length} db, összesen: ${allUsers.length} db`);
                
                localStorage.setItem('admin_users', JSON.stringify(allUsers));
            }
        }
        
        if (allUsers.length === 0) {
            allUsers = [
                { id: 1, username: 'admin', email: 'admin@example.com', fullname: 'Adminisztrátor', role: 'admin', created_at: new Date().toISOString() },
                { id: 2, username: 'jozsi', email: 'jozsi@example.com', fullname: 'Kiss József', role: 'user', created_at: new Date().toISOString() },
                { id: 3, username: 'mari', email: 'mari@example.com', fullname: 'Nagy Mária', role: 'user', created_at: new Date().toISOString() },
                { id: 4, username: 'peti', email: 'peti@example.com', fullname: 'Kovács Péter', role: 'user', created_at: new Date().toISOString() }
            ];
            localStorage.setItem('admin_users', JSON.stringify(allUsers));
            console.log(`✅ Demo felhasználók betöltve: ${allUsers.length} db`);
        }
        
        return allUsers;
    } catch (error) {
        console.error('❌ Felhasználók betöltési hiba:', error);
        return [];
    }
}

// =========================
// FELHASZNÁLÓ KEZELÉS
// =========================
async function loadUserData() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        currentUser = null;
        return null;
    }
    
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        try {
            currentUser = JSON.parse(savedUserData);
            console.log('✅ Felhasználó betöltve localStorage-ból:', currentUser);
            return currentUser;
        } catch (e) {
            localStorage.removeItem('userData');
        }
    }
    
    try {
        console.log('🔍 Felhasználói adatok lekérése API-ból...');
        const response = await fetch('api.php?action=user', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API válasz:', data);
            
            currentUser = {
                id: data.id || 0,
                username: data.username || 'Ismeretlen',
                email: data.email || '',
                fullname: data.fullname || data.name || data.username,
                role: data.role || 'user'
            };
            localStorage.setItem('userData', JSON.stringify(currentUser));
            console.log('✅ Felhasználó sikeresen betöltve:', currentUser);
        } else {
            console.log('❌ API hiba, token törlése');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            currentUser = null;
        }
    } catch (error) {
        console.error('❌ Felhasználó betöltési hiba:', error);
        if (!currentUser) {
            currentUser = { id: 1, username: 'demo', fullname: 'Demo Felhasználó', role: 'user' };
            console.log('⚠️ Demo felhasználó használata');
        }
    }
    
    return currentUser;
}

// =========================
// BEJELENTKEZÉS
// =========================
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.log('❌ Login form nem található');
        return;
    }
    
    console.log('✅ Login form inicializálva');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        console.log('🔐 Bejelentkezési kísérlet:', username);
        
        if (!username || !password) {
            alert('Kérjük, töltsd ki mindkét mezőt!');
            return;
        }
        
        try {
            const response = await fetch('api.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            console.log('📦 Bejelentkezés válasz:', data);
            
            if (data.success) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                localStorage.setItem('username', data.user.username);
                
                currentUser = data.user;
                
                console.log('✅ Bejelentkezés sikeres! Felhasználó:', currentUser);
                
                await loadAllUsers();
                
                hideModal('loginModal');
                refreshUserMenuState();
                
                if (typeof renderFilteredAnimals === 'function') renderFilteredAnimals();
                if (typeof renderAnimals === 'function') renderAnimals('featuredAnimals');
                
                alert(`✅ Sikeres bejelentkezés! Üdvözöljük, ${currentUser.fullname || currentUser.username}!`);
                
                if (currentUser.role === 'admin') {
                    if (confirm('Adminisztrátorként bejelentkeztél. Szeretnéd megnyitni az admin felületet?')) {
                        window.location.href = 'admin.html';
                    }
                }
            } else {
                console.log('❌ Bejelentkezés sikertelen:', data.error);
                alert(data.error || 'Hibás felhasználónév vagy jelszó!');
            }
        } catch (error) {
            console.error('❌ Bejelentkezési hiba:', error);
            alert('Hiba történt a bejelentkezés során! Ellenőrizd az API kapcsolatot.');
        }
    });
}

// =========================
// REGISZTRÁCIÓ
// =========================
function setupRegistration() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
        console.log('❌ Register form nem található');
        return;
    }
    
    console.log('✅ Register form inicializálva');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const fullname = document.getElementById('regFullName').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const passwordConfirm = document.getElementById('regPasswordConfirm').value.trim();
        const terms = document.getElementById('regTerms').checked;
        
        console.log('📝 Regisztrációs kísérlet:', { username, email, fullname });
        
        if (!username || !email || !fullname || !password || !passwordConfirm || !terms) {
            alert('Kérjük, töltsd ki az összes mezőt és fogadd el a feltételeket!');
            return;
        }
        
        if (password.length < 6) {
            alert('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
            return;
        }
        
        if (password !== passwordConfirm) {
            alert('A jelszavak nem egyeznek!');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Érvényes email címet adj meg!');
            return;
        }
        
        try {
            const response = await fetch('api.php?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, fullname, password })
            });
            
            const data = await response.json();
            console.log('📦 Regisztráció válasz:', data);
            
            if (data.success) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                localStorage.setItem('username', data.user.username);
                
                currentUser = data.user;
                
                console.log('✅ Regisztráció sikeres! Felhasználó:', currentUser);
                
                await loadAllUsers();
                
                hideModal('registerModal');
                refreshUserMenuState();
                
                if (typeof renderFilteredAnimals === 'function') renderFilteredAnimals();
                if (typeof renderAnimals === 'function') renderAnimals('featuredAnimals');
                
                alert('✅ Sikeres regisztráció! Most már örökbefogadhatsz!');
            } else {
                console.log('❌ Regisztráció sikertelen:', data.error);
                alert(data.error || 'Hiba történt a regisztráció során!');
            }
        } catch (error) {
            console.error('❌ Regisztrációs hiba:', error);
            alert('Hiba történt a regisztráció során! Ellenőrizd az API kapcsolatot.');
        }
    });
}

// =========================
// USER MENU FRISSÍTÉS - JAVÍTVA (CSAK ADMINNAK JELENIK MEG)
// =========================
function refreshUserMenuState() {
    console.log('🔄 User menu frissítése, currentUser:', currentUser);

    const authButtons = document.getElementById('authButtons');
    const userMenuButton = document.getElementById('userMenuButton');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserRole = document.getElementById('dropdownUserRole');
    const dropdownAdminLink = document.getElementById('dropdownAdminLink');

    if (!authButtons || !userMenuButton) {
        console.log('❌ Auth gombok vagy user menu gomb nem található');
        return;
    }

    if (currentUser) {
        // Bejelentkezett állapot
        authButtons.style.display = 'none';
        userMenuButton.style.display = 'block';

        if (dropdownUserName) {
            dropdownUserName.textContent = currentUser.fullname || currentUser.username;
        }
        if (dropdownUserRole) {
            dropdownUserRole.textContent = currentUser.role === 'admin' ? 'Adminisztrátor' : 'Felhasználó';
        }
        if (dropdownAdminLink) {
            // CSAK ADMINOKNAK JELENIK MEG - SENKI MÁSNAK
            dropdownAdminLink.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
        }

        console.log('✅ User menu frissítve, felhasználó:', currentUser.username);
    } else {
        // Kijelentkezett állapot
        authButtons.style.display = 'flex';
        userMenuButton.style.display = 'none';
        console.log('✅ User menu elrejtve, auth gombok megjelenítve');
    }
}

// =========================
// KIJELENTKEZÉS
// =========================
async function logout() {
    if (!confirm('Biztosan ki szeretnél jelentkezni?')) return;
    
    console.log('🚪 Kijelentkezés...');
    
    const token = localStorage.getItem('userToken');
    if (token) {
        try {
            await fetch('api.php?action=logout', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            });
        } catch (error) {
            console.log('⚠️ Kijelentkezés API hiba:', error);
        }
    }
    
    currentUser = null;
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    
    console.log('✅ Kijelentkezés sikeres');
    
    refreshUserMenuState();
    
    if (typeof renderFilteredAnimals === 'function') renderFilteredAnimals();
    if (typeof renderAnimals === 'function') renderAnimals('featuredAnimals');
    
    window.showPage('home');
}

// =========================
// USER DROPDOWN KEZELÉS
// =========================
function setupUserDropdown() {
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    const userDropdown = document.getElementById('userDropdown');
    const dropdownLogoutLink = document.getElementById('dropdownLogoutLink');

    if (!userAvatarBtn || !userDropdown) return;

    userAvatarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', function(e) {
        if (!userAvatarBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
    });

    if (dropdownLogoutLink) {
        dropdownLogoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// =========================
// AUTH GOMBOK BEÁLLÍTÁSA
// =========================
function setupAuthButtons() {
    console.log('🔧 Auth gombok beállítása...');
    
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const cancelLogin = document.getElementById('cancelLogin');
    const cancelRegister = document.getElementById('cancelRegister');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('🔑 Bejelentkezés gomb klikk');
            showModal('loginModal');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            console.log('📝 Regisztráció gomb klikk');
            showModal('registerModal');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => { 
            e.preventDefault(); 
            console.log('➡️ Átváltás bejelentkezésre');
            hideModal('registerModal'); 
            showModal('loginModal'); 
        });
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => { 
            e.preventDefault(); 
            console.log('➡️ Átváltás regisztrációra');
            hideModal('loginModal'); 
            showModal('registerModal'); 
        });
    }
    
    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            console.log('❌ Bejelentkezés bezárása');
            hideModal('loginModal');
        });
    }
    
    if (closeRegister) {
        closeRegister.addEventListener('click', () => {
            console.log('❌ Regisztráció bezárása');
            hideModal('registerModal');
        });
    }
    
    if (cancelLogin) {
        cancelLogin.addEventListener('click', () => {
            console.log('❌ Bejelentkezés mégsem');
            hideModal('loginModal');
        });
    }
    
    if (cancelRegister) {
        cancelRegister.addEventListener('click', () => {
            console.log('❌ Regisztráció mégsem');
            hideModal('registerModal');
        });
    }
    
    console.log('✅ Auth gombok beállítva');
}

// =========================
// ÁLLAT KÁRTYÁK MEGJELENÍTÉSE - JAVÍTVA (ÖRÖKBEFOGADOTT ÁLLATOK KEZELÉSE)
// =========================
function renderAnimals(containerId, animalsToRender = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container nem található:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    if (!animalsToRender) {
        if (containerId === 'adoptionAnimals') {
            animalsToRender = animals;
            animalsToRender = applyFilters(animalsToRender);
        } else if (containerId === 'featuredAnimals') {
            animalsToRender = animals.filter(a => a.featured && !a.adopted);
        } else {
            animalsToRender = animals.filter(a => !a.adopted);
        }
    }
    
    if (!animalsToRender || animalsToRender.length === 0) {
        container.innerHTML = '<div class="no-results"><i class="fas fa-paw"></i><h3>Nincs megjeleníthető állat</h3><p>Kérjük, nézz vissza később!</p></div>';
        return;
    }
    
    const isLoggedIn = !!(localStorage.getItem('userToken') && currentUser);
    const isAdmin = currentUser?.role === 'admin';
    
    const sortedAnimals = [...animalsToRender].sort((a, b) => {
        if (a.adopted === b.adopted) return 0;
        return a.adopted ? 1 : -1;
    });
    
    sortedAnimals.forEach(animal => {
        const card = document.createElement('div');
        card.className = `animal-card fade-in ${animal.urgent ? 'urgent-animal' : ''} ${animal.adopted ? 'adopted-animal' : ''}`;
        
        let actionButtonHtml = '';
        if (animal.adopted) {
            actionButtonHtml = '<button class="adopted-btn" disabled><i class="fas fa-home"></i> Örökbefogadva</button>';
        } else if (isAdmin) {
            actionButtonHtml = '<button class="disabled-admin-btn" disabled><i class="fas fa-shield-alt"></i> Admin</button>';
        } else if (!isLoggedIn) {
            actionButtonHtml = '<button class="login-required-btn"><i class="fas fa-sign-in-alt"></i> Bejelentkezés</button>';
        } else {
            actionButtonHtml = '<button class="adopt-btn"><i class="fas fa-heart"></i> Örökbefogadom!</button>';
        }
        
        let statusBadge = '';
        if (animal.adopted) {
            statusBadge = '<div class="adopted-label"><i class="fas fa-home"></i> Örökbefogadva</div>';
        } else if (animal.urgent) {
            statusBadge = '<div class="urgent-label"><i class="fas fa-exclamation-triangle"></i> Sürgős!</div>';
        }
        
        card.innerHTML = `
            <div class="animal-image">
                <img src="${animal.image}" alt="${animal.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${animal.name}'">
                ${statusBadge}
            </div>
            <div class="animal-info">
                <h3>${animal.name}</h3>
                <p>${(animal.description || '').substring(0, 80)}...</p>
                <div class="animal-features">
                    <span class="feature"><i class="fas fa-paw"></i> ${animal.type === 'kutya' ? 'Kutya' : animal.type === 'macska' ? 'Macska' : 'Egyéb'}</span>
                    <span class="feature"><i class="fas fa-dna"></i> ${animal.breed || 'Ismeretlen'}</span>
                    <span class="feature"><i class="fas fa-birthday-cake"></i> ${animal.age || '?'}</span>
                </div>
                <div class="animal-actions">
                    ${actionButtonHtml}
                    <button class="details-btn"><i class="fas fa-info-circle"></i> Részletek</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Eseménykezelők az örökbefogadás gombokhoz
    document.querySelectorAll(`#${containerId} .adopt-btn`).forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const nonAdoptedAnimals = sortedAnimals.filter(a => !a.adopted);
            const buttonIndex = Array.from(document.querySelectorAll(`#${containerId} .adopt-btn`)).indexOf(btn);
            if (buttonIndex < nonAdoptedAnimals.length) {
                const animal = nonAdoptedAnimals[buttonIndex];
                if (animal) startAdoption(animal.id);
            }
        });
    });
    
    document.querySelectorAll(`#${containerId} .details-btn`).forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const buttonIndex = Array.from(document.querySelectorAll(`#${containerId} .details-btn`)).indexOf(btn);
            if (buttonIndex < sortedAnimals.length) {
                const animal = sortedAnimals[buttonIndex];
                if (animal) showAnimalDetails(animal.id);
            }
        });
    });
    
    document.querySelectorAll(`#${containerId} .login-required-btn`).forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Örökbefogadáshoz be kell jelentkezned!');
            showModal('loginModal');
        });
    });
}

// =========================
// ÁLLAT RÉSZLETEK - JAVÍTVA
// =========================
function showAnimalDetails(animalId) {
    const animal = animals.find(a => a.id == animalId);
    if (!animal) return;
    
    const detailsDiv = document.getElementById('animalDetails');
    if (!detailsDiv) return;
    
    const isLoggedIn = !!(localStorage.getItem('userToken') && currentUser);
    const isAdmin = currentUser?.role === 'admin';
    
    let actionButtonHtml = '';
    if (animal.adopted) {
        actionButtonHtml = '<div class="adopted-message"><i class="fas fa-home"></i> Ez az állat már örökbefogadásra került.</div>';
    } else if (isAdmin) {
        actionButtonHtml = '<div class="admin-message"><i class="fas fa-shield-alt"></i> Adminok nem fogadhatnak örökbe.</div>';
    } else if (!isLoggedIn) {
        actionButtonHtml = '<button class="btn" onclick="showModal(\'loginModal\')"><i class="fas fa-sign-in-alt"></i> Bejelentkezés</button>';
    } else {
        actionButtonHtml = `<button class="btn" onclick="startAdoption(${animal.id})"><i class="fas fa-heart"></i> Örökbefogadom!</button>`;
    }
    
    detailsDiv.innerHTML = `
        <div class="animal-details-image">
            <img src="${animal.image}" alt="${animal.name}" onerror="this.src='https://via.placeholder.com/400x300?text=${animal.name}'">
            ${animal.urgent ? '<div class="urgent-badge"><i class="fas fa-exclamation-triangle"></i> Sürgős!</div>' : ''}
            ${animal.adopted ? '<div class="adopted-badge"><i class="fas fa-home"></i> Örökbefogadva</div>' : ''}
        </div>
        <div class="animal-details-info">
            <h2>${animal.name}</h2>
            <div class="details-grid">
                <p><strong>Faj:</strong> ${animal.type === 'kutya' ? 'Kutya' : animal.type === 'macska' ? 'Macska' : 'Egyéb'}</p>
                <p><strong>Fajta:</strong> ${animal.breed || 'Ismeretlen'}</p>
                <p><strong>Életkor:</strong> ${animal.age || 'Ismeretlen'}</p>
                <p><strong>Nem:</strong> ${animal.gender === 'Hím' ? 'Hím' : 'Nőstény'}</p>
                <p><strong>Méret:</strong> ${animal.size === 'kis' ? 'Kis' : animal.size === 'kozepes' ? 'Közepes' : animal.size === 'nagy' ? 'Nagy' : 'Ismeretlen'}</p>
            </div>
            <div class="description">
                <h3>Leírás</h3>
                <p>${animal.description || 'Nincs leírás'}</p>
            </div>
            <div class="details-actions">
                ${actionButtonHtml}
            </div>
        </div>
    `;
    
    showModal('animalModal');
}

// =========================
// ÖRÖKBEFOGADÁS INDÍTÁSA - JAVÍTVA
// =========================
function startAdoption(animalId) {
    if (!localStorage.getItem('userToken') || !currentUser) {
        alert('Örökbefogadáshoz be kell jelentkezned!');
        showModal('loginModal');
        return;
    }
    
    if (currentUser.role === 'admin') {
        alert('Adminisztrátorok nem fogadhatnak örökbe!');
        return;
    }
    
    const animal = animals.find(a => a.id == animalId);
    if (!animal) return;
    
    if (animal.adopted) {
        alert('Ez az állat már örökbefogadásra került!');
        return;
    }
    
    currentAnimal = animal;
    
    let animalIdInput = document.getElementById('animalIdInput');
    if (!animalIdInput) {
        const adoptionForm = document.getElementById('adoptionForm');
        animalIdInput = document.createElement('input');
        animalIdInput.type = 'hidden';
        animalIdInput.id = 'animalIdInput';
        animalIdInput.name = 'animal_id';
        adoptionForm.appendChild(animalIdInput);
    }
    animalIdInput.value = animal.id;
    // A startAdoption függvényben, a beállítás után:
animalIdInput.value = animal.id;
console.log('✅ Animal ID beállítva:', animalIdInput.value, 'típus:', typeof animalIdInput.value);
    const animalNameInput = document.getElementById('animalNameInput');
    if (animalNameInput) animalNameInput.value = animal.name;
    
    const modalAnimalInfo = document.getElementById('modalAnimalInfo');
    if (modalAnimalInfo) {
        modalAnimalInfo.innerHTML = `
            <div class="animal-info-summary">
                <img src="${animal.image}" alt="${animal.name}" onerror="this.src='https://via.placeholder.com/80x80?text=${animal.name}'">
                <div>
                    <h4>${animal.name}</h4>
                    <p>${animal.type === 'kutya' ? 'Kutya' : animal.type === 'macska' ? 'Macska' : 'Egyéb'} · ${animal.breed || 'ismeretlen fajta'} · ${animal.age}</p>
                </div>
            </div>
        `;
    }
    
    if (currentUser) {
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        
        if (fullNameInput && currentUser.fullname) fullNameInput.value = currentUser.fullname;
        if (emailInput && currentUser.email) emailInput.value = currentUser.email;
    }
    
    hideModal('animalModal');
    showModal('adoptionModal');
}

// =========================
// ÖRÖKBEFOGADÁSI ŰRLAP - JAVÍTVA
// =========================
function setupAdoptionForm() {
    const adoptionForm = document.getElementById('adoptionForm');
    if (!adoptionForm) {
        console.error('❌ Adoption form nem található!');
        return;
    }
    
    console.log('✅ Adoption form inicializálva');
    
    if (!document.getElementById('animalIdInput')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'animalIdInput';
        hiddenInput.name = 'animal_id';
        adoptionForm.appendChild(hiddenInput);
    }
    
    adoptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📝 Adoption form elküldve');
        
        if (currentUser?.role === 'admin') {
            alert('Adminisztrátorok nem fogadhatnak örökbe!');
            hideModal('adoptionModal');
            return;
        }
        
        const animalId = document.getElementById('animalIdInput')?.value;
        
        const animal = animals.find(a => a.id == animalId);
        if (animal && animal.adopted) {
            alert('❌ Ez az állat már örökbefogadásra került!');
            hideModal('adoptionModal');
            return;
        }
        
       const formData = {
    animalId: animalId || '',  // maradhat, mert a submitAdoption is használja
    animal_id: animalId || '', // <- EZT ADD HOZZÁ!
    animalName: document.getElementById('animalNameInput')?.value || '',
    fullName: document.getElementById('fullName')?.value || '',
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    homeType: document.getElementById('homeType')?.value || '',
    address: document.getElementById('address')?.value || '',
    experience: document.getElementById('experience')?.value || '',
    message: document.getElementById('message')?.value || '',
    newsletter: document.getElementById('newsletter')?.checked || false
};
        
        if (!formData.animalId) {
            alert('Hiba: Nem sikerült azonosítani az állatot!');
            return;
        }
        
        if (!formData.fullName || !formData.email || !formData.phone) {
            alert('Kérjük, töltsd ki a kötelező mezőket!');
            return;
        }
        
        try {
            const result = await submitAdoption(formData);
            if (result.success) {
                alert('✅ Köszönjük! Az örökbefogadási jelentkezésed fogadtuk. Hamarosan felvesszük veled a kapcsolatot!');
                
                saveAdoptionToLocalStorage(formData);
                
                hideModal('adoptionModal');
                adoptionForm.reset();
            } else {
                alert(result.error || 'Hiba történt a jelentkezés elküldése során!');
            }
        } catch (error) {
            console.error('Adoption error:', error);
            
            saveAdoptionToLocalStorage(formData);
            
            alert('✅ Demo mód: Az örökbefogadási kérelmed rögzítettük!');
            hideModal('adoptionModal');
            adoptionForm.reset();
        }
    });
    
    const cancelBtn = document.getElementById('cancelAdoption');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            hideModal('adoptionModal');
        });
    }
    
    const closeBtn = document.getElementById('closeAdoption');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideModal('adoptionModal');
        });
    }
}

function saveAdoptionToLocalStorage(formData) {
    try {
        let existingAdoptions = [];
        const stored = localStorage.getItem('admin_adoptions');
        if (stored) {
            existingAdoptions = JSON.parse(stored);
        }
        
        const newAdoption = {
            id: existingAdoptions.length > 0 ? Math.max(...existingAdoptions.map(a => a.id)) + 1 : 1,
            animal_id: parseInt(formData.animalId),
            animal_name: formData.animalName,
            user_id: currentUser?.id || 0,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            home_type: formData.homeType,
            address: formData.address,
            experience: formData.experience,
            message: formData.message,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        existingAdoptions.push(newAdoption);
        localStorage.setItem('admin_adoptions', JSON.stringify(existingAdoptions));
        localStorage.setItem('adoptionsUpdated', Date.now().toString());
        
        console.log('✅ Örökbefogadás mentve localStorage-ba:', newAdoption);
    } catch (error) {
        console.error('❌ Hiba a localStorage mentéskor:', error);
    }
}

async function submitAdoption(data) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('userToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const animalId = document.getElementById('animalIdInput')?.value;
    
    const requestData = {
        animal_id: animalId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        home_type: data.homeType,
        address: data.address,
        experience: data.experience,
        message: data.message
    };
    
    const response = await fetch('api.php?action=adoptions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
    });
    
    return await response.json();
}

// =========================
// OLDAL BETÖLTÉS
// =========================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Oldal betöltődött...');
    
    animals = getDemoAnimals();
    blogPosts = getDemoBlogPosts();
    
    initSlideshow();
    
    await loadAllUsers();
    await loadUserData();
    
    setupNavigation();
    setupAuthButtons();
    setupLogin();
    setupRegistration();
    setupAdoptionForm();
    setupUserDropdown();
    
    // Szűrők beállítása
    setupFilters();
    
    const closeAnimal = document.getElementById('closeAnimal');
    if (closeAnimal) {
        closeAnimal.addEventListener('click', () => hideModal('animalModal'));
    }
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
    
    try {
        await loadAnimalsFromAPI();
        await loadBlogPostsFromAPI();
    } catch (e) {
        console.error('Adatok betöltési hiba:', e);
    }
    
    console.log('🐾 Állatok megjelenítése... Összes állat:', animals.length);
    console.log('🐾 Örökbefogadott állatok:', animals.filter(a => a.adopted).length);
    
    renderFilteredAnimals();
    renderAnimals('featuredAnimals');
    renderBlogPosts();
    
    refreshUserMenuState();
    
    console.log(`✅ Kész! Állatok: ${animals.length}, Blog: ${blogPosts.length}, Felhasználók: ${allUsers.length}`);
    console.log('👤 Aktuális felhasználó:', currentUser);
});
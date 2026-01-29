// Állatok adatai
const animals = [
    {
        "id": 1,
        "name": "Füles",
        "type": "kutya",
        "breed": "Labrador keverék",
        "age": "2 éves",
        "gender": "Hím",
        "size": "kozepes",
        "description": "Füles egy kedves, bújós és kíváncsi kutya, aki imád játszani és sétálni. Gyorsan tanul és nagyon ragaszkodó.",
        "image": "img/kep1.jpg",
        "vaccinations": ["Kutya veszettség", "Parvovírus", "Hepatitis", "Leptospirózis"],
        "personality": "Barátságos, játékos, hűséges",
        "history": "Utcáról hozták be — valószínűleg elhagyott, mielőtt hozzánk került.",
        "specialNeeds": "Rendszeres, napi többszöri testmozgásra és figyelemre van szüksége.",
        "featured": true,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 2,
        "name": "Bea",
        "type": "macska",
        "breed": "Rövidszőrű cirmos",
        "age": "3 éves",
        "gender": "Nőstény",
        "size": "kis",
        "description": "Bea egy nyugodt, figyelmes cica, aki szeret bekuckózni, de játékos percei is vannak. Gyorsan barátkozik, ha lassan közelítenek hozzá.",
        "image": "img/kep2.jpg",
        "vaccinations": ["Macska panleukopénia", "Calicivírus", "Herpesz (rhinotracheitis)", "Macska leukózis (FeLV)"],
        "personality": "Nyugodt, kíváncsi, önálló",
        "history": "Valószínűleg elkóborolt házi macska — találtuk és behoztuk a menhelyre.",
        "specialNeeds": "Beltéri tartás ajánlott; rendszeres tiszta almot és nyugodt környezetet igényel.",
        "featured": true,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 3,
        "name": "Bodri",
        "type": "kutya",
        "breed": "Beagle",
        "age": "1 éves",
        "gender": "Hím",
        "size": "kozepes",
        "description": "Bodri egy kíváncsi és vidám kutya, aki mindig készen áll egy új kalandra.",
        "image": "img/kep3.jpg",
        "vaccinations": ["Kutya veszettség", "Parvovírus", "Hepatitis", "Leptospirózis"],
        "personality": "Kíváncsi, vidám, intelligens",
        "history": "Bodri tenyésztőtől került hozzánk, aki bezárta a vállalkozását.",
        "specialNeeds": "Rendszeres testmozgásra van szüksége",
        "featured": true,
        "urgent": true,
        "adopted": false
    },
    {
        "id": 4,
        "name": "Cirmoska",
        "type": "macska",
        "breed": "Házimacska (tarka)",
        "age": "5 éves",
        "gender": "Nőstény",
        "size": "kozepes",
        "description": "Cirmoska egy kedves, visszahúzódó macska, aki szeret puha párnákon pihenni és figyelni a környezetét.",
        "image": "img/kep4.jpg",
        "vaccinations": ["Macska veszettség", "Rhinotracheitis", "Calicivírus", "Panleukopenia"],
        "personality": "Csendes, érzékeny, ragaszkodó",
        "history": "Egy idősebb hölgytől került be, aki sajnos már nem tudott gondoskodni róla.",
        "specialNeeds": "Szereti a nyugalmat és a saját kis fekhelyét.",
        "featured": false,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 5,
        "name": "Bátor",
        "type": "kutya",
        "breed": "Kevert (valószínűleg terrier és vizsla keverék)",
        "age": "3 éves",
        "gender": "Kan",
        "size": "kozepes",
        "description": "Bátor fegyelmezett és figyelmes szolgálati kutya, aki mindig készen áll a feladatokra.",
        "image": "img/kep5.jpg",
        "vaccinations": ["Veszettség", "Parvovírus", "Szopornyica", "Leptospirózis"],
        "personality": "Éber, intelligens, hűséges",
        "history": "Kölyökkorától kezdve szolgálati kutyának képezték.",
        "specialNeeds": "Rendszeres tréningekre és sok mozgásra van szüksége.",
        "featured": false,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 6,
        "name": "Bundás",
        "type": "macska",
        "breed": "Házimacska (cirmos)",
        "age": "2 éves",
        "gender": "Kandúr",
        "size": "kozepes",
        "description": "Bundás egy játékos és aktív fiatal macska, aki imád a játékok között heverészni.",
        "image": "img/kep6.jpg",
        "vaccinations": ["Macska veszettség", "Rhinotracheitis", "Calicivírus"],
        "personality": "Játékos, kíváncsi, energikus",
        "history": "Egy kertben találták testvérével együtt, majd befogadták.",
        "specialNeeds": "Sok játékkal és foglalkoztatással érzi jól magát.",
        "featured": false,
        "urgent": true,
        "adopted": false
    },
    {
        "id": 7,
        "name": "Balu",
        "type": "kutya",
        "breed": "keverék (bull típusú)",
        "age": "kb. 3 éves",
        "gender": "Hím",
        "size": "kozepes-nagy",
        "description": "Balu egy erős, izmos, de meglepően gyengéd kutya. Nagyon szereti a sétákat és az emberek társaságát.",
        "image": "img/kep7.jpg",
        "vaccinations": ["Veszettség", "Parvovírus", "Hepatitis", "Leptospirózis"],
        "personality": "Barátságos, energikus, ragaszkodó",
        "history": "Gazdától került be, aki már nem tudta ellátni.",
        "specialNeeds": "Erős kutya, ezért következetes gazdára és sok mozgásra van szüksége.",
        "featured": true,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 8,
        "name": "Luna",
        "type": "macska",
        "breed": "rövidszőrű keverék",
        "age": "kb. 1 éves",
        "gender": "Nőstény",
        "size": "kis",
        "description": "Luna egy gyönyörű, fekete cica aranyszínű szemekkel. Nyugodt, figyelmes tekintete igazán megnyerő.",
        "image": "img/kep8.jpg",
        "vaccinations": ["Macska veszettség", "Rhinotracheitis", "Calicivírus", "Panleukopenia"],
        "personality": "Kedves, nyugodt, bújós",
        "history": "Utcáról mentették be sérülten, ma már teljesen egészséges.",
        "specialNeeds": "Érzékeny lehet a hidegre, így benti tartás ajánlott.",
        "featured": false,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 9,
        "name": "Max",
        "type": "kutya",
        "breed": "keverék",
        "age": "kb. 5 éves",
        "gender": "Hím",
        "size": "nagy",
        "description": "Max egy kedves, nyugodt kutya, aki imád pihenni a fűben. Hosszú séta után boldogan liheg.",
        "image": "img/kep9.jpg",
        "vaccinations": ["Veszettség", "Parvovírus", "Hepatitis", "Leptospirózis"],
        "personality": "Nyugodt, barátságos, türelmes",
        "history": "Kóbor kutyaként került be, de hamar megmutatta, mennyire szereti az embereket.",
        "specialNeeds": "Mérsékelt mozgásigény, érzékeny a melegre.",
        "featured": true,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 10,
        "name": "Molly",
        "type": "macska",
        "breed": "Bengáli",
        "age": "3 éves",
        "gender": "Nőstény",
        "size": "kozepes",
        "description": "Molly egy aktív és kíváncsi macska, aki szeret magas helyekre mászni.",
        "image": "img/kep10.jpg",
        "vaccinations": ["Macska veszettség", "Rhinotracheitis", "Calicivírus", "Panleukopenia"],
        "personality": "Aktív, kíváncsi, magas helyeket kedveli",
        "history": "Molly egy tenyésztőtől került hozzánk, aki bezárta a vállalkozását.",
        "specialNeeds": "Magas kaparófa szükséges",
        "featured": false,
        "urgent": true,
        "adopted": false
    },
    {
        "id": 11,
        "name": "Bella",
        "type": "kutya",
        "breed": "Arany retriever",
        "age": "1 éves",
        "gender": "Nőstény",
        "size": "nagy",
        "description": "Bella egy gyengéd és ragaszkodó kutya, aki imádja a gyerekeket.",
        "image": "img/kep11.jpg",
        "vaccinations": ["Kutya veszettség", "Parvovírus", "Hepatitis", "Leptospirózis"],
        "personality": "Gyengéd, ragaszkodó, gyerekbarát",
        "history": "Bella egy családtól került hozzánk, akiknek nem volt idejük rá.",
        "specialNeeds": "Nincs",
        "featured": true,
        "urgent": false,
        "adopted": false
    },
    {
        "id": 12,
        "name": "Oscar",
        "type": "macska",
        "breed": "Maine Coon",
        "age": "5 éves",
        "gender": "Hím",
        "size": "nagy",
        "description": "Oscar egy nyugodt és barátságos macska, aki szeret a társaságában lenni.",
        "image": "img/kep12.jpg",
        "vaccinations": ["Macska veszettség", "Rhinotracheitis", "Calicivírus", "Panleukopenia"],
        "personality": "Nyugodt, barátságos, társaságkedvelő",
        "history": "Oscar előző gazdája idősek otthonába került.",
        "specialNeeds": "Rendszeres fésülésre van szüksége",
        "featured": false,
        "urgent": false,
        "adopted": false
    }
    // Blog bejegyzések
const blogPosts = [
    {
        id: 1,
        title: "Rekord számú örökbefogadás!",
        excerpt: "Szeptemberben 25 állat talált örökbefogadót, ami rekord szám a menhelyünk történetében.",
        content: "Különösen örülünk, hogy a hosszú ideje nálunk élő idősebb állatok is gazdára találtak. A szeptemberi hónapban 25 állatot sikerült örökbefogadtatnunk, ami a menhelyünk történetében eddigi legjobb eredmény. Köszönjük mindenkinek, aki részt vett a sikerben!",
        image:"img/blog1.jpg",
        date: "2023-10-05",
        author: "Dominika"
    },
    {
        id: 2,
        title: "Új menhelyi program indult!",
        excerpt: "Bevezetjük a 'Menhelyi Napok' programot, ahol látogatók megismerhetik munkánkat.",
        content: "A program keretében minden szombaton 10-14 óra között tartunk nyílt napokat. Látogatók megismerhetik az állatokat, beszélgethetnek a gondozókkal és megtekinthetik a menhelyi létesítményeinket. Az első nyílt napok nagy sikert arattak, több mint 50 látogató volt nálunk!",
        image: "img/blog2.jpg",
        date: "2023-10-15",
        author: "Jázmin"
    },
    {
        id: 3,
        title: "Télire készülünk - adománygyűjtés",
        excerpt: "Téli takarókat, melegítőket és élelmiszert gyűjtünk az állatok számára.",
        content: "A hideg időjárás elközeledtével fontos, hogy az állatkák kényelmesen átvészeljék a telet. Gyűjtünk meleg takarókat, kutyaruhákat, macskamelegítőket és minőségi élelmiszereket. Az adományokat a menhelyünkre szállíthatják hétköznap 9-17 óra között.",
        image: "img/blog3.jpg",
        date: "2023-09-28",
        author: "Leila"
    }
];
// =========================
// GLOBÁLIS VÁLTOZÓK
// =========================
let currentAnimal = null;
let currentSlide = 0;
let slideInterval;
let currentUser = null;

// Szűrési változók
let activeFilters = {
    faj: 'all',
    nem: 'all-nem',
    kor: 'all-kor',
    meret: 'all-meret'
};

// =========================
// OLDAL NAVIGÁCIÓ - GLOBÁLIS FÜGGVÉNY
// =========================
window.showPage = function(pageId) {
    console.log(`Oldal váltás: ${pageId}`);
    
    // Összes oldal elrejtése
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Kiválasztott oldal megjelenítése
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error(`Nem található oldal: ${pageId}`);
    }
    
    // Navigációs linkek aktív állapotának frissítése
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // Görgetés az oldal tetejére
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =========================
// NAVIGÁCIÓ ESEMÉNYKEZELŐK
// =========================
function setupNavigation() {
    console.log("Navigáció beállítása...");
    
    // Csak a NAVIGÁCIÓS SORBAN lévő linkekre állítunk be eseménykezelőt
    document.querySelectorAll('nav .nav-link, .footer-links .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            console.log(`Navigációs link kattintás: ${pageId}`);
            window.showPage(pageId);
        });
    });
    
    // Külön kezeljük a slideshow gombokat
    setupSlideshowButtons();
}

// =========================
// SLIDESHOW GOMBOK
// =========================
function setupSlideshowButtons() {
    console.log("Slideshow gombok beállítása...");
    
    // Külön eseménykezelő a slideshow gomboknak
    const slideshowButtons = document.querySelectorAll('.slideshow .slideshow-btn');
    console.log(`Slideshow gombok száma: ${slideshowButtons.length}`);
    
    slideshowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const pageId = this.getAttribute('data-slide-page');
            console.log(`🚀 SLIDESHOW GOMB: ${pageId}`);
            
            if (pageId) {
                window.showPage(pageId);
            }
        }, true); // true = capture phase - ez fontos!
    });
}

// =========================
// SLIDESHOW KEZELÉS
// =========================
function initSlideshow() {
    console.log("Slideshow inicializálása...");
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    const prevArrow = document.querySelector('.slideshow-arrow.prev');
    const nextArrow = document.querySelector('.slideshow-arrow.next');
    
    if (slides.length === 0) {
        console.warn("Nincsenek slide elemek!");
        return;
    }
    
    // 1. Vissza nyíl (balra)
    if (prevArrow) {
        prevArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.remove('active');
            }
            
            currentSlide = currentSlide - 1;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
            
            restartSlideshowInterval();
        });
    }
    
    // 2. Előre nyíl (jobbra)
    if (nextArrow) {
        nextArrow.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.remove('active');
            }
            
            currentSlide = currentSlide + 1;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
            
            restartSlideshowInterval();
        });
    }
    
    // 3. Dotok
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) {
                dots[currentSlide].classList.remove('active');
            }
            
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            
            restartSlideshowInterval();
        });
    });
    
    // 4. Automatikus slideshow
    startSlideshowInterval();
    
    // 5. Hover effekt
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', function() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        });
        
        slideshow.addEventListener('mouseleave', function() {
            startSlideshowInterval();
        });
    }
}

function startSlideshowInterval() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(function() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slideshow-dot');
        
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove('active');
        }
        
        currentSlide = currentSlide + 1;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }, 6000);
}

function restartSlideshowInterval() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    startSlideshowInterval();
}

// =========================
// SZŰRÉSI FUNKCIÓK (LEGÖRDÜLŐ MENÜ)
// =========================

// Legördülő menü kezelése
function setupFilterDropdown() {
    const dropdownBtn = document.getElementById('filterDropdownBtn');
    const dropdownContent = document.getElementById('filterDropdownContent');
    const filterOptions = document.querySelectorAll('.filter-dropdown-option');
    
    if (!dropdownBtn || !dropdownContent) return;
    
    // Legördülő menü megnyitása/bezárása
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
        dropdownBtn.classList.toggle('active');
    });
    
    // Menü bezárása ha kívülre kattintanak
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('show');
            dropdownBtn.classList.remove('active');
        }
    });
    
    // Szűrő opciók kezelése
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter-type');
            const filterValue = this.getAttribute('data-filter-value');
            
            // Távolítsuk el az összes "összes" opciót azonos típusból
            if (filterValue === 'all' || filterValue === 'all-nem' || 
                filterValue === 'all-kor' || filterValue === 'all-meret') {
                // Visszaállítjuk az adott típus összes szűrőjét
                resetFilterType(filterType);
                activeFilters[filterType] = filterValue;
            } else {
                // Ha az összes opció aktív, kikapcsoljuk
                const allOption = document.querySelector(`[data-filter-type="${filterType}"][data-filter-value^="all"]`);
                if (allOption) {
                    allOption.classList.remove('active');
                }
                
                // Állítsuk be az új szűrőt
                activeFilters[filterType] = filterValue;
            }
            
            // Frissítsük a kijelölést
            updateFilterSelection();
            updateActiveFiltersDisplay();
            renderFilteredAnimals();
        });
    });
}

// Szűrő típus visszaállítása
function resetFilterType(filterType) {
    // Távolítsuk el az összes kijelölést az adott típusból
    document.querySelectorAll(`[data-filter-type="${filterType}"]`).forEach(option => {
        option.classList.remove('active');
    });
    
    // Állítsuk vissza az "összes" opciót
    const allOption = document.querySelector(`[data-filter-type="${filterType}"][data-filter-value^="all"]`);
    if (allOption) {
        allOption.classList.add('active');
    }
}

// Szűrő kijelölés frissítése
function updateFilterSelection() {
    document.querySelectorAll('.filter-dropdown-option').forEach(option => {
        option.classList.remove('active');
        
        const filterType = option.getAttribute('data-filter-type');
        const filterValue = option.getAttribute('data-filter-value');
        
        if (activeFilters[filterType] === filterValue) {
            option.classList.add('active');
        }
    });
}

// Kor kategóriák meghatározása
function getAgeCategory(ageString) {
    // Kinyerjük a számot az "X éves" stringből
    const ageMatch = ageString.match(/(\d+)/);
    if (!ageMatch) return 'fiatal';
    
    const age = parseInt(ageMatch[1]);
    if (age <= 1) return 'kolyok';
    if (age <= 4) return 'fiatal';
    if (age <= 8) return 'felnott';
    return 'idos';
}

// Szűrés logika
function filterAnimals() {
    return animals.filter(animal => {
        // Csak nem örökbefogadott állatok
        if (animal.adopted) {
            return false;
        }
        
        // Faj szűrés
        if (activeFilters.faj !== 'all' && animal.type !== activeFilters.faj) {
            return false;
        }
        
        // Nem szűrés
        if (activeFilters.nem !== 'all-nem') {
            const genderMap = {
                'Hím': 'him',
                'Kan': 'him', 
                'Kandúr': 'him',
                'Nőstény': 'nosteny'
            };
            
            const animalGender = genderMap[animal.gender] || animal.gender.toLowerCase();
            const filterGender = activeFilters.nem === 'him' ? 'him' : 'nosteny';
            
            if (animalGender !== filterGender) {
                return false;
            }
        }
        
        // Kor szűrés
        if (activeFilters.kor !== 'all-kor') {
            const ageCategory = getAgeCategory(animal.age);
            if (ageCategory !== activeFilters.kor) {
                return false;
            }
        }
        
        // Méret szűrés
        if (activeFilters.meret !== 'all-meret') {
            // Különleges méretek kezelése
            if (animal.size === 'kozepes-nagy') {
                if (activeFilters.meret === 'nagy' || activeFilters.meret === 'kozepes') {
                    // Megfelel mindkettőnek
                } else {
                    return false;
                }
            } else if (animal.size !== activeFilters.meret) {
                return false;
            }
        }
        
        return true;
    });
}

// Aktív szűrők frissítése
function updateActiveFiltersDisplay() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    const filterCountElement = document.getElementById('filterCount');
    const noResultsElement = document.getElementById('noResults');
    
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    let activeFilterCount = 0;
    const filteredAnimals = filterAnimals();
    
    // Szűrők hozzáadása
    Object.keys(activeFilters).forEach(key => {
        if (activeFilters[key] !== 'all' && 
            activeFilters[key] !== 'all-nem' && 
            activeFilters[key] !== 'all-kor' && 
            activeFilters[key] !== 'all-meret') {
            
            activeFilterCount++;
            
            let filterName = '';
            switch(key) {
                case 'faj':
                    filterName = activeFilters[key] === 'kutya' ? 'Kutya' : 'Macska';
                    break;
                case 'nem':
                    filterName = activeFilters[key] === 'him' ? 'Hím' : 'Nőstény';
                    break;
                case 'kor':
                    const korNames = {
                        'kolyok': 'Kölyök (0-1 év)',
                        'fiatal': 'Fiatal (1-4 év)',
                        'felnott': 'Felnőtt (4-8 év)',
                        'idos': 'Idős (8+ év)'
                    };
                    filterName = korNames[activeFilters[key]] || activeFilters[key];
                    break;
                case 'meret':
                    const meretNames = {
                        'kis': 'Kis méret',
                        'kozepes': 'Közepes méret',
                        'nagy': 'Nagy méret'
                    };
                    filterName = meretNames[activeFilters[key]] || activeFilters[key];
                    break;
            }
            
            const filterTag = document.createElement('div');
            filterTag.className = 'active-filter-tag';
            filterTag.innerHTML = `
                ${filterName}
                <button class="remove-filter" data-filter-type="${key}" title="Szűrő eltávolítása">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            filterTag.querySelector('.remove-filter').addEventListener('click', function(e) {
                e.stopPropagation();
                const filterType = this.getAttribute('data-filter-type');
                removeFilter(filterType);
            });
            
            activeFiltersContainer.appendChild(filterTag);
        }
    });
    
    // Találatok száma
    if (filterCountElement) {
        filterCountElement.textContent = filteredAnimals.length;
    }
    
    // Nincs találat üzenet
    if (noResultsElement && filteredAnimals.length === 0 && activeFilterCount > 0) {
        noResultsElement.style.display = 'block';
    } else if (noResultsElement) {
        noResultsElement.style.display = 'none';
    }
}

// Szűrők törlése
function resetFilters() {
    activeFilters = {
        faj: 'all',
        nem: 'all-nem',
        kor: 'all-kor',
        meret: 'all-meret'
    };
    
    updateFilterSelection();
    updateActiveFiltersDisplay();
    renderFilteredAnimals();
}

// Szűrő eltávolítása
function removeFilter(filterType) {
    switch(filterType) {
        case 'faj':
            activeFilters.faj = 'all';
            break;
        case 'nem':
            activeFilters.nem = 'all-nem';
            break;
        case 'kor':
            activeFilters.kor = 'all-kor';
            break;
        case 'meret':
            activeFilters.meret = 'all-meret';
            break;
    }
    
    updateFilterSelection();
    updateActiveFiltersDisplay();
    renderFilteredAnimals();
}

// Szűrt állatok renderelése
function renderFilteredAnimals() {
    const filteredAnimals = filterAnimals();
    renderAnimals('adoptionAnimals', filteredAnimals);
}

// =========================
// ÁLLAT KÁRTYÁK GENERÁLÁSA
// =========================
function renderAnimals(containerId, animalsToRender = null) {
    const animalGrid = document.getElementById(containerId);
    if (!animalGrid) {
        console.error(`Nem található: ${containerId}`);
        return;
    }
    
    animalGrid.innerHTML = '';
    
    // Ha nem adtunk meg állatlistát, akkor szűrjük
    if (!animalsToRender && containerId === 'adoptionAnimals') {
        animalsToRender = filterAnimals();
    } else if (!animalsToRender && containerId === 'featuredAnimals') {
        animalsToRender = animals.filter(animal => animal.featured && !animal.adopted);
    }
    
    if (animalsToRender.length === 0 && containerId === 'adoptionAnimals') {
        return;
    }
    
    animalsToRender.forEach(animal => {
        const animalCard = document.createElement('div');
        animalCard.className = 'animal-card fade-in';
        
        if (animal.adopted) {
            animalCard.classList.add('adopted-animal');
        }
        
        if (animal.urgent) {
            animalCard.classList.add('urgent-animal');
        }
        
        animalCard.innerHTML = `
            <div class="animal-image">
                <img src="${animal.image}" alt="${animal.name}" onerror="this.src='https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                ${animal.urgent ? '<div class="urgent-label">Sürgős eset!</div>' : ''}
                ${animal.adopted ? '<div class="adopted-label">Örökbefogadva!</div>' : ''}
            </div>
            <div class="animal-info">
                <h3>${animal.name}</h3>
                <p>${animal.description}</p>
                <div class="animal-features">
                    <span class="feature">${animal.type}</span>
                    <span class="feature">${animal.breed}</span>
                    <span class="feature">${animal.age}</span>
                    <span class="feature">${animal.gender}</span>
                    <span class="feature">${animal.size}</span>
                </div>
                <div class="animal-actions">
                    ${animal.adopted ? 
                        '<button class="adopted-btn" disabled>Már örökbefogadva!</button>' : 
                        `<button class="adopt-btn" data-id="${animal.id}">Örökbefogadom!</button>`
                    }
                    <button class="details-btn" data-id="${animal.id}">Részletek</button>
                </div>
            </div>
        `;
        
        animalGrid.appendChild(animalCard);
    });
    
    // Gombok eseménykezelői
    document.querySelectorAll('.adopt-btn').forEach(button => {
        button.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            startAdoption(animalId);
        });
    });
    
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const animalId = this.getAttribute('data-id');
            showAnimalDetails(animalId);
        });
    });
}
// =========================
// ÁLLAT RÉSZLETEK MEGJELENÍTÉSE
// =========================
window.showAnimalDetails = function(animalId) {
    const animal = animals.find(a => a.id == animalId);
    if (!animal) return;
    
    const animalDetails = document.getElementById('animalDetails');
    if (!animalDetails) return;

    animalDetails.innerHTML = `
        <div class="animal-details-image">
            <img src="${animal.image}" alt="${animal.name}" onerror="this.src='https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
            ${animal.urgent ? '<div class="urgent-badge">Sürgős eset!</div>' : ''}
            ${animal.adopted ? '<div class="adopted-badge">Örökbefogadva!</div>' : ''}
        </div>
        <div class="animal-details-info">
            <h3>${animal.name}</h3>
            <p><strong>Faj:</strong> ${animal.type}</p>
            <p><strong>Fajta:</strong> ${animal.breed}</p>
            <p><strong>Életkor:</strong> ${animal.age}</p>
            <p><strong>Nem:</strong> ${animal.gender}</p>
            <p><strong>Méret:</strong> ${animal.size}</p>
            <p><strong>Személyiség:</strong> ${animal.personality}</p>
            <p><strong>Története:</strong> ${animal.history}</p>
            <p><strong>Speciális igények:</strong> ${animal.specialNeeds}</p>
            <p><strong>Státusz:</strong> ${animal.adopted ? '<span style="color: #2a9d8f; font-weight: bold;">Örökbefogadva</span>' : '<span style="color: #e74c3c; font-weight: bold;">Örökbefogadható</span>'}</p>

            <div class="vaccination-list">
                <h4>Oltások:</h4>
                <ul>
                    ${animal.vaccinations.map(vacc => `<li>${vacc}</li>`).join('')}
                </ul>
            </div>

            ${animal.adopted ? 
                '<button class="btn" style="margin-top: 20px; background-color: #95a5a6; cursor: not-allowed;" disabled>Már örökbefogadva</button>' : 
                `<button class="btn" style="margin-top: 20px;" onclick="startAdoption(${animal.id})">Örökbefogadom!</button>`
            }
        </div>
    `;

    document.getElementById('animalModal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

// =========================
// ÖRÖKBEFOGADÁS INDÍTÁSA
// =========================
window.startAdoption = function(animalId) {
    currentAnimal = animals.find(a => a.id == animalId);
    if (!currentAnimal) return;
    
    const animalInput = document.getElementById('animalNameInput');
    if (animalInput) {
        animalInput.value = currentAnimal.name;
    }
    
    // Frissítjük a modal állat információit
    const modalAnimalInfo = document.getElementById('modalAnimalInfo');
    if (modalAnimalInfo && currentAnimal) {
        modalAnimalInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${currentAnimal.image}" alt="${currentAnimal.name}" 
                     style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;"
                     onerror="this.src='https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: var(--primary);">${currentAnimal.name}</h4>
                    <p style="margin: 0; font-size: 0.95rem;">${currentAnimal.type} - ${currentAnimal.breed}</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #666;">${currentAnimal.age} • ${currentAnimal.gender} • ${currentAnimal.size}</p>
                </div>
            </div>
        `;
    }
    
    // Állat részletek modal bezárása
    document.getElementById('animalModal').style.display = 'none';
    
    // Örökbefogadási modal megjelenítése
    document.getElementById('adoptionModal').style.display = 'flex';
    document.body.classList.add('modal-open');
    
    // Automatikus görgetés a modal tetejére
    setTimeout(() => {
        const modalContent = document.querySelector('.adoption-modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 100);
}
// =========================
// BLOG BEJEGYZÉSEK MEGJELENÍTÉSE
// =========================
function renderBlogPosts() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) {
        console.error("Nem található: newsGrid");
        return;
    }
    
    newsGrid.innerHTML = '';

    blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'news-card fade-in';

        postElement.innerHTML = `
            <div class="news-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="news-content">
                <h3>${post.title}</h3>
                <p class="news-excerpt">${post.excerpt}</p>
                <div class="news-meta">
                    <span class="news-date">${formatDate(post.date)}</span>
                    <span class="news-author">Írta: ${post.author}</span>
                </div>
                <button class="news-read-more" data-id="${post.id}">Tovább olvasom</button>
            </div>
        `;

        newsGrid.appendChild(postElement);
    });

    // Tovább olvasom gombok
    document.querySelectorAll('.news-read-more').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-id');
            const post = blogPosts.find(p => p.id == postId);
            if (post) {
                alert(`A teljes cikk megjelenítése jelenleg fejlesztés alatt áll.\n\n${post.title}\n\n${post.content}`);
            }
        });
    });
}

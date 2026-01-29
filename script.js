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

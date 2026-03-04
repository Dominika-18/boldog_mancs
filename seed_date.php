<?php
// seed_data.php - Demo adatok beszúrása
require_once 'config.php';

$conn = getDBConnection();

// Demo állatok
$demoAnimals = [
    [
        'name' => 'Füles',
        'type' => 'kutya',
        'breed' => 'Labrador keverék',
        'age' => '2 éves',
        'gender' => 'Hím',
        'size' => 'kozepes',
        'description' => 'Füles egy kedves, bújós és kíváncsi kutya, aki imád játszani és sétálni.',
        'image' => 'img/kep1.jpg',
        'personality' => 'Barátságos, játékos, hűséges',
        'history' => 'Utcáról hozták be — valószínűleg elhagyott, mielőtt hozzánk került.',
        'special_needs' => 'Rendszeres, napi többszöri testmozgásra és figyelemre van szüksége.',
        'vaccinations' => json_encode(['Kutya veszettség', 'Parvovírus', 'Hepatitis', 'Leptospirózis']),
        'featured' => 1,
        'urgent' => 0,
        'adopted' => 0
    ],
    [
        'name' => 'Bea',
        'type' => 'macska',
        'breed' => 'Rövidszőrű cirmos',
        'age' => '3 éves',
        'gender' => 'Nőstény',
        'size' => 'kis',
        'description' => 'Bea egy nyugodt, figyelmes cica, aki szeret bekuckózni, de játékos percei is vannak.',
        'image' => 'img/kep2.jpg',
        'personality' => 'Nyugodt, kíváncsi, önálló',
        'history' => 'Valószínűleg elkóborolt házi macska — találtuk és behoztuk a menhelyre.',
        'special_needs' => 'Beltéri tartás ajánlott; rendszeres tiszta almot és nyugodt környezetet igényel.',
        'vaccinations' => json_encode(['Macska panleukopénia', 'Calicivírus', 'Herpesz (rhinotracheitis)', 'Macska leukózis (FeLV)']),
        'featured' => 1,
        'urgent' => 0,
        'adopted' => 0
    ],
    [
        'name' => 'Bodri',
        'type' => 'kutya',
        'breed' => 'Beagle',
        'age' => '1 éves',
        'gender' => 'Hím',
        'size' => 'kozepes',
        'description' => 'Bodri egy kíváncsi és vidám kutya, aki mindig készen áll egy új kalandra.',
        'image' => 'img/kep3.jpg',
        'personality' => 'Kíváncsi, vidám, intelligens',
        'history' => 'Bodri tenyésztőtől került hozzánk, aki bezárta a vállalkozását.',
        'special_needs' => 'Rendszeres testmozgásra van szüksége',
        'vaccinations' => json_encode(['Kutya veszettség', 'Parvovírus', 'Hepatitis', 'Leptospirózis']),
        'featured' => 1,
        'urgent' => 1,
        'adopted' => 0
    ],
    // További állatok...
];

// Demo felhasználók
$demoUsers = [
    [
        'username' => 'admin',
        'email' => 'admin@boldogmancs.hu',
        'fullname' => 'Adminisztrátor',
        'password' => password_hash('admin123', PASSWORD_BCRYPT),
        'role' => 'admin'
    ],
    [
        'username' => 'tesztfelhasznalo',
        'email' => 'teszt@example.hu',
        'fullname' => 'Teszt Felhasználó',
        'password' => password_hash('teszt123', PASSWORD_BCRYPT),
        'role' => 'user'
    ]
];

// Demo blog bejegyzések
$demoBlogPosts = [
    [
        'title' => 'Rekord számú örökbefogadás!',
        'excerpt' => 'Szeptemberben 25 állat talált örökbefogadót, ami rekord szám a menhelyünk történetében.',
        'content' => 'Különösen örülünk, hogy a hosszú ideje nálunk élő idősebb állatok is gazdára találtak. A szeptemberi hónapban 25 állatot sikerült örökbefogadtatnunk, ami a menhelyünk történetében eddigi legjobb eredmény.',
        'image' => 'img/blog1.jpg',
        'author' => 'Dominika',
        'published' => 1
    ],
    [
        'title' => 'Új menhelyi program indult!',
        'excerpt' => 'Bevezetjük a \'Menhelyi Napok\' programot, ahol látogatók megismerhetik munkánkat.',
        'content' => 'A program keretében minden szombaton 10-14 óra között tartunk nyílt napokat. Látogatók megismerhetik az állatokat, beszélgethetnek a gondozókkal.',
        'image' => 'img/blog2.jpg',
        'author' => 'Jázmin',
        'published' => 1
    ]
];

echo "Adatbázis inicializálása...\n";

// Felhasználók beszúrása
foreach ($demoUsers as $user) {
    $sql = "INSERT INTO users (username, email, fullname, password, role) 
            VALUES ('{$user['username']}', '{$user['email']}', '{$user['fullname']}', 
                    '{$user['password']}', '{$user['role']}')
            ON DUPLICATE KEY UPDATE email = VALUES(email)";
    
    if ($conn->query($sql)) {
        echo "✅ Felhasználó létrehozva: {$user['username']}\n";
    } else {
        echo "❌ Hiba felhasználó létrehozásánál: " . $conn->error . "\n";
    }
}

// Állatok beszúrása
foreach ($demoAnimals as $animal) {
    $columns = implode(', ', array_keys($animal));
    $values = "'" . implode("', '", array_values($animal)) . "'";
    
    $sql = "INSERT INTO animals ($columns) VALUES ($values)
            ON DUPLICATE KEY UPDATE name = VALUES(name)";
    
    if ($conn->query($sql)) {
        echo "✅ Állat létrehozva: {$animal['name']}\n";
    } else {
        echo "❌ Hiba állat létrehozásánál: " . $conn->error . "\n";
    }
}

// Blog bejegyzések beszúrása
foreach ($demoBlogPosts as $post) {
    $columns = implode(', ', array_keys($post));
    $values = "'" . implode("', '", array_values($post)) . "'";
    
    $sql = "INSERT INTO blog_posts ($columns) VALUES ($values)
            ON DUPLICATE KEY UPDATE title = VALUES(title)";
    
    if ($conn->query($sql)) {
        echo "✅ Blog bejegyzés létrehozva: {$post['title']}\n";
    } else {
        echo "❌ Hiba blog bejegyzés létrehozásánál: " . $conn->error . "\n";
    }
}

// Demo örökbefogadás (csak ha van állat és felhasználó)
$sql = "SELECT id FROM animals WHERE name = 'Füles' LIMIT 1";
$result = $conn->query($sql);
$animal = $result->fetch_assoc();

$sql = "SELECT id FROM users WHERE username = 'tesztfelhasznalo' LIMIT 1";
$result = $conn->query($sql);
$user = $result->fetch_assoc();

if ($animal && $user) {
    $adoption = [
        'animal_id' => $animal['id'],
        'user_id' => $user['id'],
        'full_name' => 'Teszt Felhasználó',
        'email' => 'teszt@example.hu',
        'phone' => '+36 30 123 4567',
        'home_type' => 'lakas',
        'address' => '1234 Budapest, Teszt utca 1.',
        'experience' => 'Korábban volt kutyám és macskám is.',
        'message' => 'Nagyon szeretném örökbefogadni Füles-t!',
        'status' => 'pending'
    ];
    
    $columns = implode(', ', array_keys($adoption));
    $values = implode(', ', array_map(function($val) {
        return "'" . $val . "'";
    }, array_values($adoption)));
    
    $sql = "INSERT INTO adoptions ($columns) VALUES ($values)";
    
    if ($conn->query($sql)) {
        echo "✅ Demo örökbefogadás létrehozva\n";
        
        // Állat státuszának frissítése
        $conn->query("UPDATE animals SET adopted = 1 WHERE id = {$animal['id']}");
    } else {
        echo "❌ Hiba örökbefogadás létrehozásánál: " . $conn->error . "\n";
    }
}

echo "\n🎉 Demo adatok sikeresen beszúrva!\n";
$conn->close();
?>
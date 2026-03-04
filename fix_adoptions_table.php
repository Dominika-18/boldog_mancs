<?php
require_once 'config.php';

$conn = getDBConnection();

echo "<h2>Örökbefogadások tábla javítása</h2>";

// 1. 0-s ID javítása
$result = $conn->query("SELECT id FROM adoptions WHERE id = 0");
if ($result->num_rows > 0) {
    echo "<p>⚠️ Van 0-s ID-jú rekord, javítás...</p>";
    
    // Kapunk egy új ID-t
    $conn->query("INSERT INTO adoptions (animal_id, full_name, email, phone) VALUES (1, 'tmp', 'tmp@tmp.hu', 'tmp')");
    $new_id = $conn->insert_id;
    $conn->query("DELETE FROM adoptions WHERE id = $new_id");
    
    // Átállítjuk a 0-s ID-t
    $conn->query("UPDATE adoptions SET id = $new_id WHERE id = 0");
    echo "<p>✅ 0-s ID javítva: új ID = $new_id</p>";
}

// 2. PRIMARY KEY ellenőrzése
$result = $conn->query("SHOW KEYS FROM adoptions WHERE Key_name = 'PRIMARY'");
if ($result->num_rows == 0) {
    echo "<p>❌ Nincs PRIMARY KEY, hozzáadás...</p>";
    $conn->query("ALTER TABLE adoptions ADD PRIMARY KEY (id)");
    echo "<p>✅ PRIMARY KEY hozzáadva</p>";
} else {
    echo "<p>✅ PRIMARY KEY létezik</p>";
}

// 3. AUTO_INCREMENT ellenőrzése
$result = $conn->query("SHOW TABLE STATUS LIKE 'adoptions'");
$row = $result->fetch_assoc();
$auto_increment = $row['Auto_increment'] ?? null;

if (!$auto_increment) {
    echo "<p>❌ Nincs AUTO_INCREMENT, hozzáadás...</p>";
    $conn->query("ALTER TABLE adoptions MODIFY id INT NOT NULL AUTO_INCREMENT");
    
    // AUTO_INCREMENT beállítása
    $max_id = $conn->query("SELECT MAX(id) as max_id FROM adoptions")->fetch_assoc()['max_id'];
    $new_auto = $max_id + 1;
    $conn->query("ALTER TABLE adoptions AUTO_INCREMENT = $new_auto");
    
    echo "<p>✅ AUTO_INCREMENT hozzáadva, új érték: $new_auto</p>";
} else {
    echo "<p>✅ AUTO_INCREMENT jelenleg: $auto_increment</p>";
}

// 4. Végeredmény listázása
echo "<h3>Javított örökbefogadások:</h3>";
$result = $conn->query("SELECT id, animal_id, user_id, status, created_at FROM adoptions ORDER BY id");
echo "<table border='1' cellpadding='8'>";
echo "<tr><th>ID</th><th>Állat ID</th><th>Felhasználó ID</th><th>Státusz</th><th>Dátum</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['animal_id'] . "</td>";
    echo "<td>" . ($row['user_id'] ?: 'NULL') . "</td>";
    echo "<td>" . $row['status'] . "</td>";
    echo "<td>" . $row['created_at'] . "</td>";
    echo "</tr>";
}
echo "</table>";

$conn->close();

echo "<hr>";
echo "<h3 style='color:green;'>✅ Javítás kész! Most már működnie kell az örökbefogadások elfogadásának.</h3>";
echo "<p><a href='admin_adoptions.html'>👉 Tovább az örökbefogadások kezeléséhez</a></p>";
?>
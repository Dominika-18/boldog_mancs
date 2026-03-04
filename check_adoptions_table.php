<?php
require_once 'config.php';

$conn = getDBConnection();

echo "<h2>Örökbefogadások tábla ellenőrzése</h2>";

// Tábla szerkezet
$result = $conn->query("SHOW CREATE TABLE adoptions");
$row = $result->fetch_assoc();
echo "<pre>" . $row['Create Table'] . "</pre>";

// Auto_increment érték
$result = $conn->query("SHOW TABLE STATUS LIKE 'adoptions'");
$row = $result->fetch_assoc();
echo "<p><strong>Auto_increment:</strong> " . ($row['Auto_increment'] ?? 'Nincs') . "</p>";

// Örökbefogadások listája
echo "<h3>Örökbefogadások:</h3>";
$result = $conn->query("SELECT id, animal_id, user_id, status, created_at FROM adoptions ORDER BY id");
echo "<table border='1' cellpadding='8'>";
echo "<tr><th>ID</th><th>Állat ID</th><th>Felhasználó ID</th><th>Státusz</th><th>Dátum</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['animal_id'] . "</td>";
    echo "<td>" . $row['user_id'] . "</td>";
    echo "<td>" . $row['status'] . "</td>";
    echo "<td>" . $row['created_at'] . "</td>";
    echo "</tr>";
}
echo "</table>";

$conn->close();
?>
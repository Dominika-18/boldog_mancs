<?php
require_once 'config.php';

$conn = getDBConnection();

echo "<h2>Állatok tábla ellenőrzése</h2>";

// Tábla szerkezet
$result = $conn->query("SHOW CREATE TABLE animals");
$row = $result->fetch_assoc();
echo "<pre>" . $row['Create Table'] . "</pre>";

// Auto_increment érték
$result = $conn->query("SHOW TABLE STATUS LIKE 'animals'");
$row = $result->fetch_assoc();
echo "<p><strong>Auto_increment:</strong> " . ($row['Auto_increment'] ?? 'Nincs') . "</p>";

// Állatok listája ID szerint
echo "<h3>Állatok ID szerint:</h3>";
$result = $conn->query("SELECT id, name FROM animals ORDER BY id");
echo "<ul>";
while ($row = $result->fetch_assoc()) {
    echo "<li>ID: {$row['id']} - {$row['name']}</li>";
}
echo "</ul>";

$conn->close();
?>
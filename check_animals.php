<?php
// check_animals.php
$conn = new mysqli('localhost', 'root', '', 'boldog_mancs');

$result = $conn->query("SELECT * FROM animals");
$count = $result->num_rows;

echo "<h2>Ellenőrzés: {$count} állat az adatbázisban</h2>";

if ($result->num_rows > 0) {
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Név</th><th>Faj</th><th>Fajta</th><th>Kép</th></tr>";
    
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td><strong>{$row['name']}</strong></td>";
        echo "<td>{$row['type']}</td>";
        echo "<td>{$row['breed']}</td>";
        echo "<td><img src='{$row['image']}' width='50' height='50' style='object-fit: cover;'></td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "❌ Nincs állat az adatbázisban!";
}

$conn->close();
?>
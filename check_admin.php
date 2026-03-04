<?php
// check_admin.php
require_once 'config.php';

$conn = getDBConnection();

// Ellenőrzés
$sql = "SHOW TABLES LIKE 'users'";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    die("❌ A 'users' tábla nem létezik az adatbázisban!");
}

echo "✅ A 'users' tábla létezik.<br><br>";

// Ellenőrizzük az admin felhasználót
$sql = "SELECT id, username, email, role, created_at FROM users 
        WHERE username = 'admin' OR role = 'admin' 
        ORDER BY id DESC";
$result = $conn->query($sql);

echo "<h3>Admin felhasználók az adatbázisban:</h3>";

if ($result->num_rows > 0) {
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Felhasználónév</th><th>Email</th><th>Jogosultság</th><th>Létrehozva</th></tr>";
    
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row["id"] . "</td>";
        echo "<td><strong>" . $row["username"] . "</strong></td>";
        echo "<td>" . $row["email"] . "</td>";
        echo "<td>" . $row["role"] . "</td>";
        echo "<td>" . $row["created_at"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "❌ Nincs admin felhasználó az adatbázisban!<br>";
    echo '<a href="create_admin_secure.php">Kattints ide admin létrehozásához</a>';
}

// Mutasd meg az összes felhasználót is
echo "<br><hr><h3>Összes felhasználó:</h3>";

$sql_all = "SELECT id, username, email, role, created_at FROM users ORDER BY id";
$result_all = $conn->query($sql_all);

if ($result_all->num_rows > 0) {
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Felhasználónév</th><th>Email</th><th>Jogosultság</th><th>Létrehozva</th></tr>";
    
    while($row = $result_all->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row["id"] . "</td>";
        echo "<td>" . $row["username"] . "</td>";
        echo "<td>" . $row["email"] . "</td>";
        echo "<td>" . $row["role"] . "</td>";
        echo "<td>" . $row["created_at"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "Nincs egyetlen felhasználó sem az adatbázisban!";
}

$conn->close();
?>
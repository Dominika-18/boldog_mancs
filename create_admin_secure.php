<?php
// create_admin_secure.php
require_once 'config.php';

$conn = getDBConnection();

// Alapértelmezett admin adatok
$username = 'admin';
$email = 'admin@boldogmancs.hu';
$fullname = 'Rendszergazda';
$password = password_hash('admin123', PASSWORD_DEFAULT);
$role = 'admin';
$created_at = date('Y-m-d H:i:s');

// Ellenőrizzük, hogy létezik-e már
$check_sql = "SELECT id FROM users WHERE username = ? OR email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("ss", $username, $email);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

echo "<h2>Admin felhasználó létrehozása</h2>";

if ($check_result->num_rows > 0) {
    echo "❌ Az admin felhasználó már létezik!<br>";
    echo '<a href="check_admin.php">Kattints ide az ellenőrzéshez</a>';
} else {
    // Beszúrás prepared statementtel
    $sql = "INSERT INTO users (username, email, fullname, password, role, created_at) 
            VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $username, $email, $fullname, $password, $role, $created_at);
    
    if ($stmt->execute()) {
        echo "✅ <h3 style='color:green;'>Admin felhasználó sikeresen létrehozva!</h3><br>";
        echo "<strong>Bejelentkezési adatok:</strong><br>";
        echo "Felhasználónév: <strong>admin</strong><br>";
        echo "Jelszó: <strong>admin123</strong><br>";
        echo "Email: <strong>admin@boldogmancs.hu</strong><br><br>";
        echo '<a href="admin.html">Kattints ide az admin felülethez</a><br>';
        echo '<a href="check_admin.php">Kattints ide az ellenőrzéshez</a>';
    } else {
        echo "❌ Hiba: " . $stmt->error . "<br>";
        echo "SQL hiba: " . $conn->error;
    }
    
    $stmt->close();
}

$check_stmt->close();
$conn->close();

echo "<br><hr><h4>Debug információk:</h4>";
echo "PHP verzió: " . PHP_VERSION . "<br>";
echo "Password hash támogatás: " . (function_exists('password_hash') ? '✅ Igen' : '❌ Nem');
?>
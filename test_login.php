<?php
// test_login.php - egyszerű teszt a bejelentkezéshez
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$conn = getDBConnection();

// Bejelentkezési kísérlet
$username = 'admin';
$password = 'admin123';

echo "<h2>Bejelentkezési teszt</h2>";

// Lekérdezzük a felhasználót
$sql = "SELECT id, username, email, fullname, password, role FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo "<p style='color:green;'>✅ Admin felhasználó megtalálva: " . $user['username'] . "</p>";
    
    // Ellenőrizzük a jelszót
    if (password_verify($password, $user['password'])) {
        echo "<p style='color:green;'>✅ Jelszó helyes!</p>";
        
        // Token generálás
        $token = bin2hex(random_bytes(32));
        echo "<p>Generált token: " . $token . "</p>";
        
        // Válasz adatok
        $response = [
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'fullname' => $user['fullname'],
                'role' => $user['role']
            ],
            'token' => $token
        ];
        
        echo "<h3>JSON válasz:</h3>";
        echo "<pre>" . json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
        
    } else {
        echo "<p style='color:red;'>❌ Jelszó NEM helyes!</p>";
        echo "<p>Adatbázisban tárolt hash: " . $user['password'] . "</p>";
        echo "<p>Ellenőrzés módja: password_verify('admin123', hash)</p>";
    }
} else {
    echo "<p style='color:red;'>❌ Nincs 'admin' felhasználó az adatbázisban!</p>";
}

$stmt->close();
$conn->close();
?>
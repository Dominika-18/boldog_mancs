<?php
// create_admin.php
require_once 'config.php';

$conn = getDBConnection();

$username = 'admin';
$email = 'admin@boldogmancs.hu';
$fullname = 'Admin Felhasználó';
// JELSZÓ HASHELÉS FONTOS! Használd a password_hash-t
$password = password_hash('admin123', PASSWORD_DEFAULT); // VÁLTOZÁS: PASSWORD_DEFAULT
$role = 'admin';

// Jobb, ha prepared statement-et használunk
$stmt = $conn->prepare("INSERT INTO users (username, email, fullname, password, role) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $username, $email, $fullname, $password, $role);

if ($stmt->execute()) {
    echo "Admin felhasználó létrehozva!<br>";
    echo "Felhasználónév: admin<br>";
    echo "Jelszó: admin123<br><br>";
    echo "<strong>FIGYELEM:</strong> Mentse el ezeket az adatokat!";
} else {
    echo "Hiba: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
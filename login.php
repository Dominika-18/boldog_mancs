<?php
// login.php - Egyszerű bejelentkezési endpoint
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Egyszerű ellenőrzés (fejlesztéshez)
if ($username === 'admin' && $password === 'admin123') {
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => 1,
            'username' => 'admin',
            'fullname' => 'Rendszergazda',
            'role' => 'admin'
        ],
        'token' => 'admin_token_' . time()
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Hibás felhasználónév vagy jelszó!'
    ]);
}
?>
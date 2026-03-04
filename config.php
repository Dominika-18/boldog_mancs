<?php
// config.php - JAVÍTOTT VERZIÓ

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Adatbázis kapcsolati adatok
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'boldog_mancs');

// JWT titkosítási kulcs - LEGALÁBB 32 karakter
// config.php - JWT titkos kulcs JAVÍTVA
define('JWT_SECRET', 'boldog_mancs_2025_super_secret_key_that_is_very_long_and_secure_!@#$%^&*()');
// Adatbázis kapcsolat
function getDBConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("Kapcsolódási hiba: " . $conn->connect_error);
        }
        
        $conn->set_charset("utf8mb4");
        return $conn;
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Adatbázis hiba', 'message' => $e->getMessage()]);
        exit;
    }
}

// Jelszó hashelés
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

// Jelszó ellenőrzés
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// JWT token generálás - JAVÍTOTT
function generateToken($userId, $username, $role) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => (int)$userId,
        'username' => $username,
        'role' => $role,
        'exp' => time() + (24 * 60 * 60) // 24 óra
    ]);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Token ellenőrzés - JAVÍTOTT
function verifyToken($token) {
    try {
        // Split the token
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $tokenParts;
        
        // Check the signature
        $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlSignature));
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            return false;
        }
        
        // Decode payload
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload)), true);
        
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    } catch (Exception $e) {
        error_log("Token ellenőrzési hiba: " . $e->getMessage());
        return false;
    }
}
?>
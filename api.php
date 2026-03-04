<?php
// api.php - TELJES JAVÍTOTT VERZIÓ PHP 5.6 KOMPATIBILIS
// EGYSÉGESÍTETT VÉGPONTOK: MINDENHOL "adoptions"
// ÁTIRÁNYÍTÁS - ha action=adoption jön, átírjuk adoptions-ra
if (isset($_GET['action']) && $_GET['action'] === 'adoption') {
    $_GET['action'] = 'adoptions';
}

// Ha POSTban jön az action
$input = json_decode(file_get_contents('php://input'), true);
if (isset($input['action']) && $input['action'] === 'adoption') {
    $input['action'] = 'adoptions';
    // Visszaírjuk a globális tömbbe
    $_POST = $input;
}
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Konfiguráció betöltése
require_once 'config.php';

// Debug függvény
function debug_log($message) {
    $logfile = __DIR__ . '/api_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logfile, "[$timestamp] $message\n", FILE_APPEND);
}

debug_log("API hívás: " . $_SERVER['REQUEST_URI']);
debug_log("handleRequest indul: action=" . (isset($_GET['action']) ? $_GET['action'] : 'nincs'));

class API {
    private $db;
    
    public function __construct() {
        $this->db = getDBConnection();
    }
    
    public function __destruct() {
        if ($this->db) {
            $this->db->close();
        }
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $endpoint = isset($_GET['action']) ? $_GET['action'] : '';
        
        if ($method === 'OPTIONS') {
            exit(0);
        }
        
        switch($method) {
            case 'GET':
                $this->handleGet($endpoint);
                break;
            case 'POST':
                $this->handlePost($endpoint);
                break;
            case 'PUT':
                $this->handlePut($endpoint);
                break;
            case 'DELETE':
                $this->handleDelete($endpoint);
                break;
            default:
                http_response_code(405);
                echo json_encode(array('error' => 'Method not allowed'));
        }
    }
    
    private function handleGet($endpoint) {
        switch($endpoint) {
            case 'animals':
                $this->getAnimals();
                break;
            case 'animal':
                $this->getAnimal();
                break;
            case 'adoptions':  // EGYSÉGESÍTVE
                $this->getAdoptions();
                break;
            case 'my_adoptions':
                $this->getMyAdoptions();
                break;
            case 'get_all_users':
                $this->getAllUsers();
                break;
            case 'stats':
                $this->getStats();
                break;
            case 'blog':
                $this->getBlogPosts();
                break;
            case 'user':
            case 'profile':
                $this->getCurrentUser();
                break;
            case 'favorites':
                $this->getFavorites();
                break;
            case 'check_favorite':
                $animalId = isset($_GET['animal_id']) ? $_GET['animal_id'] : null;
                if ($animalId) {
                    $this->checkFavorite($animalId);
                } else {
                    http_response_code(400);
                    echo json_encode(array('error' => 'Animal ID required'));
                }
                break;
            default:
                http_response_code(404);
                echo json_encode(array('error' => 'Endpoint not found: ' . $endpoint));
        }
    }
    
    private function handlePost($endpoint) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    switch($endpoint) {
        case 'login':
            $this->login($data);
            break;
        case 'register':
            $this->register($data);
            break;
        case 'adoption':      // RÉGI - a frontend ezt hívja
            $this->createAdoption($data);
            break;
        case 'adoptions':      // ÚJ - egységesítve
            $this->createAdoption($data);
            break;
        case 'animal':
            $this->createAnimal($data);
            break;
        case 'logout':
            $this->logout($data);
            break;
        case 'favorite':
            $this->addFavorite();
            break;
        default:
            http_response_code(404);
            echo json_encode(array('error' => 'Endpoint not found: ' . $endpoint));
    }
}
    
    private function handlePut($endpoint) {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        switch($endpoint) {
            case 'adoptions':  // EGYSÉGESÍTVE
                if ($id) {
                    $this->updateAdoptionStatus($id, $data);
                } else {
                    http_response_code(400);
                    echo json_encode(array('error' => 'Adoption ID required'));
                }
                break;
            case 'animal':
                if ($id) {
                    $this->updateAnimal($id, $data);
                } else {
                    http_response_code(400);
                    echo json_encode(array('error' => 'Animal ID required'));
                }
                break;
            default:
                http_response_code(404);
                echo json_encode(array('error' => 'Endpoint not found: ' . $endpoint));
        }
    }
    
    private function handleDelete($endpoint) {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $animalId = isset($_GET['animal_id']) ? $_GET['animal_id'] : null;
        
        switch($endpoint) {
            case 'animal':
                if ($id) {
                    $this->deleteAnimal($id);
                } else {
                    http_response_code(400);
                    echo json_encode(array('error' => 'Animal ID required'));
                }
                break;
            case 'favorite':
                $this->removeFavorite();
                break;
            default:
                http_response_code(404);
                echo json_encode(array('error' => 'Endpoint not found: ' . $endpoint));
        }
    }
    
    // ==================== FELHASZNÁLÓK ====================
    
    private function login($data) {
        if (empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(array('error' => 'Felhasználónév és jelszó megadása kötelező'));
            return;
        }
        
        $username = $this->db->real_escape_string($data['username']);
        $password = $data['password'];
        
        $sql = "SELECT * FROM users WHERE username = '$username' OR email = '$username'";
        $result = $this->db->query($sql);
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            if (password_verify($password, $user['password'])) {
                $token = generateToken($user['id'], $user['username'], $user['role']);
                $this->saveToken($user['id'], $token);
                
                echo json_encode(array(
                    'success' => true,
                    'token' => $token,
                    'user' => array(
                        'id' => (int)$user['id'],
                        'username' => $user['username'],
                        'role' => $user['role'],
                        'fullname' => $user['fullname'],
                        'email' => $user['email'],
                        'created_at' => $user['created_at']
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array('success' => false, 'error' => 'Hibás jelszó'));
            }
        } else {
            http_response_code(401);
            echo json_encode(array('success' => false, 'error' => 'Felhasználó nem található'));
        }
    }
    
    private function register($data) {
        $required = array('username', 'email', 'fullname', 'password');
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(array('error' => "A(z) $field mező kitöltése kötelező"));
                return;
            }
        }
        
        $username = $this->db->real_escape_string($data['username']);
        $email = $this->db->real_escape_string($data['email']);
        $fullname = $this->db->real_escape_string($data['fullname']);
        $password = hashPassword($data['password']);
        
        $checkSql = "SELECT id FROM users WHERE username = '$username' OR email = '$email'";
        $checkResult = $this->db->query($checkSql);
        
        if ($checkResult->num_rows > 0) {
            http_response_code(409);
            echo json_encode(array('error' => 'A felhasználónév vagy email cím már foglalt'));
            return;
        }
        
        $sql = "INSERT INTO users (username, email, fullname, password, role) 
                VALUES ('$username', '$email', '$fullname', '$password', 'user')";
        
        if ($this->db->query($sql)) {
            $userId = $this->db->insert_id;
            
            $token = generateToken($userId, $username, 'user');
            $this->saveToken($userId, $token);
            
            echo json_encode(array(
                'success' => true,
                'message' => 'Sikeres regisztráció!',
                'token' => $token,
                'user' => array(
                    'id' => $userId,
                    'username' => $username,
                    'role' => 'user',
                    'fullname' => $fullname,
                    'email' => $email
                )
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Regisztrációs hiba'));
        }
    }
    
    private function saveToken($userId, $token) {
        $expires = date('Y-m-d H:i:s', time() + (24 * 60 * 60));
        $tokenEscaped = $this->db->real_escape_string($token);
        
        $this->db->query("DELETE FROM user_tokens WHERE user_id = $userId OR expires_at < NOW()");
        
        $sql = "INSERT INTO user_tokens (user_id, token, expires_at) 
                VALUES ($userId, '$tokenEscaped', '$expires')";
        $this->db->query($sql);
    }
    
    private function getCurrentUser() {
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(array('error' => 'No token provided'));
            return;
        }
        
        $sql = "SELECT id, username, email, fullname, role, created_at FROM users WHERE id = $userId";
        $result = $this->db->query($sql);
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            echo json_encode(array(
                'id' => (int)$user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'fullname' => $user['fullname'],
                'role' => $user['role'],
                'created_at' => $user['created_at']
            ));
        } else {
            http_response_code(404);
            echo json_encode(array('error' => 'User not found'));
        }
    }
    
    private function logout($data) {
        $token = isset($data['token']) ? $data['token'] : '';
        
        if ($token) {
            $tokenEscaped = $this->db->real_escape_string($token);
            $this->db->query("DELETE FROM user_tokens WHERE token = '$tokenEscaped'");
        }
        
        echo json_encode(array('success' => true, 'message' => 'Logged out'));
    }
    
    private function getAllUsers() {
        if (!$this->isAdmin()) {
            http_response_code(403);
            echo json_encode(array('error' => 'Admin jogosultság szükséges'));
            return;
        }
        
        $sql = "SELECT id, username, email, fullname, role, created_at FROM users ORDER BY id";
        $result = $this->db->query($sql);
        $users = array();
        
        while ($row = $result->fetch_assoc()) {
            $users[] = array(
                'id' => (int)$row['id'],
                'username' => $row['username'],
                'email' => $row['email'],
                'fullname' => $row['fullname'],
                'role' => $row['role'],
                'created_at' => $row['created_at']
            );
        }
        
        echo json_encode($users);
    }
    
    // ==================== ÁLLATOK ====================
    
    private function getAnimals() {
        $type = isset($_GET['type']) ? $_GET['type'] : null;
        $featured = isset($_GET['featured']) ? $_GET['featured'] : null;
        $urgent = isset($_GET['urgent']) ? $_GET['urgent'] : null;
        $adopted = isset($_GET['adopted']) ? $_GET['adopted'] : 'all';
        
        $sql = "SELECT * FROM animals";
        $conditions = array();
        
        if ($adopted !== 'all') {
            $conditions[] = "adopted = " . (int)$adopted;
        }
        
        if ($type) {
            $typeEscaped = $this->db->real_escape_string($type);
            $conditions[] = "type = '$typeEscaped'";
        }
        
        if ($featured !== null) {
            $featuredVal = $featured ? 1 : 0;
            $conditions[] = "featured = $featuredVal";
        }
        
        if ($urgent !== null) {
            $urgentVal = $urgent ? 1 : 0;
            $conditions[] = "urgent = $urgentVal";
        }
        
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        $result = $this->db->query($sql);
        $animals = array();
        
        while ($row = $result->fetch_assoc()) {
            $animals[] = $this->formatAnimal($row);
        }
        
        echo json_encode($animals);
    }
    
    private function getAnimal() {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(array('error' => 'Animal ID required'));
            return;
        }
        
        $id = (int)$id;
        $sql = "SELECT * FROM animals WHERE id = $id";
        $result = $this->db->query($sql);
        
        if ($result->num_rows === 1) {
            echo json_encode($this->formatAnimal($result->fetch_assoc()));
        } else {
            http_response_code(404);
            echo json_encode(array('error' => 'Animal not found'));
        }
    }
    
    private function createAnimal($data) {
        if (!$this->isAdmin()) {
            http_response_code(403);
            echo json_encode(array('error' => 'Admin access required'));
            return;
        }
        
        $required = array('name', 'type');
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(array('error' => "A(z) $field mező kitöltése kötelező"));
                return;
            }
        }
        
        $fields = array(
            'name' => $this->db->real_escape_string($data['name']),
            'type' => $this->db->real_escape_string($data['type']),
            'breed' => $this->db->real_escape_string(isset($data['breed']) ? $data['breed'] : ''),
            'age' => $this->db->real_escape_string(isset($data['age']) ? $data['age'] : ''),
            'gender' => $this->db->real_escape_string(isset($data['gender']) ? $data['gender'] : 'Hím'),
            'size' => $this->db->real_escape_string(isset($data['size']) ? $data['size'] : 'kozepes'),
            'description' => $this->db->real_escape_string(isset($data['description']) ? $data['description'] : ''),
            'image' => $this->db->real_escape_string(isset($data['image']) ? $data['image'] : ''),
            'personality' => $this->db->real_escape_string(isset($data['personality']) ? $data['personality'] : ''),
            'history' => $this->db->real_escape_string(isset($data['history']) ? $data['history'] : ''),
            'special_needs' => $this->db->real_escape_string(isset($data['special_needs']) ? $data['special_needs'] : ''),
            'vaccinations' => $this->db->real_escape_string(isset($data['vaccinations']) ? $data['vaccinations'] : '[]'),
            'featured' => isset($data['featured']) ? (int)$data['featured'] : 0,
            'urgent' => isset($data['urgent']) ? (int)$data['urgent'] : 0,
            'adopted' => isset($data['adopted']) ? (int)$data['adopted'] : 0
        );
        
        $columns = implode(', ', array_keys($fields));
        $values = "'" . implode("', '", array_values($fields)) . "'";
        
        $sql = "INSERT INTO animals ($columns) VALUES ($values)";
        
        if ($this->db->query($sql)) {
            $animalId = $this->db->insert_id;
            echo json_encode(array(
                'success' => true,
                'message' => 'Állat sikeresen létrehozva',
                'id' => $animalId
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba az állat létrehozásakor: ' . $this->db->error));
        }
    }
    
    private function updateAnimal($id, $data) {
        if (!$this->isAdmin()) {
            http_response_code(403);
            echo json_encode(array('error' => 'Admin access required'));
            return;
        }
        
        $id = (int)$id;
        $updates = array();
        
        $allowedFields = array('name', 'type', 'breed', 'age', 'gender', 'size', 'description', 
                         'image', 'personality', 'history', 'special_needs', 'vaccinations',
                         'featured', 'urgent', 'adopted');
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $value = $this->db->real_escape_string($data[$field]);
                $updates[] = "$field = '$value'";
            }
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(array('error' => 'No fields to update'));
            return;
        }
        
        $sql = "UPDATE animals SET " . implode(', ', $updates) . " WHERE id = $id";
        
        if ($this->db->query($sql)) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Állat sikeresen frissítve'
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba az állat frissítésekor'));
        }
    }
    
    private function deleteAnimal($id) {
        if (!$this->isAdmin()) {
            http_response_code(403);
            echo json_encode(array('error' => 'Admin access required'));
            return;
        }
        
        $id = (int)$id;
        $sql = "DELETE FROM animals WHERE id = $id";
        
        if ($this->db->query($sql)) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Állat sikeresen törölve'
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba az állat törlésekor'));
        }
    }
    
    private function formatAnimal($row) {
        $vaccinations = $row['vaccinations'];
        if (is_string($vaccinations)) {
            try {
                $vaccinations = json_decode($vaccinations, true);
                if (!is_array($vaccinations)) {
                    $vaccinations = array();
                }
            } catch (Exception $e) {
                $vaccinations = array();
            }
        }
        
        return array(
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'type' => $row['type'],
            'breed' => $row['breed'],
            'age' => $row['age'],
            'gender' => $row['gender'],
            'size' => $row['size'],
            'description' => $row['description'],
            'image' => $row['image'],
            'personality' => $row['personality'],
            'history' => $row['history'],
            'special_needs' => $row['special_needs'],
            'vaccinations' => $vaccinations,
            'featured' => (bool)$row['featured'],
            'urgent' => (bool)$row['urgent'],
            'adopted' => (bool)$row['adopted'],
            'created_at' => $row['created_at']
        );
    }
    
    // ==================== ÖRÖKBEFOGADÁSOK ====================
    
    private function createAdoption($data) {
        $required = array('animal_id', 'full_name', 'email', 'phone');
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(array('error' => "A(z) $field mező kitöltése kötelező"));
                return;
            }
        }
        
        $animalId = (int)$data['animal_id'];
        
        // Ellenőrizzük, hogy az állat még örökbefogadható-e
        $checkAnimal = $this->db->query("SELECT adopted FROM animals WHERE id = $animalId");
        if ($checkAnimal->num_rows === 0) {
            http_response_code(404);
            echo json_encode(array('error' => 'Az állat nem található'));
            return;
        }
        
        $animal = $checkAnimal->fetch_assoc();
        if ($animal['adopted'] == 1) {
            http_response_code(400);
            echo json_encode(array('error' => 'Ez az állat már örökbefogadásra került'));
            return;
        }
        
        $userId = $this->getCurrentUserId();
        
        $fullName = $this->db->real_escape_string($data['full_name']);
        $email = $this->db->real_escape_string($data['email']);
        $phone = $this->db->real_escape_string($data['phone']);
        $homeType = $this->db->real_escape_string(isset($data['home_type']) ? $data['home_type'] : '');
        $address = $this->db->real_escape_string(isset($data['address']) ? $data['address'] : '');
        $experience = $this->db->real_escape_string(isset($data['experience']) ? $data['experience'] : '');
        $message = $this->db->real_escape_string(isset($data['message']) ? $data['message'] : '');
        
        $userIdSql = $userId ? $userId : 'NULL';
        $sql = "INSERT INTO adoptions (animal_id, user_id, full_name, email, phone, home_type, address, experience, message, status) 
                VALUES ($animalId, $userIdSql, '$fullName', '$email', '$phone', '$homeType', '$address', '$experience', '$message', 'pending')";
        
        if ($this->db->query($sql)) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Örökbefogadási jelentkezés sikeresen elküldve!',
                'adoption_id' => $this->db->insert_id
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba a jelentkezés mentésekor: ' . $this->db->error));
        }
    }
    
    private function getAdoptions() {
        if (!$this->isAdmin()) {
            http_response_code(403);
            echo json_encode(array('error' => 'Admin jogosultság szükséges'));
            return;
        }
        
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        
        $sql = "SELECT a.*, 
                an.name as animal_name, 
                an.type as animal_type, 
                an.image as animal_image,
                u.username as user_username
                FROM adoptions a 
                LEFT JOIN animals an ON a.animal_id = an.id 
                LEFT JOIN users u ON a.user_id = u.id";
        
        if ($status && in_array($status, array('pending', 'approved', 'rejected'))) {
            $sql .= " WHERE a.status = '$status'";
        }
        
        $sql .= " ORDER BY a.created_at DESC";
        
        $result = $this->db->query($sql);
        $adoptions = array();
        
        while ($row = $result->fetch_assoc()) {
            $adoptions[] = $row;
        }
        
        echo json_encode($adoptions);
    }
    
    private function getMyAdoptions() {
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(array('error' => 'Bejelentkezés szükséges'));
            return;
        }
        
        $sql = "SELECT a.*, 
                an.name as animal_name, 
                an.type as animal_type, 
                an.image as animal_image
                FROM adoptions a 
                LEFT JOIN animals an ON a.animal_id = an.id 
                WHERE a.user_id = $userId 
                ORDER BY a.created_at DESC";
        
        $result = $this->db->query($sql);
        $adoptions = array();
        
        while ($row = $result->fetch_assoc()) {
            $adoptions[] = $row;
        }
        
        echo json_encode(array('success' => true, 'adoptions' => $adoptions));
    }
    
    private function updateAdoptionStatus($id, $data) {
        if (!$this->isAdmin()) {
            http_response_code(403);
            echo json_encode(array('error' => 'Admin jogosultság szükséges'));
            return;
        }
        
        $id = (int)$id;
        $status = isset($data['status']) ? $data['status'] : '';
        
        if (!in_array($status, array('approved', 'rejected'))) {
            http_response_code(400);
            echo json_encode(array('error' => 'Érvénytelen státusz'));
            return;
        }
        
        $this->db->begin_transaction();
        
        try {
            $sql = "UPDATE adoptions SET status = '$status' WHERE id = $id";
            $this->db->query($sql);
            
            if ($status === 'approved') {
                $adoption = $this->db->query("SELECT animal_id FROM adoptions WHERE id = $id")->fetch_assoc();
                if ($adoption) {
                    $animalId = $adoption['animal_id'];
                    $this->db->query("UPDATE animals SET adopted = 1 WHERE id = $animalId");
                    
                    $this->db->query("UPDATE adoptions SET status = 'rejected' WHERE animal_id = $animalId AND id != $id AND status = 'pending'");
                }
            }
            
            $this->db->commit();
            echo json_encode(array('success' => true, 'message' => 'Státusz frissítve'));
            
        } catch (Exception $e) {
            $this->db->rollback();
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba a frissítés során'));
        }
    }
    
    // ==================== STATISZTIKÁK ====================
    
    private function getStats() {
        $stats = array();
        
        $result = $this->db->query("SELECT COUNT(*) as total FROM animals");
        $stats['totalAnimals'] = (int)$result->fetch_assoc()['total'];
        
        $result = $this->db->query("SELECT COUNT(*) as total FROM animals WHERE adopted = 1");
        $stats['adoptedAnimals'] = (int)$result->fetch_assoc()['total'];
        
        $result = $this->db->query("SELECT COUNT(*) as total FROM animals WHERE urgent = 1 AND adopted = 0");
        $stats['urgentAnimals'] = (int)$result->fetch_assoc()['total'];
        
        $result = $this->db->query("SELECT COUNT(*) as total FROM adoptions WHERE status = 'pending'");
        $stats['pendingAdoptions'] = (int)$result->fetch_assoc()['total'];
        
        $result = $this->db->query("SELECT COUNT(*) as total FROM users");
        $stats['totalUsers'] = (int)$result->fetch_assoc()['total'];
        
        echo json_encode($stats);
    }
    
    // ==================== BLOG ====================
    
    private function getBlogPosts() {
        $sql = "SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC";
        $result = $this->db->query($sql);
        $posts = array();
        
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
        
        echo json_encode($posts);
    }
    
    // ==================== KEDVENCEK KEZELÉSE ====================
    
    private function getFavorites() {
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(array('error' => 'Bejelentkezés szükséges'));
            return;
        }
        
        $sql = "SELECT f.*, a.name, a.type, a.breed, a.age, a.image, a.description, a.gender, a.size, a.urgent 
                FROM favorites f
                JOIN animals a ON f.animal_id = a.id
                WHERE f.user_id = $userId
                ORDER BY f.created_at DESC";
        
        $result = $this->db->query($sql);
        $favorites = array();
        
        while ($row = $result->fetch_assoc()) {
            $favorites[] = array(
                'id' => (int)$row['id'],
                'user_id' => (int)$row['user_id'],
                'animal_id' => (int)$row['animal_id'],
                'created_at' => $row['created_at'],
                'animal' => array(
                    'id' => (int)$row['animal_id'],
                    'name' => $row['name'],
                    'type' => $row['type'],
                    'breed' => $row['breed'],
                    'age' => $row['age'],
                    'gender' => $row['gender'],
                    'size' => $row['size'],
                    'image' => $row['image'],
                    'description' => $row['description'],
                    'urgent' => (bool)$row['urgent']
                )
            );
        }
        
        echo json_encode(array(
            'success' => true,
            'favorites' => $favorites
        ));
    }
    
    private function addFavorite() {
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(array('error' => 'Bejelentkezés szükséges'));
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $animalId = isset($data['animal_id']) ? (int)$data['animal_id'] : 0;
        
        if (!$animalId) {
            http_response_code(400);
            echo json_encode(array('error' => 'Állat ID szükséges'));
            return;
        }
        
        // Ellenőrizzük, hogy létezik-e az állat
        $checkAnimal = $this->db->query("SELECT id FROM animals WHERE id = $animalId");
        if ($checkAnimal->num_rows === 0) {
            http_response_code(404);
            echo json_encode(array('error' => 'Az állat nem található'));
            return;
        }
        
        // Duplikáció ellenőrzése
        $checkSql = "SELECT id FROM favorites WHERE user_id = $userId AND animal_id = $animalId";
        $checkResult = $this->db->query($checkSql);
        
        if ($checkResult->num_rows > 0) {
            echo json_encode(array(
                'success' => false,
                'error' => 'Már a kedvencek között van',
                'already_exists' => true
            ));
            return;
        }
        
        $sql = "INSERT INTO favorites (user_id, animal_id) VALUES ($userId, $animalId)";
        
        if ($this->db->query($sql)) {
            $favoriteId = $this->db->insert_id;
            
            echo json_encode(array(
                'success' => true,
                'message' => 'Állat a kedvencekhez adva',
                'favorite_id' => $favoriteId
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba a kedvenc mentésekor'));
        }
    }
    
    private function removeFavorite() {
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(array('error' => 'Bejelentkezés szükséges'));
            return;
        }
        
        $animalId = isset($_GET['animal_id']) ? $_GET['animal_id'] : null;
        
        if (!$animalId) {
            http_response_code(400);
            echo json_encode(array('error' => 'Állat ID szükséges'));
            return;
        }
        
        $animalId = (int)$animalId;
        $sql = "DELETE FROM favorites WHERE user_id = $userId AND animal_id = $animalId";
        
        if ($this->db->query($sql)) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Állat eltávolítva a kedvencekből'
            ));
        } else {
            http_response_code(500);
            echo json_encode(array('error' => 'Hiba a kedvenc eltávolításakor'));
        }
    }
    
    private function checkFavorite($animalId) {
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            echo json_encode(array('is_favorite' => false));
            return;
        }
        
        $animalId = (int)$animalId;
        $sql = "SELECT id FROM favorites WHERE user_id = $userId AND animal_id = $animalId";
        $result = $this->db->query($sql);
        
        echo json_encode(array(
            'is_favorite' => $result->num_rows > 0
        ));
    }
    
    // ==================== SEGÉDFÜGGVÉNYEK ====================
    
    private function getCurrentUserId() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            $payload = verifyToken($token);
            
            if ($payload && isset($payload['user_id'])) {
                return (int)$payload['user_id'];
            }
        }
        return null;
    }
    
    private function isAdmin() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            $payload = verifyToken($token);
            
            if ($payload && isset($payload['role']) && $payload['role'] === 'admin') {
                return true;
            }
        }
        
        return false;
    }
}

// API indítása
$api = new API();
$api->handleRequest();
?>
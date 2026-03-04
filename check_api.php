<?php
// check_api.php - API ELLENŐRZŐ
require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo '<!DOCTYPE html>
<html>
<head>
    <title>API Ellenőrző - Boldog Mancs</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2a9d8f; }
        .success { color: green; padding: 10px; background: #d4edda; border-radius: 5px; margin: 5px 0; }
        .error { color: red; padding: 10px; background: #f8d7da; border-radius: 5px; margin: 5px 0; }
        .warning { color: #856404; padding: 10px; background: #fff3cd; border-radius: 5px; margin: 5px 0; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f2f2f2; }
        .badge { padding: 3px 8px; border-radius: 3px; font-size: 12px; }
        .badge-success { background: #28a745; color: white; }
        .badge-danger { background: #dc3545; color: white; }
        .badge-warning { background: #ffc107; color: black; }
    </style>
</head>
<body>
    <div class="container">';

echo '<h1> Boldog Mancs API Ellenőrző</h1>';

$conn = getDBConnection();

// 1. Adatbázis kapcsolat
echo '<h2> Adatbázis állapot</h2>';
if ($conn) {
    echo '<div class="success"> Adatbázis kapcsolat: OK</div>';
} else {
    echo '<div class="error"> Adatbázis kapcsolat: HIBA</div>';
}

// 2. Táblák ellenőrzése
$tables = ['users', 'user_tokens', 'animals', 'adoptions', 'blog_posts'];
echo '<h3> Táblák</h3><ul>';
foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows > 0) {
        $count = $conn->query("SELECT COUNT(*) as c FROM $table")->fetch_assoc()['c'];
        echo "<li class='success'> $table - $count rekord</li>";
    } else {
        echo "<li class='error'> $table - NEM LÉTEZIK</li>";
    }
}
echo '</ul>';

// 3. API végpontok tesztelése
echo '<h2> API végpontok</h2>';

$endpoints = [
    'api.php?action=animals' => 'Állatok listázása',
    'api.php?action=stats' => 'Statisztikák',
    'api.php?action=blog' => 'Blog bejegyzések',
    'api.php?action=user' => 'Felhasználói adatok (auth kell)',
    'api.php?action=my_adoptions' => 'Saját örökbefogadások (auth kell)',
    'api.php?action=adoptions' => 'Örökbefogadások (admin kell)'
];

echo '<table>';
echo '<tr><th>Végpont</th><th>Leírás</th><th>Státusz</th></tr>';

foreach ($endpoints as $endpoint => $description) {
    $url = $endpoint;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $statusClass = $httpCode == 200 ? 'badge-success' : ($httpCode == 401 || $httpCode == 403 ? 'badge-warning' : 'badge-danger');
    $statusText = $httpCode == 200 ? 'OK' : ($httpCode == 401 ? 'Auth kell' : ($httpCode == 403 ? 'Admin kell' : 'Hiba'));
    
    echo "<tr>";
    echo "<td><code>$endpoint</code></td>";
    echo "<td>$description</td>";
    echo "<td><span class='badge $statusClass'>$httpCode - $statusText</span></td>";
    echo "</tr>";
}

echo '</table>';

// 4. Felhasználók listája
echo '<h2> Felhasználók</h2>';
$result = $conn->query("SELECT id, username, email, fullname, role, created_at FROM users ORDER BY id");
if ($result->num_rows > 0) {
    echo '<table>';
    echo '<tr><th>ID</th><th>Felhasználónév</th><th>Email</th><th>Név</th><th>Szerepkör</th><th>Regisztráció</th></tr>';
    while ($row = $result->fetch_assoc()) {
        $roleClass = $row['role'] == 'admin' ? 'badge-danger' : 'badge-success';
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td><strong>{$row['username']}</strong></td>";
        echo "<td>{$row['email']}</td>";
        echo "<td>{$row['fullname']}</td>";
        echo "<td><span class='badge $roleClass'>{$row['role']}</span></td>";
        echo "<td>{$row['created_at']}</td>";
        echo "</tr>";
    }
    echo '</table>';
} else {
    echo '<div class="warning"> Nincs egyetlen felhasználó sem!</div>';
}

// 5. Örökbefogadások
echo '<h2> Örökbefogadások</h2>';
$result = $conn->query("
    SELECT a.*, u.username, an.name as animal_name 
    FROM adoptions a 
    LEFT JOIN users u ON a.user_id = u.id 
    LEFT JOIN animals an ON a.animal_id = an.id 
    ORDER BY a.created_at DESC 
    LIMIT 5
");

if ($result->num_rows > 0) {
    echo '<table>';
    echo '<tr><th>ID</th><th>Állat</th><th>Felhasználó</th><th>Név</th><th>Státusz</th><th>Dátum</th></tr>';
    while ($row = $result->fetch_assoc()) {
        $statusClass = $row['status'] == 'pending' ? 'badge-warning' : ($row['status'] == 'approved' ? 'badge-success' : 'badge-danger');
        echo "<tr>";
        echo "<td>{$row['id']}</td>";
        echo "<td>{$row['animal_name']} (#{$row['animal_id']})</td>";
        echo "<td>{$row['username']} (#{$row['user_id']})</td>";
        echo "<td>{$row['full_name']}</td>";
        echo "<td><span class='badge $statusClass'>{$row['status']}</span></td>";
        echo "<td>{$row['created_at']}</td>";
        echo "</tr>";
    }
    echo '</table>';
} else {
    echo '<div class="warning"> Nincs egyetlen örökbefogadás sem!</div>';
}



echo '<hr>';
echo '<p style="text-align: center; color: #666;">&copy; 2025-2026 Boldog Mancs Állatmenhely - API Ellenőrző</p>';

echo '</div></body></html>';

$conn->close();
?>
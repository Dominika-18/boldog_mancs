<?php
// Összes hiba megjelenítése
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<pre>";
echo "=== DEBUG INFO ===\n\n";

// PHP verzió
echo "PHP Version: " . phpversion() . "\n";

// Config fájl ellenőrzése
echo "\n=== CONFIG CHECK ===\n";
if (file_exists('config.php')) {
    echo "config.php: OK\n";
    require_once 'config.php';
    echo "config.php betöltve\n";
    
    // Adatbázis kapcsolat teszt
    echo "\n=== DATABASE TEST ===\n";
    $conn = getDBConnection();
    if ($conn) {
        echo "Adatbázis kapcsolat: OK\n";
        
        // Táblák ellenőrzése
        $tables = ['users', 'animals', 'adoptions'];
        foreach ($tables as $table) {
            $result = $conn->query("SELECT COUNT(*) as count FROM $table");
            if ($result) {
                $row = $result->fetch_assoc();
                echo "$table: " . $row['count'] . " rekord\n";
            } else {
                echo "$table: HIBA - " . $conn->error . "\n";
            }
        }
        
        $conn->close();
    } else {
        echo "Adatbázis kapcsolat: HIBA\n";
    }
} else {
    echo "config.php: NEM TALÁLHATÓ!\n";
}

// API teszt
echo "\n=== API TEST ===\n";
if (file_exists('api.php')) {
    echo "api.php: OK\n";
    echo "api.php mérete: " . filesize('api.php') . " bájt\n";
    echo "api.php módosítva: " . date("Y-m-d H:i:s", filemtime('api.php')) . "\n";
} else {
    echo "api.php: NEM TALÁLHATÓ!\n";
}

echo "\n=== SERVER INFO ===\n";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "Request URI: " . $_SERVER['REQUEST_URI'] . "\n";

echo "</pre>";
?>
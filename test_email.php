<?php
// test_email.php - Email küldés tesztelése
?>
<!DOCTYPE html>
<html>
<head>
    <title>Email teszt - Boldog Mancs</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1a472a; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        input, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
        button { background: #1a472a; color: white; border: none; cursor: pointer; font-size: 16px; }
        button:hover { background: #2d5a3d; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Email küldés tesztelése</h1>
        
        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $to = $_POST['email'] ?? '';
            $subject = "Teszt email a Boldog Mancstól";
            
            $message = "
            <html>
            <body>
                <h2 style='color: #1a472a;'>Sikeres teszt! ✅</h2>
                <p>Ez egy teszt email a Boldog Mancs Állatmenhely rendszeréből.</p>
                <p>Ha ezt az emailt látod, akkor az email küldés megfelelően működik!</p>
                <hr>
                <p><strong>Dátum:</strong> " . date('Y-m-d H:i:s') . "</p>
                <p><strong>Küldő:</strong> Boldog Mancs Állatmenhely</p>
            </body>
            </html>
            ";
            
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8\r\n";
            $headers .= "From: Boldog Mancs <info@boldogmancs.hu>\r\n";
            $headers .= "Reply-To: info@boldogmancs.hu\r\n";
            
            if (mail($to, $subject, $message, $headers)) {
                echo "<div class='success'>✅ Email sikeresen elküldve a következő címre: $to</div>";
            } else {
                echo "<div class='error'>❌ Email küldési hiba! Ellenőrizd a PHP mail beállításokat.</div>";
            }
        }
        ?>
        
        <form method="POST">
            <h3>Küldj teszt emailt:</h3>
            <label>Címzett email címe:</label>
            <input type="email" name="email" required placeholder="pelda@email.hu" value="<?php echo $_POST['email'] ?? ''; ?>">
            <button type="submit">Teszt email küldése</button>
        </form>
        
        <hr>
        
        <h3>📝 Megjegyzés:</h3>
        <p>Ha a teszt nem működik, ellenőrizd a következőket:</p>
        <ul>
            <li>A PHP mail() függvény működik-e a szerveren</li>
            <li>Ellenőrizd a spam mappát is</li>
            <li>XAMPP/WAMP esetén szükség lehet SMTP beállításra a php.ini-ben</li>
        </ul>
        
        <p><a href="admin_adoptions.html">⬅ Vissza az örökbefogadások kezeléséhez</a></p>
    </div>
</body>
</html>
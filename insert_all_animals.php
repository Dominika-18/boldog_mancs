<?php
// insert_all_animals.php
require_once 'config.php';

$conn = getDBConnection();

// SQL parancs a 12 állattal
$sql = "INSERT INTO animals (name, type, breed, age, gender, size, description, image, personality, history, special_needs, vaccinations, featured, urgent, adopted) VALUES
('Füles', 'kutya', 'Labrador keverék', '2 éves', 'Hím', 'kozepes', 'Füles egy kedves, bújós és kíváncsi kutya, aki imád játszani és sétálni. Gyorsan tanul és nagyon ragaszkodó.', 'img/kep1.jpg', 'Barátságos, játékos, hűséges', 'Utcáról hozták be — valószínűleg elhagyott, mielőtt hozzánk került.', 'Rendszeres, napi többszöri testmozgásra és figyelemre van szüksége.', '[\"Kutya veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0),
('Bea', 'macska', 'Rövidszőrű cirmos', '3 éves', 'Nőstény', 'kis', 'Bea egy nyugodt, figyelmes cica, aki szeret bekuckózni, de játékos percei is vannak. Gyorsan barátkozik, ha lassan közelítenek hozzá.', 'img/kep2.jpg', 'Nyugodt, kíváncsi, önálló', 'Valószínűleg elkóborolt házi macska — találtuk és behoztuk a menhelyre.', 'Beltéri tartás ajánlott; rendszeres tiszta almot és nyugodt környezetet igényel.', '[\"Macska panleukopénia\",\"Calicivírus\",\"Herpesz (rhinotracheitis)\",\"Macska leukózis (FeLV)\"]', 1, 0, 0),
('Bodri', 'kutya', 'Beagle', '1 éves', 'Hím', 'kozepes', 'Bodri egy kíváncsi és vidám kutya, aki mindig készen áll egy új kalandra.', 'img/kep3.jpg', 'Kíváncsi, vidám, intelligens', 'Bodri tenyésztőtől került hozzánk, aki bezárta a vállalkozását.', 'Rendszeres testmozgásra van szüksége', '[\"Kutya veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 1, 0),
('Cirmoska', 'macska', 'Házimacska (tarka)', '5 éves', 'Nőstény', 'kozepes', 'Cirmoska egy kedves, visszahúzódó macska, aki szeret puha párnákon pihenni és figyelni a környezetét.', 'img/kep4.jpg', 'Csendes, érzékeny, ragaszkodó', 'Egy idősebb hölgytől került be, aki sajnos már nem tudott gondoskodni róla.', 'Szereti a nyugalmat és a saját kis fekhelyét.', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 0, 0),
('Bátor', 'kutya', 'Kevert (valószínűleg terrier és vizsla keverék)', '3 éves', 'Hím', 'kozepes', 'Bátor fegyelmezett és figyelmes szolgálati kutya, aki mindig készen áll a feladatokra.', 'img/kep5.jpg', 'Éber, intelligens, hűséges', 'Kölyökkorától kezdve szolgálati kutyának képezték.', 'Rendszeres tréningekre és sok mozgásra van szüksége.', '[\"Veszettség\",\"Parvovírus\",\"Szopornyica\",\"Leptospirózis\"]', 0, 0, 0),
('Bundás', 'macska', 'Házimacska (cirmos)', '2 éves', 'Hím', 'kozepes', 'Bundás egy játékos és aktív fiatal macska, aki imád a játékok között heverészni.', 'img/kep6.jpg', 'Játékos, kíváncsi, energikus', 'Egy kertben találták testvérével együtt, majd befogadták.', 'Sok játékkal és foglalkoztatással érzi jól magát.', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\"]', 0, 1, 0),
('Balu', 'kutya', 'keverék (bull típusú)', 'kb. 3 éves', 'Hím', 'kozepes-nagy', 'Balu egy erős, izmos, de meglepően gyengéd kutya. Nagyon szereti a sétákat és az emberek társaságát.', 'img/kep7.jpg', 'Barátságos, energikus, ragaszkodó', 'Gazdától került be, aki már nem tudta ellátni.', 'Erős kutya, ezért következetes gazdára és sok mozgásra van szüksége.', '[\"Veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0),
('Luna', 'macska', 'rövidszőrű keverék', 'kb. 1 éves', 'Nőstény', 'kis', 'Luna egy gyönyörű, fekete cica aranyszínű szemekkel. Nyugodt, figyelmes tekintete igazán megnyerő.', 'img/kep8.jpg', 'Kedves, nyugodt, bújós', 'Utcáról mentették be sérülten, ma már teljesen egészséges.', 'Érzékeny lehet a hidegre, így benti tartás ajánlott.', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 0, 0),
('Max', 'kutya', 'keverék', 'kb. 5 éves', 'Hím', 'nagy', 'Max egy kedves, nyugodt kutya, aki imád pihenni a fűben. Hosszú séta után boldogan liheg.', 'img/kep9.jpg', 'Nyugodt, barátságos, türelmes', 'Kóbor kutyaként került be, de hamar megmutatta, mennyire szereti az embereket.', 'Mérsékelt mozgásigény, érzékeny a melegre.', '[\"Veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0),
('Molly', 'macska', 'Bengáli', '3 éves', 'Nőstény', 'kozepes', 'Molly egy aktív és kíváncsi macska, aki szeret magas helyekre mászni.', 'img/kep10.jpg', 'Aktív, kíváncsi, magas helyeket kedveli', 'Molly egy tenyésztőtől került hozzánk, aki bezárta a vállalkozását.', 'Magas kaparófa szükséges', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 1, 0),
('Bella', 'kutya', 'Arany retriever', '1 éves', 'Nőstény', 'nagy', 'Bella egy gyengéd és ragaszkodó kutya, aki imádja a gyerekeket.', 'img/kep11.jpg', 'Gyengéd, ragaszkodó, gyerekbarát', 'Bella egy családtól került hozzánk, akiknek nem volt idejük rá.', 'Nincs', '[\"Kutya veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0),
('Oscar', 'macska', 'Maine Coon', '5 éves', 'Hím', 'nagy', 'Oscar egy nyugodt és barátságos macska, aki szeret a társaságában lenni.', 'img/kep12.jpg', 'Nyugodt, barátságos, társaságkedvelő', 'Oscar előző gazdája idősek otthonába került.', 'Rendszeres fésülésre van szüksége', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 0, 0);";

// Először töröljük a régi adatokat (opcionális)
echo "<h2>Állatok beszúrása az adatbázisba</h2>";

// Ha szeretnéd törölni a régi adatokat, ezt használd:
// $conn->query("DELETE FROM animals");

if ($conn->multi_query($sql)) {
    echo "<p style='color: green;'>✅ 12 állat sikeresen hozzáadva az adatbázishoz!</p>";
} else {
    echo "<p style='color: red;'>❌ Hiba: " . $conn->error . "</p>";
}

// Ellenőrizzük
$result = $conn->query("SELECT COUNT(*) as total FROM animals");
$row = $result->fetch_assoc();
echo "<p>Összesen <strong>{$row['total']}</strong> állat van az adatbázisban.</p>";

// Listázás
echo "<h3>Állatok listája:</h3>";
$result = $conn->query("SELECT id, name, type, breed, featured, urgent, adopted FROM animals ORDER BY id");
echo "<table border='1' cellpadding='8'>";
echo "<tr><th>ID</th><th>Név</th><th>Faj</th><th>Fajta</th><th>Kiemelt</th><th>Sürgős</th><th>Örökbefogadva</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>{$row['id']}</td>";
    echo "<td><strong>{$row['name']}</strong></td>";
    echo "<td>{$row['type']}</td>";
    echo "<td>{$row['breed']}</td>";
    echo "<td>" . ($row['featured'] ? '✅' : '❌') . "</td>";
    echo "<td>" . ($row['urgent'] ? '✅' : '❌') . "</td>";
    echo "<td>" . ($row['adopted'] ? '✅' : '❌') . "</td>";
    echo "</tr>";
}
echo "</table>";

echo "<hr>";
echo "<h3 style='color: green;'>✅ Kész! Most már az API betölti az állatokat az adatbázisból.</h3>";
echo "<p><a href='index.html'>Nyisd meg a főoldalt</a> hogy lásd az állatokat.</p>";
echo "<p><a href='admin.html'>Nyisd meg az admin felületet</a> hogy kezeld az állatokat.</p>";

$conn->close();
?>
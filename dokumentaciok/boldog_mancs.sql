-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Már 02. 10:35
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `boldog_mancs`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `adoptions`
--

CREATE TABLE `adoptions` (
  `id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `home_type` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `adoptions`
--

INSERT INTO `adoptions` (`id`, `animal_id`, `user_id`, `full_name`, `email`, `phone`, `home_type`, `address`, `experience`, `message`, `status`, `created_at`, `updated_at`) VALUES
(12, 75, 4, 'adewr', 'poi@gmail.com', '30211452589', 'lakas', '541871kml', '54', '55', 'rejected', '2026-02-25 10:25:34', '2026-02-25 11:21:29'),
(13, 75, 4, 'adewr', 'poi@gmail.com', '30211452589', 'lakas', '541871kml', '54', '55', 'rejected', '2026-02-25 10:25:39', '2026-02-25 11:21:29'),
(14, 75, 4, 'adewr', 'poi@gmail.com', '30211452589', 'haz_kerttel', '541871kml', 'gf', 'g', 'rejected', '2026-02-25 10:26:38', '2026-02-25 11:21:29'),
(15, 75, 4, 'adewr', 'poi@gmail.com', '30211452589', 'haz_kerttel', '541871kml', 'gf', 'g', 'rejected', '2026-02-25 10:26:46', '2026-02-25 11:21:29'),
(16, 75, 4, 'adewr', 'poi@gmail.com', '30211452589', '', 'jf', 'fj', 'j', 'rejected', '2026-02-25 10:30:51', '2026-02-25 11:21:29'),
(17, 75, 4, 'adewr', 'poi@gmail.com', '30211452589', '', 'jf', 'fj', 'j', 'approved', '2026-02-25 10:30:54', '2026-02-25 11:21:29'),
(18, 77, 4, 'adewr', 'poi@gmail.com', '30211452589', 'haz_kerttel', '541871kmluz', 'kj', 'zu', 'approved', '2026-02-25 11:39:55', '2026-02-27 06:42:28'),
(19, 88, 4, 'adewr', 'poi@gmail.com', '30211452589', 'lakas', 'jk', 'g', 'hm', 'approved', '2026-02-27 07:25:37', '2026-02-27 07:26:02'),
(20, 74, 4, 'adewr', 'poi@gmail.com', '30211452589', 'lakas', '541871kml', 'hjn', 'hj', 'approved', '2026-02-27 10:35:02', '2026-02-27 10:35:23');

--
-- Eseményindítók `adoptions`
--
DELIMITER $$
CREATE TRIGGER `after_adoption_status_update` AFTER UPDATE ON `adoptions` FOR EACH ROW BEGIN
    IF OLD.status != NEW.status AND NEW.user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (
            NEW.user_id,
            'adoption_status',
            CONCAT('Örökbefogadás státusza: ', 
                CASE NEW.status
                    WHEN 'approved' THEN 'Elfogadva'
                    WHEN 'rejected' THEN 'Elutasítva'
                    WHEN 'completed' THEN 'Teljesítve'
                    ELSE NEW.status
                END
            ),
            CONCAT('A(z) ', 
                (SELECT name FROM animals WHERE id = NEW.animal_id),
                ' örökbefogadására benyújtott jelentkezésed státusza megváltozott: ',
                CASE NEW.status
                    WHEN 'approved' THEN 'Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.'
                    WHEN 'rejected' THEN 'Sajnos elutasították. További részletekért keresd a menhelyet.'
                    WHEN 'completed' THEN 'Sikeresen teljesítve! Köszönjük, hogy örökbefogadtál!'
                    ELSE 'Változás történt a jelentkezésed státuszában.'
                END
            ),
            'profile.html#adoptions'
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `animals`
--

CREATE TABLE `animals` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` enum('kutya','macska') NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` varchar(50) DEFAULT NULL,
  `gender` enum('Hím','Nőstény','Kan','Kandúr') DEFAULT 'Hím',
  `size` enum('kis','kozepes','nagy','kozepes-nagy') DEFAULT 'kozepes',
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `personality` varchar(255) DEFAULT NULL,
  `history` text DEFAULT NULL,
  `special_needs` text DEFAULT NULL,
  `vaccinations` text DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `urgent` tinyint(1) DEFAULT 0,
  `adopted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `animals`
--

INSERT INTO `animals` (`id`, `name`, `type`, `breed`, `age`, `gender`, `size`, `description`, `image`, `personality`, `history`, `special_needs`, `vaccinations`, `featured`, `urgent`, `adopted`, `created_at`, `updated_at`) VALUES
(64, 'Füles', 'kutya', 'Labrador keverék', '2 éves', 'Hím', 'kozepes', 'Füles egy kedves, bújós és kíváncsi kutya, aki imád játszani és sétálni. Gyorsan tanul és nagyon ragaszkodó.', 'img/kep1.jpg', 'Barátságos, játékos, hűséges', 'Utcáról hozták be — valószínűleg elhagyott, mielőtt hozzánk került.', 'Rendszeres, napi többszöri testmozgásra és figyelemre van szüksége.', '[\"Kutya veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(65, 'Bea', 'macska', 'Rövidszőrű cirmos', '3 éves', 'Nőstény', 'kis', 'Bea egy nyugodt, figyelmes cica, aki szeret bekuckózni, de játékos percei is vannak. Gyorsan barátkozik, ha lassan közelítenek hozzá.', 'img/kep2.jpg', 'Nyugodt, kíváncsi, önálló', 'Valószínűleg elkóborolt házi macska — találtuk és behoztuk a menhelyre.', 'Beltéri tartás ajánlott; rendszeres tiszta almot és nyugodt környezetet igényel.', '[\"Macska panleukopénia\",\"Calicivírus\",\"Herpesz (rhinotracheitis)\",\"Macska leukózis (FeLV)\"]', 1, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(66, 'Bodri', 'kutya', 'Beagle', '1 éves', 'Hím', 'kozepes', 'Bodri egy kíváncsi és vidám kutya, aki mindig készen áll egy új kalandra.', 'img/kep3.jpg', 'Kíváncsi, vidám, intelligens', 'Bodri tenyésztőtől került hozzánk, aki bezárta a vállalkozását.', 'Rendszeres testmozgásra van szüksége', '[\"Kutya veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 1, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(67, 'Cirmoska', 'macska', 'Házimacska (tarka)', '5 éves', 'Nőstény', 'kozepes', 'Cirmoska egy kedves, visszahúzódó macska, aki szeret puha párnákon pihenni és figyelni a környezetét.', 'img/kep4.jpg', 'Csendes, érzékeny, ragaszkodó', 'Egy idősebb hölgytől került be, aki sajnos már nem tudott gondoskodni róla.', 'Szereti a nyugalmat és a saját kis fekhelyét.', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(68, 'Bátor', 'kutya', 'Kevert (valószínűleg terrier és vizsla keverék)', '3 éves', 'Hím', 'kozepes', 'Bátor fegyelmezett és figyelmes szolgálati kutya, aki mindig készen áll a feladatokra.', 'img/kep5.jpg', 'Éber, intelligens, hűséges', 'Kölyökkorától kezdve szolgálati kutyának képezték.', 'Rendszeres tréningekre és sok mozgásra van szüksége.', '[\"Veszettség\",\"Parvovírus\",\"Szopornyica\",\"Leptospirózis\"]', 0, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(69, 'Bundás', 'macska', 'Házimacska (cirmos)', '2 éves', 'Hím', 'kozepes', 'Bundás egy játékos és aktív fiatal macska, aki imád a játékok között heverészni.', 'img/kep6.jpg', 'Játékos, kíváncsi, energikus', 'Egy kertben találták testvérével együtt, majd befogadták.', 'Sok játékkal és foglalkoztatással érzi jól magát.', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\"]', 0, 1, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(70, 'Balu', 'kutya', 'keverék (bull típusú)', 'kb. 3 éves', 'Hím', 'kozepes-nagy', 'Balu egy erős, izmos, de meglepően gyengéd kutya. Nagyon szereti a sétákat és az emberek társaságát.', 'img/kep7.jpg', 'Barátságos, energikus, ragaszkodó', 'Gazdától került be, aki már nem tudta ellátni.', 'Erős kutya, ezért következetes gazdára és sok mozgásra van szüksége.', '[\"Veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(71, 'Luna', 'macska', 'rövidszőrű keverék', 'kb. 1 éves', 'Nőstény', 'kis', 'Luna egy gyönyörű, fekete cica aranyszínű szemekkel. Nyugodt, figyelmes tekintete igazán megnyerő.', 'img/kep8.jpg', 'Kedves, nyugodt, bújós', 'Utcáról mentették be sérülten, ma már teljesen egészséges.', 'Érzékeny lehet a hidegre, így benti tartás ajánlott.', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(72, 'Max', 'kutya', 'keverék', 'kb. 5 éves', 'Hím', 'nagy', 'Max egy kedves, nyugodt kutya, aki imád pihenni a fűben. Hosszú séta után boldogan liheg.', 'img/kep9.jpg', 'Nyugodt, barátságos, türelmes', 'Kóbor kutyaként került be, de hamar megmutatta, mennyire szereti az embereket.', 'Mérsékelt mozgásigény, érzékeny a melegre.', '[\"Veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(73, 'Molly', 'macska', 'Bengáli', '3 éves', 'Nőstény', 'kozepes', 'Molly egy aktív és kíváncsi macska, aki szeret magas helyekre mászni.', 'img/kep10.jpg', 'Aktív, kíváncsi, magas helyeket kedveli', 'Molly egy tenyésztőtől került hozzánk, aki bezárta a vállalkozását.', 'Magas kaparófa szükséges', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 1, 0, '2026-02-25 10:15:02', '2026-02-25 10:15:02'),
(74, 'Bella', 'kutya', 'Arany retriever', '1 éves', 'Nőstény', 'nagy', 'Bella egy gyengéd és ragaszkodó kutya, aki imádja a gyerekeket.', 'img/kep11.jpg', 'Gyengéd, ragaszkodó, gyerekbarát', 'Bella egy családtól került hozzánk, akiknek nem volt idejük rá.', 'Nincs', '[\"Kutya veszettség\",\"Parvovírus\",\"Hepatitis\",\"Leptospirózis\"]', 1, 0, 1, '2026-02-25 10:15:02', '2026-02-27 10:35:23'),
(75, 'Oscar', 'macska', 'Maine Coon', '5 éves', 'Hím', 'nagy', 'Oscar egy nyugodt és barátságos macska, aki szeret a társaságában lenni.', 'img/kep12.jpg', 'Nyugodt, barátságos, társaságkedvelő', 'Oscar előző gazdája idősek otthonába került.', 'Rendszeres fésülésre van szüksége', '[\"Macska veszettség\",\"Rhinotracheitis\",\"Calicivírus\",\"Panleukopenia\"]', 0, 0, 1, '2026-02-25 10:15:02', '2026-02-25 11:21:29'),
(76, 'Füles', 'kutya', 'Labrador keverék', '2 éves', 'Hím', 'kozepes', 'Füles egy kedves, bújós és kíváncsi kutya, aki imád játszani és sétálni. Gyorsan tanul és nagyon ragaszkodó.', 'img/kep1.jpg', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(77, 'Bea', 'macska', 'Rövidszőrű cirmos', '3 éves', 'Nőstény', 'kis', 'Bea egy nyugodt, figyelmes cica, aki szeret bekuckózni, de játékos percei is vannak. Gyorsan barátkozik, ha lassan közelítenek hozzá.', 'img/kep2.jpg', NULL, NULL, NULL, NULL, 1, 0, 1, '2026-02-25 11:13:14', '2026-02-27 06:42:28'),
(78, 'Bodri', 'kutya', 'Beagle', '1 éves', 'Hím', 'kozepes', 'Bodri egy kíváncsi és vidám kutya, aki mindig készen áll egy új kalandra.', 'img/kep3.jpg', NULL, NULL, NULL, NULL, 1, 1, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(79, 'Cirmoska', 'macska', 'Házimacska (tarka)', '5 éves', 'Nőstény', 'kozepes', 'Cirmoska egy kedves, visszahúzódó macska, aki szeret puha párnákon pihenni és figyelni a környezetét.', 'img/kep4.jpg', NULL, NULL, NULL, NULL, 0, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(80, 'Bátor', 'kutya', 'Kevert (valószínűleg terrier és vizsla keverék)', '3 éves', 'Hím', 'kozepes', 'Bátor fegyelmezett és figyelmes szolgálati kutya, aki mindig készen áll a feladatokra.', 'img/kep5.jpg', NULL, NULL, NULL, NULL, 0, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(81, 'Bundás', 'macska', 'Házimacska (cirmos)', '2 éves', 'Hím', 'kozepes', 'Bundás egy játékos és aktív fiatal macska, aki imád a játékok között heverészni.', 'img/kep6.jpg', NULL, NULL, NULL, NULL, 0, 1, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(82, 'Balu', 'kutya', 'keverék (bull típusú)', 'kb. 3 éves', 'Hím', 'kozepes-nagy', 'Balu egy erős, izmos, de meglepően gyengéd kutya. Nagyon szereti a sétákat és az emberek társaságát.', 'img/kep7.jpg', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(83, 'Luna', 'macska', 'rövidszőrű keverék', 'kb. 1 éves', 'Nőstény', 'kis', 'Luna egy gyönyörű, fekete cica aranyszínű szemekkel. Nyugodt, figyelmes tekintete igazán megnyerő.', 'img/kep8.jpg', NULL, NULL, NULL, NULL, 0, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(84, 'Max', 'kutya', 'keverék', 'kb. 5 éves', 'Hím', 'nagy', 'Max egy kedves, nyugodt kutya, aki imád pihenni a fűben. Hosszú séta után boldogan liheg.', 'img/kep9.jpg', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(85, 'Molly', 'macska', 'Bengáli', '3 éves', 'Nőstény', 'kozepes', 'Molly egy aktív és kíváncsi macska, aki szeret magas helyekre mászni.', 'img/kep10.jpg', NULL, NULL, NULL, NULL, 0, 1, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(86, 'Bella', 'kutya', 'Arany retriever', '1 éves', 'Nőstény', 'nagy', 'Bella egy gyengéd és ragaszkodó kutya, aki imádja a gyerekeket.', 'img/kep11.jpg', NULL, NULL, NULL, NULL, 1, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(87, 'Oscar', 'macska', 'Maine Coon', '5 éves', 'Hím', 'nagy', 'Oscar egy nyugodt és barátságos macska, aki szeret a társaságában lenni.', 'img/kep12.jpg', NULL, NULL, NULL, NULL, 0, 0, 0, '2026-02-25 11:13:14', '2026-02-25 11:13:14'),
(88, 'Dalma', 'kutya', 'Dalmata', '5 éves', 'Hím', 'nagy', '.', 'https://kolyokkutyakaland.hu/wp-content/uploads/dalmata2.jpg', '', '', '', '[]', 1, 1, 1, '2026-02-27 07:23:04', '2026-02-27 07:26:02'),
(89, 'Dávid', 'kutya', 'Tacskó', '1 éves', 'Hím', 'kis', 'Nincs leírás', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSty7y5T01Zec7vQpoUPoGmW8qcyP1Ga_VNrA&s', '', '', '', '[]', 1, 0, 0, '2026-02-27 11:32:16', '2026-02-27 11:32:16'),
(90, 'Zacskó', 'kutya', 'Tacskó', '1 éves', 'Hím', 'kis', 'Nincs leírás', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSty7y5T01Zec7vQpoUPoGmW8qcyP1Ga_VNrA&s', '', '', '', '[]', 1, 0, 1, '2026-02-27 11:34:51', '2026-02-27 11:34:51'),
(91, 'Dávid', 'kutya', 'Tacskó', '1 éves', 'Hím', 'kis', 'Nincs leírás', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSty7y5T01Zec7vQpoUPoGmW8qcyP1Ga_VNrA&s', '', '', '', '[]', 0, 0, 0, '2026-02-27 11:36:33', '2026-02-27 11:36:33'),
(92, 'Hasi', 'kutya', 'Tacskó', '1 éves', 'Hím', 'kis', 'Nincs leírás', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSty7y5T01Zec7vQpoUPoGmW8qcyP1Ga_VNrA&s', '', '', '', '[]', 0, 0, 0, '2026-02-27 11:36:53', '2026-02-27 11:36:53');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `excerpt` varchar(300) DEFAULT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `excerpt`, `content`, `image`, `author`, `published`, `created_at`, `updated_at`) VALUES
(1, 'Rekord számú örökbefogadás!', 'Szeptemberben 25 állat talált örökbefogadót, ami rekord szám a menhelyünk történetében.', 'Különösen örülünk, hogy a hosszú ideje nálunk élő idősebb állatok is gazdára találtak. A szeptemberi hónapban 25 állatot sikerült örökbefogadtatnunk, ami a menhelyünk történetében eddigi legjobb eredmény. Köszönjük mindenkinek, aki részt vett a sikerben!', 'img/blog1.jpg', 'Dominika', 1, '2026-02-06 08:51:04', '2026-02-06 08:51:04'),
(2, 'Új menhelyi program indult!', 'Bevezetjük a \'Menhelyi Napok\' programot, ahol látogatók megismerhetik munkánkat.', 'A program keretében minden szombaton 10-14 óra között tartunk nyílt napokat. Látogatók megismerhetik az állatokat, beszélgethetnek a gondozókkal és megtekinthetik a menhelyi létesítményeinket. Az első nyílt napok nagy sikert arattak, több mint 50 látogató volt nálunk!', 'img/blog2.jpg', 'Jázmin', 1, '2026-02-06 08:51:04', '2026-02-06 08:51:04'),
(3, 'Télire készülünk - adománygyűjtés', 'Téli takarókat, melegítőket és élelmiszert gyűjtünk az állatok számára.', 'A hideg időjárás elközeledtével fontos, hogy az állatkák kényelmesen átvészeljék a telet. Gyűjtünk meleg takarókat, kutyaruhákat, macskamelegítőket és minőségi élelmiszereket. Az adományokat a menhelyünkre szállíthatják hétköznap 9-17 óra között.', 'img/blog3.jpg', 'Leila', 1, '2026-02-06 08:51:04', '2026-02-06 08:51:04');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('adoption_status','system','message') DEFAULT 'system',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES
(1, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Sanyi örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-18 10:43:31'),
(2, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Ella örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-18 11:29:09'),
(3, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Vakarcs örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-23 09:23:30'),
(4, 8, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Vakarcs örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-23 09:23:30'),
(5, 4, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Vakarcs örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-23 09:23:30'),
(6, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Oscar örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-25 11:21:29'),
(7, 4, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Oscar örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-25 11:21:29'),
(8, 4, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Oscar örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-25 11:21:29'),
(9, 4, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Oscar örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-25 11:21:29'),
(10, 4, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Oscar örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-25 11:21:29'),
(11, 4, 'adoption_status', 'Örökbefogadás státusza: Elutasítva', 'A(z) Oscar örökbefogadására benyújtott jelentkezésed státusza megváltozott: Sajnos elutasították. További részletekért keresd a menhelyet.', 'profile.html#adoptions', 0, '2026-02-25 11:21:29'),
(12, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Bea örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-27 06:42:28'),
(13, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Dalma örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-27 07:26:02'),
(14, 4, 'adoption_status', 'Örökbefogadás státusza: Elfogadva', 'A(z) Bella örökbefogadására benyújtott jelentkezésed státusza megváltozott: Elfogadták! Kérjük, vedd fel a kapcsolatot a menhely munkatársaival.', 'profile.html#adoptions', 0, '2026-02-27 10:35:23');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `role`, `created_at`, `updated_at`) VALUES
(2, 'user123', 'user@email.hu', '$2y$10$YourHashedPasswordHere', 'User', 'user', '2026-02-06 07:52:33', '2026-02-06 07:52:33'),
(3, 'leila', 'nagy.peter@email.hu', '$2y$10$YourHashedPasswordHere', 'Tóht Leila', 'user', '2026-02-06 07:52:33', '2026-02-06 07:52:33'),
(4, 'leilaa', 'poi@gmail.com', '$2y$12$FBZ0dksDmODN1Er1sR2cWO/TlOpggi/V87W0iq.GzaFcdHr16PJva', 'adewr', 'user', '2026-02-06 08:00:13', '2026-02-06 08:00:13'),
(5, 'jzmn', 'jzmn@gmail.com', '$2y$12$ZEiNMmxDj/jNKsDZGZaAjeN6EOTMrGf0Ari9i9o.MmUuFXwxuq8Lm', 'j_zmn', 'user', '2026-02-06 08:01:50', '2026-02-06 08:01:50'),
(6, 'Anna', 'anna.kovacs@gmail.com', '$2y$12$FLvLHpy.GmFOJsKIe5JLjuDXejW8Km8dhjX2mHbAKGNpEV2JfQem2', 'Kovács Anna', 'user', '2026-02-09 09:36:06', '2026-02-09 09:36:06'),
(7, 'admin', 'admin@boldogmancs.hu', '$2y$10$qijiBMxAZRh9BoNrf8mnRuTXc5fkHVdCTOdbpELsuodLXgsFw4Jhe', 'Rendszergazda', 'admin', '2026-02-10 12:57:05', '2026-02-10 12:57:05'),
(8, 'leilaaa', 'tothleilaanasztazia@gmail.com', '$2y$12$tjK2.wgg3DYccBZxUfT9Ren3mC9jBq5yifdg74fr2vRiOpJigcEpy', 'Tóth Leila', 'user', '2026-02-20 07:57:21', '2026-02-20 07:57:21');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_tokens`
--

CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `user_tokens`
--

INSERT INTO `user_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(120, 7, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo3LCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzcyMjc4MjE0fQ.aOIs19R_MtagdpGdv6n8UuUN4VTa45pL5PjrRyLp9HA', '2026-02-28 12:30:14', '2026-02-27 11:30:14');

-- --------------------------------------------------------

--
-- A nézet helyettes szerkezete `view_active_adoptions`
-- (Lásd alább az aktuális nézetet)
--
CREATE TABLE `view_active_adoptions` (
`id` int(11)
,`animal_id` int(11)
,`user_id` int(11)
,`full_name` varchar(100)
,`email` varchar(100)
,`phone` varchar(20)
,`home_type` varchar(50)
,`address` varchar(255)
,`experience` text
,`message` text
,`status` enum('pending','approved','rejected','completed')
,`created_at` timestamp
,`updated_at` timestamp
,`animal_name` varchar(50)
,`animal_type` enum('kutya','macska')
,`animal_image` varchar(255)
,`username` varchar(50)
);

-- --------------------------------------------------------

--
-- A nézet helyettes szerkezete `view_adoption_stats`
-- (Lásd alább az aktuális nézetet)
--
CREATE TABLE `view_adoption_stats` (
`total` bigint(21)
,`pending` decimal(22,0)
,`approved` decimal(22,0)
,`rejected` decimal(22,0)
,`completed` decimal(22,0)
,`date` date
);

-- --------------------------------------------------------

--
-- Nézet szerkezete `view_active_adoptions`
--
DROP TABLE IF EXISTS `view_active_adoptions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_active_adoptions`  AS SELECT `a`.`id` AS `id`, `a`.`animal_id` AS `animal_id`, `a`.`user_id` AS `user_id`, `a`.`full_name` AS `full_name`, `a`.`email` AS `email`, `a`.`phone` AS `phone`, `a`.`home_type` AS `home_type`, `a`.`address` AS `address`, `a`.`experience` AS `experience`, `a`.`message` AS `message`, `a`.`status` AS `status`, `a`.`created_at` AS `created_at`, `a`.`updated_at` AS `updated_at`, `an`.`name` AS `animal_name`, `an`.`type` AS `animal_type`, `an`.`image` AS `animal_image`, `u`.`username` AS `username` FROM ((`adoptions` `a` left join `animals` `an` on(`a`.`animal_id` = `an`.`id`)) left join `users` `u` on(`a`.`user_id` = `u`.`id`)) WHERE `a`.`status` in ('pending','approved') ;

-- --------------------------------------------------------

--
-- Nézet szerkezete `view_adoption_stats`
--
DROP TABLE IF EXISTS `view_adoption_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_adoption_stats`  AS SELECT count(0) AS `total`, sum(case when `adoptions`.`status` = 'pending' then 1 else 0 end) AS `pending`, sum(case when `adoptions`.`status` = 'approved' then 1 else 0 end) AS `approved`, sum(case when `adoptions`.`status` = 'rejected' then 1 else 0 end) AS `rejected`, sum(case when `adoptions`.`status` = 'completed' then 1 else 0 end) AS `completed`, cast(`adoptions`.`created_at` as date) AS `date` FROM `adoptions` GROUP BY cast(`adoptions`.`created_at` as date) ORDER BY cast(`adoptions`.`created_at` as date) DESC ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `adoptions`
--
ALTER TABLE `adoptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_animal_id` (`animal_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_adoptions_status_created` (`status`,`created_at`);

--
-- A tábla indexei `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_adopted` (`adopted`),
  ADD KEY `idx_urgent` (`urgent`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_animals_type_adopted` (`type`,`adopted`),
  ADD KEY `idx_animals_featured_adopted` (`featured`,`adopted`);

--
-- A tábla indexei `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_published` (`published`);

--
-- A tábla indexei `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`animal_id`),
  ADD KEY `idx_favorites_user` (`user_id`),
  ADD KEY `idx_favorites_animal` (`animal_id`);

--
-- A tábla indexei `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_read` (`user_id`,`is_read`),
  ADD KEY `idx_created` (`created_at`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`);

--
-- A tábla indexei `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `adoptions`
--
ALTER TABLE `adoptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `animals`
--
ALTER TABLE `animals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT a táblához `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `adoptions`
--
ALTER TABLE `adoptions`
  ADD CONSTRAINT `adoptions_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `adoptions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

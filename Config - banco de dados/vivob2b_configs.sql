-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vivob2b_configs
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `historico_login_vivoconfig`
--

DROP TABLE IF EXISTS `historico_login_vivoconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_login_vivoconfig` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `re` varchar(30) NOT NULL,
  `dt_login` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `re` (`re`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_login_vivoconfig`
--

LOCK TABLES `historico_login_vivoconfig` WRITE;
/*!40000 ALTER TABLE `historico_login_vivoconfig` DISABLE KEYS */;
INSERT INTO `historico_login_vivoconfig` VALUES (1,'re003','2025-10-02 16:24:47'),(2,'80999282','2025-10-02 17:04:28');
/*!40000 ALTER TABLE `historico_login_vivoconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `re` varchar(30) NOT NULL,
  `senha` char(60) NOT NULL,
  `permissao` varchar(120) NOT NULL,
  `dt_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  `ativo` enum('sim','nao') NOT NULL DEFAULT 'nao',
  PRIMARY KEY (`id`),
  UNIQUE KEY `re` (`re`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Usuário 1','re001','senha001','usuario','2025-10-02 13:34:54','sim'),(2,'Usuário 2','re002','senha002','admin','2025-10-02 13:34:56','sim'),(3,'Usuário 3','re003','senha003','coordenador','2025-10-02 13:34:58','sim'),(4,'Usuário 4','re004','senha004','coordenador','2025-10-02 13:35:00','sim'),(5,'Usuário 5','re005','senha005','admin','2025-10-02 13:35:02','sim'),(6,'Usuário 6','re006','senha006','admin','2025-10-02 13:35:04','sim'),(7,'Usuário 7','re007','senha007','coordenador','2025-10-02 13:35:06','sim'),(8,'Usuário 8','re008','senha008','usuario','2025-10-02 13:35:08','sim'),(9,'Usuário 9','re009','senha009','admin','2025-10-02 13:35:10','sim'),(10,'Usuário 10','re010','senha010','usuario','2025-10-02 13:35:12','sim'),(11,'Usuário 11','re011','senha011','usuario','2025-10-02 13:35:14','sim'),(12,'Usuário 12','re012','senha012','coordenador','2025-10-02 13:50:41','sim'),(13,'Usuário 13','re013','senha013','coordenador','2025-10-02 13:50:43','sim'),(14,'Usuário 14','re014','senha014','admin','2025-10-02 13:50:45','sim'),(15,'Usuário 15','re015','senha015','admin','2025-10-02 13:50:47','sim'),(16,'Usuário 16','re016','senha016','usuario','2025-10-02 13:50:50','sim'),(17,'Usuário 17','re017','senha017','coordenador','2025-10-02 13:50:52','sim'),(18,'Usuário 18','re018','senha018','admin','2025-10-02 13:50:54','sim'),(19,'Usuário 19','re019','senha019','coordenador','2025-10-02 13:50:56','sim'),(21,'Robson','80999282','12','escritorio','2025-10-02 16:33:52','sim'),(22,'Robson','123456','1','escritorio','2025-10-02 17:17:12','nao');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 17:43:45

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
-- Table structure for table `aparelho_configuracao`
--

DROP TABLE IF EXISTS `aparelho_configuracao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aparelho_configuracao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_config` varchar(100) NOT NULL,
  `cliente` varchar(150) NOT NULL,
  `tipo_config` varchar(100) NOT NULL,
  `status` enum('pendente','em_andamento','finalizado','cancelado') DEFAULT 'pendente',
  `observacao` text DEFAULT NULL,
  `dt_cadastro` datetime DEFAULT current_timestamp(),
  `dt_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `re_assumiu` varchar(50) DEFAULT NULL,
  `dt_assumiu` datetime DEFAULT NULL,
  `dt_finalizou` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aparelho_configuracao`
--

LOCK TABLES `aparelho_configuracao` WRITE;
/*!40000 ALTER TABLE `aparelho_configuracao` DISABLE KEYS */;
/*!40000 ALTER TABLE `aparelho_configuracao` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_login_vivoconfig`
--

LOCK TABLES `historico_login_vivoconfig` WRITE;
/*!40000 ALTER TABLE `historico_login_vivoconfig` DISABLE KEYS */;
INSERT INTO `historico_login_vivoconfig` VALUES (1,'80999282','2025-10-15 13:04:43'),(2,'80999282','2025-10-15 13:10:16'),(3,'80999282','2025-10-15 13:20:07');
/*!40000 ALTER TABLE `historico_login_vivoconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_execucao`
--

DROP TABLE IF EXISTS `perfil_execucao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil_execucao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_config` int(11) NOT NULL,
  `re_assumiu` varchar(50) NOT NULL,
  `dt_assumiu` datetime NOT NULL DEFAULT current_timestamp(),
  `dt_finalizou` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_config` (`id_config`),
  CONSTRAINT `perfil_execucao_ibfk_1` FOREIGN KEY (`id_config`) REFERENCES `aparelho_configuracao` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_execucao`
--

LOCK TABLES `perfil_execucao` WRITE;
/*!40000 ALTER TABLE `perfil_execucao` DISABLE KEYS */;
/*!40000 ALTER TABLE `perfil_execucao` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Robson Calheira','80999282','Vivo@123','administrativo','2025-10-15 13:00:51','sim'),(2,'Teste','123456','12345678','escritorio','2025-10-15 13:08:02','sim'),(3,'Mirelle ','R3388808','Vivo@123','coordenacao','2025-10-15 13:18:45','sim'),(4,'Renato Brandão','R328071','Vivo@123','coordenacao','2025-10-15 13:19:22','sim');
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

-- Dump completed on 2025-10-15 13:31:56

-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: hris_payroll_app_v2
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `hris_payroll_app_v2`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `hris_payroll_app_v2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `hris_payroll_app_v2`;

--
-- Table structure for table `absensi`
--

DROP TABLE IF EXISTS `absensi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `absensi` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `jam_masuk` datetime DEFAULT NULL,
  `jam_pulang` datetime DEFAULT NULL,
  `status_absensi` enum('hadir','sakit','izin','libur','setengah_hari','alfa') NOT NULL DEFAULT 'hadir',
  `kode_absensi` varchar(10) DEFAULT NULL,
  `shift` varchar(24) DEFAULT NULL,
  `foto_masuk` varchar(255) DEFAULT NULL,
  `foto_pulang` varchar(255) DEFAULT NULL,
  `latitude_masuk` decimal(10,7) DEFAULT NULL,
  `longitude_masuk` decimal(10,7) DEFAULT NULL,
  `latitude_pulang` decimal(10,7) DEFAULT NULL,
  `longitude_pulang` decimal(10,7) DEFAULT NULL,
  `terlambat_menit` int(10) unsigned NOT NULL DEFAULT 0,
  `setengah_hari` tinyint(1) NOT NULL DEFAULT 0,
  `lembur_jam` decimal(6,2) NOT NULL DEFAULT 0.00,
  `keterangan` varchar(255) DEFAULT NULL,
  `absen_dipulihkan` tinyint(1) NOT NULL DEFAULT 0,
  `butuh_approval` tinyint(1) NOT NULL DEFAULT 0,
  `approval_status` varchar(10) DEFAULT NULL,
  `approval_jenis` varchar(20) DEFAULT NULL,
  `assigned_approver_user_id` bigint(20) unsigned DEFAULT NULL,
  `approver_user_id` bigint(20) unsigned DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `catatan_atasan` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_absensi_karyawan_tanggal` (`karyawan_id`,`tanggal`),
  KEY `idx_absensi_tanggal` (`tanggal`),
  KEY `idx_absensi_status` (`status_absensi`),
  KEY `idx_absensi_kode` (`kode_absensi`),
  KEY `idx_absensi_assigned_approver` (`assigned_approver_user_id`),
  CONSTRAINT `fk_absensi_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absensi`
--

LOCK TABLES `absensi` WRITE;
/*!40000 ALTER TABLE `absensi` DISABLE KEYS */;
INSERT INTO `absensi` VALUES (1,1,'2026-03-10','2026-03-10 15:49:09','2026-03-10 15:51:06','hadir','H',NULL,'/uploads/attendance/employee-1-in-1773132549670.jpg','/uploads/attendance/employee-1-out-1773132666131.jpg',-7.7780000,110.3677000,-7.7780000,110.3677000,439,0,0.00,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-10 15:49:09','2026-03-10 15:51:06'),(2,2,'2026-03-10','2026-03-10 16:23:48','2026-03-10 16:24:31','hadir','H',NULL,'/uploads/attendance/employee-2-in-1773134628726.jpg','/uploads/attendance/employee-2-out-1773134671107.jpg',-7.7780000,110.3677000,-7.7780000,110.3677000,473,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-10 16:14:45','2026-03-10 16:24:31'),(3,3,'2026-03-10',NULL,NULL,'sakit','S',NULL,'/uploads/attendance/1773135033521-FOTO-KATALOG-STUDIO-.pdf',NULL,NULL,NULL,NULL,NULL,0,0,0.00,'demam',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-10 16:30:33','2026-03-10 16:30:33'),(4,2,'2026-03-11','2026-03-11 08:34:36',NULL,'hadir','H',NULL,'/uploads/attendance/employee-2-in-1773192876009.jpg',NULL,-7.7780000,110.3677000,NULL,NULL,4,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-11 08:34:36','2026-03-11 08:34:36'),(5,1,'2026-03-11','2026-03-11 11:18:36',NULL,'hadir','H',NULL,'/uploads/attendance/employee-1-in-1773202716087.jpg',NULL,-7.7780000,110.3677000,NULL,NULL,168,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-11 11:18:36','2026-03-11 11:18:36'),(6,3,'2026-03-11',NULL,NULL,'izin','X',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'keperluan keluarga',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-11 11:38:27','2026-03-11 11:38:27'),(7,2,'2026-03-12','2026-03-12 09:33:23',NULL,'hadir','O',NULL,'/uploads/attendance/employee-2-in-1773282803112.jpg',NULL,-7.7780000,110.3677000,NULL,NULL,63,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-12 09:33:23','2026-03-12 09:33:23'),(8,3,'2026-03-12','2026-03-12 11:44:23',NULL,'hadir','O',NULL,'/uploads/attendance/employee-3-in-1773290663470.jpg',NULL,-7.7780000,110.3677000,NULL,NULL,194,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-12 11:44:23','2026-03-12 11:44:23'),(9,3,'2026-04-16','2026-04-16 08:55:25',NULL,'hadir','O',NULL,'/uploads/attendance/employee-3-in-1776304525785.jpg',NULL,-7.8025076,110.4068520,NULL,NULL,25,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-16 08:55:25','2026-04-16 08:55:25'),(10,3,'2026-04-17',NULL,NULL,'izin','X',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'sedang acara keluarga',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-17 10:10:28','2026-04-17 10:10:28'),(11,3,'2026-04-18','2026-04-18 10:49:02',NULL,'hadir','O',NULL,'/uploads/attendance/employee-3-in-1776484142921.jpg',NULL,-7.8025094,110.4068550,NULL,NULL,139,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-18 10:49:02','2026-04-18 10:49:02'),(12,2,'2026-04-18','2026-04-18 11:11:44',NULL,'hadir','O',NULL,'/uploads/attendance/employee-2-in-1776485505000.jpg',NULL,-7.8025076,110.4068520,NULL,NULL,161,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-18 11:11:45','2026-04-18 11:11:45'),(13,1,'2026-04-18','2026-04-18 11:14:32',NULL,'hadir','O',NULL,'/uploads/attendance/employee-1-in-1776485672233.jpg',NULL,-7.8025067,110.4067805,NULL,NULL,164,0,0.00,'',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-18 11:14:32','2026-04-18 11:14:32'),(14,4,'2026-04-23',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #3 (2026-04-24 s/d 2026-04-27)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:24:51','2026-04-24 15:24:51'),(15,4,'2026-04-24',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #3 (2026-04-24 s/d 2026-04-27)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:24:51','2026-04-24 15:24:51'),(16,4,'2026-04-25',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #3 (2026-04-24 s/d 2026-04-27)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:24:51','2026-04-24 15:24:51'),(17,4,'2026-04-26',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #3 (2026-04-24 s/d 2026-04-27)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:24:51','2026-04-24 15:24:51'),(18,4,'2026-04-27',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #3 (2026-04-24 s/d 2026-04-27)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:24:51','2026-04-24 15:24:51'),(19,3,'2026-04-24',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #2 (2026-04-24 s/d 2026-04-26)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:27:21','2026-04-24 15:27:21'),(20,3,'2026-04-25',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #2 (2026-04-24 s/d 2026-04-26)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:27:21','2026-04-24 15:27:21'),(21,3,'2026-04-26',NULL,NULL,'hadir','O',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0.00,'Auto hadir perjalanan dinas #2 (2026-04-24 s/d 2026-04-26)',0,0,NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-24 15:27:21','2026-04-24 15:27:21');
/*!40000 ALTER TABLE `absensi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_migrations`
--

DROP TABLE IF EXISTS `app_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_migrations` (
  `key_name` varchar(100) NOT NULL,
  `executed_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_migrations`
--

LOCK TABLES `app_migrations` WRITE;
/*!40000 ALTER TABLE `app_migrations` DISABLE KEYS */;
INSERT INTO `app_migrations` VALUES ('clear_stale_loan_override_v1','2026-11-25 07:34:48'),('recompute_late_v1_media_hostlive_advertiser','2026-11-25 07:34:48'),('recompute_pagi_halfday_after_1130_v1','2026-11-25 07:34:49');
/*!40000 ALTER TABLE `app_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_code`
--

DROP TABLE IF EXISTS `attendance_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(8) NOT NULL,
  `label` varchar(100) NOT NULL,
  `status` enum('hadir','setengah_hari','sakit','izin','alfa','libur') NOT NULL,
  `sort` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_code`
--

LOCK TABLES `attendance_code` WRITE;
/*!40000 ALTER TABLE `attendance_code` DISABLE KEYS */;
INSERT INTO `attendance_code` VALUES (1,'O','Hadir (O)','hadir',0,'2026-11-25 00:34:50'),(2,'T','Terlambat (T)','hadir',10,'2026-11-25 00:34:50'),(3,'PA','Pulang Awal (PA)','hadir',20,'2026-11-25 00:34:50'),(4,'H','Setengah Hari (H)','setengah_hari',30,'2026-11-25 00:34:50'),(5,'S','Sakit + Surat (S)','sakit',40,'2026-11-25 00:34:50'),(6,'SX','Sakit Tanpa Surat (SX)','sakit',50,'2026-11-25 00:34:50'),(7,'I','Izin (I)','izin',60,'2026-11-25 00:34:50'),(8,'A','Alfa (A)','alfa',70,'2026-11-25 00:34:50'),(9,'L','Libur (L)','libur',80,'2026-11-25 00:34:50'),(10,'LN','Libur Nasional (LN)','libur',90,'2026-11-25 00:34:50'),(11,'LP','Libur Perusahaan (LP)','libur',100,'2026-11-25 00:34:50'),(12,'C','Cuti (C)','libur',110,'2026-11-25 00:34:50'),(13,'-','Tidak Absen (-)','libur',120,'2026-11-25 00:34:50'),(14,'CM','Cuti Mandiri (CM)','libur',130,'2026-11-25 00:34:50'),(15,'CH','Cuti Hamil (CH)','libur',140,'2026-11-25 00:34:50');
/*!40000 ALTER TABLE `attendance_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bonus_distribution`
--

DROP TABLE IF EXISTS `bonus_distribution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bonus_distribution` (
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `team_approved` tinyint(1) NOT NULL DEFAULT 0,
  `company_approved` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`periode_bulan`,`periode_tahun`,`karyawan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bonus_distribution`
--

LOCK TABLES `bonus_distribution` WRITE;
/*!40000 ALTER TABLE `bonus_distribution` DISABLE KEYS */;
/*!40000 ALTER TABLE `bonus_distribution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bonus_omzet_input`
--

DROP TABLE IF EXISTS `bonus_omzet_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bonus_omzet_input` (
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `ava_sportivo` decimal(16,2) NOT NULL DEFAULT 0.00,
  `ayres` decimal(16,2) NOT NULL DEFAULT 0.00,
  `gabungan` decimal(16,2) NOT NULL DEFAULT 0.00,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bonus_omzet_input`
--

LOCK TABLES `bonus_omzet_input` WRITE;
/*!40000 ALTER TABLE `bonus_omzet_input` DISABLE KEYS */;
/*!40000 ALTER TABLE `bonus_omzet_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_lembur_tambahan`
--

DROP TABLE IF EXISTS `finance_lembur_tambahan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `finance_lembur_tambahan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `unit` varchar(100) NOT NULL,
  `nominal` decimal(14,2) NOT NULL DEFAULT 0.00,
  `catatan` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_finance_lembur_unit` (`periode_bulan`,`periode_tahun`,`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_lembur_tambahan`
--

LOCK TABLES `finance_lembur_tambahan` WRITE;
/*!40000 ALTER TABLE `finance_lembur_tambahan` DISABLE KEYS */;
/*!40000 ALTER TABLE `finance_lembur_tambahan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freelance_custom_item`
--

DROP TABLE IF EXISTS `freelance_custom_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `freelance_custom_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) NOT NULL,
  `nama_jenis` varchar(100) NOT NULL,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freelance_custom_item`
--

LOCK TABLES `freelance_custom_item` WRITE;
/*!40000 ALTER TABLE `freelance_custom_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `freelance_custom_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freelance_custom_pengerjaan`
--

DROP TABLE IF EXISTS `freelance_custom_pengerjaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `freelance_custom_pengerjaan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `bulan` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `harga_per_pcs` int(11) NOT NULL DEFAULT 0,
  `jumlah_pcs` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fcp` (`item_id`,`bulan`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freelance_custom_pengerjaan`
--

LOCK TABLES `freelance_custom_pengerjaan` WRITE;
/*!40000 ALTER TABLE `freelance_custom_pengerjaan` DISABLE KEYS */;
/*!40000 ALTER TABLE `freelance_custom_pengerjaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freelance_harian`
--

DROP TABLE IF EXISTS `freelance_harian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `freelance_harian` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) NOT NULL,
  `bulan` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `harga_per_hari` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fh` (`karyawan_id`,`bulan`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freelance_harian`
--

LOCK TABLES `freelance_harian` WRITE;
/*!40000 ALTER TABLE `freelance_harian` DISABLE KEYS */;
/*!40000 ALTER TABLE `freelance_harian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freelance_jam`
--

DROP TABLE IF EXISTS `freelance_jam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `freelance_jam` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) NOT NULL,
  `bulan` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `rate_per_jam` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fj` (`karyawan_id`,`bulan`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freelance_jam`
--

LOCK TABLES `freelance_jam` WRITE;
/*!40000 ALTER TABLE `freelance_jam` DISABLE KEYS */;
/*!40000 ALTER TABLE `freelance_jam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `freelance_pengerjaan`
--

DROP TABLE IF EXISTS `freelance_pengerjaan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `freelance_pengerjaan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) NOT NULL,
  `bulan` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `harga_per_pcs` int(11) NOT NULL DEFAULT 0,
  `jumlah_pcs` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fp` (`karyawan_id`,`bulan`,`tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `freelance_pengerjaan`
--

LOCK TABLES `freelance_pengerjaan` WRITE;
/*!40000 ALTER TABLE `freelance_pengerjaan` DISABLE KEYS */;
/*!40000 ALTER TABLE `freelance_pengerjaan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris_migration_log`
--

DROP TABLE IF EXISTS `hris_migration_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris_migration_log` (
  `migration_key` varchar(150) NOT NULL,
  `applied_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`migration_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris_migration_log`
--

LOCK TABLES `hris_migration_log` WRITE;
/*!40000 ALTER TABLE `hris_migration_log` DISABLE KEYS */;
INSERT INTO `hris_migration_log` VALUES ('nip_auto_format_v1','2026-11-25 07:25:13');
/*!40000 ALTER TABLE `hris_migration_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jadwal_karyawan`
--

DROP TABLE IF EXISTS `jadwal_karyawan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jadwal_karyawan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `karyawan_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `shift` varchar(24) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_karyawan_tanggal` (`karyawan_id`,`tanggal`),
  KEY `idx_tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadwal_karyawan`
--

LOCK TABLES `jadwal_karyawan` WRITE;
/*!40000 ALTER TABLE `jadwal_karyawan` DISABLE KEYS */;
/*!40000 ALTER TABLE `jadwal_karyawan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jadwal_master`
--

DROP TABLE IF EXISTS `jadwal_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jadwal_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `karyawan_id` int(11) NOT NULL,
  `hari` tinyint(4) NOT NULL,
  `shift` varchar(24) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_karyawan_hari` (`karyawan_id`,`hari`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadwal_master`
--

LOCK TABLES `jadwal_master` WRITE;
/*!40000 ALTER TABLE `jadwal_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `jadwal_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `karyawan`
--

DROP TABLE IF EXISTS `karyawan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `karyawan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `no_karyawan` varchar(50) DEFAULT NULL,
  `nama` varchar(150) NOT NULL,
  `unit` varchar(100) DEFAULT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `tipe_payroll_penjahit` enum('mingguan','bulanan') DEFAULT NULL,
  `tipe_freelance` enum('jam','pengerjaan','custom_pengerjaan','harian') DEFAULT NULL,
  `departemen` varchar(100) DEFAULT NULL,
  `divisi` varchar(100) DEFAULT NULL,
  `sub_divisi` varchar(100) DEFAULT NULL,
  `cs_type` enum('selling','order','grosir','marketplace') DEFAULT NULL,
  `bonus_group` enum('ava','ayres','operasional') DEFAULT NULL,
  `cuti_hamil` tinyint(1) NOT NULL DEFAULT 0,
  `cuti_hamil_mulai` date DEFAULT NULL,
  `penempatan` varchar(150) DEFAULT NULL,
  `penempatan_extra` varchar(500) DEFAULT NULL,
  `is_shift` tinyint(1) NOT NULL DEFAULT 0,
  `jadwal_editor` tinyint(1) NOT NULL DEFAULT 0,
  `pembagian_rekapan` varchar(100) DEFAULT NULL,
  `pembebanan` varchar(100) DEFAULT NULL,
  `bank` varchar(50) DEFAULT 'BCA',
  `no_rekening` varchar(50) DEFAULT NULL,
  `jenis_kelamin` enum('laki-laki','perempuan') DEFAULT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `nik` varchar(30) DEFAULT NULL,
  `agama` varchar(30) DEFAULT NULL,
  `alamat_ktp` text DEFAULT NULL,
  `alamat_rumah_kost` text DEFAULT NULL,
  `nomor_telepon` varchar(30) DEFAULT NULL,
  `foto_ktp` varchar(255) DEFAULT NULL,
  `status_kepegawaian` enum('training','kontrak','tetap','freelance','partime','magang','resign') NOT NULL DEFAULT 'kontrak',
  `status_kerja` enum('training','kontrak','tetap','freelance','partime','magang','resign') NOT NULL DEFAULT 'kontrak',
  `status_data` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `tanggal_nonaktif` date DEFAULT NULL,
  `tanggal_masuk_pertama` date DEFAULT NULL,
  `tanggal_kontrak` date DEFAULT NULL,
  `tanggal_selesai_kontrak` date DEFAULT NULL,
  `kenaikan_tiap_tahun` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `potongan_kontrak_stop_ym` int(11) DEFAULT NULL,
  `potongan_kontrak_start_ym` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_karyawan_user_id` (`user_id`),
  UNIQUE KEY `uq_karyawan_no_karyawan` (`no_karyawan`),
  UNIQUE KEY `uq_karyawan_nik` (`nik`),
  KEY `idx_karyawan_nama` (`nama`),
  KEY `idx_karyawan_unit` (`unit`),
  KEY `idx_karyawan_departemen` (`departemen`),
  KEY `idx_karyawan_divisi` (`divisi`),
  KEY `idx_karyawan_status_kepegawaian` (`status_kepegawaian`),
  KEY `idx_karyawan_status_kerja` (`status_kerja`),
  KEY `idx_karyawan_status_data` (`status_data`),
  CONSTRAINT `fk_karyawan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `karyawan`
--

LOCK TABLES `karyawan` WRITE;
/*!40000 ALTER TABLE `karyawan` DISABLE KEYS */;
INSERT INTO `karyawan` VALUES (1,2,'MR.SR.2025.0001','ZEXO','Ayres Apparel','Sales Nasional',NULL,NULL,'Marketing','Sales & Retail','Media',NULL,NULL,0,NULL,'Office',NULL,1,0,NULL,'penjualan ava',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/uploads/ktp/1773132378887-ABSENSI.drawio.png','kontrak','kontrak','aktif',NULL,'2025-12-10','2026-03-10','2027-03-10',100000.00,'2026-03-10 15:46:18','2026-11-25 07:25:13',NULL,NULL),(2,3,'FC.RND.2026.0001','ZETACO','AVA Sportivo','Staff','mingguan',NULL,'Finance','RnD','Penjahit',NULL,NULL,0,NULL,'Office',NULL,0,0,NULL,'penjualan ayres',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/uploads/ktp/1773134048617-Mar06-02_09.jpg.jpeg','tetap','tetap','aktif',NULL,'2026-03-10','2026-06-10','2027-06-10',999999999999.99,'2026-03-10 16:14:08','2026-11-25 07:25:13',NULL,NULL),(3,4,'MR.SR.2026.0001','LEIF','AVA Sportivo','Sales Area',NULL,NULL,'Marketing','Sales & Retail','Finishing',NULL,NULL,0,NULL,'Toko','Ayres',1,0,NULL,'penjualan ava',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/uploads/ktp/1773134994321-AdiVira-01.jpg.jpeg','tetap','tetap','aktif',NULL,'2026-03-11','2026-06-11','2027-06-11',999999999999.99,'2026-03-10 16:29:54','2026-11-25 07:25:13',NULL,NULL),(4,5,'FC.LOG.2026.0001','ezranhmry',NULL,'Staff',NULL,NULL,'Finance','Logistik','Finishing',NULL,NULL,0,NULL,'Toko',NULL,1,0,NULL,'penjualan ava',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'33','tetap','tetap','aktif',NULL,'2026-04-02','2026-07-02','2027-07-02',0.00,'2026-04-07 10:19:21','2026-11-25 07:25:13',NULL,NULL),(5,6,'XX.XX.2026.0001','avagrouphrd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,0,0,NULL,NULL,'BCA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'training','training','aktif',NULL,NULL,NULL,NULL,0.00,'2026-04-18 09:18:49','2026-11-25 07:25:13',NULL,NULL),(6,11,NULL,'test.karyawan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,0,0,NULL,NULL,'BCA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'training','training','aktif',NULL,NULL,NULL,NULL,0.00,'2026-11-25 23:48:17','2026-11-25 23:48:17',NULL,NULL);
/*!40000 ALTER TABLE `karyawan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_finance_hari_kerja`
--

DROP TABLE IF EXISTS `kpi_finance_hari_kerja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_finance_hari_kerja` (
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `hari_kerja` int(11) NOT NULL DEFAULT 23,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_finance_hari_kerja`
--

LOCK TABLES `kpi_finance_hari_kerja` WRITE;
/*!40000 ALTER TABLE `kpi_finance_hari_kerja` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_finance_hari_kerja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_finance_input`
--

DROP TABLE IF EXISTS `kpi_finance_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_finance_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `karyawan_id` int(11) NOT NULL,
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `row_key` varchar(64) NOT NULL,
  `aktual_data` varchar(255) DEFAULT NULL,
  `perhitungan` decimal(7,2) NOT NULL DEFAULT 0.00,
  `hasil_override` enum('terpenuhi','tidak') DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kpi_finance` (`karyawan_id`,`periode_bulan`,`periode_tahun`,`row_key`),
  KEY `idx_kpi_finance_emp_period` (`karyawan_id`,`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_finance_input`
--

LOCK TABLES `kpi_finance_input` WRITE;
/*!40000 ALTER TABLE `kpi_finance_input` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_finance_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_finance_omzet`
--

DROP TABLE IF EXISTS `kpi_finance_omzet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_finance_omzet` (
  `placement_key` varchar(32) NOT NULL,
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `target` decimal(16,2) NOT NULL DEFAULT 0.00,
  `realisasi` decimal(16,2) NOT NULL DEFAULT 0.00,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`placement_key`,`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_finance_omzet`
--

LOCK TABLES `kpi_finance_omzet` WRITE;
/*!40000 ALTER TABLE `kpi_finance_omzet` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_finance_omzet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_rnd_hari_kerja`
--

DROP TABLE IF EXISTS `kpi_rnd_hari_kerja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_rnd_hari_kerja` (
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `hari_kerja` int(11) NOT NULL DEFAULT 23,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_rnd_hari_kerja`
--

LOCK TABLES `kpi_rnd_hari_kerja` WRITE;
/*!40000 ALTER TABLE `kpi_rnd_hari_kerja` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_rnd_hari_kerja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_rnd_input`
--

DROP TABLE IF EXISTS `kpi_rnd_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_rnd_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `karyawan_id` int(11) NOT NULL,
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `row_key` varchar(64) NOT NULL,
  `aktual_data` varchar(255) DEFAULT NULL,
  `perhitungan` decimal(7,2) NOT NULL DEFAULT 0.00,
  `hasil_override` enum('terpenuhi','tidak') DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kpi_rnd` (`karyawan_id`,`periode_bulan`,`periode_tahun`,`row_key`),
  KEY `idx_kpi_rnd_emp_period` (`karyawan_id`,`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_rnd_input`
--

LOCK TABLES `kpi_rnd_input` WRITE;
/*!40000 ALTER TABLE `kpi_rnd_input` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_rnd_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_sales_retail_hari_kerja`
--

DROP TABLE IF EXISTS `kpi_sales_retail_hari_kerja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_sales_retail_hari_kerja` (
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `hari_kerja` int(11) NOT NULL DEFAULT 23,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_sales_retail_hari_kerja`
--

LOCK TABLES `kpi_sales_retail_hari_kerja` WRITE;
/*!40000 ALTER TABLE `kpi_sales_retail_hari_kerja` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_sales_retail_hari_kerja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi_sales_retail_input`
--

DROP TABLE IF EXISTS `kpi_sales_retail_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi_sales_retail_input` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `karyawan_id` int(11) NOT NULL,
  `periode_bulan` int(11) NOT NULL,
  `periode_tahun` int(11) NOT NULL,
  `row_key` varchar(64) NOT NULL,
  `aktual_data` varchar(255) DEFAULT NULL,
  `perhitungan` decimal(9,2) NOT NULL DEFAULT 0.00,
  `hasil_override` enum('terpenuhi','tidak') DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kpi_sr` (`karyawan_id`,`periode_bulan`,`periode_tahun`,`row_key`),
  KEY `idx_kpi_sr_emp_period` (`karyawan_id`,`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi_sales_retail_input`
--

LOCK TABLES `kpi_sales_retail_input` WRITE;
/*!40000 ALTER TABLE `kpi_sales_retail_input` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpi_sales_retail_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laporan_kunjungan`
--

DROP TABLE IF EXISTS `laporan_kunjungan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `laporan_kunjungan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `waktu_submit` datetime NOT NULL,
  `nama_toko` varchar(255) NOT NULL,
  `jenis_klien` varchar(100) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `no_hp_pic` varchar(50) DEFAULT NULL,
  `produk_ditawarkan` text DEFAULT NULL,
  `kebutuhan_klien` text DEFAULT NULL,
  `potensi_order` varchar(100) DEFAULT NULL,
  `status_klien` varchar(100) DEFAULT NULL,
  `foto_path` varchar(500) NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_laporan_kunjungan_karyawan_tanggal` (`karyawan_id`,`tanggal`),
  KEY `idx_laporan_kunjungan_tanggal` (`tanggal`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laporan_kunjungan`
--

LOCK TABLES `laporan_kunjungan` WRITE;
/*!40000 ALTER TABLE `laporan_kunjungan` DISABLE KEYS */;
INSERT INTO `laporan_kunjungan` VALUES (1,3,'2026-04-21','2026-04-21 12:58:07','Toko Lampu',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/uploads/visit-reports/visit-3-1776751087422.jpg',-7.8025077,110.4067648,'2026-04-21 12:58:07'),(2,1,'2026-04-21','2026-04-21 14:31:47','TOKO MAWAR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/uploads/visit-reports/visit-1-1776756707076.jpg',-7.8025077,110.4067648,'2026-04-21 14:31:47');
/*!40000 ALTER TABLE `laporan_kunjungan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lembur`
--

DROP TABLE IF EXISTS `lembur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lembur` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `tanggal` date NOT NULL,
  `jam_mulai` datetime NOT NULL,
  `jam_selesai` datetime NOT NULL,
  `total_jam` decimal(6,2) NOT NULL DEFAULT 0.00,
  `bukti_lembur` varchar(255) DEFAULT NULL,
  `status_approval` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `catatan_atasan` varchar(255) DEFAULT NULL,
  `assigned_approver_user_id` bigint(20) unsigned DEFAULT NULL,
  `catatan_karyawan` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `jenis_pekerjaan` text DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `nama_order` varchar(255) DEFAULT NULL,
  `jumlah_qty` int(10) unsigned DEFAULT NULL,
  `target_sebelum_lembur` int(10) unsigned DEFAULT NULL,
  `target_setelah_lembur` int(10) unsigned DEFAULT NULL,
  `approval_flow` varchar(10) NOT NULL DEFAULT 'single',
  `first_approval_status` varchar(10) DEFAULT NULL,
  `first_approver_user_id` bigint(20) unsigned DEFAULT NULL,
  `first_approved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_lembur_karyawan_tanggal` (`karyawan_id`,`tanggal`),
  KEY `idx_lembur_status_approval` (`status_approval`),
  KEY `idx_lembur_approved_by` (`approved_by`),
  KEY `idx_lembur_assigned_approver` (`assigned_approver_user_id`),
  CONSTRAINT `fk_lembur_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_lembur_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lembur`
--

LOCK TABLES `lembur` WRITE;
/*!40000 ALTER TABLE `lembur` DISABLE KEYS */;
INSERT INTO `lembur` VALUES (1,1,'2026-03-10','2026-03-10 16:30:00','2026-03-10 18:51:00',2.35,'/uploads/overtime/1773132713856-Mar06-02_09.jpg.jpeg','rejected',1,NULL,NULL,NULL,'2026-03-10 15:51:53','2026-03-10 15:53:59',NULL,NULL,NULL,NULL,NULL,NULL,'single',NULL,NULL,NULL),(2,1,'2026-03-12','2026-03-12 12:20:00','2026-03-12 15:30:00',3.17,'/uploads/overtime/1773202742942-Mar06-02_07.jpg.jpeg','approved',1,'jangan sampai larut malam',NULL,NULL,'2026-03-11 11:19:02','2026-03-11 11:19:30',NULL,NULL,NULL,NULL,NULL,NULL,'single',NULL,NULL,NULL);
/*!40000 ALTER TABLE `lembur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libur_nasional`
--

DROP TABLE IF EXISTS `libur_nasional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libur_nasional` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `tipe` varchar(20) NOT NULL DEFAULT 'nasional',
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_libur_tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libur_nasional`
--

LOCK TABLES `libur_nasional` WRITE;
/*!40000 ALTER TABLE `libur_nasional` DISABLE KEYS */;
/*!40000 ALTER TABLE `libur_nasional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_distribusi_slip`
--

DROP TABLE IF EXISTS `log_distribusi_slip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_distribusi_slip` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slip_gaji_id` bigint(20) unsigned NOT NULL,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `didistribusikan_oleh` bigint(20) unsigned NOT NULL,
  `tanggal_distribusi` datetime NOT NULL,
  `status_baca` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_log_distribusi_slip` (`slip_gaji_id`),
  KEY `idx_log_distribusi_karyawan` (`karyawan_id`),
  KEY `idx_log_distribusi_admin` (`didistribusikan_oleh`),
  CONSTRAINT `fk_log_distribusi_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_log_distribusi_slip` FOREIGN KEY (`slip_gaji_id`) REFERENCES `slip_gaji` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_log_distribusi_user` FOREIGN KEY (`didistribusikan_oleh`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_distribusi_slip`
--

LOCK TABLES `log_distribusi_slip` WRITE;
/*!40000 ALTER TABLE `log_distribusi_slip` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_distribusi_slip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_distribusi_slip_bonus`
--

DROP TABLE IF EXISTS `log_distribusi_slip_bonus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log_distribusi_slip_bonus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slip_bonus_id` bigint(20) unsigned NOT NULL,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `didistribusikan_oleh` bigint(20) unsigned NOT NULL,
  `tanggal_distribusi` datetime NOT NULL DEFAULT current_timestamp(),
  `status_baca` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_log_slip_bonus_slip` (`slip_bonus_id`),
  KEY `idx_log_slip_bonus_karyawan` (`karyawan_id`),
  KEY `fk_log_slip_bonus_user` (`didistribusikan_oleh`),
  CONSTRAINT `fk_log_slip_bonus_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_log_slip_bonus_slip` FOREIGN KEY (`slip_bonus_id`) REFERENCES `slip_bonus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_log_slip_bonus_user` FOREIGN KEY (`didistribusikan_oleh`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_distribusi_slip_bonus`
--

LOCK TABLES `log_distribusi_slip_bonus` WRITE;
/*!40000 ALTER TABLE `log_distribusi_slip_bonus` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_distribusi_slip_bonus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_lookup`
--

DROP TABLE IF EXISTS `master_lookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `master_lookup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(32) NOT NULL,
  `value` varchar(150) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT 0,
  `can_approve` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_master_cat_value` (`category`,`value`),
  KEY `idx_master_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_lookup`
--

LOCK TABLES `master_lookup` WRITE;
/*!40000 ALTER TABLE `master_lookup` DISABLE KEYS */;
INSERT INTO `master_lookup` VALUES (1,'unit','AVA Sportivo',0,0,'2026-11-25 00:25:13'),(2,'unit','Ayres Apparel',1,0,'2026-11-25 00:25:13'),(3,'unit','Ayres Solo',2,0,'2026-11-25 00:25:13'),(4,'unit','JNE',3,0,'2026-11-25 00:25:13'),(5,'jabatan','CEO',0,0,'2026-11-25 00:25:13'),(6,'jabatan','Secretary',1,0,'2026-11-25 00:25:13'),(7,'jabatan','Manager',2,0,'2026-11-25 00:25:13'),(8,'jabatan','Supervisor',3,0,'2026-11-25 00:25:13'),(9,'jabatan','Staff',4,0,'2026-11-25 00:25:13'),(10,'jabatan','Staff Senior',5,0,'2026-11-25 00:25:13'),(11,'jabatan','Freelance',6,0,'2026-11-25 00:25:13'),(12,'jabatan','Sales Area',7,0,'2026-11-25 00:25:13'),(13,'jabatan','Sales Nasional',8,0,'2026-11-25 00:25:13'),(14,'jabatan','Organizational Development Officer',9,0,'2026-11-25 00:25:13'),(15,'departemen','Secretary',0,0,'2026-11-25 00:25:13'),(16,'departemen','HRD',1,0,'2026-11-25 00:25:13'),(17,'departemen','Finance',2,0,'2026-11-25 00:25:13'),(18,'departemen','Operasional',3,0,'2026-11-25 00:25:13'),(19,'departemen','Marketing',4,0,'2026-11-25 00:25:13'),(20,'departemen','Ekspedisi',5,0,'2026-11-25 00:25:13'),(21,'departemen','Business Relation',6,0,'2026-11-25 00:25:13'),(22,'departemen','AI',7,0,'2026-11-25 00:25:13'),(23,'departemen','OD',8,0,'2026-11-25 00:25:13'),(24,'divisi','Produksi',0,0,'2026-11-25 00:25:13'),(25,'divisi','RnD',1,0,'2026-11-25 00:25:13'),(26,'divisi','Logistik',2,0,'2026-11-25 00:25:13'),(27,'divisi','Sales & Retail',3,0,'2026-11-25 00:25:13'),(28,'divisi','Marketing & Media',4,0,'2026-11-25 00:25:13'),(29,'divisi','Finance',5,0,'2026-11-25 00:25:13'),(30,'divisi','HRD',6,0,'2026-11-25 00:25:13'),(31,'divisi','Ekspedisi',7,0,'2026-11-25 00:25:13'),(32,'divisi','AI',8,0,'2026-11-25 00:25:13'),(33,'divisi','OD',9,0,'2026-11-25 00:25:13'),(34,'divisi','Business Relation',10,0,'2026-11-25 00:25:13'),(35,'sub_divisi','Admin Produksi',0,0,'2026-11-25 00:25:13'),(36,'sub_divisi','Print',1,0,'2026-11-25 00:25:13'),(37,'sub_divisi','Press',2,0,'2026-11-25 00:25:13'),(38,'sub_divisi','Finishing',3,0,'2026-11-25 00:25:13'),(39,'sub_divisi','Desain',4,0,'2026-11-25 00:25:13'),(40,'sub_divisi','Quality Control',5,0,'2026-11-25 00:25:13'),(41,'sub_divisi','Gudang Ayres',6,0,'2026-11-25 00:25:13'),(42,'sub_divisi','RnD',7,0,'2026-11-25 00:25:13'),(43,'sub_divisi','Bagian Umum',8,0,'2026-11-25 00:25:13'),(44,'sub_divisi','Procesing',9,0,'2026-11-25 00:25:13'),(45,'sub_divisi','Stok',10,0,'2026-11-25 00:25:13'),(46,'sub_divisi','Sales',11,0,'2026-11-25 00:25:13'),(47,'sub_divisi','Purchase',12,0,'2026-11-25 00:25:13'),(48,'sub_divisi','Marketplace',13,0,'2026-11-25 00:25:13'),(49,'sub_divisi','Customer Service',14,0,'2026-11-25 00:25:13'),(50,'sub_divisi','Markom',15,0,'2026-11-25 00:25:13'),(51,'sub_divisi','Media',16,0,'2026-11-25 00:25:13'),(52,'sub_divisi','Advertiser',17,0,'2026-11-25 00:25:13'),(53,'sub_divisi','Finance',18,0,'2026-11-25 00:25:13'),(54,'sub_divisi','Pajak',19,0,'2026-11-25 00:25:13'),(55,'sub_divisi','HRD',20,0,'2026-11-25 00:25:13'),(56,'sub_divisi','Ekspedisi',21,0,'2026-11-25 00:25:13'),(57,'sub_divisi','Hostlive',22,0,'2026-11-25 00:25:13'),(58,'sub_divisi','Penjahit',23,0,'2026-11-25 00:25:13');
/*!40000 ALTER TABLE `master_lookup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `omzet_bulanan`
--

DROP TABLE IF EXISTS `omzet_bulanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `omzet_bulanan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `unit` varchar(100) NOT NULL DEFAULT '',
  `total_omzet` decimal(14,2) NOT NULL DEFAULT 0.00,
  `is_custom_bonus` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_omzet_bulanan_periode_unit` (`periode_bulan`,`periode_tahun`,`unit`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `omzet_bulanan`
--

LOCK TABLES `omzet_bulanan` WRITE;
/*!40000 ALTER TABLE `omzet_bulanan` DISABLE KEYS */;
INSERT INTO `omzet_bulanan` VALUES (1,3,2026,'',1030403520.00,0,'2026-03-11 16:00:00','2026-03-11 16:05:18'),(2,4,2026,'AVA+Ayres',4000000000.00,0,'2026-04-15 08:52:00','2026-04-15 08:52:00'),(3,4,2026,'JNE',20000.00,1,'2026-04-15 08:52:00','2026-04-15 08:57:08');
/*!40000 ALTER TABLE `omzet_bulanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_codes`
--

DROP TABLE IF EXISTS `otp_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otp_codes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(190) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_otp_email_code` (`email`,`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_codes`
--

LOCK TABLES `otp_codes` WRITE;
/*!40000 ALTER TABLE `otp_codes` DISABLE KEYS */;
INSERT INTO `otp_codes` VALUES (1,'ezranhmry@gmail.com','489344','2026-04-07 09:26:50',1,'2026-04-07 09:21:50'),(2,'ezranhmry@gmail.com','792405','2026-04-07 10:24:02',1,'2026-04-07 10:19:02'),(3,'ezra.kristanto@ti.ukdw.ac.id','889381','2026-04-18 09:15:20',0,'2026-04-18 09:10:20');
/*!40000 ALTER TABLE `otp_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payroll` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `hari_kerja` int(10) unsigned NOT NULL DEFAULT 0,
  `total_masuk` int(10) unsigned NOT NULL DEFAULT 0,
  `total_lembur_jam` decimal(8,2) NOT NULL DEFAULT 0.00,
  `total_terlambat` int(10) unsigned NOT NULL DEFAULT 0,
  `total_setengah_hari` int(10) unsigned NOT NULL DEFAULT 0,
  `gaji_pokok` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tunjangan_jabatan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tunjangan_lain` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bonus_performa` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bpjs` decimal(14,2) NOT NULL DEFAULT 0.00,
  `uang_makan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `transport` decimal(14,2) NOT NULL DEFAULT 0.00,
  `insentif` decimal(14,2) NOT NULL DEFAULT 0.00,
  `upah_lembur` decimal(14,2) NOT NULL DEFAULT 0.00,
  `potongan_keterlambatan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `potongan_setengah_hari` decimal(14,2) NOT NULL DEFAULT 0.00,
  `potongan_kontrak` decimal(14,2) NOT NULL DEFAULT 0.00,
  `potongan_pinjaman` decimal(14,2) NOT NULL DEFAULT 0.00,
  `potongan_kerajinan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_potongan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `gaji_bersih` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status_payroll` enum('draft','processed','approved_finance','paid') NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payroll_periode` (`karyawan_id`,`periode_bulan`,`periode_tahun`),
  KEY `idx_payroll_periode` (`periode_tahun`,`periode_bulan`),
  KEY `idx_payroll_status` (`status_payroll`),
  CONSTRAINT `fk_payroll_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
INSERT INTO `payroll` VALUES (1,3,3,2026,24,24,4.00,0,1,6000000.00,100000.00,380998.00,0.00,25000.00,1680000.00,0.00,0.00,80000.00,0.00,50000.00,0.00,700000.00,0.00,750000.00,4515998.00,'draft','2026-03-11 16:08:42','2026-03-12 10:57:01'),(21,2,3,2026,24,22,2.00,3,0,15000000.00,200000.00,736996.00,0.00,25000.00,3300000.00,0.00,0.00,40000.00,60000.00,0.00,200000.00,0.00,1500000.00,1760000.00,10641996.00,'draft','2026-03-12 11:17:23','2026-03-12 11:17:23'),(26,1,3,2026,24,10,0.00,2,0,2000000.00,100000.00,10000.00,0.00,25000.00,100000.00,0.00,0.00,0.00,40000.00,0.00,200000.00,0.00,10000.00,250000.00,995000.00,'draft','2026-03-12 15:17:22','2026-03-13 10:32:34'),(27,3,4,2026,27,10,0.00,2,0,2000000.00,100000.00,150000.00,0.00,25000.00,200000.00,15000.00,0.00,0.00,40000.00,0.00,0.00,0.00,200000.00,240000.00,750000.00,'draft','2026-04-22 12:42:07','2026-04-22 12:42:07'),(28,2,4,2026,27,27,0.00,1,0,4000000.00,100000.00,0.00,0.00,25000.00,2403000.00,0.00,0.00,0.00,20000.00,0.00,0.00,0.00,0.00,20000.00,3858000.00,'draft','2026-04-24 09:35:15','2026-04-24 09:35:46'),(31,1,4,2026,27,1,0.00,1,0,2000000.00,0.00,0.00,0.00,50000.00,0.00,5000.00,0.00,0.00,20000.00,0.00,200000.00,500000.00,0.00,720000.00,-615000.00,'draft','2026-04-24 14:27:49','2026-04-24 14:27:49'),(32,3,11,2026,27,0,0.00,0,0,0.00,100000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'draft','2026-11-25 08:16:33','2026-11-25 08:16:33'),(33,2,11,2026,27,0,0.00,0,0,0.00,100000.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'draft','2026-11-25 08:16:33','2026-11-25 08:16:33'),(34,1,11,2026,27,0,0.00,0,0,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'draft','2026-11-25 08:16:33','2026-11-25 08:16:33');
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll_bonus`
--

DROP TABLE IF EXISTS `payroll_bonus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payroll_bonus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `bonus_type` enum('sales','spv','manager','cs','host_live','marketplace','marketing','advertiser','umum') NOT NULL,
  `nominal_bonus` decimal(14,2) NOT NULL DEFAULT 0.00,
  `catatan` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payroll_bonus_employee_period` (`karyawan_id`,`periode_bulan`,`periode_tahun`),
  KEY `idx_payroll_bonus_period` (`periode_tahun`,`periode_bulan`),
  CONSTRAINT `fk_payroll_bonus_employee` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll_bonus`
--

LOCK TABLES `payroll_bonus` WRITE;
/*!40000 ALTER TABLE `payroll_bonus` DISABLE KEYS */;
/*!40000 ALTER TABLE `payroll_bonus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll_editor`
--

DROP TABLE IF EXISTS `payroll_editor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payroll_editor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll_editor`
--

LOCK TABLES `payroll_editor` WRITE;
/*!40000 ALTER TABLE `payroll_editor` DISABLE KEYS */;
INSERT INTO `payroll_editor` VALUES (1,'avafamily17@gmail.com','2026-11-25 01:16:33');
/*!40000 ALTER TABLE `payroll_editor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll_employee_input`
--

DROP TABLE IF EXISTS `payroll_employee_input`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payroll_employee_input` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `payroll_id` bigint(20) unsigned NOT NULL,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `payroll_type` enum('non_sales','sales') NOT NULL DEFAULT 'non_sales',
  `gaji_pokok_per_hari` decimal(14,2) NOT NULL DEFAULT 0.00,
  `uang_makan_per_hari` decimal(14,2) NOT NULL DEFAULT 0.00,
  `subsidi` decimal(14,2) NOT NULL DEFAULT 0.00,
  `uang_kerajinan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bpjs` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bonus_performa` decimal(14,2) NOT NULL DEFAULT 0.00,
  `insentif` decimal(14,2) NOT NULL DEFAULT 0.00,
  `uang_transport` decimal(14,2) NOT NULL DEFAULT 0.00,
  `kendaraan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `perjalanan_dinas_reimburse` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `override_masuk` int(11) DEFAULT NULL,
  `override_lembur` decimal(14,2) DEFAULT NULL,
  `override_izin` int(11) DEFAULT NULL,
  `override_sakit` int(11) DEFAULT NULL,
  `override_sakit_tanpa_surat` int(11) DEFAULT NULL,
  `override_setengah_hari` int(11) DEFAULT NULL,
  `override_kontrak` decimal(14,2) DEFAULT NULL,
  `override_pinjaman` decimal(14,2) DEFAULT NULL,
  `override_pinjaman_pribadi` decimal(14,2) DEFAULT NULL,
  `override_gaji_pokok` decimal(14,2) DEFAULT NULL,
  `override_potongan_absensi` decimal(14,2) DEFAULT NULL,
  `override_denda` decimal(14,2) DEFAULT NULL,
  `potongan_sp2` decimal(14,2) DEFAULT NULL,
  `potongan_sp2_note` text DEFAULT NULL,
  `override_kerajinan` decimal(14,2) DEFAULT NULL,
  `is_manual` tinyint(1) NOT NULL DEFAULT 0,
  `freelance_rate_type` enum('per_hari','per_jam') DEFAULT NULL,
  `gaji_pokok_per_jam` decimal(14,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payroll_employee_input_payroll` (`payroll_id`),
  KEY `idx_payroll_employee_input_karyawan` (`karyawan_id`),
  CONSTRAINT `fk_payroll_employee_input_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payroll_employee_input_payroll` FOREIGN KEY (`payroll_id`) REFERENCES `payroll` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll_employee_input`
--

LOCK TABLES `payroll_employee_input` WRITE;
/*!40000 ALTER TABLE `payroll_employee_input` DISABLE KEYS */;
INSERT INTO `payroll_employee_input` VALUES (1,1,3,'non_sales',100000.00,70000.00,380998.00,600000.00,25000.00,0.00,0.00,0.00,0.00,0.00,'2026-03-11 16:08:42','2026-11-25 08:16:33',24,4.00,0,1,0,1,NULL,NULL,NULL,6000000.00,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(21,21,2,'non_sales',300000.00,150000.00,736996.00,1500000.00,25000.00,0.00,0.00,0.00,0.00,0.00,'2026-03-12 11:17:23','2026-03-12 11:17:23',22,2.00,1,1,1,0,200000.00,NULL,NULL,15000000.00,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL),(26,26,1,'non_sales',100000.00,10000.00,10000.00,10000.00,25000.00,0.00,0.00,0.00,0.00,0.00,'2026-03-12 15:17:22','2026-03-13 10:32:34',10,0.00,0,0,0,0,NULL,NULL,NULL,2000000.00,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL),(29,27,3,'sales',30000.00,20000.00,150000.00,200000.00,25000.00,0.00,0.00,15000.00,0.00,0.00,'2026-04-22 12:42:07','2026-11-25 08:16:33',10,0.00,0,0,0,0,0.00,NULL,0.00,2000000.00,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(30,28,2,'non_sales',50000.00,89000.00,0.00,0.00,25000.00,0.00,0.00,0.00,0.00,0.00,'2026-04-24 09:35:15','2026-11-25 08:16:33',27,0.00,0,0,0,0,0.00,NULL,NULL,4000000.00,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(33,31,1,'sales',0.00,0.00,0.00,0.00,50000.00,0.00,0.00,5000.00,50000.00,0.00,'2026-04-24 14:27:49','2026-11-25 08:16:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2000000.00,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL),(34,32,3,'sales',30000.00,20000.00,150000.00,200000.00,25000.00,0.00,0.00,15000.00,0.00,0.00,'2026-11-25 08:16:33','2026-11-25 08:16:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2000000.00,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL),(35,33,2,'non_sales',50000.00,89000.00,0.00,0.00,25000.00,0.00,0.00,0.00,0.00,0.00,'2026-11-25 08:16:33','2026-11-25 08:16:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4000000.00,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL),(36,34,1,'sales',0.00,0.00,0.00,0.00,50000.00,0.00,0.00,5000.00,50000.00,0.00,'2026-11-25 08:16:33','2026-11-25 08:16:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2000000.00,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `payroll_employee_input` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll_period_config`
--

DROP TABLE IF EXISTS `payroll_period_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payroll_period_config` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `periode_bulan` tinyint(3) unsigned NOT NULL,
  `periode_tahun` smallint(5) unsigned NOT NULL,
  `total_omzet` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payroll_period_config` (`periode_bulan`,`periode_tahun`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll_period_config`
--

LOCK TABLES `payroll_period_config` WRITE;
/*!40000 ALTER TABLE `payroll_period_config` DISABLE KEYS */;
INSERT INTO `payroll_period_config` VALUES (1,3,2026,2.00,'2026-03-11 15:50:01','2026-03-11 15:55:32');
/*!40000 ALTER TABLE `payroll_period_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peminjaman_barang`
--

DROP TABLE IF EXISTS `peminjaman_barang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `peminjaman_barang` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `karyawan_ids` text DEFAULT NULL,
  `barang` text NOT NULL,
  `tanggal_peminjaman` date DEFAULT NULL,
  `keterangan` varchar(500) DEFAULT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_peminjaman_karyawan` (`karyawan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peminjaman_barang`
--

LOCK TABLES `peminjaman_barang` WRITE;
/*!40000 ALTER TABLE `peminjaman_barang` DISABLE KEYS */;
/*!40000 ALTER TABLE `peminjaman_barang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengembalian_kontrak`
--

DROP TABLE IF EXISTS `pengembalian_kontrak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pengembalian_kontrak` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `nominal` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tanggal_pengembalian` date DEFAULT NULL,
  `catatan` varchar(255) DEFAULT NULL,
  `dikembalikan_oleh` varchar(150) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pengembalian_karyawan` (`karyawan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengembalian_kontrak`
--

LOCK TABLES `pengembalian_kontrak` WRITE;
/*!40000 ALTER TABLE `pengembalian_kontrak` DISABLE KEYS */;
/*!40000 ALTER TABLE `pengembalian_kontrak` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perjalanan_dinas`
--

DROP TABLE IF EXISTS `perjalanan_dinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perjalanan_dinas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `surat_path` varchar(500) NOT NULL,
  `catatan` text DEFAULT NULL,
  `status_approval` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `catatan_admin` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_perjalanan_dinas_karyawan` (`karyawan_id`),
  KEY `idx_perjalanan_dinas_status` (`status_approval`),
  KEY `idx_perjalanan_dinas_tanggal` (`tanggal_mulai`,`tanggal_selesai`),
  CONSTRAINT `fk_perjalanan_dinas_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perjalanan_dinas`
--

LOCK TABLES `perjalanan_dinas` WRITE;
/*!40000 ALTER TABLE `perjalanan_dinas` DISABLE KEYS */;
INSERT INTO `perjalanan_dinas` VALUES (1,1,'2026-04-24','2026-04-26','/uploads/business-trips/1777018612393-FancyIconText.png','PERGI CAMPING','rejected',1,'2026-04-24 15:27:16',NULL,'2026-04-24 15:16:52','2026-04-24 15:27:16'),(2,3,'2026-04-24','2026-04-26','/uploads/business-trips/1777018822923-SimpleIconBanner.png','CAMPING','approved',1,'2026-04-24 15:27:21',NULL,'2026-04-24 15:20:22','2026-04-24 15:27:21'),(3,4,'2026-04-24','2026-04-27','/uploads/business-trips/1777019013669-MascotIconWText.png','camp','approved',1,'2026-04-24 15:24:51',NULL,'2026-04-24 15:23:33','2026-04-24 15:24:51');
/*!40000 ALTER TABLE `perjalanan_dinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pinjaman`
--

DROP TABLE IF EXISTS `pinjaman`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pinjaman` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `jumlah_pinjaman` decimal(14,2) NOT NULL,
  `jumlah_angsuran` int(10) unsigned NOT NULL DEFAULT 1,
  `angsuran_per_bulan` decimal(14,2) NOT NULL,
  `total_sudah_bayar` decimal(14,2) NOT NULL DEFAULT 0.00,
  `sisa_pinjaman` decimal(14,2) NOT NULL,
  `tanggal_pengajuan` date NOT NULL,
  `tanggal_approval` date DEFAULT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `status_pinjaman` enum('pending','approved','berjalan','lunas','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pinjaman_karyawan` (`karyawan_id`),
  KEY `idx_pinjaman_status` (`status_pinjaman`),
  KEY `idx_pinjaman_tanggal` (`tanggal_pengajuan`),
  CONSTRAINT `fk_pinjaman_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pinjaman`
--

LOCK TABLES `pinjaman` WRITE;
/*!40000 ALTER TABLE `pinjaman` DISABLE KEYS */;
INSERT INTO `pinjaman` VALUES (1,1,1000000.00,2,500000.00,0.00,1000000.00,'2026-03-12',NULL,NULL,'rejected','2026-03-12 15:12:06','2026-03-12 15:12:49'),(2,1,1000000.00,2,500000.00,500000.00,500000.00,'2026-02-12','2026-03-12',1,'berjalan','2026-03-12 15:14:40','2026-04-24 14:27:49');
/*!40000 ALTER TABLE `pinjaman` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pinjaman_cicilan`
--

DROP TABLE IF EXISTS `pinjaman_cicilan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pinjaman_cicilan` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pinjaman_id` bigint(20) unsigned NOT NULL,
  `urutan_cicilan` int(10) unsigned NOT NULL,
  `bulan` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `minggu` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `nominal_potongan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `nominal_terpotong` decimal(14,2) DEFAULT NULL,
  `payroll_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pinjaman_cicilan_urutan` (`pinjaman_id`,`urutan_cicilan`),
  UNIQUE KEY `uq_pinjaman_cicilan_periode` (`pinjaman_id`,`bulan`,`tahun`,`minggu`),
  KEY `idx_pinjaman_cicilan_periode` (`tahun`,`bulan`),
  KEY `idx_pinjaman_cicilan_payroll` (`payroll_id`),
  CONSTRAINT `fk_pinjaman_cicilan_pinjaman` FOREIGN KEY (`pinjaman_id`) REFERENCES `pinjaman` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pinjaman_cicilan`
--

LOCK TABLES `pinjaman_cicilan` WRITE;
/*!40000 ALTER TABLE `pinjaman_cicilan` DISABLE KEYS */;
INSERT INTO `pinjaman_cicilan` VALUES (1,2,1,4,2026,0,500000.00,500000.00,31,'2026-03-12 15:15:32','2026-04-24 14:27:49'),(2,2,2,5,2026,0,500000.00,NULL,NULL,'2026-03-12 15:15:32','2026-03-12 15:15:32');
/*!40000 ALTER TABLE `pinjaman_cicilan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `potongan_kontrak`
--

DROP TABLE IF EXISTS `potongan_kontrak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `potongan_kontrak` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `bulan` tinyint(3) unsigned NOT NULL,
  `tahun` smallint(5) unsigned NOT NULL,
  `nominal_potongan` decimal(14,2) NOT NULL DEFAULT 0.00,
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_potongan_kontrak_periode` (`karyawan_id`,`bulan`,`tahun`),
  KEY `idx_potongan_kontrak_periode` (`tahun`,`bulan`),
  CONSTRAINT `fk_potongan_kontrak_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `potongan_kontrak`
--

LOCK TABLES `potongan_kontrak` WRITE;
/*!40000 ALTER TABLE `potongan_kontrak` DISABLE KEYS */;
/*!40000 ALTER TABLE `potongan_kontrak` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reimbursements`
--

DROP TABLE IF EXISTS `reimbursements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reimbursements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `karyawan_id` bigint(20) unsigned NOT NULL,
  `tanggal_pengajuan` date NOT NULL,
  `tanggal_biaya` date NOT NULL,
  `kategori` varchar(100) NOT NULL DEFAULT 'Perjalanan Dinas',
  `keterangan` text DEFAULT NULL,
  `nominal` decimal(14,2) NOT NULL DEFAULT 0.00,
  `nota_path` varchar(500) NOT NULL,
  `status_approval` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `catatan_admin` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_reimbursements_karyawan` (`karyawan_id`),
  KEY `idx_reimbursements_status` (`status_approval`),
  KEY `idx_reimbursements_tanggal_biaya` (`tanggal_biaya`),
  CONSTRAINT `fk_reimbursements_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reimbursements`
--

LOCK TABLES `reimbursements` WRITE;
/*!40000 ALTER TABLE `reimbursements` DISABLE KEYS */;
INSERT INTO `reimbursements` VALUES (1,1,'2026-04-21','2026-04-21','Perjalanan Dinas','-',200000.00,'/uploads/reimbursements/1776756726588-pelatih2.png','approved',1,'2026-04-21 14:32:42',NULL,'2026-04-21 14:32:06','2026-04-21 14:32:42'),(2,1,'2026-04-22','2026-04-22','Perjalanan Dinas','55555 erwg',500000.00,'/uploads/reimbursements/1776835775613-Logo-Ayres-only-white--1-.png','approved',1,'2026-04-22 12:30:02',NULL,'2026-04-22 12:29:35','2026-04-22 12:30:02');
/*!40000 ALTER TABLE `reimbursements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schema_migrations`
--

DROP TABLE IF EXISTS `schema_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schema_migrations` (
  `mig_key` varchar(120) NOT NULL,
  `applied_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`mig_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schema_migrations`
--

LOCK TABLES `schema_migrations` WRITE;
/*!40000 ALTER TABLE `schema_migrations` DISABLE KEYS */;
INSERT INTO `schema_migrations` VALUES ('bpjs-25k-to-35k-2026-10','2026-11-25 08:16:33'),('humbelina-uangmakan-25k-to-35k-2026-10','2026-11-25 08:16:33');
/*!40000 ALTER TABLE `schema_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_def`
--

DROP TABLE IF EXISTS `shift_def`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shift_def` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(24) NOT NULL,
  `label` varchar(60) NOT NULL,
  `start_min` int(11) NOT NULL DEFAULT 0,
  `checkin_start_min` int(11) NOT NULL DEFAULT 0,
  `checkin_end_min` int(11) NOT NULL DEFAULT 0,
  `checkout_start_min` int(11) NOT NULL DEFAULT 0,
  `checkout_end_min` int(11) NOT NULL DEFAULT 0,
  `tolerance_min` int(11) NOT NULL DEFAULT 5,
  `is_libur` tinyint(1) NOT NULL DEFAULT 0,
  `is_selectable` tinyint(1) NOT NULL DEFAULT 1,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `sort` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_def`
--

LOCK TABLES `shift_def` WRITE;
/*!40000 ALTER TABLE `shift_def` DISABLE KEYS */;
INSERT INTO `shift_def` VALUES (1,'pagi','Pagi (08:30 - 16:30)',510,480,510,990,1050,5,0,1,1,0,'2026-11-25 00:42:14'),(2,'siang','Siang (12:00 - 21:00)',720,705,720,1200,1260,5,0,1,1,10,'2026-11-25 00:42:14'),(3,'lembur','Lembur (10:00 - 21:00)',600,585,600,1200,1260,5,0,1,1,20,'2026-11-25 00:42:14'),(4,'ayres_siang','Siang (14:00 - 22:00)',840,810,870,1320,1380,5,0,1,1,30,'2026-11-25 00:42:15'),(5,'jne_pagi','JNE Pagi (08:00 - 16:00)',480,450,660,930,990,10,0,1,1,40,'2026-11-25 00:42:15'),(6,'jne_siang','JNE Siang (14:00 - 21:00)',840,810,1020,1230,1290,10,0,1,1,50,'2026-11-25 00:42:15'),(7,'jne_minggu','JNE Minggu (13:00 - 20:00)',780,750,840,1170,1230,10,0,1,1,60,'2026-11-25 00:42:15'),(8,'libur','Libur',0,0,0,0,0,0,1,1,1,70,'2026-11-25 00:42:15'),(9,'setengah_1','Setengah Hari 1',780,630,780,990,1050,5,0,0,1,80,'2026-11-25 00:42:15'),(10,'setengah_2','Setengah Hari 2',510,480,510,720,780,5,0,0,1,90,'2026-11-25 00:42:15'),(11,'pagi_full','Pagi (08:30 - 17:00)',510,480,510,990,1050,5,0,0,1,100,'2026-11-25 00:42:15'),(12,'pagi_short','Pagi (08:30 - 15:00)',510,480,510,870,930,5,0,0,1,110,'2026-11-25 00:42:15'),(13,'siang_sore','Siang (12:00 - 17:00)',720,705,720,990,1050,5,0,0,1,120,'2026-11-25 00:42:15'),(14,'partime','Partime (17:00 - 22:00)',1020,990,1320,1320,1380,5,0,0,1,130,'2026-11-25 00:42:16');
/*!40000 ALTER TABLE `shift_def` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_group`
--

DROP TABLE IF EXISTS `shift_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shift_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `target_type` enum('jabatan','departemen','penempatan','custom') NOT NULL,
  `target_value` varchar(120) DEFAULT NULL,
  `sort` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_group`
--

LOCK TABLES `shift_group` WRITE;
/*!40000 ALTER TABLE `shift_group` DISABLE KEYS */;
INSERT INTO `shift_group` VALUES (1,'Ayres','penempatan','Ayres',0,'2026-11-25 00:42:16'),(2,'JNE','penempatan','JNE',10,'2026-11-25 00:42:16');
/*!40000 ALTER TABLE `shift_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_group_member`
--

DROP TABLE IF EXISTS `shift_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shift_group_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `karyawan_id` int(11) NOT NULL,
  `kind` enum('include','exclude') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_member` (`group_id`,`karyawan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_group_member`
--

LOCK TABLES `shift_group_member` WRITE;
/*!40000 ALTER TABLE `shift_group_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `shift_group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_group_shift`
--

DROP TABLE IF EXISTS `shift_group_shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shift_group_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `shift_code` varchar(24) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_shift` (`group_id`,`shift_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_group_shift`
--

LOCK TABLES `shift_group_shift` WRITE;
/*!40000 ALTER TABLE `shift_group_shift` DISABLE KEYS */;
INSERT INTO `shift_group_shift` VALUES (1,1,'pagi',0),(2,1,'ayres_siang',10),(3,1,'libur',20),(4,2,'jne_pagi',0),(5,2,'jne_siang',10),(6,2,'jne_minggu',20),(7,2,'libur',30);
/*!40000 ALTER TABLE `shift_group_shift` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slip_bonus`
--

DROP TABLE IF EXISTS `slip_bonus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slip_bonus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `payroll_bonus_id` bigint(20) unsigned NOT NULL,
  `nomor_slip` varchar(80) NOT NULL,
  `status_distribusi` enum('draft','didistribusikan','dibaca') NOT NULL DEFAULT 'draft',
  `tanggal_distribusi` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slip_bonus_payroll_bonus` (`payroll_bonus_id`),
  KEY `idx_slip_bonus_status` (`status_distribusi`),
  CONSTRAINT `fk_slip_bonus_payroll_bonus` FOREIGN KEY (`payroll_bonus_id`) REFERENCES `payroll_bonus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slip_bonus`
--

LOCK TABLES `slip_bonus` WRITE;
/*!40000 ALTER TABLE `slip_bonus` DISABLE KEYS */;
/*!40000 ALTER TABLE `slip_bonus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slip_gaji`
--

DROP TABLE IF EXISTS `slip_gaji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slip_gaji` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `payroll_id` bigint(20) unsigned NOT NULL,
  `nomor_slip` varchar(50) NOT NULL,
  `tanggal_distribusi` datetime DEFAULT NULL,
  `status_distribusi` enum('draft','didistribusikan','dibaca') NOT NULL DEFAULT 'draft',
  `file_slip` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slip_gaji_payroll_id` (`payroll_id`),
  UNIQUE KEY `uq_slip_gaji_nomor_slip` (`nomor_slip`),
  KEY `idx_slip_gaji_status` (`status_distribusi`),
  CONSTRAINT `fk_slip_gaji_payroll` FOREIGN KEY (`payroll_id`) REFERENCES `payroll` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slip_gaji`
--

LOCK TABLES `slip_gaji` WRITE;
/*!40000 ALTER TABLE `slip_gaji` DISABLE KEYS */;
/*!40000 ALTER TABLE `slip_gaji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','karyawan','spv') NOT NULL DEFAULT 'karyawan',
  `status_aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role_status` (`role`,`status_aktif`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ezra Kristanto','ezra.kristanto@ti.ukdw.ac.id','437a70301fed0618c6c3375402de28fef9248362aafdc3070046339b4501195c','admin',1,'2026-03-10 15:00:08','2026-03-10 15:00:08'),(2,'ZEXO','zexo@gmail.com','120eb43c9db4d2c719ec1a16519976bf3cbf59bff9f7cdf8745f4944db48d481','karyawan',1,'2026-03-10 15:46:18','2026-03-10 15:46:18'),(3,'ZETACO','zetaco@gmail.com','f87ddab125c15f8b9c73a89a2c4ba6ae145ff33d1e6a57629e4b403026a83382','karyawan',1,'2026-03-10 16:14:08','2026-03-10 16:14:08'),(4,'LEIF','leif@gmail.com','5d00fdccb9467908ee514ef6516d24e04cd473d063796b9511d0e98c4bf62325','karyawan',1,'2026-03-10 16:29:54','2026-03-10 16:29:54'),(5,'ezranhmry','ezranhmry@gmail.com','437a70301fed0618c6c3375402de28fef9248362aafdc3070046339b4501195c','karyawan',1,'2026-04-07 10:19:21','2026-04-07 10:19:21'),(6,'Ava Group HRD','avagrouphrd@gmail.com','af4e76dcf9ca1021e3846b85ee029e187810c4dc3f2f23d5477e0feda6e5068f','admin',1,'2026-04-18 09:18:49','2026-11-25 04:44:35'),(9,'ezra','spv@gmail.com','437a70301fed0618c6c3375402de28fef9248362aafdc3070046339b4501195c','spv',1,'2026-04-25 15:29:43','2026-04-25 15:29:43'),(10,'Ava Family','avafamily17@gmail.com','af4e76dcf9ca1021e3846b85ee029e187810c4dc3f2f23d5477e0feda6e5068f','admin',1,'2026-11-25 04:44:35','2026-11-25 04:44:35'),(11,'test.karyawan','test.karyawan@example.invalid','85777f270ad7cf2a790981bbae3c4e484a1dc55e24a77390d692fbf1cffa12fa','karyawan',1,'2026-11-25 23:48:17','2026-11-25 23:48:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-26  3:36:13

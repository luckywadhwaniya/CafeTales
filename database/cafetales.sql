-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2026 at 04:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafetales`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `item_id`, `quantity`, `created_at`) VALUES
(42, 2, 11, 1, '2026-04-04 13:15:30'),
(43, 2, 9, 1, '2026-04-04 13:15:31');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Hot Coffee', 'coffee'),
(2, 'Cold Brews', 'cold-brew'),
(3, 'Bakery', 'bakery'),
(4, 'Savory', 'savory');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `tag` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `event_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `tag`, `description`, `image_url`, `capacity`, `event_date`) VALUES
(1, 'Open Mic Night', 'Open Mic • Community', 'Sing, poetry, guitar, stand-up — friendly crowd and warm vibes.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=70', 20, '2026-02-14 19:30:00'),
(2, 'Board Games Evening', 'Games • Chill', 'Uno, Chess, Ludo, Jenga — join a table and make new friends.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=70', 24, '2026-02-18 18:00:00'),
(3, 'Latte Art Workshop', 'Workshop • Coffee', 'Learn heart, rosetta, tulip patterns with hands-on practice.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=70', 15, '2026-02-22 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `image` varchar(255) DEFAULT 'default.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_available`, `image`) VALUES
(5, 1, 'Cappuccino', NULL, 160.00, NULL, 1, '1770545754_6988625ae313c.jpg'),
(6, 1, 'Espresso', NULL, 120.00, NULL, 1, '1770545897_698862e993254.jpg'),
(7, 2, 'Cold Brew', NULL, 190.00, NULL, 1, '1770545971_69886333a13da.jpg'),
(8, 1, 'Masala Tea', NULL, 80.00, NULL, 1, '1770546087_698863a74a3b3.jpg'),
(9, 3, 'Chocolate Brownie', NULL, 140.00, NULL, 1, '1770546524_6988655cf1402.jpg'),
(11, 3, 'Cheesecake', NULL, 200.00, NULL, 1, '1770546602_698865aacaa37.jpg'),
(12, 3, 'Cupcake', NULL, 100.00, NULL, 1, '1770546665_698865e9d433a.jpg'),
(13, 4, 'Veg Sandwich', NULL, 170.00, NULL, 1, '1770546792_69886668889ac.jpg'),
(14, 4, 'Garlic Bread ', NULL, 180.00, NULL, 1, '1770546851_698866a38581d.jpg'),
(16, 4, 'Double Cheese Margherita', NULL, 430.00, NULL, 1, '1770546950_69886706c41b0.jpg'),
(17, 4, 'Paneer Tikka Pizza', NULL, 470.00, NULL, 1, '1770547001_698867399e8c0.jpg'),
(18, 4, 'White Sauce Pasta', NULL, 320.00, NULL, 1, '1770547070_6988677e65574.jpg'),
(19, 4, 'Red Sauce pasta', NULL, 250.00, NULL, 1, '1770547121_698867b1d4b59.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `phone`, `message`, `sent_at`) VALUES
(1, 'Lucky Wadhwaniya', 'luckywadhwaniya@gmail.com', '8866484085', 'Hello', '2026-02-10 03:48:28');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(50) DEFAULT 'Cash',
  `table_number` int(11) NOT NULL DEFAULT 0,
  `payment_status` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `order_date`, `payment_method`, `table_number`, `payment_status`) VALUES
(1, 2, 1040.00, 'pending', '2026-02-18 07:42:08', 'Cash', 0, 'Pending'),
(2, 2, 320.00, 'pending', '2026-02-18 10:04:31', 'Cash', 0, 'Pending'),
(3, 2, 1260.00, 'pending', '2026-02-18 10:30:22', 'QR', 0, 'Paid'),
(4, 2, 320.00, 'pending', '2026-02-18 10:52:50', 'QR', 0, 'Paid'),
(5, 2, 320.00, 'pending', '2026-02-18 11:43:49', 'QR', 14, 'Paid'),
(6, 2, 160.00, 'pending', '2026-02-18 12:13:40', 'Counter', 20, 'Paid'),
(7, 3, 180.00, 'pending', '2026-02-18 12:53:39', 'QR', 5, 'Paid'),
(8, 3, 570.00, 'pending', '2026-02-18 13:17:09', 'QR', 0, 'Paid'),
(9, 3, 320.00, 'pending', '2026-02-18 13:49:04', 'QR', 23, 'Paid'),
(10, 3, 970.00, 'pending', '2026-02-18 14:02:40', 'QR', 23, 'Paid'),
(11, 3, 530.00, 'pending', '2026-02-18 15:22:04', 'Counter', 78, 'Paid'),
(12, 3, 820.00, 'pending', '2026-02-18 15:29:09', 'QR', 23, 'Paid'),
(13, 3, 400.00, 'pending', '2026-02-18 15:29:42', 'Counter', 23, 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `item_id`, `quantity`, `price_at_time`) VALUES
(1, 1, 17, 1, 470.00),
(2, 1, 18, 1, 320.00),
(3, 1, 19, 1, 250.00),
(4, 2, 18, 1, 320.00),
(5, 3, 18, 1, 320.00),
(6, 3, 17, 2, 470.00),
(7, 4, 18, 1, 320.00),
(8, 5, 18, 1, 320.00),
(9, 6, 5, 1, 160.00),
(10, 7, 14, 1, 180.00),
(11, 8, 19, 1, 250.00),
(12, 8, 18, 1, 320.00),
(13, 9, 18, 1, 320.00),
(14, 10, 14, 3, 180.00),
(15, 10, 16, 1, 430.00),
(16, 11, 14, 2, 180.00),
(17, 11, 13, 1, 170.00),
(18, 12, 18, 1, 320.00),
(19, 12, 19, 2, 250.00),
(20, 13, 11, 2, 200.00);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `guests` int(11) NOT NULL,
  `seating_area` enum('Indoor','Outdoor','Window') NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `table_number` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `reservation_date`, `reservation_time`, `guests`, `seating_area`, `status`, `created_at`, `table_number`, `notes`) VALUES
(1, NULL, 'test', 'test@gmail.com', '1234567890', '2026-02-08', '10:00:00', 2, 'Indoor', 'confirmed', '2026-02-08 07:06:04', NULL, NULL),
(2, 2, 'test', 'test@gmail.com', '1234567890', '2026-02-08', '10:00:00', 2, 'Indoor', 'confirmed', '2026-02-08 07:06:04', NULL, NULL),
(3, NULL, 'test', 'test@gmail.com', '1234567890', '2026-02-08', '12:00:00', 2, 'Indoor', 'confirmed', '2026-02-08 07:06:12', NULL, NULL),
(4, 2, 'test', 'test@gmail.com', '1234567890', '2026-02-08', '12:00:00', 2, 'Indoor', 'confirmed', '2026-02-08 07:06:12', NULL, NULL),
(5, 2, 'test', 'test@gmail.com', '1234567890', '2026-02-08', '12:00:00', 2, 'Indoor', 'cancelled', '2026-02-08 07:17:58', NULL, NULL),
(6, 2, 'test', 'test@gmail.com', '1234567890', '2026-02-14', '14:00:00', 2, 'Outdoor', 'confirmed', '2026-02-09 12:07:34', NULL, NULL),
(7, 2, 'test', 'test@gmail.com', '9825632563', '2026-02-18', '10:00:00', 2, 'Outdoor', 'confirmed', '2026-02-10 09:52:32', NULL, NULL),
(8, 3, 'Lucky', '', '8866484085', '2026-02-19', '20:00:00', 2, 'Indoor', 'confirmed', '2026-02-18 13:15:24', 2, ''),
(9, 3, 'Lucky', '', '8866484085', '2026-02-18', '18:00:00', 2, 'Window', 'confirmed', '2026-02-18 13:16:20', 23, ''),
(10, 3, 'Lucky', '', '8866484085', '2026-02-21', '20:00:00', 2, 'Outdoor', 'confirmed', '2026-02-18 13:50:14', 15, ''),
(11, 2, 'test', '', '8866484085', '2026-02-27', '20:00:00', 2, 'Indoor', 'confirmed', '2026-02-18 14:05:27', 2, ''),
(12, 3, 'Lucky', '', '8866484085', '2026-02-27', '18:00:00', 2, 'Indoor', 'confirmed', '2026-02-18 15:20:11', 10, ''),
(13, 3, 'Lucky', '', '8866484085', '2026-02-27', '16:00:00', 2, 'Outdoor', 'confirmed', '2026-02-18 15:31:04', 11, '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `created_at`, `phone_number`) VALUES
(1, 'Super Admin', 'admin@cafetales.com', 'admin123', 'admin', '2026-02-08 04:38:37', NULL),
(2, 'test', 'test@gmail.com', 'test123', 'customer', '2026-02-08 06:56:18', NULL),
(3, 'Lucky', 'lucky@gmail.com', 'lucky123', 'customer', '2026-02-18 12:43:13', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

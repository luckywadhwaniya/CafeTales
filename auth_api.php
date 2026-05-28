<?php
// auth_api.php
header("Content-Type: application/json");
require 'db_connect.php';

$action = $_POST['action'] ?? '';

// --- REGISTER ---
if ($action === 'register') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $pass = $_POST['password']; 

    // Check if email exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already registered"]);
        exit;
    }
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'customer')");
    $stmt->bind_param("sss", $name, $email, $pass);

    if ($stmt->execute()) echo json_encode(["success" => true]);
    else echo json_encode(["success" => false, "message" => "DB Error"]);
}

// --- LOGIN ---
if ($action === 'login') {
    $email = $_POST['email'];
    $pass = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, full_name, email, role, password_hash FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        // Check password (Plain text comparison for now based on your seed data)
        if ($pass === $user['password_hash']) {
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }
}
?>
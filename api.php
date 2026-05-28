<?php
header("Content-Type: application/json");
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', 0); 
require 'db_connect.php';

$action = $_REQUEST['action'] ?? '';

// =============================================
// 1. GET MENU (Loads the Menu Page)
// =============================================
if ($action === 'get_menu') {
    $sql = "SELECT m.*, c.name as category_name 
            FROM menu_items m 
            LEFT JOIN categories c ON m.category_id = c.id 
            WHERE m.is_available = 1 
            ORDER BY m.id DESC";
    $result = $conn->query($sql);
    
    $data = [];
    while ($result && $row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// =============================================
// 2. GET CART (Loads User's Cart)
// =============================================
if ($action === 'get_cart') {
    $uid = $_POST['user_id'] ?? 0;
    $stmt = $conn->prepare("SELECT c.item_id as id, c.quantity as qty, m.name, m.price, m.image 
                            FROM cart c 
                            JOIN menu_items m ON c.item_id = m.id 
                            WHERE c.user_id = ?");
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// =============================================
// 3. UPDATE CART (Fixes the "Add" Button)
// =============================================
if ($action === 'update_cart') {
    $uid = $_POST['user_id'];
    $itemId = $_POST['item_id'];
    $change = (int)$_POST['change'];

    // Check if item exists in cart
    $check = $conn->prepare("SELECT quantity FROM cart WHERE user_id = ? AND item_id = ?");
    $check->bind_param("ii", $uid, $itemId);
    $check->execute();
    $res = $check->get_result();

    if ($row = $res->fetch_assoc()) {
        // Item exists: Update Quantity
        $newQty = $row['quantity'] + $change;
        if ($newQty <= 0) {
            // Remove if 0
            $del = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND item_id = ?");
            $del->bind_param("ii", $uid, $itemId);
            $del->execute();
        } else {
            // Update count
            $upd = $conn->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?");
            $upd->bind_param("iii", $newQty, $uid, $itemId);
            $upd->execute();
        }
    } else {
        // Item new: Insert (only if adding)
        if ($change > 0) {
            $ins = $conn->prepare("INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)");
            $qty = 1;
            $ins->bind_param("iii", $uid, $itemId, $qty);
            $ins->execute();
        }
    }
    echo json_encode(["success" => true]);
    exit;
}

// =============================================
// 4. GET CATEGORIES (For Filter Buttons)
// =============================================
if ($action === 'get_categories') {
    $result = $conn->query("SELECT * FROM categories");
    $data = [];
    while ($result && $row = $result->fetch_assoc()) $data[] = $row;
    echo json_encode($data);
    exit;
}

// =============================================
// 5. PLACE ORDER (Checkout Logic)
// =============================================
if ($action === 'place_order') {
    $uid = $_POST['user_id'];
    $tableNum = $_POST['table_number']; 
    $payMethod = $_POST['payment_method'];
    $payStatus = $_POST['payment_status']; 

    // Get Items
    $cart_q = $conn->prepare("SELECT c.item_id, c.quantity, m.price FROM cart c JOIN menu_items m ON c.item_id = m.id WHERE c.user_id = ?");
    $cart_q->bind_param("i", $uid);
    $cart_q->execute();
    $cart_res = $cart_q->get_result();
    
    $items = []; 
    $total = 0;
    while ($row = $cart_res->fetch_assoc()) {
        $items[] = $row;
        $total += ($row['price'] * $row['quantity']);
    }

    if (empty($items)) { echo json_encode(["success" => false, "message" => "Cart Empty"]); exit; }

    // Create Order
    $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, status, table_number, payment_method, payment_status) VALUES (?, ?, 'pending', ?, ?, ?)");
    $stmt->bind_param("idiss", $uid, $total, $tableNum, $payMethod, $payStatus);
    
    if ($stmt->execute()) {
        $order_id = $conn->insert_id;
        
        // Save Details
        $detail_stmt = $conn->prepare("INSERT INTO order_details (order_id, item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $detail_stmt->bind_param("iiid", $order_id, $item['item_id'], $item['quantity'], $item['price']);
            $detail_stmt->execute();
        }
        
        // Clear Cart
        $conn->query("DELETE FROM cart WHERE user_id = $uid");
        echo json_encode(["success" => true, "order_id" => $order_id]);
    } else {
        echo json_encode(["success" => false, "message" => $conn->error]);
    }
    exit;
}

// =============================================
// 6. CHECK AVAILABILITY (New Feature)
// =============================================
if ($action === 'check_availability') {
    $date = $_POST['date'];
    $time = $_POST['time'];
    $area = $_POST['area'];

    // Define Capacity (Total tables per area)
    $capacity = 10; 

    $stmt = $conn->prepare("SELECT count(*) as booked FROM reservations WHERE reservation_date = ? AND reservation_time = ? AND seating_area = ? AND status != 'cancelled'");
    $stmt->bind_param("sss", $date, $time, $area);
    $stmt->execute();
    $booked = $stmt->get_result()->fetch_assoc()['booked'];
    
    $left = $capacity - $booked;
    echo json_encode(["left" => $left]);
    exit;
}

// =============================================
// 7. RESERVE TABLE (New Feature + Random Table Logic)
// =============================================
if ($action === 'reserve') {
    $uid = $_POST['user_id'];
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $area = $_POST['area'];
    $guests = $_POST['guests'];
    $notes = $_POST['notes'];
    
    // 1. Table Ranges
    $ranges = ['Indoor' => [1, 10], 'Outdoor' => [11, 20], 'Window' => [21, 30]];
    if (!isset($ranges[$area])) { echo json_encode(["success" => false, "message" => "Invalid Area"]); exit; }
    $min = $ranges[$area][0]; $max = $ranges[$area][1];

    // 2. Find booked tables
    $stmt = $conn->prepare("SELECT table_number FROM reservations WHERE reservation_date = ? AND reservation_time = ? AND status != 'cancelled'");
    $stmt->bind_param("ss", $date, $time);
    $stmt->execute();
    $res = $stmt->get_result();
    $taken = []; while($row = $res->fetch_assoc()) $taken[] = $row['table_number'];

    // 3. Find available
    $avail = [];
    for($i = $min; $i <= $max; $i++) { if (!in_array($i, $taken)) $avail[] = $i; }

    if (empty($avail)) { echo json_encode(["success" => false, "message" => "Slot Full!"]); exit; }
    
    $assigned_table = $avail[array_rand($avail)];

    // 4. INSERT (STATUS IS NOW 'pending')
    $ins = $conn->prepare("INSERT INTO reservations (user_id, customer_name, customer_phone, reservation_date, reservation_time, guests, seating_area, table_number, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
    $ins->bind_param("issssssis", $uid, $name, $phone, $date, $time, $guests, $area, $assigned_table, $notes);
    
    if ($ins->execute()) {
        echo json_encode(["success" => true, "id" => $conn->insert_id, "table" => $assigned_table]);
    } else {
        echo json_encode(["success" => false, "message" => $conn->error]);
    }
    exit;
}

// =============================================
// 8. USER HISTORY ACTIONS (New Feature)
// =============================================

// Get Order History
if ($action === 'get_user_orders') {
    $uid = $_POST['user_id'];
    
    $sql = "SELECT o.id, o.total_amount, o.payment_status, o.order_date,
            COALESCE((SELECT GROUP_CONCAT(CONCAT(m.name, ' x', od.quantity) SEPARATOR ', ') 
             FROM order_details od 
             JOIN menu_items m ON od.item_id = m.id 
             WHERE od.order_id = o.id), 'No items') as items
            FROM orders o 
            WHERE o.user_id = ? 
            ORDER BY o.id DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $data = [];
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// Get Booking History
if ($action === 'get_my_bookings') {
    $uid = $_POST['user_id'];
    $stmt = $conn->prepare("SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC");
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = []; while($row = $result->fetch_assoc()) $data[] = $row; 
    echo json_encode($data); exit;
}

// Get User Profile (Auto-fill)
if ($action === 'get_user_details') {
    $uid = $_POST['user_id'];
    $stmt = $conn->prepare("SELECT full_name, email, phone_number FROM users WHERE id = ?");
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    if($res) echo json_encode(["success" => true, "user" => $res]);
    else echo json_encode(["success" => false]);
    exit;
}

// =============================================
// 9. ADMIN ACTIONS (Existing)
// =============================================
if ($action === 'get_all_orders') {
    $sql = "SELECT o.id, o.total_amount, o.table_number, o.payment_method, o.payment_status, o.order_date, 
            COALESCE(u.full_name, 'Guest') as full_name,
            COALESCE((SELECT GROUP_CONCAT(CONCAT(IFNULL(m.name, 'Item'), ' (x', od.quantity, ')') SEPARATOR '<br>') FROM order_details od LEFT JOIN menu_items m ON od.item_id = m.id WHERE od.order_id = o.id), 'No Items') as items_summary
            FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.id DESC LIMIT 50";
    $result = $conn->query($sql);
    $data = []; while ($result && $row = $result->fetch_assoc()) $data[] = $row; echo json_encode($data); exit;
}

if ($action === 'get_my_reservations_today') {
    $uid = $_POST['user_id']; $today = date('Y-m-d');
    $stmt = $conn->prepare("SELECT id, reservation_time, seating_area, table_number FROM reservations WHERE user_id = ? AND reservation_date = ? AND status = 'confirmed'");
    $stmt->bind_param("is", $uid, $today); $stmt->execute();
    $result = $stmt->get_result(); $data = []; while ($row = $result->fetch_assoc()) $data[] = $row; echo json_encode($data); exit;
}

if ($action === 'admin_stats') {
    $pending = $conn->query("SELECT count(*) as c FROM reservations WHERE status='pending'")->fetch_assoc()['c'];
    $items = $conn->query("SELECT count(*) as c FROM menu_items WHERE is_available = 1")->fetch_assoc()['c'];
    $revRes = $conn->query("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'Paid'");
    $revenue = ($revRes && $r = $revRes->fetch_assoc()) ? $r['total'] : 0;
    echo json_encode(["pending" => $pending, "items" => $items, "revenue" => $revenue ?? 0]); exit;
}
if ($action === 'add_item') {
    $name = $_POST['name']; $price = $_POST['price']; $catId = $_POST['category_id']; $image = "default.jpg";
    if (!empty($_FILES['image']['name'])) { $image = time()."_".basename($_FILES["image"]["name"]); move_uploaded_file($_FILES["image"]["tmp_name"], "uploads/".$image); }
    $stmt = $conn->prepare("INSERT INTO menu_items (name, price, category_id, image, is_available) VALUES (?, ?, ?, ?, 1)");
    $stmt->bind_param("sdis", $name, $price, $catId, $image); $stmt->execute(); echo json_encode(["success" => true]); exit;
}
if ($action === 'delete_item') { $conn->query("DELETE FROM menu_items WHERE id = ".$_POST['id']); echo json_encode(["success" => true]); exit; }
if ($action === 'get_reservations') { $res = $conn->query("SELECT * FROM reservations ORDER BY reservation_date DESC"); $d=[]; while($r=$res->fetch_assoc())$d[]=$r; echo json_encode($d); exit; }
if ($action === 'update_res_status') { $conn->query("UPDATE reservations SET status='".$_POST['status']."' WHERE id=".$_POST['id']); echo json_encode(["success" => true]); exit; }
if ($action === 'update_payment_status') { $conn->query("UPDATE orders SET payment_status='".$_POST['status']."' WHERE id=".$_POST['order_id']); echo json_encode(["success" => true]); exit; }
?>
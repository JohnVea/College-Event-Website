<?php
    // Allow requests from any origin
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
  
    header("Content-Type: application/json");

    // Get input data
    $inData = getRequestInfo();

    // Extract input parameters
    $eventID = $inData['eventID'];
    $adminID = $inData['adminID'];
    $superAdminID = $inData['superAdminID'];

    // Connect to the database
    $conn = new mysqli("localhost", "username", "password", "database");

    // Check for connection errors
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        // Prepare and execute SQL statement to insert data into Private_Events table
        $stmt = $conn->prepare("INSERT INTO Private_Events (EventID, AdminID, SuperAdminID) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $eventID, $adminID, $superAdminID);
        
        if ($stmt->execute()) {
            $response = array("message" => "Private event created successfully");
            sendResultInfoAsJson($response);
        } else {
            returnWithError("Failed to create private event");
        }

        // Close database connection
        $stmt->close();
        $conn->close();
    }

    // Function to get request data
    function getRequestInfo() {
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    
        if ($contentType === 'application/json') {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                returnWithError("Invalid JSON data: " . json_last_error_msg());
            }
            return $data;
        } else {
            return $_POST;
        }
    }

    // Function to send response as JSON
    function sendResultInfoAsJson($obj) {
        echo json_encode($obj);
    }

    // Function to return error message
    function returnWithError($err) {
        $response = array("error" => $err);
        sendResultInfoAsJson($response);
        http_response_code(500);
        exit;
    }
?>

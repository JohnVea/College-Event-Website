<?php

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow certain methods (e.g., POST)
header("Access-Control-Allow-Methods: POST");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type");

// Set response content type
header("Content-Type: application/json");

$inData = getRequestInfo();

$time = $inData['time'];
$location = $inData['location'];
$eventName = $inData['eventName'];
$description = $inData['description'];

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

if ($conn->connect_error) { 
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO Events (Time, Location, Event_name, Description) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $time, $location, $eventName, $description);

    if ($stmt->execute()) {
        $response = array("message" => "Event created successfully");
        sendResultInfoAsJson($response);
    } else {
        $error = $stmt->error;
        returnWithError("Failed to create event: $error");
    }

    $stmt->close();
    $conn->close();
}

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

function sendResultInfoAsJson($obj) {
    echo json_encode($obj);
}

function returnWithError($err) {
    $response = array("error" => $err);
    sendResultInfoAsJson($response);
    http_response_code(500);
    exit;
}
?>

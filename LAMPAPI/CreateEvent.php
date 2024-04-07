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
    // Generate a unique LocID value
    $locId = uniqid('loc_', true);

    // Check if the location already exists in the Locations table
    $checkLocationStmt = $conn->prepare("SELECT LocID FROM Locations WHERE Name = ?");
    $checkLocationStmt->bind_param("s", $location);
    $checkLocationStmt->execute();
    $checkLocationStmt->bind_result($existingLocId);
    $checkLocationStmt->fetch();
    $checkLocationStmt->close();

    if ($existingLocId) {
        // Location already exists, use the existing LocID
        $locId = $existingLocId;
    } else {
        // Location doesn't exist, insert it into the Locations table
        $insertLocationStmt = $conn->prepare("INSERT INTO Locations (LocID, Name) VALUES (?, ?)");
        $insertLocationStmt->bind_param("ss", $locId, $location);
        $insertLocationStmt->execute();
        $insertLocationStmt->close();
    }

    // Now insert the event into the Events table
    $stmt = $conn->prepare("INSERT INTO Events (Time, Location, Event_name, Description) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $time, $locId, $eventName, $description);

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
        echo "Raw JSON data: $json\n";
        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $jsonError = json_last_error_msg();
            echo "JSON decode error: $jsonError\n";
            returnWithError("Invalid JSON data: $jsonError");
        }
        echo "Decoded JSON data: ";
        print_r($data);
        echo "\n";
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

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
$longitude = $inData['longitude'];
$latitude = $inData['latitude'];

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    // Extract the city from the location string
    $locationParts = explode(',', $location);
    $city = trim($locationParts[0]);

    // Check if the location already exists in the Locations table
    $checkLocationStmt = $conn->prepare("SELECT LocID FROM Locations WHERE LocID = ?");
    $checkLocationStmt->bind_param("s", $city);
    $checkLocationStmt->execute();
    $checkLocationStmt->store_result();
    $checkLocationStmt->bind_result($locId);
    $checkLocationStmt->fetch();
    $checkLocationStmt->close();

    if (!$locId) {
        // Location doesn't exist, insert it into the Locations table
        $insertLocationStmt = $conn->prepare("INSERT INTO Locations (LocID, Name, Longitude, Latitude) VALUES (?, ?, ?, ?)");
        $insertLocationStmt->bind_param("ssdd", $city, $location, $longitude, $latitude);
        if (!$insertLocationStmt->execute()) {
            returnWithError("Failed to insert location: " . $insertLocationStmt->error);
        }
        $insertLocationStmt->close();
        $locId = $city;
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

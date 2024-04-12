<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow certain methods (e.g., POST)
header("Access-Control-Allow-Methods: POST");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type");

// Set response content type
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include required functions
require_once("functions.php");

// Get request data
$requestData = getRequestInfo();

// Validate required fields
$requiredFields = ['time', 'timeOfDay', 'location', 'longitude', 'latitude', 'eventName', 'description'];
foreach ($requiredFields as $field) {
    if (!isset($requestData[$field]) || empty($requestData[$field])) {
        returnWithError("Missing or empty required field: $field");
    }
}

// Extract data from request
$time = $requestData['time'];
$timeOfDay = $requestData['timeOfDay'];
$location = $requestData['location'];
$longitude = $requestData['longitude'];
$latitude = $requestData['latitude'];
$eventName = $requestData['eventName'];
$description = $requestData['description'];

// Establish database connection
$conn = establishDatabaseConnection();

// Check for database connection errors
if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    // Check if the location already exists in the Locations table
    $existingLocId = getLocationId($conn, $location);

    if (!$existingLocId) {
        // Location doesn't exist, insert it into the Locations table
        $locId = generateUniqueId();
        $insertLocationResult = insertLocationIntoDatabase($conn, $locId, $location, $description, $longitude, $latitude);
        if (!$insertLocationResult) {
            returnWithError("Failed to insert location into database");
        }
    } else {
        // Use the existing LocID
        $locId = $existingLocId;
    }

    // Insert the event into the Events table
    $insertEventResult = insertEventIntoDatabase($conn, $time, $timeOfDay, $locId, $eventName, $description);
    if ($insertEventResult) {
        $response = array("message" => "Event created successfully");
        sendResultInfoAsJson($response);
    } else {
        returnWithError("Failed to create event");
    }

    // Close database connection
    $conn->close();
}

function returnWithError($err)
{
    // Check if the error is already an array
    if (!is_array($err)) {
        // If not, create an array with the error message
        $err = array("message" => $err);
    }

    // Add debugging information
    $err["debug"] = array(
        "message" => $err["message"],
        "file" => __FILE__,
        "line" => __LINE__,
        "requestData" => $_REQUEST,
        "serverData" => $_SERVER
    );

    // Send response as JSON
    sendResultInfoAsJson($err);
    
    // Set HTTP status code to 500 (Internal Server Error)
    http_response_code(500);

    // Terminate script execution
    exit;
}
?>

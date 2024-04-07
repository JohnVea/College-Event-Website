<?php
    
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
    $longitude = $inData['longitude'];
    $latitude = $inData['latitude'];
    $eventName = $inData['eventName'];
    $description = $inData['description'];
    
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    if ($conn->connect_error) {
        returnWithError("Database connection error: " . $conn->connect_error);
    } else {
        // Generate a unique string for LocID
        $locId = uniqid();
    
        // Check if the location already exists in the Locations table
        $checkLocationStmt = $conn->prepare("SELECT LocID FROM Locations WHERE Name = ?");
        $checkLocationStmt->bind_param("s", $location);
        $checkLocationStmt->execute();
        $checkLocationStmt->store_result();
        $checkLocationStmt->bind_result($existingLocId);
        $checkLocationStmt->fetch();
        $checkLocationStmt->close();
    
        if (!$existingLocId) {
            // Location doesn't exist, insert it into the Locations table
            $descr = $description;
            $insertLocationStmt = $conn->prepare("INSERT INTO Locations (LocID, Name, Descr, Longitude, Latitude) VALUES (?, ?, ?, ?, ?)");
            $insertLocationStmt->bind_param("sssss", $locId, $location, $descr, $longitude, $latitude);
            if (!$insertLocationStmt->execute()) {
                returnWithError("Failed to insert location: " . $insertLocationStmt->error);
            }
            $insertLocationStmt->close();
        } else {
            // Use the existing LocID
            $locId = $existingLocId;
        }
    
        // Now insert the event into the Events table
        $stmt = $conn->prepare("INSERT INTO Events (Time, Location, Event_name, Description) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("siss", $time, $locID, $eventName, $description);
    
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
    
    function getRequestInfo()
    {
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
    
    function sendResultInfoAsJson($obj)
    {
        echo json_encode($obj);
    }
    
    function returnWithError($err)
    {
        $response = array("error" => $err);
        sendResultInfoAsJson($response);
        http_response_code(500);
        exit;
    }
?>

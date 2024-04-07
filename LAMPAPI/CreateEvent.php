<?php
    // Allow requests from any origin
    header("Access-Control-Allow-Origin: *");
    
    // Allow certain methods (e.g., POST)
    header("Access-Control-Allow-Methods: POST");
    
    // Allow specific headers
    header("Access-Control-Allow-Headers: Content-Type");
    
    // Set response content type
    header("Content-Type: application/json");

    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        // Retrieve raw JSON data from request body
        $json_data = file_get_contents('php://input');
        
        // Decode JSON data
        $data = json_decode($json_data, true);
        
        // Extract data fields
        $time = $data['time'];
        $location = $data['location'];
        $eventName = $data['eventName'];
        $description = $data['description'];

        // Prepare and execute SQL statement to insert new event
        $stmt = $conn->prepare("INSERT INTO Events (Time, Location, Event_name, Description) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $time, $location, $eventName, $description);
        
        if ($stmt->execute()) {
            // If insertion is successful, return success response
            $response = array("message" => "Event created successfully");
            sendResultInfoAsJson($response);
        } else {
            // If there's an error, return error response
            returnWithError("Failed to create event");
        }

        $stmt->close();
        $conn->close();
    }
    
    function sendResultInfoAsJson($obj) {
        echo json_encode($obj);
    }
    
    function returnWithError($err) {
        $response = array("error" => $err);
        sendResultInfoAsJson($response);
    }
?>

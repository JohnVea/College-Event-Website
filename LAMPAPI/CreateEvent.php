<?php
    // Allow requests from any origin
    header("Access-Control-Allow-Origin: *");
    
    // Allow certain methods (e.g., POST)
    header("Access-Control-Allow-Methods: POST");
    
    // Allow specific headers
    header("Access-Control-Allow-Headers: Content-Type");
    
    // Set response content type
    header("Content-Type: application/json");

    // Get the raw JSON data from the request body
    $json_data = file_get_contents('php://input');

    // Decode the JSON data into an associative array
    $data = json_decode($json_data, true);

    // Extract event data from the decoded JSON
    $time = $data['time'];
    $location = $data['location'];
    $eventName = $data['eventName'];
    $description = $data['description'];

    // Create a new MySQLi connection
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    // Check for connection errors
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        // Prepare SQL statement to insert new event
        $stmt = $conn->prepare("INSERT INTO Events (Time, Location, Event_name, Description) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $time, $location, $eventName, $description);
        
        // Execute the SQL statement
        if ($stmt->execute()) {
            // If insertion is successful, return success response
            $response = array("message" => "Event created successfully");
            sendResultInfoAsJson($response);
        } else {
            // If there's an error, return error response
            returnWithError("Failed to create event");
        }

        // Close the statement and connection
        $stmt->close();
        $conn->close();
    }
    
    // Function to send result info as JSON
    function sendResultInfoAsJson($obj) {
        echo json_encode($obj);
    }
    
    // Function to return error with JSON
    function returnWithError($err) {
        $response = array("error" => $err);
        sendResultInfoAsJson($response);
    }
?>

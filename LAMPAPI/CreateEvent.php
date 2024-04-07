<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    header("Content-Type: application/json");
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        // Get the JSON data from the request body
        $json_data = file_get_contents('php://input');
        
        // Decode JSON data
        $data = json_decode($json_data, true);
        
        // Extract data fields
        $time = $data['time'];
        $location = $data['location'];
        $eventName = $data['eventName'];
        $description = $data['description'];

        $stmt = $conn->prepare("INSERT INTO Events (Time, Location, Event_name, Description) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $time, $location, $eventName, $description);
        
        if ($stmt->execute()) {
            $eventId = $stmt->insert_id;
            $response = array("eventId" => $eventId);
            sendResultInfoAsJson($response);
        } else {
            returnWithError("Failed to create event");
        }

        $stmt->close();
        $conn->close();
    }
    
    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo json_encode($obj); // Encode the array as JSON before sending
    }
    
    function returnWithError($err) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>

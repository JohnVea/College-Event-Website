<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Content-Type: application/json");

    // Establish database connection
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

    // Check for connection errors
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Query to get all private events
    $sql = "SELECT * FROM Private_Events";

    // Execute the query
    $result = $conn->query($sql);

    // Check if there are any results
    if ($result->num_rows > 0) {
        // Initialize an array to store private events
        $privateEvents = array();

        // Fetch each row from the result set
        while ($row = $result->fetch_assoc()) {
            // Add each private event to the array
            $privateEvents[] = $row;
        }

        // Return the private events as JSON
        echo json_encode($privateEvents);
    } else {
        // If no private events are found, return an empty array
        echo json_encode(array());
    }

    // Close the database connection
    $conn->close();
?>

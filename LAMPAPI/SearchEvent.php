<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Function to establish database connection
function connectDB() {
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

// Function to return an error response
function returnWithError($message) {
    $response = array("error" => $message);
    echo json_encode($response);
    http_response_code(500);
    exit;
}

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve search parameters from the request body
    $searchParams = json_decode(file_get_contents("php://input"), true);

    // Validate search parameters
    if (!isset($searchParams["keyword"])) {
        returnWithError("Missing keyword parameter");
    }

    // Sanitize search keyword
    $keyword = trim($searchParams["keyword"]);
    $keyword = htmlspecialchars($keyword);

    // Connect to the database
    $conn = connectDB();

    // Prepare the SQL query to select event name, event date, and event time separately
    $sql = "SELECT Event_name, DATE(Event_date) AS Event_date, TIME(Event_time) AS Event_time FROM Events WHERE Event_name LIKE ? OR Description LIKE ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        returnWithError("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters and execute the query
    $searchTerm = "%" . $keyword . "%";
    $stmt->bind_param("ss", $searchTerm, $searchTerm);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if any matching events were found
    if ($result->num_rows > 0) {
        // Fetch each row and format the date and time separately
        $events = array();
        while ($row = $result->fetch_assoc()) {
            $event = array(
                "Event_name" => $row["Event_name"],
                "Event_date" => $row["Event_date"],
                "Event_time" => $row["Event_time"]
            );
            $events[] = $event;
        }
        // Encode matching events as JSON
        echo json_encode($events);
    } else {
        // Return an empty array if no matching events were found
        echo json_encode(array());
    }

    // Close the database connection and statement
    $stmt->close();
    $conn->close();
} else {
    // Return an error if the request method is not POST
    returnWithError("Invalid request method");
}
?>

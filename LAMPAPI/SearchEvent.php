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

        // Prepare the SQL query
        $sql = "SELECT * FROM Events WHERE Event_name LIKE ? OR Description LIKE ?";
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
            // Fetch and encode matching events as JSON
            $events = $result->fetch_all(MYSQLI_ASSOC);
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
?>    This is what it returns [
    {
        "Events_ID": 83,
        "Time": "2024-04-07 15:30:00",
        "Location": "661302aeef0d9",
        "Event_name": "Tech Conference",
        "Description": "An annual tech conference featuring the latest industry trends and innovations."
    }
]

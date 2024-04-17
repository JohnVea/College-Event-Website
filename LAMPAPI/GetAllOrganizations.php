<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    // Retrieve all RSOs with their associated university names from the database
    $sql = "SELECT RSOs.*, Universities.Name AS UniversityName FROM RSOs 
            INNER JOIN Universities ON RSOs.UniversityID = Universities.UniversityID";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $rsoArray = array();

        // Fetch each row as an associative array and add it to the result array
        while ($row = $result->fetch_assoc()) {
            $rsoArray[] = $row;
        }

        // Return the RSOs as JSON
        sendResultInfoAsJson($rsoArray);
    } else {
        // No RSOs found
        returnWithError("No RSOs found");
    }

    $conn->close();
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

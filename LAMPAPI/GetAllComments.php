<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow certain methods (e.g., GET)
header("Access-Control-Allow-Methods: GET");

// Set response content type
header("Content-Type: application/json");

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

// Check connection
if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    $sql = "SELECT * FROM Comments";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $comments = array();
        while ($row = $result->fetch_assoc()) {
            $comment = array(
                "CommentID" => $row["CommentID"],
                "CommentedUser" => $row["CommentedUser"],
                "UserComment" => $row["UserComment"],
                "CommentedEventID" => $row["CommentedEventID"]
            );
            array_push($comments, $comment);
        }
        sendResultInfoAsJson($comments);
    } else {
        returnWithError("No comments found.");
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
    http_response_code(404); // Not Found
    exit;
}

?>

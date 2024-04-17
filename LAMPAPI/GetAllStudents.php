<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    $students = array();

    $query = "SELECT StudentID, UserID, UniversityID FROM Students";
    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $student = array(
                "StudentID" => $row["StudentID"],
                "UserID" => $row["UserID"],
                "UniversityID" => $row["UniversityID"]
            );
            array_push($students, $student);
        }
        sendResultInfoAsJson($students);
    } else {
        returnWithError("No students found");
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

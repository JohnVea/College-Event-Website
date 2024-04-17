<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$inData = getRequestInfo();

$studentID = $inData['studentID'];
$rsoID = $inData['rsoID'];

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    // Associate student with the RSO in Students_RSOs table
    $insertStudentRSOStmt = $conn->prepare("INSERT INTO Students_RSOs (StudentID, RSOID) VALUES (?, ?)");
    $insertStudentRSOStmt->bind_param("ii", $studentID, $rsoID);
    if ($insertStudentRSOStmt->execute()) {
        $response = array("message" => "Student associated with RSO successfully");
        sendResultInfoAsJson($response);
    } else {
        $error = $insertStudentRSOStmt->error;
        returnWithError("Failed to associate student with RSO: $error");
    }
    $insertStudentRSOStmt->close();

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

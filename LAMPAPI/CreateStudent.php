<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$inData = getRequestInfo();

$userID = $inData['UserID'];
$universityName = $inData['UniversityName'];

$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");

if ($conn->connect_error) {
    returnWithError("Database connection error: " . $conn->connect_error);
} else {
    // Check if the university exists
    $checkUniversityStmt = $conn->prepare("SELECT UniversityID FROM Universities WHERE Name = ?");
    $checkUniversityStmt->bind_param("s", $universityName);
    $checkUniversityStmt->execute();
    $checkUniversityStmt->store_result();
    $checkUniversityStmt->bind_result($universityID);
    $checkUniversityStmt->fetch();
    $checkUniversityStmt->close();

    if (!$universityID) {
        returnWithError("University does not exist");
    }

    // Insert the student into the Students table
    $insertStudentStmt = $conn->prepare("INSERT INTO Students (UserID, UniversityID) VALUES (?, ?)");
    $insertStudentStmt->bind_param("ii", $userID, $universityID);
    if ($insertStudentStmt->execute()) {
        $response = array("message" => "Student created successfully");
        sendResultInfoAsJson($response);
    } else {
        $error = $insertStudentStmt->error;
        returnWithError("Failed to create student: $error");
    }
    $insertStudentStmt->close();

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

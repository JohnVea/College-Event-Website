<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$inData = getRequestInfo();

$name = $inData['name'];
$universityName = $inData['universityName'];

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
        // University does not exist, insert it into the Universities table
        $insertUniversityStmt = $conn->prepare("INSERT INTO Universities (Name) VALUES (?)");
        $insertUniversityStmt->bind_param("s", $universityName);
        if (!$insertUniversityStmt->execute()) {
            returnWithError("Failed to insert university: " . $insertUniversityStmt->error);
        }
        $insertUniversityStmt->close();
        // Retrieve the newly inserted university's ID
        $universityID = $conn->insert_id;
    }

    // Insert the RSO into the RSOs table
    $insertRSOStmt = $conn->prepare("INSERT INTO RSOs (Name, UniversityID) VALUES (?, ?)");
    $insertRSOStmt->bind_param("si", $name, $universityID);
    if ($insertRSOStmt->execute()) {
        $response = array("message" => "RSO created successfully");
        sendResultInfoAsJson($response);
    } else {
        $error = $insertRSOStmt->error;
        returnWithError("Failed to create RSO: $error");
    }
    $insertRSOStmt->close();

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

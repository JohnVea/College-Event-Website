<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow certain methods (e.g., POST)
header("Access-Control-Allow-Methods: POST");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type");

// Set response content type
header("Content-Type: application/json");

$inData = getRequestInfo();
$username = $inData["username"];
$password = $inData["password"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];

// Establish connection
$conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare and execute statement to insert user data into Users table
    $stmt = $conn->prepare("INSERT INTO Users (Username, Password, Email) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $password, $email);

    if ($stmt->execute()) {
        $id = $stmt->insert_id;

        // Prepare and execute statement to insert user profile data into Profiles table
        $stmt = $conn->prepare("INSERT INTO Profiles (UserID, FirstName, LastName) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $id, $firstName, $lastName);

        if ($stmt->execute()) {
            returnWithInfo($id, $firstName, $lastName);
        } else {
            returnWithError("Failed to create profile");
        }
    } else {
        returnWithError("Registration Failed");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = array("id" => 0, "firstName" => "", "lastName" => "", "error" => $err);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($id, $firstName, $lastName)
{
    $retValue = array("id" => $id, "firstName" => $firstName, "lastName" => $lastName, "error" => "");
    sendResultInfoAsJson($retValue);
}
?>

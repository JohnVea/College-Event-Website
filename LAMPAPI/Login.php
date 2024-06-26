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
    $UserID = 0;
    $FirstName = "";
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("SELECT UserID FROM Users WHERE Username=? AND Password=?");
        $stmt->bind_param("ss", $inData["Username"], $inData["Password"]);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if ($row = $result->fetch_assoc()) {
            $UserID = $row['UserID'];
            $stmt = $conn->prepare("SELECT FirstName FROM Profiles WHERE UserID=?");
            $stmt->bind_param("s", $UserID);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $FirstName = $row['FirstName'];
            }
            returnWithInfo($UserID, $FirstName);
        } else {
            returnWithError("No Records Found");
        }
    
        $stmt->close();
        $conn->close();
    }
    
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err) {
        $retValue = '{"UserID": 0, "FirstName": "", "error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($id, $firstName) {
        $retValue = '{"UserID":' . $id . ', "FirstName":"' . $firstName . '", "error":""}';
        sendResultInfoAsJson($retValue);
    }
?>

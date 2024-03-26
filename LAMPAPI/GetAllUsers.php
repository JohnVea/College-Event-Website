<?php
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        $resultArray = array(); // Initialize an array to store user data

        // Select all users from the Users table
        $sql = "SELECT * FROM Users";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $UserID = $row['UserID'];

                // For each user, retrieve their first name from the Profiles table
                $stmt = $conn->prepare("SELECT FirstName FROM Profiles WHERE UserID=?");
                $stmt->bind_param("s", $UserID);
                $stmt->execute();
                $profileResult = $stmt->get_result();

                // If a profile exists for the user, fetch the first name
                if ($profileRow = $profileResult->fetch_assoc()) {
                    $FirstName = $profileRow['FirstName'];
                } else {
                    $FirstName = ""; // If no profile exists, set first name to empty string
                }

                // Create an associative array representing the user and add it to the result array
                $user = array(
                    "UserID" => $UserID,
                    "FirstName" => $FirstName
                );
                array_push($resultArray, $user);
            }

            // Return the result array containing all users
            sendResultInfoAsJson($resultArray);
        } else {
            returnWithError("No Records Found");
        }

        $conn->close();
    }
    
    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo json_encode($obj); // Encode the array as JSON before sending
    }
    
    function returnWithError($err) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>

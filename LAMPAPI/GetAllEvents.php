<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
  
    header("Content-Type: application/json");
    $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
    
    if ($conn->connect_error) { 
        returnWithError($conn->connect_error);
    } else {
        $resultArray = array(); // Initialize an array to store event data

        $sql = "SELECT * FROM Events";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $EventID = $row['Events_ID'];
                $Time = $row['Time'];
                $Location = $row['Location'];
                $EventName = $row['Event_name'];
                $Description = $row['Description'];

                $event = array(
                    "EventID" => $EventID,
                    "Time" => $Time,
                    "Location" => $Location,
                    "EventName" => $EventName,
                    "Description" => $Description
                );
                array_push($resultArray, $event);
            }

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

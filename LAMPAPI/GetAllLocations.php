<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Allow-Headers: Content-Type");
  
  header("Content-Type: application/json");
  $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
  
  if ($conn->connect_error) {
      returnWithError($conn->connect_error);
  } else {
      $resultArray = array(); // Initialize an array to store location data
  
      $sql = "SELECT * FROM Locations";
      $result = $conn->query($sql);
  
      if ($result && $result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
              $LocID = $row['LocID'];
              $Name = $row['Name'];
              $Description = $row['Descr'];
              $Longitude = $row['Longitude'];
              $Latitude = $row['Latitude'];
  
              $location = array(
                  "LocID" => $LocID,
                  "Name" => $Name,
                  "Description" => $Description,
                  "Longitude" => $Longitude,
                  "Latitude" => $Latitude
              );
              array_push($resultArray, $location);
          }
  
          sendResultInfoAsJson($resultArray);
      } else {
          returnWithError("No Records Found");
      }
  
      $conn->close();
  }
  
  function sendResultInfoAsJson($obj)
  {
      header('Content-type: application/json');
      echo json_encode($obj); // Encode the array as JSON before sending
  }
  
  function returnWithError($err)
  {
      $retValue = '{"error":"' . $err . '"}';
      sendResultInfoAsJson($retValue);
  }
?>

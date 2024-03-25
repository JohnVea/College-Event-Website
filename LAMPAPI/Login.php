<?php
  $inData = getRequestInfo();
	
	$UserID = 0;
  $conn = new mysqli("localhost", "JohnVea", "1loveComputers", "COP4710");
  if( $conn->connect_error )
	{ 
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT UserID FROM Users WHERE Usernameogin=? AND Password =?");
		$stmt->bind_param("ss", $inData["Username"], $inData["Password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['UserID'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"UserID":0 . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($id )
	{
		$retValue = '{"UserID":' . $UserID . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

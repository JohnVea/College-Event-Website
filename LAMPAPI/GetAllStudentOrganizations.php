<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "username", "password", "database");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM Students_RSOs";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $students_rso_array = array();
    while($row = $result->fetch_assoc()) {
        $student_rso_item = array(
            "StudentID" => $row["StudentID"],
            "RSOID" => $row["RSOID"]
        );
        array_push($students_rso_array, $student_rso_item);
    }
    echo json_encode($students_rso_array);
} else {
    echo json_encode(array("message" => "No Students_RSOs found."));
}
$conn->close();
?>

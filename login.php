<?php

$method = $_SERVER['REQUEST_METHOD'];
if( strtolower($method) == 'post')
{


	if (empty($_POST['username']) && empty($_POST['password']))
	{
 	 echo "PLEASE ENTER YOUR USERNAME AND PASSWORD";
  		exit();
	}

	$username = $_POST['username'];
	$password = $_POST['password'];

	$host = "eu-cdbr-azure-west-b.cloudapp.net";
	$user = "b8c7529fe0d6fc";
	$pwd = "364bb00f";
	$db = "cytoplaArrSa6tT4";


	try {
		$conn = new PDO( "mysql:host=$host;dbname=$db", $user, $pwd);
		$conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
	}
	catch(Exception $e){
		die(var_dump($e));
	}


	if($conn)
	{
		$sql_select = "SELECT * FROM account WHERE username = '$username' AND password = '$password'";
		$stmt = $conn->prepare($sql_select);
		$stmt->execute();
		$registrants = $stmt->fetchAll();

		if(count($registrants) == 1) {
			//echo "<h2>Welcome $username</h2>";
			echo "true";
		} 
		else {
			echo "WRONF PASSWORD OR USERNAME";
		}
	}
}
?>
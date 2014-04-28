<?php
	include 'connectDB.php';
	
	$name = rand();
	$score = $_POST['score'];
	
	
	$result = mysqli_query($link, "INSERT INTO `users_data`(`id`, `name`, `score`, `place`) VALUES ('', '$name', '$score', '1')") or die("Не удалось выполнить запрос ".mysqli_error($link));
	
	echo $result;
	//	$row = mysqli_fetch_array($result);
	//	mysqli_close($link);
?>
<?php
	include 'connectDB.php';
	
	$name = rand();
	$score = $_POST['score'];

	$user = mysqli_query($link, "SELECT * FROM `users_data` WHERE name = '$name'") or die("Не удалось выполнить запрос ".mysqli_error($link));

	if(mysqli_num_rows($user)) {
		$row = mysqli_fetch_array($user);
		$name = $row['name'];
		if($score > $row['score']) {
			mysqli_query($link, "UPDATE `users_data` SET score = $score WHERE name = '$name'") or die("Не удалось выполнить запрос ".mysqli_error($link));
		}
	} else {
		mysqli_query($link, "INSERT INTO `users_data` (`id`, `name`, `score`) VALUES ('', '".$name."', '".$score."')") or die("Не удалось выполнить запрос ".mysqli_error($link));
	}
	echo $name." - ".$score;
	mysqli_close($link);
?>
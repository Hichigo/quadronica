<?php
	include 'connectDB.php';
	$place = trim(htmlspecialchars($_POST['place'] - 1));
	
	$user = mysqli_query($link, "SELECT `name`, `score`, `photo` FROM `users_data` ORDER BY `score` DESC LIMIT $place, 1") or die("Не удалось выполнить запрос ".mysqli_error($link));
	$row = mysqli_fetch_array($user);
	
	echo $row['name'].', '.$row['score'].', '.$row['photo'];

?>
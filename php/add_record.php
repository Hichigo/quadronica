<?php
	include 'connectDB.php';
	
	$name = trim(htmlspecialchars($_POST['name']));
	$score = trim(htmlspecialchars($_POST['score']));
	$photo = trim(htmlspecialchars($_POST['photo']));
	$id = trim(htmlspecialchars($_POST['id']));

	$user = mysqli_query($link, "SELECT * FROM `users_data` WHERE vkid = '$id'") or die("Не удалось выполнить запрос ".mysqli_error($link));

	if(mysqli_num_rows($user)) {
		$row = mysqli_fetch_array($user);
		$name = $row['name'];
		echo $row['score'];
		if($score > $row['score']) {
			mysqli_query($link, "UPDATE `users_data` SET score = '$score', photo = '$photo' WHERE vkid = '$id'") or die("Не удалось выполнить запрос ".mysqli_error($link));
		}
	} else {
		mysqli_query($link, "INSERT INTO `users_data` (`id`, `vkid`, `name`, `score`, `photo`) VALUES ('', '".$id."', '".$name."', '".$score."', '".$photo."')") or die("Не удалось выполнить запрос ".mysqli_error($link));
	}

	mysqli_close($link);
?>
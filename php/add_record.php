<?php
	include 'connectDB.php';
	
	$name = rand();
	$score = $_POST['score'];
	
	mysqli_query($link, "INSERT INTO `users_data`(`id`, `name`, `score`, `place`) VALUES ('', '$name', '$score', '1')") or die("Не удалось выполнить запрос ".mysqli_error($link));

	$select = mysqli_query($link, "SELECT * FROM `users_data` ORDER BY `score` DESC") or die("Не удалось выполнить запрос ".mysqli_error($link));
	$i = 1;
	$table = '<table border="1">';
	while($row = mysqli_fetch_array($select)) {
		$table .= "<tr><td>".$row['id']."</td><td>".$row['name']."</td><td>".$row['score']."</td><td>".($i++)."</td></tr>";
	}
	$table .= "</table>";
	
	echo $table;
	//	$row = mysqli_fetch_array($result);
	//	mysqli_close($link);
?>
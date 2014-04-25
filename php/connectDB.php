<?php
$link = mysqli_connect("localhost", "root", "", "quadronica") or die("Ошибка ссоединения с бд ".mysqli_error($link));
	$result = mysqli_query($link, "SELECT * FROM `user_data`") or die("Не удалось выполнить запрос ".mysqli_error($link));
	$row = mysqli_fetch_array($result);
	mysqli_close($link);


?>
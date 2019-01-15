<?php
	require('lib.php');

	$con = new DBConector('localhost', 'nextu_proyects', '12345');

	if($con->initConnection('nextu') == 'OK'){
		session_start();
		$data['fk_email'] = $_SESSION['user'];
		$data['title'] = $_POST['titulo'];
		$data['dateStart'] = $_POST['start_date'];
		$data['timeStart'] = $_POST['start_hour'];
		$data['dateEnd'] = $_POST['end_date'];
		$data['timeEnd'] = $_POST['end_hour'];
		$data['fullDay'] = ($_POST['allDay'] == 'true') ? 1 : 0;

		if($data['dateStart'] == ''){
			$response['msg'] = 'ERROR: Falta la fecha de inicio';
		}else if($data['title'] == ''){
			$response['msg'] = 'ERROR: Falta el titulo del evento';
		}else{
			if($con->insertData('events', $data)){
				$response['msg'] = 'OK';
			}else{
				$response['msg'] = 'No se pudo registrar el evento';
			}
		}
	}else{
		$response['msg'] = 'Ocurrio un error en la conexión con la base de datos';
	}
	$con->closeConnection();
	echo json_encode($response);
?>
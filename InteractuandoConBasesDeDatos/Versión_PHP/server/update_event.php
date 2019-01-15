<?php
	require('lib.php');

	$con = new DBConector('localhost', 'nextu_proyects', '12345');

	if($con->initConnection('nextu') == 'OK'){
		$data['dateStart'] = $_POST['start_date'];
		$data['timeStart'] = $_POST['start_hour'];
		$data['dateEnd'] = $_POST['end_date'];
		$data['timeEnd'] = $_POST['end_hour'];

		if($con->updateData('events', $data, 'pk_id='.$_POST['id'])){
			$response['msg'] = 'OK';
		}else{
			$response['msg'] = 'No se pudo actualizar el evento';
		}
	}else{
		$response['msg'] = 'Ocurrio un error en la conexión con la base de datos';
	}
	$con->closeConnection();
	echo json_encode($response);
?>
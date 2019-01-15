<?php
	require('lib.php');

	$con = new DBConector('localhost', 'nextu_proyects', '12345');

	if($con->initConnection('nextu') == 'OK'){
		if($con->deleteData('events', 'pk_id='.$_POST['id'])){
			$response['msg'] = 'OK';
		}else{
			$response['msg'] = 'No se pudo borrar el evento';
		}
	}else{
		$response['msg'] = 'Ocurrio un error en la conexión con la base de datos';
	}
	$con->closeConnection();
	echo json_encode($response);
?>
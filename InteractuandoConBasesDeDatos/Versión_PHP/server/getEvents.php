<?php
	require('lib.php');

	$con = new DBConector('localhost', 'nextu_proyects', '12345');

	if($con->initConnection('nextu') == 'OK'){
		session_start();
		if($result = $con->consult(['*'], ['events'], 'WHERE fk_email=\''.$_SESSION['user'].'\'')){
			$response = array();
			$response['msg'] = 'OK';
			$events = array();
			while($row = $result->fetch_assoc()){
				$event['id'] = $row['pk_id'];
				$event['title'] = $row['title'];
				$event['start'] = $row['timeStart'] ? $row['dateStart'].'T'.$row['timeStart'] : $row['dateStart'];
				$event['end'] = ($row['timeEnd'] && $row['timeEnd'] != '0000-00-00') ? $row['dateEnd'].'T'.$row['timeEnd'] : '';
				$event['allDay'] = $row['fullDay'] ? true : false;
				array_push($events, $event);
			}
			$response['eventos'] = $events;
		}else{
			$response['msg'] = 'No se pudo realizar la consulta';
		}
	}else{
		$response['msg'] = 'Ocurrio un error en la conexión con la base de datos';
	}
	$con->closeConnection();
	echo json_encode($response);
?>
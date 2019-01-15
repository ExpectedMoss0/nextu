<?php
	require('lib.php');

	if(isset($_POST['username']) && isset($_POST['password'])){
		$con = new DBConector('localhost', 'nextu_proyects', '12345');

		if($con->initConnection('nextu') == 'OK'){
			if($result = $con->consult(['*'], ['users'], 'WHERE pk_email=\''.$_POST['username'].'\'')){
				if($result->num_rows != 0){
					$row = $result->fetch_assoc();
					$pass = password_verify($_POST['password'], $row['password']);

					if($_POST['password'] == $pass){
						session_start();
						$_SESSION['user'] = $_POST['username'];
						$response['msg'] = 'OK';
					}else{
						$response['msg'] = 'La contraseña es erronea';
					}
				}else{
					$response['msg'] = 'No se encontro el usuario';
				}
			}else{
				$row = $result->fetch_assoc;
				print_r($row);
				$response['msg'] = 'No se pudo realizar la consulta';
			}
		}else{
			echo 'Ocurrio un error en la conexión con la base de datos';
		}
		$con->closeConnection();
		echo json_encode($response);
	}
?>
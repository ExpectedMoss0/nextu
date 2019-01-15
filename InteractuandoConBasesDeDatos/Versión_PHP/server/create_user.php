<?php
	require('lib.php');

	$con = new DBConector('localhost', 'nextu_proyects', '12345');

	if($con->initConnection('nextu') == 'OK'){
		$data['pk_email'] = 'alecsis@gmail.com';
		$data['fullName'] = 'Alecs Sin-T';
		$data['password'] = password_hash('12345', PASSWORD_DEFAULT);
		$data['birthdate'] = '1975/07/13';
		
		if($con->insertData('users', $data)){
			echo 'Registro de usuario exitoso';
		}else{
			echo 'No se pudo registrar el usuario';
		}
	}else{
		echo 'Ocurrio un error en la conexión con la base de datos';
	}
?>
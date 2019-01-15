<?php
	class DBConector{
		private $host, $user, $password, $ctdb;

		function __construct($host, $user, $password){
			$this->host = $host;
			$this->user = $user;
			$this->password = $password;
		}

		function initConnection($dbName){
			// CTDB = Connection To Data-Base
			$this->ctdb = new mysqli($this->host, $this->user, $this->password, $dbName);

			if($this->ctdb->connect_error){
				return "ERROR: ".$this->ctdb->connect_error;
			}else{
				return "OK";
			}
		}
		function closeConnection(){
			$this->ctdb->close();
		}
		function executeQuery($query){
			return $this->ctdb->query($query);
		}

		// it = If true; if = If false
		function loop($data, $sql, $concat, $it_string, $if_string, $concatWithComma = true){
			$lastKey = array_keys($data);
			$lastKey = end($lastKey);

			foreach($data as $key => $value){
				if($concat == 'concat_key'){
					$sql .= $key;
				}else if($concat == 'concat_value'){
					if($concatWithComma){
						$sql .= "'".$value."'";
					}else{
						$sql .= $value;
					}
				}else if($concat == 'concat_key&value'){
					$sql .= $key.'=\''.$value.'\'';
				}
				if($key != $lastKey){
					$sql .= $it_string;
				}else $sql .= $if_string;
			}
			return $sql;
		}
		function consult($fields, $tables, $condition = '', $preCondition = ''){
			$sql = 'SELECT ';

			if($preCondition){
				$sql .= $preCondition.' ';
			}

			$sql = $this->loop($fields, $sql, 'concat_value', ', ', ' FROM ', false);
			$sql = $this->loop($tables, $sql, 'concat_value', ', ', '', false);

			if($condition){
				$sql .= ' '.$condition.';';
			}else{
				$sql .= ';';
			}

			//echo $sql.'<br>';
			return $this->executeQuery($sql);
		}
		function updateData($table, $data, $condition){
			$sql = 'UPDATE '.$table.' SET ';
			$sql = $this->loop($data, $sql, 'concat_key&value', ', ', ' WHERE ');
			$sql .= $condition.';';
			//echo $sql.'<br>';
			return $this->executeQuery($sql);
		}
		function insertData($table, $data){
			$sql = 'INSERT INTO '.$table.' (';
			$sql = $this->loop($data, $sql, 'concat_key', ', ', ')');
			$sql .= ' VALUES (';
			$sql = $this->loop($data, $sql, 'concat_value', ', ', ');');
			//echo $sql.'<br>';
			return $this->executeQuery($sql);
		}
		function deleteData($table, $condition){
			$sql = 'DELETE FROM '.$table.' WHERE '.$condition.';';
			//echo $sql.'<br>';
			return $this->executeQuery($sql);
		}
	}
?>
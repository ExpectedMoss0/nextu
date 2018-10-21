var $DOM = [], $data = [];

var calculadora = {
	suma: function(a, b){
		return a + b;
	},
	resta: function(a, b){
		return a - b;
	},
	multiplica: function(a, b){
		return a * b;
	},
	divide: function(a, b){
		return a / b;
	}
}

function checkSave(operator, operacion){
	var numeroPantalla_string = $DOM.pantalla.innerText,
		numeroPantalla_numero = Number(numeroPantalla_string);

	if(!$data.resultSaved && $data.number1 != ''){
		var resultadoOperacion = operacion($data.number1, numeroPantalla_numero);
		save(resultadoOperacion, 0, operator);
	}else{
		save(numeroPantalla_numero, 0,operator);
		$data.dotOnScreen = false;
	}
	if($data.resultSaved){$data.resultSaved=false;}
	$DOM.pantalla.innerText = '';
}
function save(number1, number2, operator){
	$data.number1 = number1;
	$data.number2 = number2;
	$data.lastOperator = operator;
}
function processValueOrOperator(domElem){
	switch(domElem.id){
		case 'on':
			$DOM.pantalla.innerText = '0';
			$data.number1 = 0;
			$data.number2 = 0;
			$data.lastOperator = '';
			$data.resultSaved = false;
			$data.dotOnScreen = false;
			break;
		case 'punto':
			var numeroPantalla_string = $DOM.pantalla.innerText;
			if(!$data.dotOnScreen && numeroPantalla_string.length < 7){
				$DOM.pantalla.innerText += '.';
				$data.dotOnScreen = true;
			}
			break;
		case 'sign':
			var screenVal = $DOM.pantalla.innerText;
			if(screenVal.substr(0,1) != '-' && screenVal != '0'){
				$DOM.pantalla.innerText = '-' + $DOM.pantalla.innerText;
			}else if(screenVal != '0'){
				$DOM.pantalla.innerText = screenVal.slice(1, screenVal.length);
			}
			break;
		case 'mas':
			checkSave('+', calculadora.suma);
			break;
		case 'menos':
			checkSave('-', calculadora.resta);
			break;
		case 'por':
			checkSave('*', calculadora.multiplica);
			break;
		case 'dividido':
			checkSave('/', calculadora.divide);
			break;
		case 'igual':
			var numeroPantalla_string = $DOM.pantalla.innerText,
				numeroPantalla_numero = Number(numeroPantalla_string),
				resultadoOperacion = 0;

			if(!$data.resultSaved){
				$data.number2 = numeroPantalla_numero;
				$data.resultSaved = true;
			}
			if($data.number1 != '' && $data.number2 != '' || $data.number2 != 0){
				switch($data.lastOperator){
					case '+':
						resultadoOperacion = calculadora.suma($data.number1, $data.number2);
						break;
					case '-':
						resultadoOperacion = calculadora.resta($data.number1, $data.number2);
						break;
					case '*':
						resultadoOperacion = calculadora.multiplica($data.number1, $data.number2);
						break;
					case '/':
						resultadoOperacion = calculadora.divide($data.number1, $data.number2);
						break;
				}
				save(resultadoOperacion, $data.number2, $data.lastOperator);
			}
			if(resultadoOperacion > 7){
				resultadoOperacion = resultadoOperacion.toString();
				$DOM.pantalla.innerText = resultadoOperacion.substr(0,8);
			}else{
				$DOM.pantalla.innerText = resultadoOperacion;
			}
			break;
		case '0':
			printNumber(0);
			break;
		case '1':
			printNumber(1);
			break;
		case '2':
			printNumber(2);
			break;
		case '3':
			printNumber(3);
			break;
		case '4':
			printNumber(4);
			break;
		case '5':
			printNumber(5);
			break;
		case '6':
			printNumber(6);
			break;
		case '7':
			printNumber(7);
			break;
		case '8':
			printNumber(8);
			break;
		case '9':
			printNumber(9);
			break;
	}
}
function printNumber(number){
	var numeroPantalla_string = $DOM.pantalla.innerText,
		numeroPantalla_numero = Number(numeroPantalla_string);

	if(numeroPantalla_numero == 0 && number == 0){
		console.log('No se pueden agregar ceros');
	}else if(numeroPantalla_numero == 0 && numeroPantalla_string.length == 1){
		$DOM.pantalla.innerText = number;
	}else if(numeroPantalla_string.length < 8){
		$DOM.pantalla.innerText += number;
	}
}

function init(){
	$data.number1 = 0;
	$data.number2 = 0;
	$data.lastOperator = '';
	$data.resultSaved = false;
	$data.dotOnScreen = false;

	$DOM.pantalla = document.getElementById('display');
	$DOM.teclas = document.getElementsByClassName('tecla');

	for(var i = 0, j = $DOM.teclas.length; i < j; i++){
		$DOM.teclas[i].addEventListener('mousedown', function(){
			this.style.transform = 'scale(0.9, 0.9)';
		});
		$DOM.teclas[i].addEventListener('mouseup', function(){
			this.style.transform = 'scale(1, 1)';
			processValueOrOperator(this);
		});
		$DOM.teclas[i].addEventListener('mouseout', function(){
			this.style.transform = 'scale(1, 1)';
		});
	}
}

window.onload = init;
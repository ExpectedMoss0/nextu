var $DATA = [];

$DATA.titleColorChanged = false;
$DATA.paneHeight = 0;
$DATA.candyHeight = 0;
$DATA.spaceBetweenCandys = 0;
$DATA.chAndspc = 0;
$DATA.timer = false;

// Establece una función de clonado de array (trabajar con distintas referencias)
Array.prototype.clone = function(){
	var length = this.length, arrClone = [];
	for(var i = 0; i < length; i++){
		arrClone.push(this[i].slice(0));
	}
	return arrClone;
};

// Timer helper
function formatTime(time){
	var minutes = ~~(time / 60),
		seconds = time - minutes * 60;

	minutes = minutes < 10 ? '0'+minutes : minutes;
	seconds = seconds < 10 ? '0'+seconds : seconds;

	return minutes + ':' + seconds;
}

function initGlobalData(){
	$DATA.timeRemaining = 120;
	$DATA.points = 0;
	$DATA.movements = 0;
	$DATA.dir_initialPosition = 0;
	$DATA.dir_top = false;
	$DATA.dir_left = false;
	$DATA.candyIdControl = 1;
	$DATA.candyProcess_lastWorked = 0;
	$DATA.candyProcess_repeatedCounter = 1;
	$DATA.candysToRemove = [];
	$DATA.dc_initialParent;
}
// Inicia un array bidimensional para los dulces
function initClearArray(){
	$DATA.candys = [];
	for(var i = 0; i < 7; i++){
		$DATA.candys[i] = new Array(7);
	}
}

function insertAtIndex(controller, elem, index){
	if(index === 0){
		$("." + controller).prepend(elem);
		return;
	}

	$("." + controller + " > div:nth-child(" + (index) + ")").after(elem);
}
function onDragStart(event, ui){
	var helper = ui.helper;
	helper.css("z-index", "1000");
	helper.addClass('dragging');

	// Salva el padre del cual comenzo a moverse el dulce
	$DATA.dc_initialParent = $(this).parent();

	var position = {"top": ui.position.top, "left": ui.position.left};
	$DATA.dir_initialPosition = position;
}
function onDragStop(event, ui){
	var helper = ui.helper;
	helper.css("z-index", "auto");
	helper.removeClass('dragging');
}
function onDrag(event, ui){
	var leftPosition = ui.position.left,
		topPosition = ui.position.top;

	if(leftPosition != $DATA.dir_initialPosition.left && !$DATA.dir_top){
		$DATA.dir_left = true;
		ui.position.top = $DATA.dir_initialPosition.top;
	}else{$DATA.dir_left = false;}
	if(topPosition != $DATA.dir_initialPosition.top && !$DATA.dir_left){
		$DATA.dir_top = true;
		ui.position.left = $DATA.dir_initialPosition.left;
	}else{$DATA.dir_top = false;}

	// Limita un espacio a la derecha
	if(leftPosition > $DATA.chAndspc+$DATA.dir_initialPosition.left && !$DATA.dir_top){
		ui.position.left = $DATA.chAndspc+$DATA.dir_initialPosition.left;
	}
	// Limita un espacio a la izquierda
	if(leftPosition < (0 - $DATA.chAndspc)+$DATA.dir_initialPosition.left && !$DATA.dir_top){
		ui.position.left = (0 - $DATA.chAndspc)+$DATA.dir_initialPosition.left;
	}
	// Limita a un espacio arriba
	if(topPosition < (0 - $DATA.candyHeight)+$DATA.dir_initialPosition.top && !$DATA.dir_left){
		ui.position.top = (0 - $DATA.candyHeight)+$DATA.dir_initialPosition.top;
	}
	// Limita a un espacio abajo
	if(topPosition > $DATA.candyHeight+$DATA.dir_initialPosition.top && !$DATA.dir_left){
		ui.position.top = $DATA.candyHeight+$DATA.dir_initialPosition.top;
	}
}
function onDrop(event, ui){
	// Deshabilita el arrastrado de dulces mientras se verifica este movimiento
	$("#play").attr("disabled", true);
	$(".candy").draggable("option", "disabled", true);
	$(".candy").addClass('drag-disabled');
	$(".panel-tablero").addClass("checking");

	// sc = static candy && dc = draggable candy
	var sc_id = $(this).attr('id'),
		sc_childIndex = $(this).index(),
		dc_id = ui.draggable.attr('id'),
		dc_childIndex = ui.draggable.index(),
		sc_dataLocation = document.getElementById(sc_id).getAttribute('data-location').split(","),
		dc_dataLocation = document.getElementById(dc_id).getAttribute('data-location').split(",");

	// Clona el array de dulces para testear los cambios
	var candysTMP = $DATA.candys.clone(),
		candysCloned = $DATA.candys.clone(),
		staticCandy = candysCloned[sc_dataLocation[0]][sc_dataLocation[1]],
		draggableCandy = candysCloned[dc_dataLocation[0]][dc_dataLocation[1]];

	// Aplica los cambios de posición
	candysCloned[sc_dataLocation[0]][sc_dataLocation[1]] = draggableCandy;
	candysCloned[dc_dataLocation[0]][dc_dataLocation[1]] = staticCandy;

	// Guarda el array clonado con cambios como principal
	$DATA.candys = [];
	$DATA.candys = candysCloned;

	// Mueve el dulce estatico y reemplaza la posición del dulce movido
	var sc_c = $(this).parent().attr("class"),
		dc_c = $DATA.dc_initialParent.attr("class");
	$(this).detach();
	insertAtIndex(dc_c, $(this), dc_childIndex);
	ui.draggable.detach();
	insertAtIndex(sc_c, ui.draggable, sc_childIndex);
	ui.draggable.css({'top':'','left':''});

	if(!game.checkCandyBoard(true)){
		console.log('No se encontraron lineas de dulces');

		// Revierte los cambios de posición de dulces en el tablero
		$DATA.candys = candysTMP;
		$(this).detach();
		insertAtIndex(sc_c, $(this), sc_childIndex);
		ui.draggable.detach();
		insertAtIndex(dc_c, ui.draggable, dc_childIndex);

		// Una vez terminado el proceso de evaluación habilita el drag & drop nuevamente
		$("#play").attr("disabled", false);
		$(".candy").draggable("option", "disabled", false);
		$(".candy").removeClass('drag-disabled');
		$(".panel-tablero").removeClass("checking");
	}else{
		$DATA.movements++;
		$("#movimientos-text").text($DATA.movements);
	}
}

var game = {
	generateCandy: function(){
		var candyData = [],
			random = ~~((Math.random() * 4) + 1);

		switch(random){
			case 1:
				candyData.type = 1;
				candyData.src = 'image/1.png';
				break;
			case 2:
				candyData.type = 2;
				candyData.src = 'image/2.png';
				break;
			case 3:
				candyData.type = 3;
				candyData.src = 'image/3.png';
				break;
			case 4:
				candyData.type = 4;
				candyData.src = 'image/4.png';
				break;
		}

		candyData.id = $DATA.candyIdControl;

		$DATA.candyIdControl++;

		return candyData;
	},
	validateCandy: function(candy, msg){
		candy.replace = false;
		if(candy.type != $DATA.candyProcess_lastWorked){
			$DATA.candyProcess_repeatedCounter = 1;
		}else if(candy.type == $DATA.candyProcess_lastWorked && $DATA.candyProcess_repeatedCounter < 2){
			//console.log(msg, 'Se encontro generado un duplicado en segunda ocasión');
			$DATA.candyProcess_repeatedCounter++;
		}else if(candy.type == $DATA.candyProcess_lastWorked && $DATA.candyProcess_repeatedCounter >= 2){
			//console.log(msg, 'Se encontro generado un duplicado en tercera ocasión', candy.id);
			while($DATA.candyProcess_repeatedCounter >= 2){
				if(candy.type != $DATA.candyProcess_lastWorked){
					//console.log('Nuevo dulce encontrado');
					candy.replace = true;
					$DATA.candyProcess_repeatedCounter = 1;
				}else{
					//console.log('Buscar un nuevo dulce');
					candy = this.generateCandy();
				}
			}
		}
		$DATA.candyProcess_lastWorked = candy.type;

		return candy;
	},
	checkCandyCol: function(){
		console.log('Revisar columna');
		// Variables de proceso
		var counter = 1,
			lastCandyTypeChecked = 0;

		// Revisa si coinciden minimo tres dulces en linea
		for(var i = 0; i < 7; i++){
			for(var j = 0; j < 7; j++){
				counter = $DATA.candys[i][j].type == lastCandyTypeChecked ? counter+1 : 1;
				if(counter == 3){
					//console.log('(Columna) Se encontro una linea de tres dulces');
					// Almacena los dulces que seran removidos
					var c = $DATA.candys[i][j-2];c.location = i+','+(j-2);$DATA.candysToRemove.push(c);
					var c = $DATA.candys[i][j-1];c.location = i+','+(j-1);$DATA.candysToRemove.push(c);
					var c = $DATA.candys[i][j];c.location = i+','+j;$DATA.candysToRemove.push(c);
				}
				if(counter > 3){
					//console.log('(Columna) Wow, una gran linea de',counter);
					var c = $DATA.candys[i][j];c.location = i+','+j;$DATA.candysToRemove.push(c);
				}
				lastCandyTypeChecked = $DATA.candys[i][j].type;
			}
			counter = 1;
			lastCandyTypeChecked = 0;
		}
		return $DATA.candysToRemove.length > 0 ? true : false;
	},
	checkCandyRow: function(){
		console.log('Revisar fila');
		// Variables de proceso
		var counter = 1,
			lastCandyTypeChecked = 0;

		// Revisa si coinciden minimo tres dulces en linea
		for(var i = 0; i < 7; i++){
			for(var j = 0; j < 7; j++){
				counter = $DATA.candys[j][i].type == lastCandyTypeChecked ? counter+1 : 1;
				if(counter == 3){
					//console.log('(Fila) Se encontro una linea de tres dulces');
					// Almacena los dulces que seran removidos (Verifica si alguno se repite)

					var repeatedId = '';
					for(var k = 0, l = $DATA.candysToRemove.length; k < l; k++){ //j = 0; k = 4
						var m = 2;
						while(m > -1){
							if($DATA.candys[j - m][i].id == $DATA.candysToRemove[k].id){
								repeatedId = $DATA.candysToRemove[k].id;
								m = 0;
								k = l;
							}
							m--;
						}
					}
					if($DATA.candys[j-2][i].id != repeatedId){var c = $DATA.candys[j-2][i];c.location = j-2+','+i;$DATA.candysToRemove.push(c)}
					if($DATA.candys[j-1][i].id != repeatedId){var c = $DATA.candys[j-1][i];c.location = j-1+','+i;$DATA.candysToRemove.push(c)}
					if($DATA.candys[j][i].id != repeatedId){var c = $DATA.candys[j][i];c.location = j+','+i;$DATA.candysToRemove.push(c)}
				}
				if(counter > 3){
					if($DATA.candys[j][i].id != repeatedId){var c = $DATA.candys[j][i];c.location = j+','+i;$DATA.candysToRemove.push(c)}
				}
				lastCandyTypeChecked = $DATA.candys[j][i].type;
			}
			counter = 1;
			lastCandyTypeChecked = 0;
		}
		return $DATA.candysToRemove.length > 0 ? true : false;
	},
	refillCandys: function(colsToRefill){
		console.log(colsToRefill);
		for(var i = 0, j = colsToRefill.length; i < j; i++){
			var candysCol = $DATA.candys[colsToRefill[i]];
			while(candysCol.length < 7){
				var candy = this.generateCandy();
				candysCol.unshift(candy);
				var img = document.createElement('div');
				img.classList+='candy';
				img.id = 'candy_' + candy.id;
				img.style.width = $DATA.candyHeight + 'px';
				img.style.height = $DATA.candyHeight + 'px';
				img.style.backgroundImage = 'url(\'' + candy.src + '\')';
				$('.panel-tablero').children().eq(colsToRefill[i]).prepend(img);

				// Habilita drag & drop
				$(img).draggable({
					start: onDragStart,
					stop: onDragStop,
					drag: onDrag,
					grid: [$DATA.chAndspc, $DATA.candyHeight],
					containment: $(".panel-tablero")
				});
				$(img).droppable({
					drop: onDrop
				});
			}
		}

		// Update data location on DOM
		for(var i = 0; i < 7; i++){
			for(var j = 0; j < 7; j++){
				document.getElementsByClassName('panel-tablero')[0].children[i].children[j].setAttribute('data-location', i+','+j);
				//$('.panel-tablero').children().eq(i).children().eq(j).setAttribute('data-location', i+','+j);
			}
		}

		// Vuelve a evaluar la tabla en busqueda de coincidencias
		if(colsToRefill.length > 0){
			this.checkCandyBoard();
		}else{
			$DATA.candysToRemove = [];

			// Una vez terminado el proceso de evaluación habilita el drag & drop nuevamente
			$("#play").attr("disabled", false);
			$(".candy").draggable("option", "disabled", false);
			$(".candy").removeClass('drag-disabled');
			$(".panel-tablero").removeClass("checking");
		}
	},
	destroyCandys: function(){
		// Elimina los dulces del DOM y Array
		var colsToRefill = [];
		for(var i = 0, j = $DATA.candysToRemove.length; i < j; i++){
			$('#candy_'+$DATA.candysToRemove[i].id).addClass('blink').delay(2000).promise().done(function(){
				$(this).remove();
			});

			var location = $DATA.candysToRemove[i].location.split(",");

			// Obten la columna de la cual se va a borrar un dulce
			var candysCol = $DATA.candys[location[0]];

			for(var k = 0, l = candysCol.length; k < l; k++){
				if(candysCol[k].id == $DATA.candysToRemove[i].id){
					$DATA.points = $DATA.points + 10;
					$DATA.candys[location[0]].splice(k, 1);
					colsToRefill.push(location[0]);
					k = l;
				}
			}

			$("#score-text").text($DATA.points);
		}
		setTimeout(function(){
			game.refillCandys(colsToRefill);
		}, 2000);
	},
	checkCandyBoard: function(feedback){
		var colLine = this.checkCandyCol(),
			rowLine = this.checkCandyRow(),
			candysFound = false;

		if(colLine || rowLine){
			candysFound = true;
			this.destroyCandys();
		}

		if(feedback){
			return candysFound;
		}
	},
	init: function(){
		if($DATA.timer){clearInterval($DATA.timer);}

		initGlobalData();
		initClearArray();

		$(".panel-tablero").css({'width':'', 'height': '', 'opacity': ''});
		$(".panel-score").css({'width':''});
		$("#gameover").hide();
		$(".time").show();

		$("#score-text").text(0);
		$("#movimientos-text").text(0);
		$("#timer").text("02:00");

		// Vacia la tabla si ya esta llena de dulces
		for(var i = 0; i < 7; i++){
			$(".panel-tablero").children().eq(i).empty();
		}

		/* ------------ Genera la tabla de dulces ------------ */
		// Primero genera y valida las columnas
		function validateCandyCol(that,justValidate){
			for(var i = 0; i < 7; i++){
				for(var j = 0; j < 7; j++){
					if(justValidate){
						var candy = $DATA.candys[i][j];
					}else{
						var candy = that.generateCandy();
					}
					candy = that.validateCandy(candy,'(Columna e index: ['+i+']['+j+'])');
					//candy.candyDOM.setAttribute('data-type', candy.type);

					if(candy.replace || !justValidate){
						//console.log('Configurando el dulce en columna...');
						$DATA.candys[i][j] = candy;
					}
				}
			}
		}
		function validateCandyRow(that){
			for(var i = 0; i < 7; i++){
				for(var j = 0; j < 7; j++){
					var candy = $DATA.candys[j][i];
						candy = that.validateCandy(candy,'(Fila e index: ['+j+']['+i+'])');

					if(candy.replace){
						//console.log('Reemplazando el dulce en fila...');
						$DATA.candys[j][i] = candy;
					}
				}
			}
		}

		// Despues con las columnas ya generadas valida las filas
		//console.log('Se verifica en primera ocasión -------------------------');
		validateCandyCol(this, false);
		validateCandyRow(this);

		//console.log('Se verifica en segunda ocasión -------------------------');
		$DATA.candyProcess_lastWorked = 0;
		validateCandyCol(this, true);
		validateCandyRow(this);

		// Imprime la tabla generada
		$.each($DATA.candys ,function(index, value){
			$.each(value, function(secondIndexLevel, value){
				var img = document.createElement('div');
				img.classList+='candy';
				img.id = 'candy_' + value.id;
				img.setAttribute('data-location', index + ',' + secondIndexLevel);
				img.style.width = $DATA.candyHeight + 'px';
				img.style.height = $DATA.candyHeight + 'px';
				img.style.backgroundImage = 'url(\'' + value.src + '\')';
				$(".panel-tablero").children().eq(index).append(img);
			});
		});

		// Habilita drag & drop
		$(".candy").draggable({
			start: onDragStart,
			stop: onDragStop,
			drag: onDrag,
			grid: [$DATA.chAndspc, $DATA.candyHeight],
			containment: $(".panel-tablero")
		});
		$(".candy").droppable({
			drop: onDrop
		});

		// Inicia el contador
		$DATA.timer = setInterval(function(){
			$DATA.timeRemaining--;
			var time = formatTime($DATA.timeRemaining);
			$("#timer").text(time);

			if($DATA.timeRemaining <= 0){
				// Se agoto el tiempo, desactiva el juego
				clearInterval($DATA.timer);
				$DATA.timer = false;

				$(".candy").draggable("option", "disabled", true);
				$(".candy").addClass('drag-disabled');
				$(".panel-tablero").animate({
					width: 0,
					height: 0,
					opacity: 0
				}, 1500);
				$(".panel-score").animate({
					width: '100%'
				}, 1500, function(){
					$("#gameover").show();
				});
				$(".time").slideUp(1500);
			}
		}, 1000);
		// Establece movimientos y puntuación en cero
	}
}

$(window).ready(function(){
	setInterval(function(){
		if($DATA.titleColorChanged){
			$(".main-titulo").css("color", "#DCFF0E");
			$DATA.titleColorChanged = false;
		}else{
			$(".main-titulo").css("color", "#FFFFFF");
			$DATA.titleColorChanged = true;
		}
	}, 1000);

	$DATA.paneHeight = $(".panel-tablero").height();
	$DATA.candyHeight = $DATA.paneHeight / 7;
	$DATA.spaceBetweenCandys = ($(".panel-tablero").width() - ($DATA.candyHeight * 7)) / 7;
	$DATA.chAndspc = $DATA.candyHeight + $DATA.spaceBetweenCandys;

	$("#play").click(function(){
		$(this).text("Reiniciar");
		game.init();
	});
});
$(window).resize(function(){
	$DATA.spaceBetweenCandys = ($(".panel-tablero").width() - ($DATA.candyHeight * 7)) / 7;
	$DATA.chAndspc = $DATA.candyHeight + $DATA.spaceBetweenCandys;
	$(".candy").draggable( "option", "grid", [$DATA.chAndspc, $DATA.candyHeight]);
});
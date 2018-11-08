var $DATA = [];

$DATA.titleColorChanged = false;
$DATA.paneHeight = 0;
$DATA.candyHeight = 0;
$DATA.spaceBetweenCandys = 0;
$DATA.chAndspc = 0;
$DATA.dir_initialPosition = 0;
$DATA.dir_top = false;
$DATA.dir_left = false;
$DATA.candyIdControl = 1;
$DATA.candyProcess_lastWorked = 0;
$DATA.candyProcess_repeatedCounter = 1;
$DATA.candysToRemove = [];
$DATA.dc_initialColIndex = 0;

// Establece una función de clonado de array (trabajar con distintas referencias)
Array.prototype.clone = function(){
	return this.slice(0);
};

// Inicia un array bidimensional para los dulces
(function(){
	$DATA.candys = [];
	for(var i = 0; i < 7; i++){
		$DATA.candys[i] = new Array(7);
	}
})();

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
	checkCandyCol: function(sc_id, dc_id, sc_childIndex, dc_childIndex, dc_initialColIndex){
		console.log('Revisar columna');
		// Variables de proceso
		var counter = 1,
			lastCandyTypeChecked = 0;

		// Crea una copia de la columna de dulces para testear el movimiento
		var sc_colIndex = $('#'+sc_id).parent().index(),
			candysCol = $DATA.candys[sc_colIndex].clone(),
			dc_dataLocation = document.getElementById(dc_id).getAttribute('data-location').split(",");

		// Revisa si es necesario intercambiar los valores de los dulces en la columna
		if($DATA.dir_top){
			//console.log('El dezplazamiento fue vertical, es necesario intercambiar posiciones');
			var sc_dataLocation = document.getElementById(sc_id).getAttribute('data-location').split(",");

			// Reemplaza la información en la columna
			candysCol[sc_childIndex] = $DATA.candys[dc_dataLocation[0]][dc_dataLocation[1]];
			candysCol[dc_childIndex] = $DATA.candys[sc_dataLocation[0]][sc_dataLocation[1]];
		}else{
			//console.log('El dezplazamiento fue horizontal');
			candysCol[sc_childIndex] = $DATA.candys[dc_dataLocation[0]][dc_dataLocation[1]];
		}

		// Una vez lista la columna, revisa si coinciden minimo tres dulces en linea
		for(var i = 0; i < 7; i++){
			counter = candysCol[i].type == lastCandyTypeChecked ? counter+1 : 1;
			if(counter == 3){
				//console.log('(Columna) Se encontro una linea de tres dulces');
				// Almacena los dulces que seran removidos
				$DATA.candysToRemove.push(candysCol[i-2]);
				$DATA.candysToRemove.push(candysCol[i-1]);
				$DATA.candysToRemove.push(candysCol[i]);
			}
			if(counter > 3){
				//console.log('(Columna) Wow, una gran linea de',counter);
				$DATA.candysToRemove.push(candysCol[i]);
			}
			lastCandyTypeChecked = candysCol[i].type;
		}
		console.log($DATA.candysToRemove);
	},
	checkCandyRow: function(sc_id, dc_id, sc_childIndex, dc_childIndex, dc_initialColIndex){
		console.log('Revisar fila');
		// Variables de proceso
		var counter = 1,
			lastCandyTypeChecked = 0;

		// Crea una copia de la fila de dulces para testear el movimiento
		var sc_colIndex = $('#'+sc_id).parent().index(),
			dc_dataLocation = document.getElementById(dc_id).getAttribute('data-location').split(","),
			candysRow = [];
		for(var i = 0; i < 7; i++){
			var clonedCandysCol = $DATA.candys[i].clone();
			candysRow.push(clonedCandysCol[sc_childIndex]);
		}

		// Revisa si es necesario intercambiar los valores de los dulces en la fila
		if($DATA.dir_left){
			//console.log('El dezplazamiento fue horizontal, es necesario intercambiar posiciones');
			var sc_dataLocation = document.getElementById(sc_id).getAttribute('data-location').split(",");

			// Reemplaza la información en la fila
			candysRow[sc_colIndex] = $DATA.candys[dc_dataLocation[0]][dc_dataLocation[1]];
			candysRow[dc_initialColIndex] = $DATA.candys[sc_dataLocation[0]][sc_dataLocation[1]];
		}else{
			//console.log('El dezplazamiento fue vertical');
			candysRow[sc_colIndex] = $DATA.candys[dc_dataLocation[0]][dc_dataLocation[1]];
		}

		// Una vez lista la fila, revisa si coinciden minimo tres dulces en linea
		for(var i = 0; i < 7; i++){
			counter = candysRow[i].type == lastCandyTypeChecked ? counter+1 : 1;
			if(counter == 3){
				//console.log('(Fila) Se encontro una linea de tres dulces');
				// Almacena los dulces que seran removidos (Verifica si alguno se repite)
				var repeatedId = '';
				for(var j = 0, k = $DATA.candysToRemove.length; j < k; j++){ //j = 0; k = 4
					var l = 2;
					while(l > -1){
						if(candysRow[i - l].id == $DATA.candysToRemove[j].id){
							repeatedId = $DATA.candysToRemove[j].id;
							l = 0;
						}
						l--;
					}
				}
				if(candysRow[i-2].id != repeatedId){$DATA.candysToRemove.push(candysRow[i-2])}
				if(candysRow[i-1].id != repeatedId){$DATA.candysToRemove.push(candysRow[i-1])}
				if(candysRow[i].id != repeatedId){$DATA.candysToRemove.push(candysRow[i])}
			}
			if(counter > 3){
				//console.log('(Fila) Wow, una gran linea de',counter);
				if(candysRow[i].id != repeatedId){$DATA.candysToRemove.push(candysRow[i])}
			}
			lastCandyTypeChecked = candysRow[i].type;
		}
		console.log($DATA.candysToRemove);
	},
	checkCandyBoard: function(){
		
	},
	init: function(){
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

		console.log($DATA.candys);

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
			start: function(event, ui){
				var helper = ui.helper;
				helper.css("z-index", "1000");
				helper.addClass('dragging');

				// Salva la columna de la cual comenzo a moverse el dulce
				$DATA.dc_initialColIndex = $(this).parent().index();

				var position = {"top": ui.position.top, "left": ui.position.left};
				$DATA.dir_initialPosition = position;
			},
			stop: function(event, ui){
				var helper = ui.helper;
				helper.css("z-index", "auto");
				helper.removeClass('dragging');
			},
			drag: function(event, ui){
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
			},
			grid: [$DATA.chAndspc, $DATA.candyHeight],
			containment: $(".panel-tablero")
		});
		$(".candy").droppable({
			drop: function(event, ui){
				// Deshabilita el arrastrado de dulces mientras se verifica este movimiento
				$(".candy").draggable("option", "disabled", true);
				$(".candy").addClass('drag-disabled');

				// sc = static candy && dc = draggable candy
				var sc_id = $(this).attr('id'),
					sc_childIndex = $(this).index(),
					dc_id = ui.draggable.attr('id'),
					dc_childIndex = ui.draggable.index();
					dc_initialColIndex = $DATA.dc_initialColIndex;

				/*console.log('Static candy id: ', sc_id);
				console.log('Draggable candy id: ', dc_id);
				console.log('Static candy child index: ', sc_childIndex);
				console.log('Draggable candy child index: ', dc_childIndex);*/

				game.checkCandyCol(sc_id, dc_id, sc_childIndex, dc_childIndex, dc_initialColIndex);
				game.checkCandyRow(sc_id, dc_id, sc_childIndex, dc_childIndex, dc_initialColIndex);
			}
		});

		// Inicia el contador
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

	game.init();
});
$(window).resize(function(){
	$DATA.spaceBetweenCandys = ($(".panel-tablero").width() - ($DATA.candyHeight * 7)) / 7;
	$DATA.chAndspc = $DATA.candyHeight + $DATA.spaceBetweenCandys;
	$(".candy").draggable( "option", "grid", [$DATA.chAndspc, $DATA.candyHeight]);
});
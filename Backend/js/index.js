$query = function(data){
  $.ajax({
    url: 'buscador.php',
    dataType: 'json',
    processData: false,
    contentType: false,
    data: data,
    type: 'POST',
    success: function(response){
      console.log(response);
      document.getElementById('results').innerHTML = '';
      for(let i = 0, j = response.length; i < j; i++){
        document.getElementById('results').innerHTML+= '<div class="item card"><img src="img/home.jpg" alt="Home"><div class="badge"><b>Dirección: </b>'+response[i].Direccion+'<br><b>Ciudad: </b>'+response[i].Ciudad+'<br><b>Teléfono: </b>'+response[i].Telefono+'<br><b>Código postal: </b>'+response[i].Codigo_Postal+'<br><b>Tipo: </b>'+response[i].Tipo+'<br><b>Precio: </b><span class="precioTexto">'+response[i].Precio+'</span></div></div>';
      }
    },
    error: function(){
      alert('Error en la solicitud AJAX');
    }
  })
}

$(document).ready(function(){
  $('select').material_select();

  $("form").submit(function(e){
    e.preventDefault();

    let data = new FormData(),
      inputs = $('input'),
      i_1 = inputs[0].value !== 'Elige una ciudad' ? inputs[0].value : '',
      i_2 = inputs[1].value !== 'Elige un tipo' ? inputs[1].value : '',
      i_3 = inputs[2].value;

    data.append('showAll', '0');
    data.append('ciudad', i_1);
    data.append('tipo', i_2);
    data.append('precio', i_3);

    $query(data);
  });

  $('#mostrarTodos').click(function(){
    let data = new FormData();
    data.append('showAll', '1');

    $query(data);
  });
});

/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};
/*
  Función que inicializa el elemento Slider
*/

function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}
/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
*/
/*function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}*/

inicializarSlider();
//playVideoOnScroll();
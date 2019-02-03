import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { Response } from '@angular/http';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  
  constructor(private httpService : HttpService) { }

  ngOnInit() {
  	this.httpService.getDatos()
  		.subscribe(
  			(data: Response) => {
  				let products = data['products'];
  				for(let i = 0, j = products.length; i < j; i++){
  					let elem = document.createElement('div'), card = document.createElement('div');
  						elem.className = 'col s12 m4 l3';
  						card.className = 'card';
  						card.style.minHeight = '360px';
  						card.innerHTML = '<div class="card-image"><img src="../img/'+products[i].imgSrc+'"><span class="card-title" style="margin-bottom:-66px;padding:15px;color:#000;">'+products[i].nombre+'</span></div>';
  						card.innerHTML += '<div class="card-content" style="padding:66px 15px 15px;"><p><b>Precio:</b> '+products[i].precio+'<br><b>Unidades disponibles:</b> '+products[i].unidadesDisponibles+'</p></div>';

  					elem.appendChild(card);
  					document.getElementById('products').appendChild(elem);
  					console.log(products[i]);
  				}
  			}
  		);
  }

  /*query(){
  	let val = ((document.getElementById("query") as HTMLInputElement).value);
  	console.log(val);
  }*/

  query = element => { 
  	console.log(element.target.value);
  }
}

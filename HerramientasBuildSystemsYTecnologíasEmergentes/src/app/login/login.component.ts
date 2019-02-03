import { Component } from '@angular/core';
import { HttpService } from './../http.service';
import { Response } from '@angular/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private httpService : HttpService, private router: Router) { }

  login(){
  	let email = ((document.getElementById("email") as HTMLInputElement).value),
  		pass = ((document.getElementById("password") as HTMLInputElement).value);

  	if(email !== '' && pass !== ''){
  		this.checkLogin(email, pass);
  	}
  }

  	checkLogin(email: string, password: string){
  		let usuario = [];
  		usuario['email'] = email;
  		usuario['password'] = password;

  		return this.httpService.getDatos()
  			.subscribe(
  				(data: Response) => {
  					for(let i = 0, j = data['users'].length; i < j; i++){
  						let flag = false;

  						if(usuario['email'] == data['users'][i].email && usuario['password'] == data['users'][i].password){
  							flag = true;
  						}

  						if(flag){
  							this.router.navigate(['/panel'])
  						}else{
  							document.getElementById('errorMsg').innerHTML = 'Error en el acceso, intenta nuevamente';
  						}
  					}
  				}
  			);
  	}
}

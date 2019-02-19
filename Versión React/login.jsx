import React from 'react';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom'

class Login extends React.Component{
	constructor(){
		super()

        // This binding is necessary to make `this` work in the callback
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            redirect: false
        }

        /*const database = firebase.database(),
              ref_users = database.ref('users');

        var q = database.ref().child('test').child('name');

        q.on('value', (snapshot) => {
            console.log(snapshot.val());
        })*/
	}

    renderRedirect(){
        if(this.state.redirect){
            return <Redirect to='panel' />
        }
    }

    handleLogin(e){
        e.preventDefault();
        const database = firebase.database(),
              ref_users = database.ref('users');

        var email = document.getElementById('email').value,
            password = document.getElementById('password').value;

        ref_users.once('value', (snapshot) => {
            const users = snapshot.val();
            let flag = false;

            for(let i = 0, j = users.length; i < j; i++){
                if(email == users[i].email){
                    if(password == users[i].password){
                        flag = true;
                    }else{
                        console.log('Esa no es la contraseña, china tu maye');
                    }
                }
            }

            if(flag){
                this.setState({redirect: true})
            }else{
                document.getElementById('errorMsg').innerText = 'Error vuelve a intentarlo';
            }
        })
    }

    render(){
        return(
            <div>
                {this.renderRedirect()}
                <div id="main">
                    <div className="bg-fix s_centered row">
                        <div className="box col s8 m6 l4 pull-s2 pull-m3 pull-l4">
                            <h5 className="title">Inicia sesión</h5>
                            <form className="col s12 m12">
                                <div className="row input-field col s12 m12 l12">
                                    <label htmlFor="email">Correo electrónico</label>
                                    <input id="email" type="email" className="validate" name="email" required/>
                                </div>
                                <div className="row input-field col s12 m12 l12">
                                    <label htmlFor="password">Contraseña</label>
                                    <input id="password" type="password" className="validate" name="password" required/>
                                </div>
                                <div className="row">
                                    <div id="errorMsg" className="col s12 m12 l12"></div>
                                </div>
                                <div className="btn-area">
                                    <input type="submit" onClick={this.handleLogin} className="waves-effect waves-light btn" value="Ingresar"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
import React from 'react';
import Menu from './menu.jsx';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom'

let shoppingcartProducts, shopProducts, DOMpop;

class Shoppingcart extends React.Component{
	constructor(){
		super()
        this.state = {products: [], total: '', redirect: false}
        this.pay = this.pay.bind(this);
	}
    componentWillMount(){
        shoppingcartProducts = [];
        shopProducts = [];

        // Revisar el carrito
        const ref_shoppingCart = firebase.database().ref('shoppingcart');
        shoppingcartProducts.total = 0;
        ref_shoppingCart.once('value', (snapshot) => {
            snapshot.forEach((product) => {
                shoppingcartProducts.total = shoppingcartProducts.total + product.val().subTotal;
                shoppingcartProducts.push(product);
                this.setState({products: shoppingcartProducts});
            })

            if(shoppingcartProducts.length != 0){
                DOMpop = document.getElementById('pop');
                DOMpop.innerText = shoppingcartProducts.length;
                DOMpop.style.display = 'flex';
            }
        })
    }
    renderRedirect(){
        if(this.state.redirect){
            return <Redirect to='panel' />
        }
    }
    pay(){
        // Vaciar carrito
        firebase.database().ref('shoppingcart').remove();

        // Redireccionar (actualiza estado)
        this.setState({redirect: true})
    }
    render(){
        const shoppingcartList = this.state.products.map((product) =>
            <li key={product.key} className="collection-item avatar">
                <img src={'img/'+product.val().imgSrc} className="circle"/>
                <span className="title">{product.val().nombre}</span>
                <p>
                    <b>Unidades:</b> {product.val().cantidad}<br/>
                    <b>Precio:</b> {product.val().precio}<br/>
                    <b>Subtotal:</b> {product.val().subTotal}
                </p>
            </li>
        );
        return(
            <div>
                {this.renderRedirect()}
                <Menu></Menu>
                <div className="row" style={{marginBottom: '15px'}}>
                    <div className="pane col s12 m10 l8 offset-s0 offset-m1 offset-l2">
                        <div className="row">
                            <h4>Carrito de compras</h4>
                        </div>
                        <div className="row">
                            <div className="col s12 m6 l6">
                                <ul className="collection">
                                    {shoppingcartList}
                                </ul>
                            </div>
                            <div className="col s12 m6 l6">
                                <h5><b>Total:</b> ${shoppingcartProducts.total}</h5>
                                <a onClick={this.pay} className="waves-effect waves-light btn">Cancelar</a>
                                <a onClick={this.pay} className="waves-effect waves-light btn" style={{marginLeft:'10px'}}>Pagar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Shoppingcart;
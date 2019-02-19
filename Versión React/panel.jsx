import React from 'react';
import Menu from './menu.jsx';
import firebase from 'firebase';

let products = [], shoppingcartProducts, DOMpop;

class Panel extends React.Component{
	constructor(){
		super()
        this.state = {products: []}
	}
    componentWillMount(){
        shoppingcartProducts = 0

        // Obtener los productos
        const ref_products = firebase.database().ref('products');
        ref_products.once('value', (snapshot) => {
            const data = snapshot.val();

            this.setState({products: data});
            products = data;
        })
    }
    componentDidMount(){
        DOMpop = document.getElementById('pop');

        // Revisar el carrito
        const ref_shoppingCart = firebase.database().ref('shoppingcart');
        ref_shoppingCart.once('value', (snapshot) => {
            snapshot.forEach(function(product){
                shoppingcartProducts++;
            })

            if(shoppingcartProducts != 0){
                DOMpop.innerText = shoppingcartProducts;
                DOMpop.style.display = 'flex';
            }
        })
    }
    query(){
        let query = document.getElementById('query').value,
            domRef = document.getElementById('products');

        if(query != ''){
            for(let i = 0, j = products.length; i < j; i++){
                let qResult = products[i].nombre.toLowerCase().search(query);

                if(qResult != -1){
                    domRef.children[i].style.display = 'block';
                }else{
                    domRef.children[i].style.display = 'none';
                }
            }
        }else{
            for(let i = 0, j = products.length; i < j; i++){
                domRef.children[i].style.display = 'block';
            }
        }
    }
    showInfo(e){
        const node = e.target,
              id = node.dataset.productid,
              DOMproducts = document.getElementById('productsList'),
              DOMproductDetails = document.getElementById('productDetails'),
              DOMdetails = document.getElementById('details');

        DOMproductDetails.innerHTML = '<div class="row"><div class="col l6 m6 s12"><h4>'+products[id].nombre+'</h4></div></div><div class="row"><div class="col l6 m6 s12"><img src="img/'+products[id].imgSrc+'" style="width:100%;"/></div><div class="col l6 m6 s12"><h5><b>Precio: </b>'+products[id].precio+'</h5><b>Unidades disponibles: </b>'+products[id].unidadesDisponibles+'</div></div>';
        DOMproducts.style.display = 'none';
        DOMdetails.style.display = 'block';
    }
    addToCart(e){
        const quantity = e.target.parentNode.children[0].value,
              id = e.target.dataset.productid;

        if(quantity != 0){
            // Agregar al carrito
            const ref = firebase.database().ref('shoppingcart');
            ref.push({
                'id': id,
                'imgSrc': products[id].imgSrc,
                'nombre': products[id].nombre,
                'precio': products[id].precio,
                'cantidad': quantity,
                'subTotal': (products[id].precio * quantity)
            }, function(error) {
                if(error){
                    alert("Ocurrio un error, no se pudo agregar a tu carrito: " + error);
                }else{
                    alert("Se agrego el producto a tu carrito.");
                }
            })

            // Actualiza los valores en la base de datos
            const updatedQuantity = products[id].unidadesDisponibles = (products[id].unidadesDisponibles - quantity),
                  ref_product = firebase.database().ref('products/'+id);

            ref_product.update({
                'unidadesDisponibles': updatedQuantity
            })

            // Actualiza en el DOM
            DOMpop.innerText = ++shoppingcartProducts;
            DOMpop.style.display = 'flex';
            e.target.parentNode.parentNode.parentNode.querySelector('.quantity').innerText = updatedQuantity;
        }
    }
    closeInfo(){
        const DOMproducts = document.getElementById('productsList'),
              DOMdetails = document.getElementById('details');

        DOMproducts.style.display = 'block';
        DOMdetails.style.display = 'none';
    }
    render(){
        // Construye las cartas de los productos
        let i = 0;
        const products = this.state.products.map((product) =>
            <div key={product.nombre} className="col s12 m4 l3">
                <div className="card">
                    <div className="card-image">
                        <img src={'img/'+product.imgSrc} />
                        <span className="card-title" style={{marginBottom: "-66px", padding: "15px", color:"#000"}}>{product.nombre}</span>
                    </div>
                    <div className="card-content">
                        <p>
                            <b>Precio:</b> {product.precio}<br />
                            <b>Unidades disponibles:</b> <span className="quantity">{product.unidadesDisponibles}</span>
                        </p>
                        <div className="options-badge">
                            <div onClick={((e) => this.showInfo(e))} className="btns show-more" data-productid={i}>Ver más</div>
                            <div className="selectBadge">
                                <input placeholder="0" type="number" defaultValue="1" />
                                <div onClick={((e) => this.addToCart(e))} className="btns add" data-productid={i++}>Añadir</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        return(
            <div>
                <Menu></Menu>
                <div className="row" style={{marginBottom: '15px'}}>
                    <div className="pane col s12 m10 l8 offset-s0 offset-m1 offset-l2">
                        <div id="productsList">
                            <div className="row">
                                <div className="left">
                                    <h4>Catálogo de productos</h4>
                                </div>
                                <div className="right col s12 m4 l4">
                                    <div className="input-field col s12 m12 l12">
                                        <input id="query" onChange={this.query} type="text" className="validate" placeholder="Buscar producto" />
                                    </div>
                                </div>
                            </div>
                            <div className="row" id="products">
                                {products}
                            </div>
                        </div>
                        <div className="row" id="details" style={{display: 'none'}}>
                            <div id="productDetails"></div>
                            <div className="row">
                                <div className="col l12 m12 s12">
                                    <div onClick={this.closeInfo} className="btns back">Atras</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Panel;
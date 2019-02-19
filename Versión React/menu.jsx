import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom'

class Menu extends React.Component{
	constructor(){
		super()

        // This binding is necessary to make `this` work in the callback
        this.logout = this.logout.bind(this);

        this.state = {
            redirect: false
        }
	}
    renderRedirect(){
        if(this.state.redirect){
            return <Redirect to='/' />
        }
    }
    logout(){
        this.setState({redirect: true})
    }
    render(){
        return(
            <div className="row" style={{marginBottom:'15px'}}>
                {this.renderRedirect()}
                    <div id="navBar" className="col s12 m10 l8 offset-s0 offset-m1 offset-l2">
                        <h5 className="left">La bodega</h5>
                        <div className="buttons right">
                            <a onClick={this.logout} className="link s_centered">
                                <i className="material-icons">exit_to_app</i>
                            </a>
                            <Link to="/shoppingcart" className="link s_centered">
                                <i className="material-icons">shopping_cart</i>
                                <div id="pop" className="s_centered"></div>
                            </Link>
                            <Link to="/panel" className="link s_centered">
                                <i className="material-icons">store</i>
                            </Link>
                        </div>
                    </div>
            </div>
        );
    }
}

export default Menu;
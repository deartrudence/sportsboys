import React, {Component} from 'react';
import App from '../App'
import Product from './Product';
import PropTypes from 'prop-types';
import Cart from './Cart';
import CustomerAuthWithMutation from './CustomerAuth';
import VariantSelector from './VariantSelector';
import { gql } from 'react-apollo';
import {
    createCheckout,
    checkoutLineItemsAdd,
    checkoutLineItemsUpdate,
    checkoutLineItemsRemove,
    checkoutCustomerAssociate,
    addVariantToCart,
    updateLineItemInCart,
    removeLineItemInCart,
    associateCustomerCheckout
  } from '../checkout'

class Collection extends Component {
    constructor(props) {
      super(props);
  
      
      this.state = {
        isCartOpen: false,
        isCustomerAuthOpen: false,
        isNewCustomer: false,
        products: [],
        checkout: { lineItems: { edges: [] } }
      };
      
     
      this.handleCartClose = this.handleCartClose.bind(this);
      this.handleCartOpen = this.handleCartOpen.bind(this);
      this.openCustomerAuth = this.openCustomerAuth.bind(this);
      this.closeCustomerAuth = this.closeCustomerAuth.bind(this);
      this.addVariantToCart = addVariantToCart.bind(this);
      this.updateLineItemInCart = updateLineItemInCart.bind(this);
      this.removeLineItemInCart = removeLineItemInCart.bind(this);
      this.showAccountVerificationMessage = this.showAccountVerificationMessage.bind(this);
      this.associateCustomerCheckout = associateCustomerCheckout.bind(this);
    }

    componentWillMount() {
        // this.props.collection.forEach((selector) => {
          this.setState({
            collection: this.props.collection,
            checkout: this.props.checkout
          });
        //   this.props.createCheckout({
        //     variables: {
        //       input: {}
        //     }}).then((res) => {
        //     this.setState({
        //       checkout: res.data.checkoutCreate.checkout
        //     });
        //   });
        // });
      }
      
    //   static propTypes = {
    //     createCheckout: PropTypes.func.isRequired,
    //     checkoutLineItemsAdd: PropTypes.func.isRequired,
    //     checkoutLineItemsUpdate: PropTypes.func.isRequired
    //   }

   

      handleCartOpen() {
        this.setState({
          isCartOpen: true,
        });
      }
    
      handleCartClose() {
        this.setState({
          isCartOpen: false,
        });
      }
    
      openCustomerAuth(event) {
        if (event.target.getAttribute('data-customer-type') === "new-customer") {
          this.setState({
            isNewCustomer: true,
            isCustomerAuthOpen: true
          });
        } else {
          this.setState({
            isNewCustomer: false,
            isCustomerAuthOpen: true
          });
        }
      }
    
      showAccountVerificationMessage(){
        this.setState({ accountVerificationMessage: true });
        setTimeout(() => {
         this.setState({
           accountVerificationMessage: false
         })
       }, 5000);
      }
    
      closeCustomerAuth() {
        this.setState({
          isCustomerAuthOpen: false,
        });
      }

    render(){
      console.log(this.props)
        return (
            <div>
                <h1 className="collection-title">{this.props.collection.title}</h1>
                <div className="wrapper--flex wrapper--flex-wrap">
                    { this.props.collection.products.edges.map(product => 
                        <Product addVariantToCart={this.props.addVariantToCart} checkout={this.checkout} key={product.node.id.toString()} product={product.node} />
                    )}
                </div>
            </div>
        )
    }
}
// Collection.contextTypes = {
//     createCheckout: React.PropTypes.func
// }

export default Collection;
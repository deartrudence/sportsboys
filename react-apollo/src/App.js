import React, { Component } from 'react';
import Product from './components/Product';
import Collection from './components/Collection';
import Cart from './components/Cart';
import CustomerAuthWithMutation from './components/CustomerAuth';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo'
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
} from './checkout'

class App extends Component {
  constructor() {
    super();

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
    this.props.createCheckout({
      variables: {
        input: {}
      }}).then((res) => {
      this.setState({
        checkout: res.data.checkoutCreate.checkout
      });
    });
  }

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.object,
      shop: PropTypes.object,
    }).isRequired,
    createCheckout: PropTypes.func.isRequired,
    checkoutLineItemsAdd: PropTypes.func.isRequired,
    checkoutLineItemsUpdate: PropTypes.func.isRequired
  }

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

  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div className="App">
        <header className="App__header wrapper">
            <div className="App__view-cart-wrapper">
              {/* <button className="App__view-cart" onClick={()=> this.setState({isCartOpen: true})}> */}
              <svg className="App__view-cart" onClick={()=> this.setState({isCartOpen: true})} version="1.1" x="0px" y="0px" viewBox="0 0 100 125" ><g><path d="M65.1,20.4c0-4.5-3.7-8.2-8.2-8.2h-15c-4.5,0-8.2,3.7-8.2,8.2V32H17.4l2.2,61H79l2.2-61H65.1V20.4z M39.6,20.4   c0-1.2,1-2.2,2.2-2.2h15c1.2,0,2.2,1,2.2,2.2V32H39.6V20.4z"/></g></svg>
              {/* </button> */}
            </div>
        </header>
        <div className="header wrapper wrapper--flex wrapper--flex-wrap">
          <div className=" wrapper--title col--two">
            <div className="inner--title">
              <h3>Introducing</h3>
              <h1>{this.props.data.shop.name}</h1>
              <p>{this.props.data.shop.description}</p>
              <button className="button">See Products</button>
            </div>
          </div>
          <div className="wrapper--images col--two">
            <img src={"http://deartrudence.com/sports_01.jpeg"} alt="" className="boys-1"/>
            <img src={"http://deartrudence.com/sports_02.jpeg"} alt="" className="boys-2"/>
          </div>
        </div>
        <div className="wrapper  ">
          { this.props.data.shop.collections.edges.map(collection =>
            <Collection key={collection.node.id} collection={collection.node} checkout={this.state.checkout} addVariantToCart={this.addVariantToCart} />
          )} 
        </div>
        <Cart
          removeLineItemInCart={this.removeLineItemInCart}
          updateLineItemInCart={this.updateLineItemInCart}
          checkout={this.state.checkout}
          isCartOpen={this.state.isCartOpen}
          handleCartClose={this.handleCartClose}
          customerAccessToken={this.state.customerAccessToken}
        />
      </div>
    );
  }
}

const query = gql`
  query query {
    shop {
      name
      description
      products(first:10) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            options {
              id
              name
              values
            }
            variants(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    src
                  }
                  price
                }
              }
            }
            collections(first: 10){
              edges {
                node{
                  id
                  title
                }
              }
            }
            images(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;

const query2 = gql `
  query query {
    shop {
      name
      description
      collections(first: 10){
        edges {
          node{
            id
            title
            products(first:10) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  options {
                    id
                    name
                    values
                  }
                  variants(first: 250) {
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                    }
                    edges {
                      node {
                        id
                        title
                        selectedOptions {
                          name
                          value
                        }
                        image {
                          src
                        }
                        price
                        
                      }
                    }            
                  }
                  images(first: 250) {
                    pageInfo {
                      hasNextPage
                      hasPreviousPage
                    }
                    edges {
                      node {
                        src
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } 
`
const AppWithDataAndMutation = compose(
  graphql(query2),
  graphql(createCheckout, {name: "createCheckout"}),
  graphql(checkoutLineItemsAdd, {name: "checkoutLineItemsAdd"}),
  graphql(checkoutLineItemsUpdate, {name: "checkoutLineItemsUpdate"}),
  graphql(checkoutLineItemsRemove, {name: "checkoutLineItemsRemove"}),
  graphql(checkoutCustomerAssociate, {name: "checkoutCustomerAssociate"})
)(App);


export default AppWithDataAndMutation;

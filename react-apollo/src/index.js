import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import 'normalize.css';
// import '../../shared/app.css';
import './css/App.css'


const networkInterface = createNetworkInterface({ uri: 'https://sports-boys.myshopify.com/api/graphql' });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers['X-Shopify-Storefront-Access-Token'] = '920f269518c89e165a68a9adfa8860e3'
    next();
  }
}]);
const client = new ApolloClient({
  networkInterface,
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ),
  document.getElementById('root')
);

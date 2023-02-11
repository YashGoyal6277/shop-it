import { createStore,combineReducers,applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import { productsReducer,productDetailsReducer ,newReviewReducer,newProductReducer,productReducer} from "./reducers/productReducer";
import { cartReducer } from "./reducers/cartReducers";
import {authReducer} from './reducers/userReducers'
import {newOrderReducer,myOrdersReducer,orderDetailsReducer} from './reducers/orderReducers'
const reducer=combineReducers({
   products:productsReducer,
   productDetails:productDetailsReducer,
   auth:authReducer,
   cart:cartReducer,
   newOrder:newOrderReducer,
   myOrders:myOrdersReducer,
   orderDetails:orderDetailsReducer,
   newReview:newReviewReducer,
   newProduct:newProductReducer,
   product:productReducer
})
let initalState={
   cart:{
      cartItems:localStorage.getItem('cartItems')?JSON.parse(localStorage.getItem('cartItems')):[],
      shippingInfo:localStorage.getItem('shippingInfo')?JSON.parse(localStorage.getItem('shippingInfo')):{}
   }
}
const middleware=[thunk]
const store=createStore(reducer,initalState,composeWithDevTools(applyMiddleware(...middleware)))

export default store;
import './App.css';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import {Header} from './components/layouts/Header'
import {Footer} from './components/layouts/Footer'
import {Home} from './components/Home'
import { Login } from './components/user/Login';
import  Profile  from './components/user/Profile';
import { Register } from './components/user/Register';
import Cart  from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'
import OrderSuccess from './components/cart/OrderSuccess'
import ProductDetails from './components/product/ProductDetails'
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';
import {loadUser} from './actions/userActions'
import store from './store'
import {useSelector} from 'react-redux'
import Dashboard from './components/admin/Dashboard';
import {useEffect,useState} from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';


function App() {
  const [stripeApiKey, setStripeApiKey] = useState('')
  useEffect(() => {
    store.dispatch(loadUser())
    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  },[])
  const {user,loading}= useSelector(state => state.auth)
  return (
    <div className="App"> 
     <Header/>
     <div className='container container-fluid'>
       <Routes>
       <Route path='/' element={<Home />} exact></Route>
       <Route path='/search/:keyword' element={<Home />} exact></Route>
       <Route path='/product/:id' element={<ProductDetails />} exact></Route>
       <Route path='/cart' element={<Cart />} exact></Route>
       <Route path='/login' element={<Login />} exact></Route>
       <Route path='/register' element={<Register />} exact></Route>
       <Route path='/me' element={<Profile />} exact></Route>
       <Route path='/shipping' element={<Shipping />} exact></Route>
       <Route path='/order/confirm' element={<ConfirmOrder />} exact></Route>
       <Route path='/success' element={<OrderSuccess />} exact></Route>
       <Route path='/orders/me' element={<ListOrders />} exact></Route>
       <Route path='/order/:id' element={<OrderDetails/>} exact></Route>
       </Routes>
       {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Routes>
              <Route path="/payment" element={<Payment />} />
              </Routes>
            </Elements>
          }
       
      </div>
      <Routes>
      <Route path='/dashboard'  element={<Dashboard />} exact></Route>
      <Route path='/admin/products'  element={<ProductList />} exact></Route>
      <Route path='/admin/product'  element={<NewProduct />} exact></Route>

      </Routes>
      {!loading && user && user.role !== 'admin' &&(
     <Footer />

      )}
    </div>
   
  );
}

export default App;

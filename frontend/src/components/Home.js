import React, { useEffect, useState } from 'react'
import { MetaData } from './layouts/MetaData'
import {useDispatch,useSelector} from 'react-redux'
import {getProducts} from '../actions/productAction'
import {Product} from './product/Products'
import {Loader} from './layouts/Loader'
import Pagination from 'react-js-pagination'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import {useAlert} from 'react-alert'
import { useParams } from 'react-router-dom';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
//  const range = createSliderWithTooltip(Slider.Range);
export const Home = () => {
    const [currentPage, setcurrentPage] = useState(1);
    const [price, setprice] = useState([1,1000])

    const params=useParams();  
    const keyword=params.keyword;
    
    const alert=useAlert();

    const dispatch=useDispatch();
    const {loading,products,error,productsCount,resPerPage} =useSelector(state=>state.products)
   
    
   
    useEffect(() => {
        
       if(error) {
          return alert.error(error) 
       }
         dispatch(getProducts(keyword,currentPage,price));
        }, [dispatch,error,alert,currentPage,keyword,price])

         
     function setCurrentPageNo(pageNumber){
            setcurrentPage(pageNumber)
        }

    return (
        <>
        {loading ? (<Loader /> ):(
            <>
            
            <MetaData title={"Buy Best Products Online"} />
                <h1 id="products_heading">Latest Products</h1>

                <section id="products" className="container mt-5">
                    <div className="row">
                {keyword ? (
                        <>
                            <div className="col-6 col-md-3 mt-5 mb-5">
                            <div className="px-5">
                                <Slider
                                   range
                                    marks={{
                                        1:`$1`,
                                        1000:`$1000`
                                    }}
                                    min={1}
                                    max={1000}
                                    defaultValue={[1,1000]}
                                    tipFormatter={value =>`$${value}`}
                                    tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setprice(price)}
                                />
                            </div>
                            </div> 
                             <div className=".col-6 col-md-9">
                                 <div className="row">
                                     { products && products.map(product=>(
                       <Product key={product._id} product={product} col={4}/>
                    ))}
                                 </div>
                             </div>
                        </>
                ) :(
                    products && products.map(product=>(
                       <Product key={product._id} product={product} col={3}/>
                    ))
                )}

                  
                        
                    
                        
                    </div>
                </section>
                {resPerPage<=productsCount && (
                 <div className="d-flex justify-content-center mt-5">
<Pagination  activePage={currentPage} itemsCountPerPage={resPerPage} 
    totalItemsCount={productsCount} onChange={setCurrentPageNo} nextPageText={'Next'} prevPageText={'Prev'} firstPageText={'First'} lastPageText={'Last'} itemClass="page-item" linkClass='page-link' 
/>

                 </div>)}
                
            </>
        )}
             
        </>
    )
}

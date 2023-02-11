import {
    ALL_PRODUCTS_REQUEST,ALL_PRODUCTS_FAIL,ALL_PRODUCTS_SUCCESS,CLEAR_ERROR,PRODUCTS_DETAILS_REQUEST,PRODUCTS_DETAILS_FAIL,PRODUCTS_DETAILS_SUCCESS,NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_FAIL

} from '../constants/productConstants'
export const productsReducer = (state={products:[]},action)=>{
    switch(action.type){
        case ALL_PRODUCTS_REQUEST:
        case ADMIN_PRODUCTS_REQUEST:

            return {
                loading:true,
                products:[]
            }
            case ALL_PRODUCTS_SUCCESS:
            return {
                loading:false,
                products:action.payload.products,
                productsCount:action.payload.productsCount,
                resPerPage:action.payload.resperpage
            }
            case ADMIN_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload
            }

            case ALL_PRODUCTS_FAIL:
         case ADMIN_PRODUCTS_FAIL:

                return {
                    loading:false,
                    error:action.payload
                } 
                case CLEAR_ERROR:{
                    return{
                        ...state,error:null
                    }
                }
            
        default: 
        return state;
    }
}

export const productDetailsReducer=(state={product:{}}, action) =>{
    switch(action.type){
        case PRODUCTS_DETAILS_REQUEST :
        return{
            ...state,
            loading:true
        }
        case PRODUCTS_DETAILS_SUCCESS:
            return{
                loading:false,
                product:action.payload
            }
            case PRODUCTS_DETAILS_FAIL:
            return{
                ...state,
                error:action.payload
            }
            case CLEAR_ERROR:{
                return{
                    ...state,error:null
                }
            }
            default: return state
    }
}

export const productReviewsReducer = (state = { review: [] }, action) => {
    switch (action.type) {

        case GET_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_REVIEWS_SUCCESS:
            return {
                loading: false,
                reviews: action.payload
            }

        case GET_REVIEWS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_REVIEW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_REVIEW_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const reviewReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_REVIEW_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newProductReducer = (state = { product: {} }, action) => {
    switch (action.type) {

        case NEW_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_PRODUCT_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                product: action.payload.product
            }

        case NEW_PRODUCT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_PRODUCT_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const productReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_PRODUCT_REQUEST:
       
            return {
                ...state,
                loading: true
            }

        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        

        case DELETE_PRODUCT_FAIL:
        
            return {
                ...state,
                error: action.payload
            }

        case DELETE_PRODUCT_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}
import * as actionTypes from '../Actions/actionTypes';

const initialState = {
    token : null,
    loading : true
}

const reducer = (state = initialState , action) => {
    switch(action.type)
    {
        case actionTypes.AUTH_START:
            return {
                ...state,
                token : null,
                loading : true
            }
        case actionTypes.AUTH_SUCCESSFULL:
            return {
                ...state,
                token : action.token,
                loading : false
            }
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                token : null,
                loading : false
            }
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                token : null,
                loading : false
            }
        default : 
            return {
                ...state,
                token : null,
                loading : false
            }
    }
}

export default reducer;
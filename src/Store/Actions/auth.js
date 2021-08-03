import * as actionTypes from './actionTypes';
import axios from 'axios';
export const authStart = () => {
    return {
        type : actionTypes.AUTH_START
    }
}

export const authSuccess = (token) => {
    return {
        type : actionTypes.AUTH_SUCCESSFULL,
        token : token
    }
}

export const authFail = () => {
    return {
        type : actionTypes.AUTH_FAIL
    }
}

export const authLogout = () => {
    return {
        type : actionTypes.AUTH_LOGOUT
    }
}

export const auth  = (name,email,password,isSignup) => {
    return dispatch => {
        dispatch(authStart());
        if(isSignup)
        {
            const userData = {
                name : name,
                email : email,
                password : password
            }
            console.log(userData);
            axios.post("http://localhost:5011/users",userData)
                .then(response => {
                    if(response.status === 201)
                    {
                        dispatch(authSuccess(response.data))
                    }
                    else
                    {
                        dispatch(authFail())
                    }
                })
                .catch(error => {
                    console.log(error);
                    dispatch(authFail())
                })
        }
        else
        {
            const userData = {
                email : email,
                password : password
            }
            
            axios.post("http://localhost:5011/login",userData)
                .then(response => {
                    //console.log(response.status , response.data);
                    if(response.status === 200)
                    {
                        dispatch(authSuccess(response.data));
                    }
                    else
                    {
                        dispatch(authFail())
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }
}
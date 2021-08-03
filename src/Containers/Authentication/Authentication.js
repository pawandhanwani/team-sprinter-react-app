import React, { Component } from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import * as actionCreator from '../../Store/Actions/index';
class Authentication extends Component {
    state = {
        signup :false,
        forms : {
            signupForm : {
                Name : {
                    type : 'text',
                    value : '',
                },
                Email : {
                    type : 'email',
                    value : ''
                },
                Password : {
                    type : 'password',
                    value : ''
                }
            },
            loginForm : {
                Email : {
                    type : 'text',
                    value : ''
                },
                Password : {
                    type : 'password',
                    value : ''
                }
            }
        }
    }
    formSubmitHandler = () => {
        if(this.state.signup)
        {
            //console.log(this.state.forms.signupForm.Name.value , this.state.forms.signupForm.Email.value , this.state.forms.signupForm.Password.value)
            this.props.onAuthenticate(this.state.forms.signupForm.Name.value , this.state.forms.signupForm.Email.value , this.state.forms.signupForm.Password.value,true)
        }
        else
        {
            //console.log(this.state.forms.loginForm.Email.value , this.state.forms.loginForm.Password.value);
            this.props.onAuthenticate("",this.state.forms.loginForm.Email.value , this.state.forms.loginForm.Password.value,false);
        }
    }
    inputChangedHandler = (event,field) => {
        if(this.state.signup)
        {
            const updatedForms = {...this.state.forms};
            updatedForms.signupForm[field].value = event.target.value;
            this.setState({forms : updatedForms})
        }
        else
        {
            const updatedForms = {...this.state.forms};
            updatedForms.loginForm[field].value = event.target.value;
            this.setState({forms : updatedForms})
        }
    }
    formStateSwitchHandler = () => {
        this.setState(prevState => (
            {signup : !prevState.signup}
        ))
    }
    render() {
        let formElements = [];
        if(this.state.signup)
        {
            for(let key in this.state.forms.signupForm)
            {
                formElements.push({
                    value : this.state.forms.signupForm[key].value,
                    type : this.state.forms.signupForm[key].type,
                    id : key
                })
            }
        }
        else
        {
            for(let key in this.state.forms.loginForm)
            {
                formElements.push({
                    value : this.state.forms.loginForm[key].value,
                    type : this.state.forms.loginForm[key].type,
                    id : key
                })
            }
        }
        return (
            <div style={{marginTop : '100px'}}>
                
                {formElements.map(formElement => {
                    return (<div key={formElement.id}><OutlinedInput placeholder={formElement.id} key={formElement.id} id={formElement.id} type={formElement.type} value={formElement.value} onChange={(event) => {this.inputChangedHandler(event,formElement.id)}} style={{marginTop : '10px' , marginBottom: '10px' , width : '500px'}}/><br/></div>);
                })}
                
                {/* <OutlinedInput placeholder="Name" type="text" style={{marginTop : '10px' , marginBottom: '10px' , width : '500px'}}/><br/>
                <OutlinedInput placeholder="Email" type="email" style={{marginTop : '10px' , marginBottom: '10px' , width : '500px'}}/><br/>
                <OutlinedInput placeholder="Password" type="password" style={{marginTop : '10px' , marginBottom: '10px' , width : '500px'}}/><br/> */}
                <Button variant="contained" size="medium" color="primary" onClick={this.formSubmitHandler}>{this.state.signup ? "Sign-Up" : "Sign-In"}</Button><br/>
        <Button variant="contained" size="medium" color="secondary" onClick={this.formStateSwitchHandler}>Switch to {this.state.signup ? "Sign-In" : "Sign-Up"}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticate : (name,email,password,isSignup) => (dispatch(actionCreator.auth(name,email,password,isSignup)))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Authentication);
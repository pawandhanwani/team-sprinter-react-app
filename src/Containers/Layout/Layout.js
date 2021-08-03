import React , { Component} from 'react';
import Appbar from '../../Components/Appbar/Appbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Drawer from '@material-ui/core/Drawer';
import {connect} from 'react-redux';
import * as actionCreators from '../../Store/Actions/index';
import {withRouter} from 'react-router-dom';
class Layout extends Component {
    state = {
        menuOpen : false
    }
    menuOpenHandler = () => {
        this.setState({menuOpen : true})
    }
    menuCloseHandler = () => {
        this.setState({menuOpen : false})
    }
    openSprintsHandler = () => {
        this.props.history.push('/sprints');
        this.setState({menuOpen : false})
    }
    logoutHandler = () => {
        this.setState({menuOpen : false})
        this.props.history.push('/');
        this.props.onLogout();
    }
    render() {
        return (
            <div>

                <Appbar menuOpener={this.menuOpenHandler}/>
                <Drawer open={this.state.menuOpen} style={{cursor : 'pointer'}}>
                    <List style={{width : '300px' , marginTop : '50px'}}>
                        {this.props.isAutheticated === true ?
                        <div>
                        <ListItem onClick={this.openSprintsHandler}>Sprints</ListItem>
                        <Divider/>
                        <ListItem onClick={this.logoutHandler}>Log Out</ListItem>
                        <Divider/></div>:null}
                        <ListItem onClick={this.menuCloseHandler}>Close</ListItem>
                        <Divider/>
                    </List>
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAutheticated : state.auth.token!==null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout : () => (dispatch(actionCreators.authLogout()))
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Layout));
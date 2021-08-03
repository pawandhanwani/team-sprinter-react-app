import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import {connect} from 'react-redux';
import axios from 'axios';
class Sprints extends Component {
    state = {
        newSprintName : '',
        alertShow : false,
        success : false,
        alertMessage : '',
        addSprintLoading : false,
        sprints : []
    }
    componentDidMount() {
        this.loadSprints();
    }
    loadSprints = () => {
        const requestData ={
            id : this.props.token
        }
        let loadedSprints = []
        axios.post("http://localhost:5011/getSprints",requestData)
            .then(response => {
                if(response.status === 200)
                {
                    for(let i=0;i<response.data.length;i++)
                    {
                        loadedSprints.push({
                            sprintID : response.data[i].sprintID,
                            canAdd : response.data[i].role !== "Member" ? true : false,
                            name : response.data[i].sprint[0].name,
                            showLoader : false,
                            newRoleEmail : '',
                            newRole : ''
                        })
                    }
                }
                this.setState({sprints : loadedSprints})
            })
            .catch(error => {
                this.setState({sprints : loadedSprints})
            })
    }
    changeNewSprintNameHandler = (event) => {
        this.setState({newSprintName : event.target.value})
    }
    roleChangeHandler = (event,i) => {
        const updatedSprints = this.state.sprints;
        updatedSprints[i].newRole = event.target.value;
        this.setState({sprints : updatedSprints})
    }
    roleEmailChangeHandler = (event,i) => {
        const updatedSprints = this.state.sprints;
        updatedSprints[i].newRoleEmail = event.target.value;
        this.setState({sprint : updatedSprints});
    }
    openLogsHandler = (sprintID) => {
        this.props.history.push('/logs/'+sprintID);
    }
    openTasksHandler = (sprintID) => {
        this.props.history.push('/tasks/'+sprintID);
    }
    addRoleHandler = (position) => {
        const updatedSprints = this.state.sprints;
        updatedSprints[position].showLoader = true;
        this.setState({sprints : updatedSprints});
        const requestData = {
            userEmail : this.state.sprints[position].newRoleEmail,
            id :  this.props.token,
            sprintID : this.state.sprints[position].sprintID,
            role : this.state.sprints[position].newRole
        }
        axios.post('http://localhost:5011/permissions',requestData)
            .then(response=> {
                if(response.status === 200)
                {
                    updatedSprints[position].showLoader = false;
                    updatedSprints[position].newRole = '';
                    updatedSprints[position].newRoleEmail = '';
                    this.setState({success : true , alertMessage : "User role created" ,sprint : updatedSprints});
                    this.alertToggleHandler();
                }
                else
                {
                    updatedSprints[position].showLoader = false;
                    updatedSprints[position].newRole = '';
                    updatedSprints[position].newRoleEmail = '';
                    this.setState({success : false , alertMessage : "Failed to add role" ,sprint : updatedSprints});
                    this.alertToggleHandler();
                }
            })
            .catch(error => {
                updatedSprints[position].showLoader = false;
                updatedSprints[position].newRole = '';
                    updatedSprints[position].newRoleEmail = '';
                this.setState({success : false , alertMessage : "Failed to add role" ,sprint : updatedSprints});
                this.alertToggleHandler();
            })
    }
    sprintAddhandler = () => {
        this.setState({addSprintLoading : true})
        //console.log(this.state.newSprintName , this.props.token);
        const requestData = {
            id : this.props.token,
            name : this.state.newSprintName
        }
        axios.post("http://localhost:5011/sprints",requestData)
            .then(response => {
                if(response.status === 201)
                {
                    this.setState({success : true , alertMessage : "Sprint created" , newSprintName : "" ,addSprintLoading : false})
                }
                else
                {
                    this.setState({success : false , alertMessage : "Failed to create sprint" , newSprintName : "" ,addSprintLoading : false})
                }
                this.alertToggleHandler();
                this.loadSprints();
            })
            .catch(error => {
                this.setState({success : false , alertMessage : "Failed to create sprint" , newSprintName : "" ,addSprintLoading : false})
                this.alertToggleHandler();
            })
    }
    alertToggleHandler = () => {
        this.setState({alertShow : true})
        setTimeout(() => {
            this.setState({alertShow : false})
        },3000)
    }
    render() {
        return(
            <div style={{marginLeft : '28%' , marginTop : '10px'}}>
                <Card style={{width : '400px' , marginLeft : '60px'}}>
                    <CardContent>
                    <Typography variant="h6" component="h2" color="primary"> 
                            Create a new sprint
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Input type="text" value={this.state.newSprintName} placeholder="Name of the sprint" onChange={(event) => {this.changeNewSprintNameHandler(event)}}/><br/><Button variant="contained" onClick={this.sprintAddhandler} color="primary">Create</Button>
                        {this.state.addSprintLoading ? <CircularProgress color="secondary" /> : null}
                    </CardActions>
                </Card>
                {this.state.sprints.map((sprint , key) => {
                    return (
                    <Card style={{width : '550px' , marginTop : '20px'}}>
                    <CardContent>
                        <Typography variant="h5" component="h2" color="primary"> 
                            {sprint.name}
                        </Typography>
                    </CardContent>
                    <CardActions >
                    <Button color="default" size="small" onClick={() => {this.openTasksHandler(sprint.sprintID)}}>Manage</Button>
                        <Button color="primary" size="small" onClick={() => {this.openLogsHandler(sprint.sprintID)}}>logs</Button>
                        {sprint.canAdd ? 
                        <div>
                        <Input placeholder="Email address" style={{marginRight : '4px'}} value={sprint.newRoleEmail} onChange={(event) =>{this.roleEmailChangeHandler(event,key)}}/>
                        
                        <Select style={{width : '100px'}}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            label="Role"
                            value={sprint.newRole}
                            onChange={(event) => this.roleChangeHandler(event,key)}>
                                <MenuItem value={"Admin"}>Admin</MenuItem>
                                <MenuItem value={"Member"}>Member</MenuItem>
                        </Select>
                        <Button color="secondary" size="small" onClick={() => this.addRoleHandler(key)}>Add</Button> </div>: null}
                    </CardActions>
                    {sprint.canAdd && sprint.showLoader ?<CardContent>
                     <LinearProgress style={{marginLeft: '100px' ,width : '300px'}} color="secondary"/>
                    </CardContent> : null}
                    </Card>
                    );
                })}
                


                
                <Snackbar open={this.state.alertShow} autoHideDuration={6000} onClose={null}>
                    <MuiAlert elevation={6} variant="filled" onClose={null} severity={this.state.success ? "success" : "error"}>
                        {this.state.alertMessage}
                    </MuiAlert>
                </Snackbar>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token
    }
}

export default connect(mapStateToProps)(Sprints);
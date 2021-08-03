import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LinearProgress from '@material-ui/core/LinearProgress';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import { CardContent } from '@material-ui/core';
import {connect} from 'react-redux';
import axios from 'axios';
class TaskManager extends Component {
    state = {
        Pending : [],
        InProgress : [],
        Completed : [],
        newTaskDescription : '',
        addingNewTask : false,
        loadingTasks : false
    }
    componentDidMount() {
        //console.log(this.props.match.params.sprintID , this.props.token);
        this.loadTasks();
    }
    updateTaskStatusHandler = (taskID , newStatus) => {
        this.setState({Pending : [] , InProgress : [] , Completed : [] ,loadingTasks : true})
        const requestData = {
            id : this.props.token,
            taskID : taskID,
            newStatus : newStatus
        }
        axios.post("http://localhost:5011/updateTasks",requestData)
            .then(response => {
                this.loadTasks();
            })
            .catch(error => {
                this.loadTasks();
            })
    }
    loadTasks = () => {
        this.setState({loadingTasks : true});
        const loadedPendingTasks = []
        const loadedInProgressTasks = []
        const loadedCompletedTasks = []
        const requestData = {
            id : this.props.token,
            sprintID : this.props.match.params.sprintID
        }
        axios.post("http://localhost:5011/getTasks",requestData)
            .then(response => {
                if(response.status === 200)
                {
                    for(let i=0;i<response.data[0].tasks.length;i++)
                    {
                        switch (response.data[0].tasks[i].status)
                        {
                            case "Pending":
                                loadedPendingTasks.push({
                                    id : response.data[0].tasks[i]._id,
                                    description : response.data[0].tasks[i].description,
                                    status : "Pending"
                                })
                                break;
                            case "InProgress":
                                loadedInProgressTasks.push({
                                    id : response.data[0].tasks[i]._id,
                                    description : response.data[0].tasks[i].description,
                                    status : "InProgress"
                                })
                                break;
                            case "Completed":
                                loadedCompletedTasks.push({
                                    id : response.data[0].tasks[i]._id,
                                    description : response.data[0].tasks[i].description,
                                    status : "Completed"
                                })
                                break;
                            default:
                                break;
                        }
                    }
                }
                this.setState({Pending : loadedPendingTasks , InProgress : loadedInProgressTasks , Completed : loadedCompletedTasks ,loadingTasks : false})
            })
            .catch(error => {
                this.setState({Pending : loadedPendingTasks , InProgress : loadedInProgressTasks , Completed : loadedCompletedTasks ,loadingTasks : false})
            })
    }
    newTaskUpdateHandler = (event) => {
        this.setState({newTaskDescription : event.target.value});
    }
    addNewTaskHandler = () => {
        this.setState({addingNewTask : true})
        const requestData = {
            id : this.props.token,
            sprintID : this.props.match.params.sprintID,
            description : this.state.newTaskDescription
        }
        axios.post("http://localhost:5011/tasks",requestData)
            .then(response => {
                this.setState({newTaskDescription : '' , addingNewTask : false})
                this.loadTasks();
            })
            .catch(error => {
                this.setState({newTaskDescription : '' , addingNewTask : false})
            })
    }
    render() {
        return(
            <div style={{marginTop : '30px'}}>
                <Card style={{display : 'inline-block' , position:'relative' , marginLeft : '10px' , overflowY : 'scroll' , height : '200px'}}>
                    <CardActions>
                        <List style={{width : '300px'}}> 
                            <ListItem>
                                <ListItemText>
                                    Pending Tasks
                                    <hr/>
                                </ListItemText>
                            </ListItem>
                            {this.state.Pending.map(task => {
                            return (
                                <ListItem>
                                    <ListItemText>
                                        {task.description}
                                    </ListItemText>
                                    <ListItemIcon>
                                        <ArrowForwardIcon onClick={() => this.updateTaskStatusHandler(task.id , "InProgress")} color="secondary"/>
                                    </ListItemIcon>
                                </ListItem>
                            )})}
                        </List>
                    </CardActions>
                </Card>

                <Card style={{display : 'inline-block' , position:'relative' , marginLeft : '10px' , overflowY : 'scroll' , height : '200px'}}>
                    <CardActions>
                        <List style={{width : '300px' ,display : 'inline-block'}} component="div">
                        <ListItem>
                                <ListItemText>
                                    In Progress Tasks
                                    <hr/>
                                </ListItemText>
                            </ListItem> 
                            {this.state.InProgress.map(task => {
                            return (<ListItem>
                                <ListItemIcon>
                                    <ArrowBackIcon onClick={() => this.updateTaskStatusHandler(task.id , "Pending")} color="secondary"/>
                                </ListItemIcon>
                                <ListItemText>
                                    {task.description}
                                </ListItemText>
                                <ListItemIcon>
                                    <ArrowForwardIcon onClick={() => this.updateTaskStatusHandler(task.id , "Completed")} color="secondary"/>
                                </ListItemIcon>
                            </ListItem>)})}
                        </List>
                    </CardActions>
                </Card>

                <Card style={{display : 'inline-block' , position:'relative' , marginLeft : '10px' , overflowY : 'scroll' , height : '200px'}}>
                    <CardActions>
                        <List style={{width : '300px' ,display : 'inline-block'}} component="div"> 
                        <ListItem>
                                <ListItemText>
                                    Completed Tasks
                                    <hr/>
                                </ListItemText>
                            </ListItem>
                            {this.state.Completed.map(task => {
                            return (
                            <ListItem>
                                <ListItemIcon>
                                <ArrowBackIcon onClick={() => this.updateTaskStatusHandler(task.id , "InProgress")} color="secondary"/>
                                </ListItemIcon>
                                <ListItemText>
                                    {task.description}
                                </ListItemText>
                            </ListItem>)})}
                            
                        </List>
                    </CardActions>
                </Card>
                {this.state.loadingTasks === true ?
                <LinearProgress style={{marginTop : '30px' , width : '1000px' , marginLeft : '140px'}}/> : null }
                <Card style={{marginTop : '20px' , width : '1000px' ,marginLeft : '140px'}} >
                    <CardContent>
                    <   Typography variant="h6" component="h2" color="primary"> 
                            Add a new task
                        </Typography>
                    </CardContent>
                    <CardActions style = {{marginLeft : '330px'}}>
                        <Input value ={this.state.newTaskDescription} onChange={(event) => {this.newTaskUpdateHandler(event)}}/><Button color="secondary" variant="contained" onClick={() => {this.addNewTaskHandler()}}>Add</Button>{ this.state.addingNewTask === true ? <CircularProgress/> : null}
                    </CardActions>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token : state.auth.token
    }
}

export default connect(mapStateToProps)(TaskManager);
import React , {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios';
class Logs extends Component {

    state = {
        logs : []
    }
    componentDidMount() {
        const loadedLogs = []
        const requestData = {
            sprintID : this.props.match.params.sprintID
        }
        axios.post("http://localhost:5011/getLogs",requestData)
            .then(response => {
                if(response.status === 200)
                {
                    for(let i=0;i<response.data[0].logs.length;i++)
                    {
                        loadedLogs.push(response.data[0].logs[i].description);
                    }
                }
                this.setState({logs : loadedLogs});
            })
            .catch(error => {
                this.setState({logs : loadedLogs});
            })
    }
    render() {
        console.log(this.props.match.params.sprintID);
        return(
            <div style={{marginTop : '30px'}}>
                {this.state.logs.map(log => {
                    return (
                        <Card style={{marginTop : '20px' , width : '800px' , marginLeft : '220px'}}>
                            <CardContent>
                                {log}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        );
    }
}

export default Logs;
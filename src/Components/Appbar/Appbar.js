import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
    
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={props.toggleMenuOpener} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon onClick={props.menuOpener}/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Team Sprinter
          </Typography>
          
        </Toolbar>
      </AppBar>


      
    </div>
  );
}

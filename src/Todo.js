import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import db from './firebase';
import './Todo.css';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        padding: theme.spacing(2, 4, 3),
        display: 'flex'
    },
}));

function Todo({ task }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [editData, setData] = useState('');

    useEffect(() => {
        setData(task.todos)
    }, [task.todos]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const updateTodo = () => {
        db.collection('todos').doc(task.id).set({
            todos: editData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        setOpen(false)
    }
    return (
        <List className="todo__list">
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Paper elevation={3} className={classes.paper}>
                        <TextField
                            id={task.id}
                            label="Edit Todo"
                            style={{ margin: 8 }}
                            placeholder={task.todos}
                            value={editData}
                            onChange={(e) => setData(e.target.value)}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.button}
                            onClick={updateTodo}
                        >
                            Save
                        </Button>
                    </Paper>
                </Fade>
            </Modal>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <ListItem >
                        <ListItemAvatar>
                            <Avatar>
                                <PlaylistAddCheckIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={task.todos} secondary={"Todo.."} />
                        <IconButton aria-label="delete" onClick={() => db.collection('todos').doc(task.id).delete()} >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleOpen} >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </ListItem>
                </CardContent>
            </Card>
        </List>
    )
}

export default Todo

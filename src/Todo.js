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
import FormControl from '@material-ui/core/FormControl';
import db from './firebase';
import './Todo.css';

const useStyles = makeStyles((theme, status) => ({
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
		display: 'flex',
	},
	new: {
		borderTop: '4px solid green',
		padding: 0,
		'&:hover': {
			backgroundColor: '#f5f5f5',
		},
	},
	edited: {
		borderTop: '4px solid orange',
		'&:hover': {
			backgroundColor: '#f5f5f5',
		},
	},
	list: {
		width: '10rem',
	},
}));

function Todo({ task }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [editData, setData] = useState('');

	useEffect(() => {
		setData(task.todos);
	}, [task.todos]);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const updateTodo = (e) => {
		e.preventDefault();
		db.collection('todos').doc(task.id).set(
			{
				todos: editData,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				actionType: 'update',
			},
			{ merge: true },
		);
		setOpen(false);
	};

	return (
		<List className='todo__list'>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
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
						<form className='app__form'>
							<FormControl>
								<TextField
									id={task.id}
									label='Edit task'
									style={{ margin: 8 }}
									placeholder={task.todos}
									value={editData}
									onChange={(e) => setData(e.target.value)}
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</FormControl>
							<Button
								variant='contained'
								color='primary'
								type='submit'
								className={classes.button}
								onClick={updateTodo}
							>
								Save
							</Button>
						</form>
					</Paper>
				</Fade>
			</Modal>
			<Card
				className={task.actionType === 'create' ? classes.new : classes.edited}
				variant='outlined'
			>
				<CardContent>
					<p className='timestamp'>{task.date}</p>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<PlaylistAddCheckIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							className={classes.list}
							primary={task.todos}
							secondary={'Todo..'}
						/>
						<IconButton
							aria-label='delete'
							onClick={() => db.collection('todos').doc(task.id).delete()}
						>
							<DeleteIcon fontSize='small' />
						</IconButton>
						<IconButton aria-label='delete' onClick={handleOpen}>
							<EditIcon fontSize='small' />
						</IconButton>
					</ListItem>
					<p className='timestamp'>
						{task.actionType === 'create' ? '' : 'Edited. '}
						{task.timestamp}
					</p>
				</CardContent>
			</Card>
		</List>
	);
}

export default Todo;

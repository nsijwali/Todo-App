import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircle from '@material-ui/icons/AddCircle';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Todo from './Todo';
import db from './firebase';
import firebase from 'firebase';
import './App.css';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1),
	},
}));

function App() {
	const [tasks, setTask] = useState([]);
	const [input, setInput] = useState('');
	const classes = useStyles();

	const timeStampConverter = (stamp) => {
		let unix_timestamp = stamp;
		// Create a new JavaScript Date object based on the timestamp
		// multiplied by 1000 so that the argument is in milliseconds, not seconds.
		let date = new Date(unix_timestamp * 1000);
		// Hours part from the timestamp
		let hours = date.getHours();
		let prefix = hours >= '12' ? 'PM' : 'AM';
		// Minutes part from the timestamp
		let minutes = '0' + date.getMinutes();
		// Seconds part from the timestamp
		let seconds = '0' + date.getSeconds();

		// Will display time in 10:30:23 format
		let formattedTime =
			hours +
			':' +
			minutes.substr(-2) +
			':' +
			seconds.substr(-2) +
			' ' +
			prefix;

		return formattedTime;
	};

	const dateConverter = (stamp) => {
		let unix_timestamp = stamp;
		// Create a new JavaScript Date object based on the timestamp
		// multiplied by 1000 so that the argument is in milliseconds, not seconds.
		let date = new Date(unix_timestamp * 1000);
		let newDate =
			date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
		return newDate;
	};

	useEffect(() => {
		db.collection('todos')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) => {
				setTask(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						todos: doc.data().todos,
						timestamp: timeStampConverter(doc.data()?.timestamp?.seconds),
						date: dateConverter(doc.data()?.timestamp?.seconds),
						actionType: doc.data().actionType,
					})),
				);
			});
	}, []);

	const addTodo = (event) => {
		event.preventDefault();
		if (input) {
			// setTask([...tasks, input]);
			db.collection('todos').add({
				todos: input,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				actionType: 'create',
			});
			setInput('');
		}
	};
	return (
		<div className='app'>
			<div className='app__content'>
				<h1>Todo Bucket</h1>
				<form className='app__form'>
					<FormControl>
						<InputLabel>Add a task</InputLabel>
						<Input
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
					</FormControl>
					<Button
						variant='contained'
						color='primary'
						type='submit'
						className={classes.button}
						onClick={addTodo}
						// endIcon={<AddCircle />}
					>
						Remember
					</Button>
				</form>
				<ul className='app__tasks'>
					{tasks.map((task) => (
						<Todo task={task} />
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;

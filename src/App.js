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

  useEffect(() => {
    db.collection('todos').orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setTask(snapshot.docs.map(doc => ({
        id: doc.id,
        todos: doc.data().todos
      })))
    })
  }, []);

  const addTodo = (event) => {
    event.preventDefault();
    if (input) {
      // setTask([...tasks, input]);
      db.collection('todos').add({
        todos: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      setInput('');
    }
  }
  return (
    <div className="app">
      <div className="app__content">
        <h1>Keep A Note</h1>
        <form className="app__form">
          <FormControl>
            <InputLabel>Add a task</InputLabel>
            <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
            onClick={addTodo}
            endIcon={<AddCircle />}
          >
            Add Todo
          </Button>
        </form>
        <ul className="app__tasks">
          {tasks.map(task => (
            <Todo task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

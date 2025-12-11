import './App.css';
import { useState, useEffect, use } from 'react';
import Todolist from './Todolist/Todolist.js'
function App() {
  const [inputValue, setInputValue] = useState('')
  const [tasks, setTasks] = useState([])
  const [tasksFilter, setTasksFilter]= useState([])
  const [isActiveTasks, setIsActiveTasks] = useState(false)
  const [countTasks, setCountTasks] = useState(0)
  const handleClickAddTask = (e) => {
    const randomId = Math.random().toString(36).substring(2, 8);
    inputValue && setTasks([{text: inputValue, isActive: false, id:randomId }, ...tasks])
  }
  const handleClickDeleteTask = (id) => {
    const tasksNew = tasks.filter((item) => item.id!==id)
    setTasks(tasksNew)
  }
  const changeActiveTask = (id) =>{
    const newTasks= tasks.map((item) => {
      if (item.id === id){
        return {...item, isActive:!item.isActive}
      }
      return item
    })
    setTasks(newTasks)
  }

  const handleSaveTasks = (e) => {
    e.preventDefault();
    localStorage.setItem('tasks', JSON.stringify(tasks))
  } 

  useEffect(()=>{
    let newTasks = [...tasks]
    if (isActiveTasks){
      newTasks = newTasks.filter((item)=>item.isActive === true)
    }
    setCountTasks(newTasks.filter((item)=>item.isActive === false).length)
    setTasksFilter(newTasks)
  }, [tasks, isActiveTasks])

  useEffect(()=>{
    setTasks(JSON.parse(localStorage.getItem('tasks') || '[]'))
  }, [])
  return (
    <div className="App">
      <div className='menu'>
        <input className='menu__input' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
        <div className='menu__buttons'>
          <button className='menu__but' onClick={handleClickAddTask}>Добавить</button>
          <button className={isActiveTasks ? `menu__but menu__but_back menu__but_active` : `menu__but menu__but_back`} onClick={(e)=>{setIsActiveTasks(!isActiveTasks)}}>Выполненныe</button>
          <button className='menu__but menu__but_save' onClick={handleSaveTasks}>Сохранить</button>
        </div>
      </div>
      <p className='menu__count'>Осталось задач: {countTasks}</p>
      <Todolist handleClickDeleteTask={handleClickDeleteTask} changeActiveTask={changeActiveTask} tasks={tasksFilter}/>
    </div>
  );
}

export default App;

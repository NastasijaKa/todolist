import styles from './todolist.module.css';
import ItemTodo from '../ItemTodo/ItemTodo.js'
function Todolist({tasks, changeActiveTask, handleClickDeleteTask}) {
  return (
    <div className={styles.todolist}>
      {tasks.map(item=>(
        <ItemTodo key={item.id} task={item} handleClickDeleteTask={handleClickDeleteTask} changeActiveTask={changeActiveTask}/>
      ))}
    </div>
  );
}

export default Todolist;
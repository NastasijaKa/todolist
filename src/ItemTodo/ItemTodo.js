import styles from './ItemTodo.module.css'
function ItemTodo({task, changeActiveTask, handleClickDeleteTask}) {
  return (
    <div className={task.isActive ? `${styles.task} ${styles.task_active}` : styles.task}>
     <p>{task.text}</p>
     <div className={styles.task__buttons}>
        <input type="checkbox" checked={task.isActive} onChange={(e) => changeActiveTask(task.id)} className={styles.task__checkbox} />
        <button className={styles.task__but} onClick={(e)=> handleClickDeleteTask(task.id)}/>
     </div>
    </div>
  );
}

export default ItemTodo;
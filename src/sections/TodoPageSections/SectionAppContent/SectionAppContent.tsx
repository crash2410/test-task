import style from './SectionAppContent.module.css'
import CreateTaskInput from "../../../components/inputs/CreateTaskInput/CreateTaskInput.tsx";
import TaskList from "../../../components/ui/TaskList/TaskList.tsx";
import TaskListBar from "../../../components/ui/TaskListBar/TaskListBar.tsx";
// import noTask from "/noTask.gif";


const SectionAppContent = () => {
    return (
        <section className={style.appContent}>
            <header className={style.header}>Задачи</header>
            <CreateTaskInput/>
            <div className={style.content}>
                <TaskList/>
                <TaskListBar/>
            </div>

                {/*<img src={noTask} alt="Example GIF" className={style.gif}/>*/}
        </section>
);
};

export default SectionAppContent;
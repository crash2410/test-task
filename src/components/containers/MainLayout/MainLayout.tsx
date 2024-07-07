import {ReactElement} from "react";
import style from './MainLayout.module.css'
import {Toaster} from "react-hot-toast";

interface Props {
    children: ReactElement
}

const MainLayout = ({children} : Props) => {
    return (
        <main className={style.main}>
            <Toaster
                position="top-center"
            />
            {children}
        </main>
    );
};

export default MainLayout;
import './styles/main.css'
import TodoPage from "./pages/TodoPage/TodoPage.tsx";
import MainLayout from "./components/containers/MainLayout/MainLayout.tsx";

function App() {
    return (
        <MainLayout>
            <TodoPage/>
        </MainLayout>
    )
}

export default App

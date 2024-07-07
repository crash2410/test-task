import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/normalize.css'
import './styles/global.css'
import ContextProvider from "./store/Context/Context.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
      <ContextProvider>
          <App />
      </ContextProvider>
  // </React.StrictMode>,
)

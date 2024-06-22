import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Main from './pages/main.tsx';

const router = createBrowserRouter([
  {
    "path": "/",
    "element": <Main />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Main />
)

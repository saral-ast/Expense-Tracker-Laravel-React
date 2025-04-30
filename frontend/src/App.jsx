import { BrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import router from "./routes/router";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

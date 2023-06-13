import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup/Signup";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <h1>Hello World!</h1> },
    { path: "sign-up", element: <Signup /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

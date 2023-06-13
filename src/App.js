import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MyComponent from "./components/MyComponent/MyComponent";
import Signup from "./components/Signup/Signup";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <h1>Hello World!</h1> },
    { path: "sign-up", element: <Signup /> },
    { path: "my-component", element: <MyComponent /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

import axios from "axios";
import { useCallback, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import MyComponent from "./components/MyComponent/MyComponent";
import Signup from "./components/Signup/Signup";
import { useAuth } from "./contexts/auth-context";

function App() {
  const { login, logout, isAuthenticated, expiresAt } = useAuth();

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        }
      );

      const { user, accessToken, expiresAt } = response.data;

      if (response.status === 204) {
        logout();
      } else {
        login(user, accessToken, expiresAt);
      }
    } catch (error) {
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    refreshAccessToken();
    console.log("run once");
  }, [refreshAccessToken]);

  useEffect(() => {
    let refreshAccessTokenTimerId;

    if (isAuthenticated) {
      refreshAccessTokenTimerId = setTimeout(() => {
        refreshAccessToken();
      }, new Date(expiresAt).getTime() - Date.now() - 10 * 1000);
    }

    return () => {
      if (isAuthenticated && refreshAccessTokenTimerId) {
        clearTimeout(refreshAccessTokenTimerId);
      }
    };
  }, [expiresAt, isAuthenticated, refreshAccessToken]);

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "sign-up", element: <Signup /> },
    { path: "login", element: <Login /> },
    { path: "my-component", element: <MyComponent /> },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

import axios from "axios";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";

import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";
import Login from "./components/Login/Login";
import MyComponent from "./components/MyComponent/MyComponent";
import Signup from "./components/Signup/Signup";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Users from "./components/Users/Users";

import { useAuth } from "./contexts/auth-context";
import { STATUS } from "./utils/utils";

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
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <RequireAuth redirectTo="/sign-up">
              <Home />
            </RequireAuth>
          ),
        },
        {
          path: "sign-up",
          element: (
            <RedirectIfLoggedIn redirectTo="/">
              <Signup />
            </RedirectIfLoggedIn>
          ),
        },
        {
          path: "login",
          element: (
            <RedirectIfLoggedIn redirectTo="/">
              <Login />
            </RedirectIfLoggedIn>
          ),
        },
        {
          path: "users",
          element: (
            <RequireAuth redirectTo="/">
              <Users />
            </RequireAuth>
          ),
        },
        {
          path: "/my-component",
          element: <MyComponent />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

const RequireAuth = ({ children, redirectTo }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === STATUS.PENDING) return <SplashScreen />;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} />
  );
};

RequireAuth.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

const RedirectIfLoggedIn = ({ children, redirectTo }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === STATUS.PENDING) return <SplashScreen />;

  return isAuthenticated ? (
    <Navigate to={location.state?.from.pathname || redirectTo} />
  ) : (
    children
  );
};

RedirectIfLoggedIn.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

export default App;

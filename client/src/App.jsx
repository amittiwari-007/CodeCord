import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./utilities/NotFound";
import LandingPage from "./components/LandingPage/index";
import Contest from "./components/Contests/index";
import Problem from "./components/Problems/index";
import Discussion from "./components/Discussions/index";
import Editor from "./components/Editor/index";
import AppLayout from "./layouts/AppLayout";
import LandingLayout from "./layouts/LandingLayout";
import CreateRoom from "./components/Rooms/CreateRoom";
import PasswordReset from "./components/Authentication/PasswordReset";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import { createContext, useState, useEffect } from "react";
import { logout, checkLogInStatus } from "./api/authDataAPI";
import Profile from "./components/HomePage/Profile";
import { io } from "socket.io-client";

export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [userData, setUserData] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const status = await checkLogInStatus();
      if (status.isLoggedIn && socket === null) {
        const socket = io(
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_API_URL
            : import.meta.env.DEV_API_URL,
          {
            path: "/api/v1/socket.io",
          }
        );
        setSocket(socket);
      }
      setIsLoggedIn(status.isLoggedIn);
      setUserData(status.userData);
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      const loggedOut = await logout();
      setIsLoggedIn(!loggedOut);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        socket,
        setSocket,
      }}
    >
      {typeof isLoggedIn !== "undefined" ? (
        <div className="mx-auto h-full w-full max-w-[2560px] overflow-x-hidden">
          <>
            <Routes>
              {isLoggedIn ? (
                <Route
                  path="/"
                  element={<AppLayout handleLogout={handleLogout} />}
                >
                  <Route index element={<Contest />} />
                </Route>
              ) : (
                <Route path="/" element={<LandingLayout />}>
                  <Route index element={<LandingPage />} />
                </Route>
              )}
              <Route path="/create">
                <Route index element={<CreateRoom />} />
              </Route>
              <Route
                path="/app"
                element={<AppLayout handleLogout={handleLogout} />}
              >
                <Route path="contest" element={<Contest />} />
                <Route path="problem">
                  <Route index element={<Problem />} />
                  <Route path=":name" element={<Editor isRoom={false} />} />
                </Route>
                <Route path="room">
                  <Route index element={<Problem />} />
                  <Route path=":name" element={<Editor isRoom={true} />} />
                </Route>
                <Route path="discussion" element={<Discussion />} />
                <Route path="user/:username" element={<Profile />} />
                <Route path="auth">
                  <Route path="signup" element={<SignUp />} />
                  <Route path="login" element={<Login />} />
                  <Route path="reset/request" element={<ForgotPassword />} />
                  <Route path="reset/:token" element={<PasswordReset />} />
                </Route>
              </Route>
              <Route path="/notfound" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="parent-spinner mx-auto">
            <img className="mb-14" src="/svg/logo.svg" alt="logo" />
            <div className="line mx-auto">
              <div className="inner"></div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default App;

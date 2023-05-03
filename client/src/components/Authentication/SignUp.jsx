import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "/svg/logo.svg";
import { Link } from "react-router-dom";
import FormErrors from "./FormErrors";
import { signup, checkLogInStatus } from "../../api/authDataAPI";
import { AuthContext } from "../../App";
import { io } from "socket.io-client";

const SignUp = (props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [apiErrors, setAPIErrors] = useState();
  const [status, setStatus] = useState();

  const { setIsLoggedIn, setUserData, setSocket } = useContext(AuthContext);

  const onSubmit = async (formData) => {
    setStatus("waiting");
    try {
      await signup(formData);
      const status = await checkLogInStatus();
      setIsLoggedIn(status.isLoggedIn);
      setUserData(status.userData);
      if (status.isLoggedIn) {
        const socket = io(
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_API_URL
            : import.meta.env.DEV_API_URL,
          {
            path: "/api/v1/socket.io",
          }
        );
        setSocket(socket);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setAPIErrors(<FormErrors message={err.response.data.message} />);
    }
    setStatus("");
  };

  return (
    <div className="flex flex-row items-center grow w-full py-9 px-9">
      <form
        className="flex flex-col w-[400px] max-w-7xl mx-auto items-center justify-center px-5 py-10 gap-y-6 text-white bg-secondary rounded-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <img className="mb-12" src={logo} alt="logo" />
        <div className="w-full relative group">
          <input
            type="text"
            className={`w-full rounded-xl h-18 px-6 py-6 text-base 
            ${errors.username ? "border border-hardRed" : ""} 
            outline-none focus:border focus:border-accent1 bg-grey3 relative`}
            name="username"
            placeholder="Username"
            {...register("username", {
              required: "Please provide a username.",
              pattern: {
                value:
                  /^(?=.{4,20}$)(?!.*\s)(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_.])$/,
                message:
                  "Username should be 4 to 20 characters long, only digits, letters and underscores are allowed. Do not end with an underscore.",
              },
            })}
          ></input>
          {errors.username && (
            <span className="mt-2 text-red-600">{errors.username.message}</span>
          )}
        </div>
        <div className="w-full relative group">
          <input
            type="password"
            className={`w-full rounded-xl h-18 px-6 py-6 text-base 
            ${errors.password ? "border border-hardRed" : ""} 
            outline-none focus:border focus:border-accent1 bg-grey3`}
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "Please provide a password.",
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                message:
                  "Must have 8 characters, at least one letter, one digit and one special character(@, $, !, %, *, #, ?, &)",
              },
            })}
          ></input>
          {errors.password && (
            <span className="mt-2 text-red-600">{errors.password.message}</span>
          )}
        </div>
        <div className="w-full relative group">
          <input
            type="password"
            className={`w-full rounded-xl h-18 px-6 py-6 text-base
            ${errors.passwordConfirm ? "border border-hardRed" : ""}
            outline-none focus:border focus:border-accent1 bg-grey3`}
            name="passwordConfirm"
            placeholder="Confirm password"
            {...register("passwordConfirm", {
              required: "Please confirm your password",
              validate: (val) => {
                if (watch("password") != val) {
                  return "Passwords do no match";
                }
              },
            })}
          ></input>
          {errors.passwordConfirm && (
            <span className="mt-2 text-red-600">
              {errors.passwordConfirm.message}
            </span>
          )}
        </div>
        <div className="w-full relative group">
          <input
            type="email"
            className="w-full rounded-xl h-18 px-6 py-6 text-base focus:outline focus:outline-accent1 bg-grey3"
            name="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Please provide an Email address.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          ></input>
          {errors.email && (
            <span className="mt-2 text-red-600">{errors.email.message}</span>
          )}
        </div>
        {apiErrors}
        <button
          disabled={status === "waiting"}
          className="flex gap-x-3 items-center justify-center mt-6 text-2xl w-full rounded-xl h-18 px-6 py-6 font-bold bg-accent1"
        >
          {status === "waiting" && <div className="spinner-border"></div>}
          Sign Up
        </button>
        <div className="flex flex-row items-center justify-center gap-x-3">
          <p className="text-white text-lg">Have an Account?</p>
          <Link className="text-grey1 text-base" to="/app/auth/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

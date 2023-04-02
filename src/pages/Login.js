import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  const errorHandler = (err) => {
    alert(err.message);
  };
  const loginHandler = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        history.push("/home");
      })
      .catch(errorHandler);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login Page</h1>
        <form onSubmit={loginHandler} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#33ACFF] focus:ring-2 focus:ring-[#33ACFF]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#33ACFF] focus:ring-2 focus:ring-[#33ACFF]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#33ACFF] hover:bg-[#0077B6] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
          <div className="mt-6 flex justify-center">
            <span className="text-gray-600 mr-2">Don't have an account?</span>
            <button
              onClick={() => history.push("/signup")}
              className="text-[#33ACFF] hover:text-[#0077B6] font-bold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

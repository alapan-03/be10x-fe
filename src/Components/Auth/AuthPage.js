// App.jsx
import React, { useState } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import URL from "../../url.js"; // Adjust the import path as necessary
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useNavigate } from "react-router-dom";


const AuthPage = () => {

    const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const url = `${URL}/api/auth/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // if (!res.ok) throw new Error(data.msg || "Something went wrong");

      toast.success("Login successful!");

      Cookies.set("token", data.token, {
        expires: 7, // days before it expires
        // secure: true, // only over HTTPS
        sameSite: "Strict", // or 'Lax' for some cross-site uses
        origin: "*", // specify the origin if needed
      });

      
      navigate("/") // Redirect to home page
      
      setMessage("Success! Token: " + data.token);
    } catch (err) {
      toast.error("Something went wrong");
      setMessage(err.message);
    }finally {
    setLoading(false);
    }
  };

  return (
    <div className="sign-in-cont">
      <Toaster position="top-center" reverseOrder={false} />
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="login-text-cont">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue</p>
        </div>
        <div className="login-name-email">
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
            placeholder="Password"
          />
        </div>
        {/* {error && <p className="error-message">{error}</p>} */}
        <p className="signup-q">
          New User?{" "}
          <a className="signup-link" href="/signup">
            Signup
          </a>
        </p>
        <button className="login-submit">
          {" "}
          {loading ? (
            <Ring size="16" stroke="2" bgOpacity="0" speed="2" color="white" />
          ) : (
            "Sign In"
          )}
        </button>{" "}
      </form>
    </div>
  );
};

export default AuthPage;

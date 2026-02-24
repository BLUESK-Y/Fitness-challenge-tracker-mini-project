import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../services/api";
import "./LoginModal.css"

/*Validation Schema */
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),

  password: yup
    .string()
    .required("Password is required"),
});

const LoginModal = ({ switchToSignup, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /*Login Submit*/
  const onSubmit = async (data) => {
    try {
      // Find user by email
      const res = await api.get(`/user?email=${data.email}`);

      if (res.data.length === 0) {
        alert("User not found");
        return;
      }

      const user = res.data[0];

      // Check password
      if (user.password !== data.password) {
        alert("Incorrect password");
        return;
      }

      // Save logged user
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2 className="modal-title">Welcome Back</h2>
      <p className="modal-subtitle">
        Please enter your details to access your dashboard.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Email */}
        <div className="input-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          <p className="error">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          <p className="error">{errors.password?.message}</p>
        </div>

        <button type="submit" className="modal-btn">
          Login
        </button>

        <p className="switch-text">
          Don’t have an account?{" "}
          <span onClick={switchToSignup}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default LoginModal;
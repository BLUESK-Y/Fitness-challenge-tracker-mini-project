import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../services/api";
import "./SignupModal.css"

/* Validation Schema*/
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupModal = ({ switchToLogin, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /*Submit Function*/
  const onSubmit = async (data) => {
    try {
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
        totalPoints: 0,
      };

      await api.post("/user", newUser);

      alert("Signup successful!");
      reset();

      if (onSuccess) onSuccess(); 
      
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h2 className="modal-title">Create Account</h2>
      <p className="modal-subtitle">
        Enter your details to create your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div className="input-group">
          <label>Name</label>
          <input type="text" {...register("name")} />
          <p className="error">{errors.name?.message}</p>
        </div>

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

        {/* Confirm Password */}
        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" {...register("confirmPassword")} />
          <p className="error">{errors.confirmPassword?.message}</p>
        </div>

        {/* Submit Button */}
        <button type="submit" className="modal-btn">
          Sign Up
        </button>

        {/* Switch to Login */}
        <p className="switch-text" style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <span className="switch-text" onClick={switchToLogin}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupModal;
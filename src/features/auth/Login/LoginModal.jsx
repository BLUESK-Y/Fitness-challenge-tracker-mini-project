import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
  setServerError("");
  setLoading(true);
  try {
    const res = await api.get(`/user?email=${data.email}`).catch((err) => {
      //  MockAPI returns 404 when no user matches the email filter
      if (err.response?.status === 404) return { data: [] };
      throw err;
    });

    if (res.data.length === 0) {
      setServerError("No account found with this email.");
      setLoading(false);
      return;
    }

    const user = res.data[0];

    if (user.password !== data.password) {
      setServerError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    if (onSuccess) onSuccess();
    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    setServerError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h2 className="modal-title">Welcome Back</h2>
      <p className="modal-subtitle">
        Please enter your details to access your dashboard.
      </p>

      {/* Server-level error banner */}
      {serverError && (
        <div className="auth-error-banner">
          <span>⚠️</span> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Email */}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            className={errors.email ? "input-error" : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className="field-error">⚠ {errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? "input-error" : ""}
            {...register("password")}
          />
          {errors.password && (
            <p className="field-error">⚠ {errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="modal-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={switchToSignup}>Sign Up</span>
        </p>

      </form>
    </div>
  );
};

export default LoginModal;
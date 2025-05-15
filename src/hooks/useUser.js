import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicClient } from "../config/api";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

const login = async () => {
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
  const { data } = await publicClient.post("/users/login", { email, password });
  console.log("Response:", data);

    if (!data) {
      throw new Error("Login gagal");
    }

  const token = data.Data?.token || data.data?.token || data.token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      throw new Error("No token received");
    }

    setSuccess("Login successful!");
    navigate("/dashboard");
  } catch (err) {
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

return {
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  success,
  login,
};

};

export default useLogin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (!response.ok) {
      throw new Error(data.Message || data.message || "Login failed");
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
    setError(err.message);
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

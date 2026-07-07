import { useEffect, useState } from "react";
import "./ExamApp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export default function LoginScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id,setUserId]= useState(null)

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://question-paper-app-1.onrender.com/api/login/",
        {
          username: email,
          password: password,
        }
      );
      // setUserId(response.data["user id"])
      console.log(response.data)
      // Save logged-in user
    // localStorage.setItem(
    //   "user",
    //   JSON.stringify(response.data)
    // );

    sessionStorage.setItem(
      "user",
      JSON.stringify(response.data)
    )

      const role = response.data.role;

      if (role === "SME") {
        navigate("/sme");
      } else {
        navigate("/exam");
      }

    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };
  

  useEffect(()=>{
    sessionStorage.clear()

  },[])

  return (
    <div className="login-screen">
      <div className="login-logo">
        <BookIcon />
      </div>
      {console.log(JSON.stringify(sessionStorage, null, 2))}
      <h1 className="login-title">Welcome back</h1>

      <p className="login-sub">
        Sign in to access your exams
      </p>

      <div className="login-form">
        <div className="input-group">
          <label className="input-label">Username</label>

          <input
            className="input-field"
            type="text"
            placeholder="Enter username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>

          <input
            className="input-field"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-login"
          onClick={handleLogin}
        >
          Sign in
        </button>
      </div>

      <p className="login-footer">
        Don't have an account? <a href="#">Register</a>
      </p>
    </div>
  );
}
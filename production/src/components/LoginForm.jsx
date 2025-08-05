import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import googleLogo from "../assets/google.png";
import naverLogo from "../assets/naver.png";

const LoginForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { id, password };

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log("서버 응답:", result);

      if (response.ok && result.message === "로그인 성공") {
        alert("로그인 성공!");
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/main");
      } else {
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류 발생");
    }
  };

  const handleSocialLogin = (type) => {
    console.log(`${type} 로그인 클릭`);
    // 실제 소셜 로그인 로직 추가 예정
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
      <div className="login-container">
        {/* 로고 영역 */}
        <div className="logo-container">
          <h1 className="logo-text purple">🎬 FILMPRO</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1>로그인</h1>
          <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button type="submit">로그인</button>

          <div className="divider">또는</div>

          <div className="social-login">
            <button
                type="button"
                className="social-btn google"
                onClick={() => handleSocialLogin("Google")}
            >
              <img src={googleLogo} alt="Google" />
              Google 로그인
            </button>
            <button
                type="button"
                className="social-btn naver"
                onClick={() => handleSocialLogin("Naver")}
            >
              <img src={naverLogo} alt="Naver" />
              Naver 로그인
            </button>
          </div>

          <button type="button" className="signup-btn" onClick={handleSignup}>
            회원가입
          </button>
        </form>
      </div>
  );
};

export default LoginForm;

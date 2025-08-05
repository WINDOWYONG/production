import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

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
      console.log("서버 응답 전체:", result);

      if (response.ok && result.message === "로그인 성공") {
        alert("로그인 성공!");

        // 토큰과 로그인 상태를 localStorage에 저장
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("isLoggedIn", "true");

        // 로그인 후 메인 페이지 이동
        navigate("/main");
      } else {
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류 발생");
    }
  };

  return (
      <div className="login-container">
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
        </form>
      </div>
  );
};

export default LoginForm;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // 추가
import "./SignupForm.css";

const SignupForm = () => {
    const navigate = useNavigate();  // 추가
    const [formData, setFormData] = useState({
        username: "",
        id: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const [passwordMatch, setPasswordMatch] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "phone") {
            const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
            if (numbersOnly.length <= 3) {
                formattedValue = numbersOnly;
            } else if (numbersOnly.length <= 7) {
                formattedValue = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
            } else {
                formattedValue = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
                    3,
                    7
                )}-${numbersOnly.slice(7)}`;
            }
        }

        setFormData((prev) => {
            const updated = { ...prev, [name]: formattedValue };

            if (name === "password" || name === "confirmPassword") {
                if (updated.confirmPassword === "") {
                    setPasswordMatch(null);
                } else if (updated.password === updated.confirmPassword) {
                    setPasswordMatch(true);
                } else {
                    setPasswordMatch(false);
                }
            }

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordMatch !== true) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const { confirmPassword, username, id, password, phone } = formData;

        const sendData = {
            username,
            id,
            password,
            phone,
        };

        console.log("서버로 전송하는 데이터:", sendData);

        try {
            const response = await axios.post("http://localhost:8081/api/users", sendData);
            console.log("서버 응답 데이터:", response.data);
            alert(typeof response.data === "string" ? response.data : "회원가입 완료되었습니다.");

            console.log("회원가입 성공 - 이동 시도");
            navigate("/");


            // 폼 초기화 (필요하면 유지)
            setFormData({
                username: "",
                id: "",
                password: "",
                confirmPassword: "",
                phone: "",
            });
            setPasswordMatch(null);

        } catch (error) {
            console.error("회원가입 오류:", error);
            if (error.response) {
                console.error("서버 에러 응답 데이터:", error.response.data);
                alert(error.response.data.message || "회원가입에 실패했습니다.");
            } else {
                alert("회원가입에 실패했습니다.");
            }
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h1>회원가입</h1>

                <input
                    type="text"
                    name="username"
                    placeholder="이름"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="id"
                    placeholder="아이디"
                    value={formData.id}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={
                        passwordMatch === false
                            ? "input-error"
                            : passwordMatch === true
                                ? "input-success"
                                : ""
                    }
                />
                <div className="message-box">
                    {passwordMatch === false && (
                        <div className="message error">비밀번호가 일치하지 않습니다.</div>
                    )}
                    {passwordMatch === true && (
                        <div className="message success">비밀번호가 일치합니다 ✔</div>
                    )}
                </div>

                <input
                    type="tel"
                    name="phone"
                    placeholder="전화번호"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={passwordMatch !== true}>
                    회원가입
                </button>
            </form>
        </div>
    );
};

export default SignupForm;

// src/components/AuthWrapper.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode";

const AuthWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    // 로그아웃 처리 함수
    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isLoggedIn");
        alert("로그인이 만료되어 로그아웃되었습니다. 다시 로그인해주세요.");
        navigate("/login", { replace: true });
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            // 토큰 없으면 로그인 페이지로 강제 이동
            navigate("/login", { replace: true });
            return;
        }

        let logoutTimeout;

        try {
            // 토큰 디코딩
            const decoded = jwt_decode.default(token);
            const now = Date.now() / 1000; // 현재 시간(초 단위)

            console.log("토큰 만료 시간 (exp):", decoded.exp);
            console.log("현재 시간:", now);

            // 만료된 토큰이면 즉시 로그아웃
            if (decoded.exp < now) {
                logout();
                return;
            }

            // 토큰 만료까지 남은 시간(ms)
            const timeLeft = (decoded.exp - now) * 1000;

            // 만료 1분 전에 로그아웃 예약 (시간이 너무 짧으면 바로 로그아웃)
            if (timeLeft > 60000) {
                logoutTimeout = setTimeout(() => {
                    logout();
                }, timeLeft - 60000);
            } else {
                logout();
            }
        } catch (error) {
            console.error("토큰 디코딩 중 오류:", error);
            logout();
        } finally {
            setChecking(false);
        }

        // cleanup 함수에서 예약 타이머 제거
        return () => {
            if (logoutTimeout) clearTimeout(logoutTimeout);
        };
    }, [navigate, logout]);

    // 토큰 확인 중에는 간단한 메시지 표시
    if (checking) {
        return (
            <div
                style={{
                    display: "flex",
                    height: "100vh",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "1.5rem",
                }}
            >
                인증 상태 확인 중...
            </div>
        );
    }

    // 토큰 유효하면 자식 컴포넌트 렌더링
    return <>{children}</>;
};

export default AuthWrapper;

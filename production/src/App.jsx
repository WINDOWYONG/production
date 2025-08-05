import React from "react";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import MainPage from "./components/MainPage";  // 이름 일치시킴
import Project from "./components/Project.jsx";

const router = createBrowserRouter(
    [
        { path: "/", element: <Navigate to="/main" replace /> },
        { path: "/login", element: <LoginForm /> },          // 이 부분 추가
        { path: "/signup", element: <SignupForm /> },
        { path: "/main", element: <MainPage /> },
        { path: "/Project", element: <Project /> },
    ],
    {
        future: {
            v7_relativeSplatPath: true,
        },
    }
);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;

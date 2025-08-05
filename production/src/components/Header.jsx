import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <div className="Header">
            <h1>
                Production <span>🎬</span>
            </h1>

            <button className="logout-btn" onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );
};

export default Header;

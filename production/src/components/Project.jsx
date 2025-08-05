import React, { useState } from 'react';
import "./Project.css";
import {
    Film,
    Tv,
    Music,
    Megaphone,
    Building,
    Youtube,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon
} from 'lucide-react';

const Step1ProjectCreate = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [projectData, setProjectData] = useState({
        title: '',
        budget: '',
        description: '',
        startDate: null,
        endDate: null
    });

    const [currentStartMonth, setCurrentStartMonth] = useState(new Date());
    const [currentEndMonth, setCurrentEndMonth] = useState(new Date());

    const categories = [
        { id: 'youtube', title: '유튜브', icon: <Youtube className="category-icon" />, description: '브이로그, 리뷰, 교육 콘텐츠', colorClass: 'youtube' },
        { id: 'entertainment', title: '예능 & 방송', icon: <Tv className="category-icon" />, description: 'TV 프로그램, 웹예능', colorClass: 'entertainment' },
        { id: 'music-video', title: '뮤직비디오', icon: <Music className="category-icon" />, description: '음악 영상, 퍼포먼스', colorClass: 'music' },
        { id: 'movie', title: '영화', icon: <Film className="category-icon" />, description: '단편, 장편, 다큐멘터리', colorClass: 'movie' },
        { id: 'commercial', title: '광고 & 홍보', icon: <Megaphone className="category-icon" />, description: '브랜드 영상, CF', colorClass: 'commercial' },
        { id: 'corporate', title: '기업 영상', icon: <Building className="category-icon" />, description: '홍보, 교육, 행사', colorClass: 'corporate' }
    ];

    const CategoryCard = ({ category, isSelected, onClick }) => (
        <div
            className={`category-card ${isSelected ? `selected ${category.colorClass}` : ''}`}
            onClick={() => onClick(category.id)}
        >
            <div className="category-content">
                <div className="category-icon-container">{category.icon}</div>
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
            </div>
            {!isSelected && <div className="category-hover-effect" />}
        </div>
    );

    const generateCalendar = (date, selectedDate, onDateSelect) => {
        if (!date || !(date instanceof Date)) return [];

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

        daysOfWeek.forEach(day => {
            days.push(
                <div key={`header-${day}`} className="calendar-day-header">
                    {day}
                </div>
            );
        });

        // 이전 달 날짜
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${i}`} className="calendar-day prev-month">
                    {prevMonthDays - i}
                </div>
            );
        }

        // 현재 달 날짜
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            days.push(
                <div
                    key={day}
                    className={`calendar-day current-month ${isSelected ? 'selected' : ''}`}
                    onClick={() => onDateSelect(currentDate)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    const Calendar = ({ title, currentMonth, setCurrentMonth, selectedDate, onDateSelect, icon }) => {
        const month = currentMonth instanceof Date ? currentMonth : new Date();

        const changeMonth = (direction) => {
            const newMonth = new Date(month);
            newMonth.setMonth(newMonth.getMonth() + direction);
            setCurrentMonth(newMonth);
        };

        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    {icon}
                    <h3>{title}</h3>
                </div>

                <div className="calendar-nav">
                    <button onClick={() => changeMonth(-1)} className="calendar-nav-btn" aria-label="이전 달">
                        <ChevronLeft className="nav-icon" />
                    </button>
                    <span className="current-month">
                        {month.getFullYear()}년 {month.getMonth() + 1}월
                    </span>
                    <button onClick={() => changeMonth(1)} className="calendar-nav-btn" aria-label="다음 달">
                        <ChevronRight className="nav-icon" />
                    </button>
                </div>

                <div className="calendar-grid">{generateCalendar(month, selectedDate, onDateSelect)}</div>
            </div>
        );
    };

    const handleInputChange = (field, value) => {
        setProjectData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const createProject = async () => {
        if (!selectedCategory) {
            alert('카테고리를 선택해주세요.');
            return;
        }
        if (!projectData.title.trim()) {
            alert('프로젝트 제목을 입력해주세요.');
            return;
        }
        if (!projectData.startDate || !projectData.endDate) {
            alert('촬영 시작일과 종료일을 선택해주세요.');
            return;
        }
        if (projectData.startDate > projectData.endDate) {
            alert('촬영 시작일이 종료일보다 늦을 수 없습니다.');
            return;
        }

        const token = localStorage.getItem('accessToken');  // 토큰 가져오기
        if (!token) {
            alert('로그인이 필요합니다.');
            // 필요시 로그인 페이지로 이동 처리 추가 가능
            // navigate('/login');
            return;
        }
        console.log('저장된 토큰:', token);

        const projectInfo = {
            category: selectedCategory,
            title: projectData.title,
            budget: Number(projectData.budget),
            description: projectData.description,
            startDate: projectData.startDate.toISOString().split('T')[0],
            endDate: projectData.endDate.toISOString().split('T')[0],
        };

        try {
            const response = await fetch('http://localhost:8081/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // JWT 토큰 넣기
                },
                body: JSON.stringify(projectInfo),
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`프로젝트 생성 실패: ${errorText}`);
                console.error('서버 오류 응답:', errorText);
                return;
            }

            const result = await response.json();
            console.log('프로젝트 생성 성공:', result);
            alert('프로젝트가 성공적으로 생성되었습니다!');
        } catch (error) {
            console.error('프로젝트 생성 중 오류:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };


    return (
        <div className="app-container">
            <div className="main-container">
                {/* 헤더 */}
                <header className="header">
                    <h1 className="main-title">🎬 FilmPro</h1>
                    <p className="main-subtitle">전문적인 영상 제작을 위한 올인원 플랫폼</p>
                </header>

                <main className="main-form">
                    {/* 카테고리 선택 */}
                    <section className="form-section">
                        <div className="section-header">
                            <div className="section-divider" />
                            <h2>📹 영상 카테고리 선택</h2>
                        </div>

                        <div className="category-grid">
                            {categories.map(category => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    isSelected={selectedCategory === category.id}
                                    onClick={setSelectedCategory}
                                />
                            ))}
                        </div>
                    </section>

                    {/* 프로젝트 기본 정보 */}
                    <section className="form-section">
                        <div className="section-header">
                            <div className="section-divider" />
                            <h2>💰 프로젝트 기본 정보</h2>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>프로젝트 제목</label>
                                <input
                                    type="text"
                                    value={projectData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="프로젝트 제목을 입력하세요"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group budget-input-container">
                                <label>총 제작비</label>
                                <span className="currency-symbol">₩</span>
                                <input
                                    type="text"
                                    value={projectData.budget ? new Intl.NumberFormat('ko-KR').format(Number(projectData.budget)) : ''}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/[^\d]/g, '');
                                        handleInputChange('budget', onlyNums);
                                    }}
                                    placeholder="10,000,000"
                                    className="form-input budget-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>프로젝트 설명</label>
                            <textarea
                                value={projectData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="프로젝트에 대한 상세한 설명을 입력하세요"
                                rows={4}
                                className="form-textarea"
                            />
                        </div>
                    </section>

                    {/* 제작 일정 */}
                    <section className="form-section">
                        <div className="section-header">
                            <div className="section-divider" />
                            <h2>📅 제작 일정</h2>
                        </div>

                        <div className="calendar-row">
                            <Calendar
                                title="촬영 시작일"
                                currentMonth={currentStartMonth}
                                setCurrentMonth={setCurrentStartMonth}
                                selectedDate={projectData.startDate}
                                onDateSelect={(date) => handleInputChange('startDate', date)}
                                icon={<CalendarIcon className="calendar-title-icon start" />}
                            />

                            <Calendar
                                title="촬영 종료일"
                                currentMonth={currentEndMonth}
                                setCurrentMonth={setCurrentEndMonth}
                                selectedDate={projectData.endDate}
                                onDateSelect={(date) => handleInputChange('endDate', date)}
                                icon={<CalendarIcon className="calendar-title-icon end" />}
                            />
                        </div>
                    </section>

                    {/* 생성 버튼 */}
                    <button onClick={createProject} className="create-button">
                        ✨ 프로젝트 생성하기
                    </button>
                </main>
            </div>
        </div>
    );
};

export default Step1ProjectCreate;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, DollarSign, Clock, Users, Film, Tv, Music, Megaphone, Building, Youtube, Search, Filter, MoreVertical, Play, Pause, CheckCircle } from 'lucide-react';
import './MainPage.css';

const MainPage = () => {
    const navigate = useNavigate();

    // 로그인 여부 체크
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const [projects, setProjects] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const categoryIcons = {
        youtube: { icon: <Youtube className="w-5 h-5" />, color: 'youtube', name: '유튜브' },
        entertainment: { icon: <Tv className="w-5 h-5" />, color: 'entertainment', name: '예능' },
        'music-video': { icon: <Music className="w-5 h-5" />, color: 'music', name: '뮤직비디오' },
        movie: { icon: <Film className="w-5 h-5" />, color: 'movie', name: '영화' },
        commercial: { icon: <Megaphone className="w-5 h-5" />, color: 'commercial', name: '광고' },
        corporate: { icon: <Building className="w-5 h-5" />, color: 'corporate', name: '기업' }
    };

    const statusConfig = {
        planning: { label: '기획 중', color: 'status-planning', icon: <Clock className="w-4 h-4" /> },
        'in-progress': { label: '진행 중', color: 'status-progress', icon: <Play className="w-4 h-4" /> },
        'on-hold': { label: '보류', color: 'status-hold', icon: <Pause className="w-4 h-4" /> },
        completed: { label: '완료', color: 'status-completed', icon: <CheckCircle className="w-4 h-4" /> }
    };

    // 필터링 적용
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const formatBudget = (budget) => {
        return new Intl.NumberFormat('ko-KR').format(budget);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    const getDaysLeft = (endDate) => {
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const ProjectCard = ({ project }) => {
        const categoryInfo = categoryIcons[project.category];
        const statusInfo = statusConfig[project.status];
        const daysLeft = getDaysLeft(project.endDate);

        return (
            <div className={`project-card ${categoryInfo.color}`} onClick={() => handleProjectClick(project.id)}>
                <div className="project-card-header">
                    <div className="project-thumbnail">
                        {project.thumbnail}
                    </div>
                    <div className="project-actions">
                        <button className="action-btn">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="project-info">
                    <div className="project-category">
                        {categoryInfo.icon}
                        <span>{categoryInfo.name}</span>
                    </div>

                    <h3 className="project-title">{project.title}</h3>

                    <div className={`project-status ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                    </div>

                    <div className="project-progress">
                        <div className="progress-header">
                            <span>진행률</span>
                            <span>{project.progress}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="project-details">
                        <div className="detail-item">
                            <DollarSign className="w-4 h-4" />
                            <span>₩{formatBudget(project.budget)}</span>
                        </div>
                        <div className="detail-item">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                        </div>
                        <div className="detail-item">
                            <Users className="w-4 h-4" />
                            <span>{project.team.length}명</span>
                        </div>
                    </div>

                    {project.status !== 'completed' && (
                        <div className={`days-left ${daysLeft < 7 ? 'urgent' : ''}`}>
                            {daysLeft > 0 ? `${daysLeft}일 남음` : '마감 임박'}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 로그인 여부에 따른 빈 상태 컴포넌트
    const EmptyState = () => (
        <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{isLoggedIn ? "현재 진행 중인 프로젝트가 없습니다" : "로그인 후 이용 가능합니다"}</h3>
            <p>새로운 영상 제작 프로젝트를 시작해보세요!</p>
            {isLoggedIn ? (
                <button className="create-first-project-btn" onClick={() => navigate('/Project')}>
                    <Plus className="w-5 h-5" />
                    첫 번째 프로젝트 만들기
                </button>
            ) : (
                <button className="create-first-project-btn" onClick={() => navigate('/login')}>
                    로그인
                </button>
            )}
        </div>
    );

    const handleProjectClick = (projectId) => {
        console.log('프로젝트 상세 페이지로 이동:', projectId);
        // TODO: 상세 페이지 라우팅 처리
    };

    const handleCreateProject = () => {
        navigate('/Project');
    };

    return (
        <div className="dashboard-container">
            {/* 헤더 */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">🎬 FilmPro</h1>
                        <p className="dashboard-subtitle">프로젝트 대시보드</p>
                    </div>
                    {/* 로그인 상태일 때만 프로젝트 생성 버튼 표시 */}
                    {isLoggedIn && projects.length > 0 && (
                        <div className="header-right">
                            <button className="create-project-btn" onClick={handleCreateProject}>
                                <Plus className="w-5 h-5" />
                                프로젝트 생성
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 필터 및 검색 - 로그인 및 프로젝트 있을 때만 */}
            {isLoggedIn && projects.length > 0 && (
                <div className="dashboard-controls">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="프로젝트 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-container">
                        <Filter className="filter-icon" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">전체 상태</option>
                            <option value="planning">기획 중</option>
                            <option value="in-progress">진행 중</option>
                            <option value="on-hold">보류</option>
                            <option value="completed">완료</option>
                        </select>
                    </div>
                </div>
            )}

            {/* 프로젝트 목록 또는 빈 상태 */}
            <div className="dashboard-content">
                {filteredProjects.length > 0 ? (
                    <>
                        <div className="projects-summary">
                            <h2>프로젝트 ({filteredProjects.length})</h2>
                            <div className="summary-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{projects.filter(p => p.status === 'in-progress').length}</span>
                                    <span className="stat-label">진행 중</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{projects.filter(p => p.status === 'planning').length}</span>
                                    <span className="stat-label">기획 중</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{projects.filter(p => p.status === 'completed').length}</span>
                                    <span className="stat-label">완료</span>
                                </div>
                            </div>
                        </div>

                        <div className="projects-grid">
                            {filteredProjects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </>
                ) : projects.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="no-results">
                        <div className="no-results-icon">🔍</div>
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 검색어나 필터를 시도해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;

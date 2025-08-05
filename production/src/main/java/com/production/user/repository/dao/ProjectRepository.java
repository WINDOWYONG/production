package com.production.user.repository.dao;

import com.production.user.model.vo.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // 필요 시 커스텀 메서드 추가 가능
}

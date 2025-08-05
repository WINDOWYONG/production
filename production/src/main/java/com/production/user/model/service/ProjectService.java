package com.production.user.model.service;

import com.production.user.model.vo.Project;
import com.production.user.repository.dao.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
}

package com.production.user.model.service;

import com.production.user.model.vo.User;
import com.production.user.repository.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 아이디 중복 체크
    public boolean isUserExist(String userId) {
        return userRepository.findByUserId(userId).isPresent();
    }

    // 회원가입 처리
    public void registerUser(User user) {
        userRepository.save(user);
    }

    // 로그인용 사용자 조회
    public User findUserById(String userId) {
        Optional<User> optionalUser = userRepository.findByUserId(userId);
        return optionalUser.orElse(null);
    }
}

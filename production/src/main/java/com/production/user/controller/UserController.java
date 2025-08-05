package com.production.user.controller;

import com.production.user.model.vo.User;
import com.production.user.model.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.production.user.util.JwtUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService service;

    // 회원가입
    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (service.isUserExist(user.getUserId())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "이미 존재하는 아이디입니다."));
        }

        service.registerUser(user);
        return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
    }

    // 아이디 중복 확인
    @GetMapping("/{userId}/exists")
    public ResponseEntity<?> checkUsernameExists(@PathVariable String userId) {
        boolean exists = service.isUserExist(userId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String userId = loginData.get("id");
        String password = loginData.get("password");

        User user = service.findUserById(userId);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "존재하지 않는 아이디입니다."));
        }

        if (!user.getUserPwd().equals(password)) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "비밀번호가 일치하지 않습니다."));
        }

        // 로그인 성공 - JWT 토큰 생성
        String token = JwtUtil.generateToken(userId);

        return ResponseEntity.ok(Map.of(
                "message", "로그인 성공",
                "username", user.getUserName(),
                "accessToken", token  // 토큰을 응답에 추가
        ));
    }
}

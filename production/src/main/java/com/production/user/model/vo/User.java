package com.production.user.model.vo;

import javax.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_no")  // DB 컬럼명과 매핑
    private Long memberNo;

    @Column(name = "username")
    @JsonProperty("username")
    private String userName;

    @Column(name = "id")
    @JsonProperty("id")
    private String userId;

    @Column(name = "password")
    @JsonProperty("password")
    private String userPwd;

    @Column(name = "phone")
    @JsonProperty("phone")
    private String phone;

    @Column(name = "createdDate")
    private LocalDateTime createdDate;

    @PrePersist
    public void prePersist() {
        if (this.createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
    }
}

package ru.kpfu.itis.paramonov.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kpfu.itis.paramonov.service.UserService;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class HelloController {

    private UserService userService;

    @GetMapping("/hello")
    public String hello(Long userId) {
        return String.format("Hello, %s!", userService.getUser(userId).get().getUsername());
    }

    @GetMapping("/admin/hello")
    public String adminHello(Long userId) {
        return String.format("Hello, administrator %s!", userService.getUser(userId).get().getUsername());
    }
}

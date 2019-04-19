package yak.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;

@RestController
public class HealthcheckController {
    private static Map<String, String> ok = Collections.singletonMap("status", "OK");

    @GetMapping("/")
    public final Map<String, String> root() {
        return ok;
    }

    @GetMapping("/healthcheck")
    public final Map<String, String> healthcheck() {
        return ok;
    }

}

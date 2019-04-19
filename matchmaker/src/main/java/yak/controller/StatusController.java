package yak.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import yak.field.Organizer;

@RestController
public class StatusController {

    @GetMapping("/status")
    public final String root() {

        return Organizer.instance.toString();

    }

}

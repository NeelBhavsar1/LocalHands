package com.localhands.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LocalhandsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LocalhandsBackendApplication.class, args);
	}

}

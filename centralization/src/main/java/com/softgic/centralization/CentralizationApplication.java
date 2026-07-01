package com.softgic.centralization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CentralizationApplication {

	public static void main(String[] args) {
		SpringApplication.run(CentralizationApplication.class, args);
	}

}

package com.softgic.centralization;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// spring.profiles.active ya no tiene default (ver application.properties);
// este es el único test que levanta el contexto completo, así que fija su
// propio perfil en vez de depender de una variable de entorno externa.
@SpringBootTest
@ActiveProfiles("dev")
class CentralizationApplicationTests {

	@Test
	void contextLoads() {
	}

}

package com.artsquare.cipi

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CipiConfig)
class Application {

    static void main(String[] args) {
        SpringApplication.run Application, args
    }
}

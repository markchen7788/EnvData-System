package com.envDataManager.app;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class envDataManagerApp {
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		SpringApplication.run(envDataManagerApp.class, args);

	}
}

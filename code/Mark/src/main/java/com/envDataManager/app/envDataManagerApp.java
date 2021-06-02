package com.envDataManager.app;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)//设置这个可以只使用自己的数据源，不用配置springboot的数据源
public class envDataManagerApp {
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		SpringApplication.run(envDataManagerApp.class, args);

	}
}

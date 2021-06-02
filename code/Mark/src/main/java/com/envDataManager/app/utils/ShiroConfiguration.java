package com.envDataManager.app.utils;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.Filter;

import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
public class ShiroConfiguration {
	
	
	/**
	 * LifecycleBeanPostProcessor，这是个DestructionAwareBeanPostProcessor的子类，
	 * 负责org.apache.shiro.util.Initializable类型bean的生命周期的，初始化和销毁。
	 * 主要是AuthorizingRealm类的子类，以及EhCacheManager类。
	 */
	@Bean(name = "lifecycleBeanPostProcessor")
	public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
		return new LifecycleBeanPostProcessor();
	}


	/**ShiroRealm，这是个自定义的认证类，继承自AuthorizingRealm，
	 * 负责用户的认证和权限的处理，可以参考JdbcRealm的实现。
	 */
	@Bean(name="shiroRealm")
	@DependsOn("lifecycleBeanPostProcessor")
	public MyRealm shiroRealm() {
		return  new MyRealm();
	}

	/**
	 * SecurityManager，权限管理，这个类组合了登陆，登出，权限，session的处理，是个比较重要的类。
	 */
	@Bean(name = "getSecurityManager")
	public DefaultWebSecurityManager getSecurityManager() {
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setRealm(shiroRealm());
		return securityManager;

	}
	/**
	 * ShiroFilterFactoryBean，是个factorybean，为了生成ShiroFilter。
	 * 它主要保持了三项数据，securityManager，filters，filterChainDefinitionManager。
	 */
	@Bean(name = "shiroFilter")//设置拦截未认证的请求
	public ShiroFilterFactoryBean shiroFilterFactoryBean() {

		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(getSecurityManager());
		Map<String, String> map = new LinkedHashMap<String, String>();
		map.put("/**.html", "authc");
		map.put("/", "authc");
		map.put("/getConfig", "authc");
		map.put("/test/**", "authc");
		shiroFilterFactoryBean.setLoginUrl("/login.html");//设置登录主页
		shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
		return shiroFilterFactoryBean;
	}



}

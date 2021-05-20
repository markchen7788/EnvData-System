package com.envDataManager.app.utils;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

public class MyRealm  extends AuthorizingRealm{

	/**
	 * 处理用户授权或者角色分配
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		// TODO Auto-generated method stub

		return null;
	}
	/**
	 * 处理用户登录
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		UsernamePasswordToken _token = (UsernamePasswordToken) token;
		String userName=_token.getUsername();//获得当前登录用户名称
		String pwd=String.valueOf(_token.getPassword());
		return new SimpleAuthenticationInfo(userName, token.getCredentials(), getName());
	}


}

package com.envDataManager.app.db;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.rmi.RemoteException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import com.alibaba.fastjson.JSONObject;

public class db {//用于连接数据库的类
	public static db DB=null;
	Connection con=null; 
	Properties properties=new Properties();
	Statement s; 
	ResultSet rs;
	List res;//结果列表
	String driverName="com.mysql.jdbc.Driver";
	String userName="";
	String userPasswd="";
	String Host="";
	String dbName="";
	/*
	 * 连接数据库并获取数据库连接
	 */
	public static db getdb()
	{
		if(DB==null) DB=new db();
		return DB;
	}
	private db()
	{
		try
		{
			Class.forName(driverName);
		}catch(ClassNotFoundException e)
		{System.out.println("Error loading Driver,不能加载驱动程序！");}
		changeParams();

	}
	public boolean changeParams()//读取配置文件（config.json)中的数据库连接信息
	{
		File file=new File("./config.json");
		if(!file.exists()) return false;
		JSONObject pro=null;
		FileReader fileReader;
		try {
			fileReader = new FileReader(file); 
			char[] b = new char[1024];
		    int len = 0;
		    if((len = fileReader.read(b)) != -1) { 
		        pro=JSONObject.parseObject(new String(b,0,len));
	    }
		    fileReader.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.userName=pro.getString("userName");
		this.userPasswd=pro.getString("pwd");
		this.Host=pro.getString("hostName");
		this.dbName=pro.getString("dbName");
		boolean res=connect();
		if(con!=null)closeCon();
		return res;
	   
	}
	private boolean connect()//连接数据库
	{
		properties.put("remarkdReporting", "true");
		properties.put("user", userName);
		properties.put("password", userPasswd);
		String url="jdbc:mysql://"+Host+"/"+dbName+"?characterEncoding=UTF-8";
		try
		{
			con=DriverManager.getConnection(url,properties);
		}
		catch(SQLException er)
		{System.out.println("Error getConnection,不能连接数据库！");return false;}
		return true;
	}
	/*
	 *关闭数据库连接
	 */
	void closeCon()
	{
		try {
			con.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/*
	 * 执行数据库查询语句
	 */
 	public List executeQuery(String ss) {
 		connect();
		try
		{
			s=con.createStatement();
			String sql=ss;
			rs=s.executeQuery(sql);
		}
		catch(SQLException er)
		{System.err.println("Error executeQuery,不能执行查询！");
			}
		try {
			res=convertList(rs);//将resultset转化成list
			closeCon();
			return res;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		closeCon();
		return null;
	}
 	/*
 	 * 执行操纵语句
 	 */
 	public boolean executeUpdate(String sql)
 	{
 		connect();
 		try
		{
			s=con.createStatement();
			boolean res=s.executeUpdate(sql)>0;
			closeCon();
			
		}
		catch(SQLException er)
		{System.err.println("Error executeupdate,不能执行update！");
		return false;
			}
 		closeCon();
 		return true;
 	}
 	/*
 	 * 执行批处理语句
 	 */
 	public boolean executeBatch(List<String> sql)
 	{
 		connect();
 		try
		{
			s=con.createStatement();
			for(String item:sql)
			{
				s.addBatch(item);
			}
			s.executeBatch();
			closeCon();
			
		}
		catch(SQLException er)
		{System.err.println("Error executeupdate,不能执行update！");
		return false;
			}
 		closeCon();
 		return true;
 	}
 	
 	public  static List convertList(ResultSet rs) throws SQLException {//将resultset转换成list<HashMap>

 	    List list = new ArrayList();
 	    ResultSetMetaData md = rs.getMetaData();
 	    int columnCount = md.getColumnCount();
 	    while (rs.next()) {
 	    	HashMap rowData = new HashMap();
 	        for (int i = 1; i <= columnCount; i++) {
 	            rowData.put(md.getColumnName(i), rs.getObject(i));
 	        }
 	        list.add(rowData);
 	    }
 	    return list;
 	}
 	//调试函数
//public static void main(String arg[])
//{
//
//	System.out.print(db.getdb());
//}
//
}

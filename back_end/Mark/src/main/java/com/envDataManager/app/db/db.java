package com.envDataManager.app.db;

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

public class db {//用于连接数据库的类
	public static db DB=null;
	Connection con=null; 
	Properties properties=new Properties();
	Statement s; 
	ResultSet rs;
	List res;//结果列表
	String driverName="com.mysql.jdbc.Driver";;
	String userName="cq";
	String userPasswd="cq1999";
	String url="jdbc:mysql://47.94.92.138:3306/envData?characterEncoding=UTF-8";
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
		properties.put("remarkdReporting", "true");
		properties.put("user", userName);
		properties.put("password", userPasswd);
		try
		{
			Class.forName(driverName);
		}catch(ClassNotFoundException e)
		{System.out.print("Error loading Driver,不能加载驱动程序！");}

	}
	private void connect()
	{
		try
		{
			con=DriverManager.getConnection(url,properties);
		}
		catch(SQLException er)
		{System.out.print("Error getConnection,不能连接数据库！");}
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
 	
 	public  static List convertList(ResultSet rs) throws SQLException {

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
//查询获取多表信息
public static List getTableInfo(String condition)
{
	//System.out.println("SELECT tab.`表名`,tab.`创建时间`,tab.`注释`,col.`参数名` FROM tab ,col WHERE tab.`表名` = col.`表名` AND tab.`表名` IN (SELECT tab.`表名` FROM tab ,col WHERE tab.`表名` = col.`表名` AND (tab.`表名` LIKE '%"+condition+"%' or col.`参数名` LIKE '%"+condition+"%')) limit "+(Integer.parseInt(page)-1)*3+",3");
	return db.getdb().executeQuery("SELECT tab.`表名`,tab.`创建时间`,tab.`注释`,col.`参数名`,col.`字段注释` FROM tab ,col WHERE tab.`表名` = col.`表名` AND tab.`表名` IN (SELECT distinct(tab.`表名`) FROM tab ,col WHERE tab.`表名` = col.`表名` AND (tab.`注释` LIKE '%"+condition+"%' or col.`参数名` LIKE '%"+condition+"%'))");
}

//根据表Id获取单表信息
public static List getCreatTableInfo(String id)
{
	return db.getdb().executeQuery("select * FROM tab,col WHERE col.`表名`=tab.`表名` AND tab.`表名`='"+id+"'; ");
}

public static void main(String arg[])
{
	List a=db.getdb().getCreatTableInfo("A");
	
	System.out.print(a);
}
	
}

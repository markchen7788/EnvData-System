package com.envDataManager.app.web;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.envDataManager.app.db.db;

@RestController
public class test {
/////普通表格的查询操作-----tableName:表名/condition:查询条件
	@RequestMapping("test/select")
	public List select(@RequestBody JSONObject jsonParam)
	{
		String tableName=jsonParam.getString("tableName"),condition=jsonParam.getString("condition"),order="",page="",count="";
		List res=new ArrayList();
		if(!StringUtils.isEmpty(condition))//拼接where条件
		{
			List colName=db.getdb().executeQuery("SELECT GROUP_CONCAT( `information_schema`.`COLUMNS`.`COLUMN_NAME` SEPARATOR '`,`' ) AS concat FROM `information_schema`.`COLUMNS`  WHERE`information_schema`.`COLUMNS`.TABLE_NAME = '"+tableName+"'");
			
			String[] strArr = condition.split("&&");
			
			for(int i=0;i<strArr.length;i++)
			{
			
				strArr[i]="CONCAT(`"+(String) ((HashMap)(colName.get(0))).get("concat")+"`) like '%"+strArr[i]+"%'" ;
			
			}
			if(!StringUtils.isEmpty(strArr)&&strArr.length>0)
			condition="where "+String.join(" AND ",strArr);
			else
			condition="";
		}
		if(jsonParam.containsKey("order"))//分页操作
		{
			String[] strArr = jsonParam.getString("order").split("&&");
			if(strArr.length>1)
				order ="ORDER BY `"+strArr[0]+"` "+strArr[1];
			else
				order ="ORDER BY `"+strArr[0]+"`";
		}
		if(jsonParam.containsKey("page"))//分页操作
		{
			page="limit "+jsonParam.getString("page");
		}
		if(jsonParam.containsKey("count"))//获取记录总数
		{
			String sql="select count(*) from `"+tableName+"` "+condition;
			System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:select || Sql:"+sql);
			List tmp=db.getdb().executeQuery(sql);
			long c=(long) ((HashMap)(tmp.get(0))).get("count(*)");
			count=String.valueOf(c);
			res.add(count);
		}
		String sql="select * from `"+tableName+"` "+condition+" "+order+" "+page;
		System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:select || Sql:"+sql);
		res.addAll(db.getdb().executeQuery(sql));
		//System.out.println(res);
		return res;
	}

	
/////普通表格的插入操作-----jsonArray:json数组,jsonParam:字段的键值对，其中需要有tableName这一键值对来指明操作对象；
	@RequestMapping("test/insert")
	public boolean insert(@RequestBody JSONArray jsonArray)
	{
		String sql = "";
		List<String> sqlList=new ArrayList<String>();
		boolean res=true;
		for(int i=0;i<jsonArray.size();i++)
		{
			JSONObject jsonParam=jsonArray.getJSONObject(i);
			boolean update_duplicate=jsonParam.containsKey("update_duplicate");
			String tableName=jsonParam.getString("tableName");
			List<String> cols=new ArrayList<String>(),values=new ArrayList<String>(),colAndValues=new ArrayList<String>();
			jsonParam.remove("tableName");
			if(update_duplicate) jsonParam.remove("update_duplicate");
			Iterator iter = jsonParam.entrySet().iterator();
	        while (iter.hasNext()) {
	            Map.Entry entry = (Map.Entry) iter.next();
	            cols.add("`"+entry.getKey().toString()+"`");
	            values.add("'"+entry.getValue().toString()+"'");
	            colAndValues.add("`"+entry.getKey().toString()+"`="+"'"+entry.getValue().toString()+"'");
	        }
	        if(update_duplicate)//是否更新主键重复的数据
	        {
	        	sql="INSERT INTO `"+tableName+"`("+String.join(",", cols)+") values("+String.join(",", values)+") ON DUPLICATE KEY UPDATE "+String.join(",", colAndValues);
	        }
	        else
	        {
	        	sql="INSERT ignore INTO `"+tableName+"`("+String.join(",", cols)+") values("+String.join(",", values)+")";
	        }
	        System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:insert || Sql:"+sql);
	        sqlList.add(sql);
		}
		return db.getdb().executeBatch(sqlList);//多条插入
		
	}

/////普通表格的修改操作-----jsonParam:字段的键值对，其中需要有tableName这一键值对来指明操作对象,需要有condition这一键值对来指定操作条件；
	@RequestMapping("test/modify")
	public boolean modify(@RequestBody JSONObject jsonParam)
	{
		String tableName=jsonParam.getString("tableName"),condition=jsonParam.getString("condition");
		List<String> cols=new ArrayList<String>();
		jsonParam.remove("tableName");
		jsonParam.remove("condition");
		Iterator iter = jsonParam.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry) iter.next();
            cols.add("`"+entry.getKey().toString()+"`='"+entry.getValue().toString()+"'");
        }
        System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:modify || Sql:UPDATE `"+tableName+"` SET "+String.join(",", cols)+" WHERE "+condition);
		return db.getdb().executeUpdate("UPDATE `"+tableName+"` SET "+String.join(",", cols)+" WHERE "+condition);
		
	}
//////普通表格的删除操作-----jsonArray:json数组,jsonParam:字段的键值对数组，其中每个数组需要有tableName这一键值对来指明操作对象,需要有condition这一键值对来指定操作条件；
	@RequestMapping("test/delete")
	public boolean delete(@RequestBody JSONArray jsonArray)
	{
		String sql = "";
		List<String> sqlList=new ArrayList<String>();
		boolean res=true;
		for(int i=0;i<jsonArray.size();i++)
		{
			JSONObject jsonParam=jsonArray.getJSONObject(i);
			String tableName=jsonParam.getString("tableName"),condition=jsonParam.getString("condition");
			List<String> cols=new ArrayList<String>();
			jsonParam.remove("tableName");
			jsonParam.remove("condition");
			sql="DELETE FROM `"+tableName+"` WHERE "+condition+";";
			System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:modify || Sql:"+sql);
			sqlList.add(sql);
		}
		res=db.getdb().executeBatch(sqlList);//多条删除
		return res;
		
	}

	/////////////////////////////////////////////////获取参数单位
	@CrossOrigin
	@RequestMapping("test/getArea")
	public List getArea(String area,String tableName)
	{
		String sql="SELECT DISTINCT(area) FROM "+tableName+" WHERE area LIKE '%"+area+"%'";
		System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:getArea || Sql:"+sql);
		return db.getdb().executeQuery(sql);
	}

///////////////////////////////////获取该表的各列的统计信息，包括max、min、avg、std
	@RequestMapping("test/getStatistics")
	public List getStatistics(String tableName)
	{
		
		List<HashMap> cols=db.getdb().executeQuery("SELECT `information_schema`.`COLUMNS`.`COLUMN_NAME` FROM `information_schema`.`COLUMNS` WHERE `information_schema`.`COLUMNS`.TABLE_NAME = '"+tableName+"';");
		String sql = "";
		List<String> co=new ArrayList<String>();
		for(HashMap s:cols)
		{
			String item=(String) s.get("COLUMN_NAME");
			co.add("MAX(`"+item+"`),"+"MIN(`"+item+"`),"+"AVG(`"+item+"`),"+"STD(`"+item+"`)");
		}
		sql="SELECT "+String.join(",", co)+" FROM `"+tableName+"`;";
		System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:getStatistics || Sql:"+sql);
		
		List<HashMap> tmp=db.getdb().executeQuery(sql);
		List res=new ArrayList();
		HashMap max=new HashMap(),min=new HashMap(),avg=new HashMap(),std=new HashMap();
		max.put("统计项目","最大值");min.put("统计项目","最小值");avg.put("统计项目","平均值");std.put("统计项目","标准差");
		for(HashMap s:cols)
		{
			String item=(String) s.get("COLUMN_NAME");
			max.put(item,tmp.get(0).get("MAX(`"+item+"`)"));
			min.put(item,tmp.get(0).get("MIN(`"+item+"`)"));
			avg.put(item,tmp.get(0).get("AVG(`"+item+"`)"));
			std.put(item,tmp.get(0).get("STD(`"+item+"`)"));
		}
		res.add(max);res.add(min);res.add(avg);res.add(std);
		return res;
		
	}

/////////////////////////////////////////////////获取参数单位
@RequestMapping("test/getUnit")
public HashMap getUnit(String tableName)
{
String sql="SELECT col.`参数名` AS na,col.`主键`,col.elementUnit AS unit FROM col WHERE col.`表名`='"+tableName+"';";
System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:getUnit || Sql:"+sql);
List<HashMap> tmp=db.getdb().executeQuery(sql);
List<String> pri=new ArrayList<>();
HashMap res=new HashMap();


for(HashMap item:tmp)
{
	res.put((String)item.get("参数名"), (String)item.get("elementUnit"));
	if(((String)item.get("主键")).equals("PRI"))
		pri.add((String)item.get("参数名"));
}
res.put("TABLE_PRI",String.join("/",pri));
return res;

}
	
	
	
///////////////////////////////////////////////////创建新表,tableName:表名,tableComment:存放站点id,param:元素列表,column_comment:存放元素Id,pri:存放主键
@RequestMapping("test/CreateTable")
public boolean CreateTable(@RequestBody JSONObject jsonParam)
{
//System.out.println(jsonParam);

String tableComment=(String) jsonParam.get("tableComment");
String siteId=(String) jsonParam.get("siteId");
String tableName=(String) jsonParam.get("tableName");
String sql="";
List<HashMap> columnList=(List<HashMap>) jsonParam.get("param");  
sql+="Create Table `"+tableName+"`(Id bigint NOT NULL UNIQUE AUTO_INCREMENT,";
for(HashMap item:columnList)
{			
sql+="`"+item.get("elementName")+"` "+item.get("dataType")+" COMMENT '"+item.get("Id")+"',";			
}
sql=sql.substring(0,sql.length()-1);
if(jsonParam.containsKey("pri")) {//是否有主键设置
	String pri=(String) jsonParam.get("pri");
	sql += ",PRIMARY KEY (" + pri + ")";
}
sql+=")";
System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:CreatTable || Sql:"+sql);
boolean res=db.getdb().executeUpdate(sql);
if(res)
{
	JSONArray s=JSONArray.parseArray("[{'tableName':'tableComment','tablename':'"+tableName+"','tableComment':'"+tableComment+"','siteId':'"+siteId+"'}]");
	res=insert(s);
}
return res;
}

/////////////////////////////////////////////////删除表格操作
@RequestMapping("test/deleteTable")
public boolean deleteTable(String tableName)
{
	String sql="DROP TABLE `"+tableName+"`";
	System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:deleteTable || Sql:"+sql);
	String sql2="DELETE  FROM tableComment WHERE tableComment.tablename='"+tableName+"'";
	System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:deleteTable || Sql:"+sql2);
	boolean res=db.getdb().executeUpdate(sql);
	res=db.getdb().executeUpdate(sql2);
	return res;
}

/////////////////////////////////////////////////设置数据库连接参数并测试连接
@RequestMapping("/config")
public boolean config(@RequestBody JSONObject jsonParam)
{
	File file=new File("./config.json");
	JSONObject tmp=getConfig();
    if (!file.exists()) {// 判断该文件是否存在
        try {
			file.createNewFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}// 创建文件
    }
    
    FileWriter fileWriter;
	try {
		fileWriter = new FileWriter("./config.json");  
		fileWriter.write(jsonParam.toJSONString());
	    fileWriter.flush();// 刷新缓冲区的内容到文件中
	    fileWriter.close();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}// 如果是true，就是往后追加
	System.out.println(new Date()+" || Function:config || configParams:"+jsonParam.toJSONString());
	if(db.getdb().changeParams()) return true;
	else
	{
		try {
			fileWriter = new FileWriter("./config.json");
			fileWriter.write(tmp.toJSONString());
			fileWriter.flush();// 刷新缓冲区的内容到文件中
			fileWriter.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}// 如果是true，就是往后追加
		db.getdb().changeParams();
		return false;
	}
}

	///////////////////////////////////////获取数据库连接参数
	@RequestMapping("/isFirst")
	public boolean isFirst()
	{
		File file=new File("./config.json");
		if(file.exists()) return false;
		System.out.println(new Date()+" || Function:isFirst || tips:初次运行本程序，请配置数据库连接和云盘地址！");
		return true;
	}

///////////////////////////////////////获取数据库连接参数

@RequestMapping("/getConfig")
public JSONObject getConfig()
{
	File file=new File("./config.json");
	if(!file.exists()) return null; 
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
	System.out.println(new Date()+" || Function:getConfig || configParams:"+pro.toJSONString());
	return pro;
}

//调试
//	public static void main(String arg[])
//	{
//		String str ="{'hostName':'markchen7788.xyz:3306','userName':'cq','pwd':'cq1999','dbName':'envData'}";
//
//		JSONObject json = JSONObject.parseObject(str); 
////		JSONObject a = new JSONObject();
////		a.put("tableName", "site");
////		a.put("condition", "Id='202104220022'");
////		a.put("siteName", "小陈小陈");
////		a.put("area", "铜川");
////	   System.out.println(new test().insert(json));
////		System.out.println(new test().getStatistics("2. 宝鸡-陈仓原始数据发送给许东"));
//		new test().config(json);
//	}
	

////////////////////////////////////////登陆操作
@RequestMapping("/doLogin")
public boolean doLogin(String userName,String pwd)
{
		String sql="select * from user where userName='"+userName+"' and pwd=****";
		System.out.println(new Date()+" || Function:doLogin || sql:"+sql);
		List res=db.getdb().executeQuery("select * from user where userName='"+userName+"' and pwd='"+pwd+"'");
		if(res.size()>0)
		{
			UsernamePasswordToken token = new UsernamePasswordToken(userName,pwd);
			SecurityUtils.getSubject().login(token);
			SecurityUtils.getSubject().getSession().setTimeout(1800000);//设置登录有效时长
			SecurityUtils.getSubject().getSession().setAttribute("user", res.get(0));
			return true;
		}
		return false;
}


///////////////////////////////////注销操作
@RequestMapping("/logout")
public String logout() {
	if(getUser()==null) return 	"logout";
	String userName= (String) getUser().get("userName");
	System.out.println(new Date()+" || userName:"+getUser().get("userName")+" || Function:logout");
    SecurityUtils.getSubject().logout();
    return "logout";
}

/////////////////////////////////////////注册操作
@RequestMapping("/registry")
public boolean registry(@RequestBody JSONArray jsonArray)
{
	
	String sql="";
	Iterator iter = jsonArray.getJSONObject(0).entrySet().iterator();
	List<String> cols=new ArrayList<String>(),values=new ArrayList<String>();
    while (iter.hasNext()) {
        Map.Entry entry = (Map.Entry) iter.next();
        cols.add("`"+entry.getKey().toString()+"`");
        values.add("'"+entry.getValue().toString()+"'");
    }
    sql="INSERT INTO `user`("+String.join(",", cols)+") values("+String.join(",", values)+")";
	System.out.println(new Date()+" || Function:registry || Sql:"+sql);
	return db.getdb().executeUpdate(sql);
}

///////////////////////////////////////////获取用户信息
@RequestMapping("/test/getUser")
public HashMap getUser()
{
	return (HashMap) SecurityUtils.getSubject().getSession().getAttribute("user");
	//return (HashMap) db.getdb().executeQuery("select * from user where userName='cq'").get(0);
}

///////////////////////////////////////////基本操作
	@CrossOrigin//crossOrigin设置后，该函数可以被非同源文件请求，即无需前端和后端在同一服务器下，可以方便开发和调试
	@RequestMapping("test/update")//基本操纵
	public boolean update(@RequestParam String sql)
	{
		System.out.println(sql);
		return  db.getdb().executeUpdate(sql);		
	}
	@CrossOrigin
	@RequestMapping("test/query")//基本查询
	public List query(@RequestParam String sql)
	{
		System.out.println(sql);
		List res=db.getdb().executeQuery(sql);	
		System.out.println(res);
		return  res;		
	}
	
}

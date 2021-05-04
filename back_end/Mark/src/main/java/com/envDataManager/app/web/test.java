package com.envDataManager.app.web;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.envDataManager.app.bean.col;
import com.envDataManager.app.db.db;

@RestController
public class test {
	@RequestMapping("test/test")
	public String test(String cName)
	{
		System.out.println(cName);
		return cName; 
		
	} 
///////////////////////////////////////////表格数据操作
	@CrossOrigin
	@RequestMapping("test/getTableData")
	public List getTableData(String tableName)
	{
		System.out.println("getTableData"+tableName);
		List res=new ArrayList();
		HashMap<String, List<?>> col = new HashMap();
		col.put("col",db.getdb().executeQuery("select * from col where 表名='"+tableName+"'"));
		res.add(col);
		res.addAll(db.getdb().executeQuery("select * from "+tableName));
		return res;
		
	} 
	
	
///////////////////////////////////////////表格操作
	@CrossOrigin
	@RequestMapping("test/getSiteInfo")
	public List getSiteInfo(String condition)
	{
		System.out.println("getSiteInfo"+condition);
		
		return db.getdb().executeQuery("SELECT * FROM site where CONCAT(siteName,Id,area,comment) like '%"+condition+"%';");
		
		
	}  
	@CrossOrigin
	@RequestMapping("test/deleteSite")
	public boolean deleteSite(String siteId)
	{
		System.out.println("deleteSite "+siteId);
		
		return db.getdb().executeUpdate("DELETE FROM site WHERE Id="+siteId);
		
		
	}  
	 
	@CrossOrigin
	@RequestMapping("test/addSite")
	public boolean addSite(@RequestBody JSONObject jsonParam)
	{
		System.out.println("addSite "+jsonParam);
		if(jsonParam.get("Id").equals("-1")) 
		{
			System.out.println("INSERT INTO site(siteName,area,`comment`) VALUES("+jsonParam.get("siteName")+","+jsonParam.get("area")+","+jsonParam.get("comment")+")");
			return  db.getdb().executeUpdate("INSERT INTO site(siteName,area,`comment`) VALUES('"+jsonParam.get("siteName")+"','"+jsonParam.get("area")+"','"+jsonParam.get("comment")+"')");
		}
		else
		{
			System.out.println("UPDATE site SET siteName='"+jsonParam.get("siteName")+"',area='"+jsonParam.get("area")+"',`comment`='"+jsonParam.get("comment")+"' WHERE Id= "+jsonParam.get("Id"));
			return  db.getdb().executeUpdate("UPDATE site SET siteName='"+jsonParam.get("siteName")+"',area='"+jsonParam.get("area")+"',`comment`='"+jsonParam.get("comment")+"' WHERE Id= "+jsonParam.get("Id"));
		}
		
	}  
	

/////普通表格的查询操作-----tableName:表名/condition:查询条件
	@CrossOrigin
	@RequestMapping("test/select")
	public List select(String tableName,String condition)
	{
		if(!StringUtils.isEmpty(condition))
		{
			List colName=db.getdb().executeQuery("SELECT GROUP_CONCAT( `information_schema`.`COLUMNS`.`COLUMN_NAME` SEPARATOR '`,`' ) AS concat FROM `information_schema`.`COLUMNS`  WHERE`information_schema`.`COLUMNS`.TABLE_NAME = '"+tableName+"'");
			
			condition="where CONCAT(`"+(String) ((HashMap)(colName.get(0))).get("concat")+"`) like '%"+condition+"%'" ;
		}
		System.out.println(new Date()+" || Function:select || Sql:select * from `"+tableName+"` "+condition);
		return db.getdb().executeQuery("select * from `"+tableName+"` "+condition);
	}
	
/////普通表格的插入操作-----jsonArray:json数组,jsonParam:字段的键值对，其中需要有tableName这一键值对来指明操作对象；
	@CrossOrigin
	@RequestMapping("test/insert")
	public boolean insert(@RequestBody JSONArray jsonArray)
	{
		String sql = "";
		List<String> sqlList=new ArrayList<String>();
		boolean res=true;
		for(int i=0;i<jsonArray.size();i++)
		{
			JSONObject jsonParam=jsonArray.getJSONObject(i);
			String tableName=jsonParam.getString("tableName"),condition=jsonParam.getString("condition");
			List<String> cols=new ArrayList<String>(),values=new ArrayList<String>();
			jsonParam.remove("tableName");
			Iterator iter = jsonParam.entrySet().iterator();
	        while (iter.hasNext()) {
	            Map.Entry entry = (Map.Entry) iter.next();
	            cols.add("`"+entry.getKey().toString()+"`");
	            values.add("'"+entry.getValue().toString()+"'");
	        }
	        sql="INSERT INTO `"+tableName+"`("+String.join(",", cols)+") values("+String.join(",", values)+")";
			System.out.println(new Date()+" || Function:insert || Sql:"+sql);
	        sqlList.add(sql);
		}
		return db.getdb().executeBatch(sqlList);//多条插入
		
	}

/////普通表格的修改操作-----jsonParam:字段的键值对，其中需要有tableName这一键值对来指明操作对象,需要有condition这一键值对来指定操作条件；
	@CrossOrigin
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
        System.out.println(new Date()+" || Function:modify || Sql:UPDATE `"+tableName+"` SET "+String.join(",", cols)+" WHERE "+condition);
		return db.getdb().executeUpdate("UPDATE `"+tableName+"` SET "+String.join(",", cols)+" WHERE "+condition);
		
	}
//////普通表格的删除操作-----jsonArray:json数组,jsonParam:字段的键值对数组，其中每个数组需要有tableName这一键值对来指明操作对象,需要有condition这一键值对来指定操作条件；
	@CrossOrigin
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
			System.out.println(new Date()+" || Function:modify || Sql:"+sql);
			sqlList.add(sql);
		}
		res=db.getdb().executeBatch(sqlList);//多条删除
		return res;
		
	}
	

//	public static void main(String arg[])
//	{
//		String str = "[{'tableName':'site','siteName':'宝鸡小绿监测站','area':'宝鸡','comment':'嘿嘿嘿'},{'tableName':'site','siteName':'西安小蓝监测站','area':'西安','comment':'哈哈哈哈'},{'tableName':'site','siteName':'咸阳小陈监测站','area':'咸阳','comment':'嘿嘿嘿'},{'tableName':'site','siteName':'铜川小秦监测站','area':'铜川','comment':'哈哈哈哈'},{'tableName':'site','siteName':'渭南小陈监测站','area':'渭南','comment':'嘿嘿嘿'},{'tableName':'site','siteName':'延安小秦监测站','area':'延安','comment':'哈哈哈哈'},{'tableName':'site','siteName':'榆林小陈监测站','area':'榆林','comment':'嘿嘿嘿'},{'tableName':'site','siteName':'汉中小秦监测站','area':'汉中','comment':'哈哈哈哈'},{'tableName':'site','siteName':'商丘小陈监测站','area':'商丘','comment':'嘿嘿嘿'},{'tableName':'site','siteName':'商南小秦监测站','area':'商南','comment':'哈哈哈哈'},{'tableName':'site','siteName':'安康小陈监测站安康','area':'安康','comment':'嘿嘿嘿'}]" ;  // 一个未转化的字符串
//
//		JSONArray json = JSONArray.parseArray(str); 
////		JSONObject a = new JSONObject();
////		a.put("tableName", "site");
////		a.put("condition", "Id='202104220022'");
////		a.put("siteName", "小陈小陈");
////		a.put("area", "铜川");
//	   System.out.println(new test().insert(json));
//	   
//	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	@CrossOrigin
	@RequestMapping("test/getTableInfo")
	public List getTableInfo(String condition)
	{
		System.out.println("getTableInfo"+condition);
		
		return db.getdb().getTableInfo(condition);
		
	}  
	
	@CrossOrigin
	@RequestMapping("test/getCreatTableInfo")
	public List getCreatTableInfo(String Id)
	{
		System.out.println("getCreatTableInfo"+Id);
		
		return db.getdb().getCreatTableInfo(Id);
		
	} 
	
	@CrossOrigin
	@RequestMapping("test/getAllCol")
	public List getAllCol(String condition)
	{
		System.out.println("getAllCol"+condition);
		
		return db.getdb().executeQuery("SELECT * FROM `col`,`tab` where  col.`表名`=tab.`表名` AND CONCAT(注释,参数名,数据类型,字段注释) like '%"+condition+"%';");
		
	}  
	
	
	public int getColCount(String tabName)
	{
		System.out.println("select count(*) as res from col where 表名='"+tabName+"'");
		HashMap temp= (HashMap) db.getdb().executeQuery("select count(*) as res from col where 表名='"+tabName+"'").get(0);
		System.out.println(temp);
		return ((Number) temp.get("res")).intValue();
	}
	
	public String generateNameByCount(long l)
	{
		String res="";
		while(l>0)
		{
		char temp='A';
		temp+=l%26;
		l/=26;
		res=temp+res;
		}
		return res;
	}
	public String getRandomName()
	{
		return generateNameByCount(System.currentTimeMillis());
	}
	
	@CrossOrigin
	@RequestMapping("test/AddColumnByTableId")
	public boolean AddColumnByTableId(@RequestBody List<col> columnList)
	{
		System.out.println("AddColumnByTableId");
		System.out.println(JSON.toJSONString(columnList));
		List<String>  Pri=new ArrayList<String>();
		boolean res=true;
		for(col item:columnList)
		{
			String type="varchar(190)",name=getRandomName();
			if(item.getPri().equals("true"))
			{
				Pri.add(name);
			}
			switch(item.getColumnType())
			{
			case "int": type="int";break;
			case "double":type="double"; break;
			case "timestamp":type="timestamp"; break;
			}
			System.out.println("ALTER TABLE "+item.getTableId()+" ADD COLUMN "+name+" "+type+" COMMENT '"+item.getColumnComment()+"'");
			res=db.getdb().executeUpdate("ALTER TABLE "+item.getTableId()+" ADD COLUMN "+name+" "+type+" COMMENT '"+item.getColumnComment()+"'");
			
		}
		List tmp=db.getdb().executeQuery("SELECT GROUP_CONCAT(参数名) as ori FROM col WHERE COLUMN_KEY='PRI' AND col.`表名`='"+columnList.get(0).getTableId()+"'");
		
		if(Pri.size()>0)
		{
			String newPri=String.join(",", Pri),ori=(String)(((HashMap)tmp.get(0)).get("ori"));
			System.out.println("ori----------------"+StringUtils.isEmpty(((HashMap)tmp.get(0)).get("ori")));
		if(!StringUtils.isEmpty(((HashMap)tmp.get(0)).get("ori")))
		{
			
			newPri=newPri+","+(String)(((HashMap)tmp.get(0)).get("ori"));
			
		}
		res=AlterPriByTableId(newPri,columnList.get(0).getTableId());
		}
		return res;
		
	}  
	
	
	@CrossOrigin
	@RequestMapping("test/AlterTableInfo")
	public boolean AlterTableInfo(String tableId,String comment)
	{
		System.out.println("AlterTableInfo  "+"ALTER TABLE "+tableId+" COMMENT '"+comment+"'");
		return db.getdb().executeUpdate("ALTER TABLE "+tableId+" COMMENT '"+comment+"'");
	}
	
	
	@CrossOrigin
	@RequestMapping("test/deleteColById")
	public boolean deleteColById(@RequestParam(value = "ids[]") String[] ids,String tableId)
	{
		boolean res=true;
		System.out.println("deleteColById");
		for(String id:ids)
		{
			System.out.println("ALTER TABLE "+tableId+" DROP COLUMN "+id);
			res=db.getdb().executeUpdate("ALTER TABLE "+tableId+" DROP COLUMN "+id);
		}
		return true;
	}
	
	@CrossOrigin
	@RequestMapping("test/AlterColumnByTableId")
	public boolean AlterColumnByTableId(@RequestBody List<col> columnList)
	{
		System.out.println("AlterColumnByTableId");
		System.out.println(JSON.toJSONString(columnList));
		boolean res=true;
		for(col item:columnList)
		{
			
			String type="varchar(190)";
			switch(item.getColumnType())
			{
			case "int": type="int";break;
			case "double":type="double"; break;
			case "timestamp":type="timestamp"; break;
			}
			System.out.println("ALTER TABLE "+item.getTableId()+" MODIFY COLUMN "+item.getColumnName()+" "+type+" COMMENT '"+item.getColumnComment()+"'");
			res=db.getdb().executeUpdate("ALTER TABLE "+item.getTableId()+" MODIFY COLUMN "+item.getColumnName()+" "+type+" COMMENT '"+item.getColumnComment()+"'");
			
		}
		
		return res;
		
	}  
	
	@CrossOrigin
	@RequestMapping("test/AlterPriByTableId")
	public boolean AlterPriByTableId(String pri,String tableId)
	{
		System.out.println("AlterPriByTableId "+pri+" "+tableId);
		boolean res=true;
		System.out.print("ALTER TABLE "+tableId+" DROP PRIMARY KEY,ADD PRIMARY KEY ("+pri+") USING BTREE;");
		db.getdb().executeUpdate("ALTER TABLE "+tableId+" DROP PRIMARY KEY");
		if(!pri.equals(""))res=db.getdb().executeUpdate("ALTER TABLE "+tableId+" ADD PRIMARY KEY ("+pri+") USING BTREE;");
		return true;
	}
	
	@CrossOrigin
	@RequestMapping("test/CreateTable")
	public boolean CreateTable(@RequestBody JSONObject jsonParam)
	{
		String tableComment=(String) jsonParam.get("tableComment"),tableName=getRandomName(),sql="";
		List<String> pri=new ArrayList<String>();
		List<HashMap> columnList=(List<HashMap>) jsonParam.get("tableCols");
		sql+="Create Table "+tableName+"(";
		int temp=1;
		for(HashMap item:columnList)
		{
			temp++;
			String type="varchar(190)";
			switch((String)(item.get("columnType")))
			{
			case "int": type="int";break;
			case "double":type="double"; break;
			case "timestamp":type="timestamp"; break;
			}
			sql+=tableName+temp+" "+type+" COMMENT '"+item.get("columnComment")+"',";
			if(item.get("pri").equals("true"))
			{
				pri.add(tableName+temp);
			}
			
		}
		sql=sql.substring(0,sql.length()-1);
		sql+=")COMMENT '"+tableComment+"'";
		System.out.print(sql);
		boolean res=db.getdb().executeUpdate(sql);
		res=AlterPriByTableId(String.join(",", pri),tableName);
		return res;
	}
	
	@CrossOrigin
	@RequestMapping("test/deleteTable")
	public boolean deleteTable(String tableId)
	{
		System.out.print("dropTable "+tableId);
		return db.getdb().executeUpdate("DROP TABLE "+tableId);
	}
	
	
	
	
///////////////////////////////////////////基本操作
	@CrossOrigin
	@RequestMapping("test/update")
	public boolean update(@RequestParam String sql)
	{
		System.out.println(sql);
		return  db.getdb().executeUpdate(sql);		
	}
	@CrossOrigin
	@RequestMapping("test/query")
	public List query(@RequestParam String sql)
	{
		System.out.println(sql);
		List res=db.getdb().executeQuery(sql);	
		System.out.println(res);
		return  res;		
	}
	
}

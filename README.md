# 可扩展的环境监测数据管理系统

## 介绍
本科毕业设计，基于Springboot的可扩展(用户可自主构建数据库表)的数据管理系统，前端基于Layui框架，主要功能包括建表、查询表的数据、数据图表化、文件管理(自建的简易php网盘)等。

## 软件架构
* 主系统
    * 前端：Layui(全局)、HighCharts（生成折线图）、sheetJS(excel转json)
    * 后端：SpringBoot(整合Spring和SpringMVC,未用Mybaits)、JDBC
    * 数据库：MySQL 5.6
* PHP网盘子系统
    * 源码和架构可参考本人[另一仓库](https://gitee.com/markchen7788/a-simple-php-network-disk)


## 安装教程

1.  数据库配置：
    * 主系统(Springboot)数据库配置：
        * 在MySQL数据库管理系统(本人所用版本5.6）中建立名为envdata的数据库，字符utf-8mb4;
        * 利用数据库可视化工具导入envdata.sql(检查一下col视图是否可以读出数据）
        * 数据库名可以不同，但是可能会造成视图col无法读取数据，这个时候需要修改col视图的源sql代码，把数据库名修该成当前数据库名；（建议就用envdata作为数据库名，col视图源码见col.sql文件）
        * 初次进入系统登陆界面，会弹出数据库配置窗口，配置一下数据库参数和网盘子系统地址即可正常使用系统。
        * 如果想切换数据库或者网盘子系统地址，可以直接删除config.json文件，然后重新在登陆界面配置。（config.json文件存放位置：源码运行时存储在根目录，jar包运行时存储在运行路径下）
        * 系统管理员用户名：admin     系统管理员密码：admin     利用admin账号登陆时可以在主界面的用户头像处查看到系统配置按钮，点击它同样可以配置数据库和网盘地址。

    * php网盘数据库
        * 该子系统数据库是sqlite数据库，数据库文件test.db在网盘源码根目录的DB文件夹中,可以用数据库可视化工具来读取它。
        * 系统管理员用户名：admin     系统管理员密码：admin   该用户可以查看网盘存储系统中的的所有文件。
        * 如果不想使用本网盘系统，也可修改主系统配置外接其它网盘系统（百度网盘、可道云、cloudreve）。
2.  直接部署

    * 主系统直接部署:
        * 先配置MySQL数据库，步骤可参看数据库配置文件夹下的说明文件；
        * 配置JVM（本人JDK版本1.8）
        * 打开控制台，切换到[Mark-0.0.1-SNAPSHOT.jar](https://gitee.com/markchen7788/GradualtionDesign/blob/master/deployable%20Jar%20&%20php%20source%20code/Mark-0.0.1-SNAPSHOT.jar)的路径下，输入“java -jar  Mark-0.0.1-SNAPSHOT.jar”即可运行程序。在服务器运行可以加上nohup命令把程序挂到后台。
        * 程序默认端口：8889 （可以用解压软件修改jar包中的application.yml文件内容来修改端口）
        * 初次运行程序进入登陆界面会提示配置数据库连接和网盘地址，配置完成后即可正常使用本系统。

    * 网盘子系统部署：
        * 配置php环境（本人php7+nginx)
        * 把[fileManager.zip](https://gitee.com/markchen7788/GradualtionDesign/blob/master/deployable%20Jar%20&%20php%20source%20code/fileManager.zip)解压到网站根目录即可；
        * 无需配置数据库，开箱即用
3.  源码运行
    * 主系统源码可用IDEA直接打开，记得先配置数据库
    * 网盘子系统运行方式与2相同


## 使用说明

### 登陆与用户信息管理
1. 管理员用户名"admin",默认密码"admin",建议修改；
2. 管理员可以在登陆后"点击头像"来配置系统数据库连接和文件管理系统地址；
3. 用户所在地区可以精确到任意级别(国、省、市、区),字段为空即默认为全国。用户可在登陆后修改个人信息。

### 基本信息配置
1. 监测站点信息配置
    * 用户只能够看到所在地区下的站点,非管辖区域的站点不可以查看到。
    * 站点信息管理首页显示的是所有可以管理的站点信息。
    * 左边的导航栏是随着管辖区域站点信息的变化而变化,即导航栏只能索引到存在站点的区域，没有站点的区域不会出现在导航栏上。（这里所说的“存在的站点”是指用户可查看到站点，并不是数据库中所有的站点）
    * 系统支持对站点信息进行增加、删除、修改、查询(支持搜索)、导入、导出等操作。导入文件的格式为xlsx,文件内容的格式与导出文件的格式基本一致。导入的内容无需包含站点Id这一字段,数据库会自动生成。
    * 站点信息的删除功能具有保护措施，如若站点下存在数据表格，系统会拒绝对其进行删除操作。
    * 站点地区必须精确到区县一级。
2. 监测元素信息配置
    * 系统支持对站点信息进行增加、删除、多删、修改、查询(支持搜索)、导入、导出等操作。导入文件的格式为xlsx,文件内容的格式与导出文件的格式基本一致。导入的内容无需包含元素Id这一字段,数据库会自动生成。
    * 元素的数据类型与MySQL数据库字段数据类型要保持一致，否则建表时会产生异常。如若某元素被表格使用，该元素信息不可删除。

### 监测数据表格管理
1. 基本功能：查看表格信息(支持搜索)、删除表格信息、新建表格
2. 查看表格：首页显示的是所有可以管理的表格的信息。左边的导航栏是随着管辖区域表格信息的变化而变化,即导航栏只能索引到存在表格的区域，没有表格的区域不会出现在导航栏上。（这里所说的“存在的表格”是指用户可查看到表格，并不是数据库中所有的监测表格）
3. 创建表格：表名、备注必须填写，站点信息、元素必须选择，主键可选可不选。站点信息只能选择当前用户能够查看到的，非授权的站点信息无法选择。
### 监测表格数据管理
1. 基本功能：增加、删除、多删、修改、查询(支持搜索)、排序、导入、导出；
2. 排序可以参照任意字段进行升序、降序排列；导入数据字段需要与表格字段一致，无需添加Id,系统会自动生成。
3. 数据统计分析：生成各字段的最大值、最小值、平均值、标准差
4. 数据可视化显示：选择横纵坐标，生成折线图。横坐标为一项元素，纵坐标可为多项元素。
5. 导入模式有两种：忽略主键重复数据模式、更新主键重复数据模式。导入时数据如果存在主键重复，前者会忽略此次插入操作，后者会用新数据来覆盖旧数据。

### 文件管理
1. 利用php做的网盘子系统，作为系统的辅助功能，如若想使用其它网盘来取代该子系统，可以用管理员用户登陆并在系统配置中修改网盘地址。
2. 管理员用户：admin 密码：admin 登陆后可查看所有用户文件，并可管理用户信息(接入了phpLiteAdmin来管理sqlite数据库,登陆默认密码：admin)。
3. 基本功能：查看所有文件、新建文件夹、删除文件、删除文件夹、上传文件、下载文件。

## 其它说明
1. [点击查看项目静态演示](http://markchen7788.gitee.io/gradualtiondesign)
2. 本系统为本人独立完成，瑕疵仍然较多，海涵！
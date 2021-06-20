SELECT
	`information_schema`.`columns`.`TABLE_NAME` AS `表名`,
	`information_schema`.`columns`.`COLUMN_NAME` AS `参数名`,
	`information_schema`.`columns`.`DATA_TYPE` AS `数据类型`,
	`information_schema`.`columns`.`COLUMN_COMMENT` AS `字段注释`,
	`information_schema`.`columns`.`COLUMN_KEY` AS `主键`,
	`information_schema`.`tables`.`CREATE_TIME` AS `创建时间`,
	`information_schema`.`tables`.`TABLE_COMMENT` AS `注释`,
	`envdata`.`element`.`elementName` AS `elementName`,
	`envdata`.`element`.`elementUnit` AS `elementUnit`,
	`envdata`.`element`.`dataType` AS `dataType`,
	`envdata`.`element`.`elementMemo` AS `elementMemo`,
	`envdata`.`tableComment`.`tableComment` AS `tableComment`,
	`envdata`.`tableComment`.`siteId` AS `siteId`,
	`envdata`.`site`.`siteName` AS `siteName`,
	`envdata`.`site`.`area` AS `area`,
	`envdata`.`site`.`comment` AS `comment` 
FROM
	(((
				`information_schema`.`columns`
				JOIN `information_schema`.`tables` 
				)
			JOIN `envdata`.`element` 
			)
		JOIN (
			`envdata`.`tableComment`
			JOIN `envdata`.`site` ON ((
					`envdata`.`tableComment`.`siteId` = `envdata`.`site`.`Id` 
				)))) 
WHERE
	((
			`information_schema`.`columns`.`TABLE_SCHEMA` = 'envdata' 
			) 
		AND ( `information_schema`.`columns`.`TABLE_NAME` <> 'col' ) 
		AND ( `information_schema`.`columns`.`TABLE_NAME` <> 'user' ) 
		AND ( `information_schema`.`columns`.`TABLE_NAME` <> 'site' ) 
		AND ( `information_schema`.`columns`.`TABLE_NAME` <> 'element' ) 
		AND ( `information_schema`.`columns`.`TABLE_NAME` = `information_schema`.`tables`.`TABLE_NAME` ) 
	AND ( `information_schema`.`columns`.`COLUMN_COMMENT` = `envdata`.`element`.`Id` ) 
	AND ( CONVERT ( `information_schema`.`columns`.`TABLE_NAME` USING utf8mb4 ) = `envdata`.`tableComment`.`tablename` ))
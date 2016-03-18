/*
 *
 * (c) Copyright Ascensio System Limited 2010-2016
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 ยง 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 ยง 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/
﻿var mysql = require('mysql');var configSql = require('config').get('services.CoAuthoring.sql');var pool  = mysql.createPool({	host		: configSql.get('dbHost'),	port		: configSql.get('dbPort'),	user		: configSql.get('dbUser'),	password	: configSql.get('dbPass'),	database	: configSql.get('dbName'),	charset		: configSql.get('charset'),	timezone	: '+0000',	flags : '-FOUND_ROWS'});var logger = require('./../../Common/sources/logger');exports.sqlQuery = function (sqlCommand, callbackFunction) {	pool.getConnection(function(err, connection) {		if (err) {			logger.error('pool.getConnection error: %s', err);			if (callbackFunction) callbackFunction(err, null);			return;		}		connection.query(sqlCommand, function (error, result) {			connection.release();			if (error) {				logger.error('________________________error_____________________');				logger.error('sqlQuery: %s sqlCommand: %s', error.code, sqlCommand);				logger.error(error);				logger.error('_____________________end_error_____________________');			}			if (callbackFunction) callbackFunction(error, result);		});	});};exports.sqlEscape = function (value) {	return pool.escape(value);};
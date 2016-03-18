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
﻿var mongoDB = require('mongodb');var config = require('./config.json');var _errorConnection = true;var logger = require('./../../Common/sources/logger');function CreateDbClient(){	return new mongoDB.Db(config['mongodb']['database'], new mongoDB.Server(config['mongodb']['host'], config['mongodb']['port'], {auto_reconnect: true}), {safe:false});}exports.insert = function (_collectionName, _newElement) {	var _db = CreateDbClient();	if (!_db) {		logger.error ("Error _db");		return;	}		// Открываем базу данных	_db.open (function (err, db) {		if (!err) {			// Открываем коллекцию. Если её не существует, она будет создана			db.collection(_collectionName, function(err, collection) {				if (!err) {					collection.insert (_newElement);				} else {					logger.error ("Error collection");					return;				}								db.close();			});		} else {			logger.error ("Error open database");		}	});};exports.remove = function (_collectionName, _removeElements) {	var _db = CreateDbClient();	if (!_db) {		logger.error ("Error _db");		return;	}		// Открываем базу данных	_db.open (function (err, db) {		if (!err) {			// Открываем коллекцию. Если её не существует, она будет создана			db.collection(_collectionName, function(err, collection) {				if (!err) {					collection.remove (_removeElements, function(err, collection) { 						// Все элементы удалены						logger.info ("All elements remove");					});				} else {					logger.error ("Error collection");					return;				}								db.close();			});		} else {			logger.error ("Error open database");		}	});};exports.load = function (_collectionName, callbackFunction) {	var _db = CreateDbClient();	if (!_db) {		logger.error ("Error _db");		return callbackFunction (null);	}		var result = [];		// Открываем базу данных	_db.open (function (err, db) {		// Открываем коллекцию. Если её не существует, она будет создана		db.collection(_collectionName, function(err, collection) {			// Получаем все элементы коллекции с помощью find()			collection.find(function(err, cursor) {				cursor.each(function(err, item) {					// Null обозначает последний элемент					if (item != null) {						if (!result.hasOwnProperty (item.docid))							result[item.docid] = [item];						else							result[item.docid].push(item);					} else						callbackFunction (result);				});								db.close();			});		});	});};
var path = require('path');
var redis = require('redis');
var Sequelize = require('sequelize');
var _ = require('underscore');

var redisConfig = require('../../config/database').redis;
var database = require('../../config/database').mysql;

var getRedisConn = function () {
    return redis.createClient(
        redisConfig.port,
        redisConfig.host,
        redisConfig.options
    );
};

global.redisClient = getRedisConn();
global.redisBlockClient = getRedisConn();

global.Model = Sequelize;

global.model = new Sequelize(
    database.database,
    database.username,
    database.password,
    _.extend(database, {
        logging: process.env['NODE_ENV'] !== 'production' && console.log
    })
);

require("fs").readdirSync(path.join(__dirname, '../models')).forEach(function (file) {
    if (path.extname(file) !== '.js') return;
    require(path.join(__dirname, '../models', file));
});
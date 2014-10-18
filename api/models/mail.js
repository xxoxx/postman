var path = require('path');
var moment = require('moment');
var fs = require('fs');

const MAIL_FILE_EXT = '.ml';

global.Mail = model.define('Mail', {
    from: Model.STRING,
    to: Model.STRING,
    subject: Model.STRING,
    web_hook: Model.STRING,
    immediate: Model.BOOLEAN
}, {
    tableName: 'mails',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

var Log = model.define('Log', {
    status: Model.STRING,
    log: Model.STRING
}, {
    tableName: 'logs',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

var archiveDir = process.env['POSTMAN_CONFIG_DIR'] || '../mail_archive';
var ensureExists = function (path, mask, cb) {
    if (typeof mask == 'function') {
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function (err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null);
            else cb(err);
        } else cb(null);
    });
};

Mail.write = function (mailId, content, cb) {
    var filePath = path.join(archiveDir, moment().format("YYYYMMDD"));
    ensureExists(filePath, 0744, function (err) {
        if (err !== null) throw err;
        fs.writeFile(path.join(filePath, mailId + MAIL_FILE_EXT), content, function (err) {
            if (err) throw err;
            cb && cb();
        });
    });
};

Mail.read = function (mailId, cb) {
    var filePath = path.join(archiveDir, moment().format("YYYYMMDD"), mailId + MAIL_FILE_EXT);
    fs.readFile(filePath, function (err, data) {
        if (err) return cb(null);
        cb(data);
    });
};

Mail.hasMany(Log, {as: 'Logs', foreignKey: 'mail_id'});
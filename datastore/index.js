const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filepath = exports.dataDir + '/' + id + '.txt';
    fs.writeFile(filepath, text, () => {
      callback(null, { id, text });
    });
  });

};

exports.readAll = (callback) => {
  var result = [];
  fs.readdir(exports.dataDir, (err, todoList) => {
    for (var i = 0; i < todoList.length; i++) {
      var filename = path.parse(todoList[i]).name;
      var item = {};
      item['id'] = filename;
      item['text'] = filename;
      result.push(item);
    }
    callback(null, result);
  });
};

exports.readOne = (id, callback) => {
  var filepath = exports.dataDir + '/' + id + '.txt';
  fs.readFile(filepath, (err, fileData) => {
    if (err) {
      callback(err, 0);
    } else {
      var text = fileData.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var filepath = exports.dataDir + '/' + id + '.txt';
  fs.readFile(filepath, (err, fileData) => {
    if (err) {
      callback(err, 0);
    } else {
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          callback(err, fileData);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

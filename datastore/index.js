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
  fs.readdir(exports.dataDir, (err, todoList)=>{
    for (var i = 0; i < todoList.length; i++) {
      var filename = path.parse(todoList[i]).name;
      var item = {};
      item['id'] = filename;
      item['text'] = filename;
      result.push(item);
    }
    callback(null, result);
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  
  // call fs readdir with the directory path and a callback which takes in err and todoList
  // map through each item in the array and set each value in an object with id as key and value
  //callback(null, data)
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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

const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const p = require("path");
const dbpath = p.join(home, ".todo");
const fs = require("fs");

module.exports = {
  read(path = dbpath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (err, data) => {
        if (err) reject(err);
        let list;
        try {
          list = JSON.parse(data);
        } catch (err1) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write(list, path = dbpath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list), (err) => {
        if (err) reject(err2);
        resolve();
      });
    });
  },
};

const fs = require("fs");
const path = require("path");
const del = require("del");
const async = require("async");

// let a = del.sync(["dist/**/*", "!dist/index.html"], { force: true });

// async.series(
//   {
//     one: function(cb) {
//       cb(null, "one");
//     },
//     two: function(cb) {
//       cb(null, "two");
//     }
//   },
//   function(err, results) {
//     console.log(results);
//   }
// );

// fs.access("gulpfile.js", err => {
//   console.log(err);
// });

// async.waterfall(
//   [
//     function(cb) {
//       cb(null, "one11");
//     },
//     function(data, cb) {
//       cb(null, data + " two");
//     }
//   ],
//   function(err, results) {
//     console.log(results);
//   }
// );

// async.parallel(
//   [
//     function(callback) {
//       setTimeout(function() {
//         callback(null, "one");
//       }, 200);
//     },
//     function(callback) {
//       setTimeout(function() {
//         callback(null, "two");
//       }, 100);
//     }
//   ],
//   // optional callback
//   function(err, results) {
//     // the results array will equal ['one','two'] even though
//     // the second function had a shorter timeout.
//     console.log(results);
//   }
// );

// async.each(
//   ["a.txt", "config.json"],
//   function(file, done) {
//     console.log(file);
//     done();
//   },
//   function(err) {
//     console.log("finish");
//     if (err) console.log(err);
//     else console.log("success");
//   }
// );

const { log } = console;
// async.concat(["data", "src", "dist"], fs.readdir, function(err, files) {
//   if (err) throw new Error(err);
//   log(files);
// });

// async.filter(
//   ["gulpfile.js", "package.json"],
//   function(file, cb) {
//     if (!fs.statSync(file).isDirectory()) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   },
//   function(err, res) {
//     console.log(res);
//   }
// );

let res = del.sync(["dist/**/*", "!dist/a{b,}c.html"]);
console.log(res);

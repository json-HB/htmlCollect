const path = require("path");
const fs = require("fs");

function removeLog() {
  const cwd = process.cwd();
  const target = process.env.target || "gulpfile.js";
  const resTar = path.join(cwd, target);
  if (fs.existsSync(resTar)) {
    let data = fs.readFileSync(resTar, "utf8");
    data = regLog(
      data,
      /\b\s*console.(log|info|error|debug|time|timeend|warn|count|dir|table|group|clear)\([^)]*\);?\s*\b/gim,
      function(full) {
        return "";
      }
    );
    fs.writeFileSync(resTar, data, {
      encoding: "utf8",
    });
  }
}

function regLog(data, reg, cb) {
  return data.replace(reg, cb);
}

removeLog();

exports.removeLog = removeLog;

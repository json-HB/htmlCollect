const path = require("path");
const through = require("through2");
const gulp = require("gulp");
const util = require("gulp-util");
const less = require("gulp-less");
const bs = require("browser-sync").create();
const marked = require("marked");
var UglifyJS = require("gulp-uglify");
const fs = require("fs");
const sequence = require("run-sequence");

let Tasks = ["vendors", "del", "js", "html", "less"];

gulp.task("default", Tasks, function(cb) {
  sequence("collectHtml", cb);
});

gulp.task("dev", function(cb) {
  sequence(Tasks.concat("server"), "collectHtml", cb);
});

gulp.task("collectHtml", function(cb) {
  const paths = [];
  gulp
    .src("dist/*.html")
    .pipe(
      through.obj(function(file, enc, next) {
        let extrName = path.extname(file.path);
        let basename = path.basename(file.path);
        if (extrName == ".html" && basename != "index.html") {
          paths.push("/" + basename);
        }
        this.push(file);
        next();
      })
    )
    .on("finish", function() {
      fs.readFile(path.resolve("dist/index.html"), "utf8", function(err, data) {
        if (err) throw new Error(err);
        if (data) {
          let str = paths
            .map(
              item =>
                `<a href='/htmlCollect${item}'>${item
                  .substring(1)
                  .replace(/\.html$/g, "")}</a><br />\n`
            )
            .join("");
          data = data.replace(/\{\{\s*(.+)\s*\}\}/, function(full, part) {
            return str;
          });
          fs.writeFileSync(path.resolve("dist/index.html"), data, {
            encoding: "utf8"
          });
        }
        cb();
      });
    });
});

gulp.task("js", function(cb) {
  return gulp.src(["src/**/*.js"], { base: "src" }).pipe(gulp.dest("dist"));
});

gulp.task("less", function(cb) {
  return gulp
    .src(["src/*.less"])
    .pipe(less())
    .pipe(gulp.dest("dist"))
    .pipe(bs.stream());
});

gulp.task("html", function(cb) {
  return gulp
    .src(["src/*.+(html|json|png|css|mp3)", "assert/*"])
    .pipe(gulp.dest("dist"))
    .pipe(bs.stream());
});

gulp.task("marked", function(cb) {
  let mardContent = "";
  return gulp
    .src(["*.md"])
    .pipe(
      through.obj(function(file, enc, next) {
        let contents = file.contents;
        let res = marked(String(contents));
        mardContent = res;
        file.contents = Buffer.from(res);
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest("dist"))
    .on("finish", function() {
      fs.readFile(
        path.resolve(__dirname, "src/index.html"),
        { encoding: "utf8" },
        function(err, data) {
          if (err) return util.log("wrong");
          if (data) {
            data = data.replace(/{{\s__content__\s}}/g, mardContent);
            util.log(data);
            fs.writeFile(
              "src/index.html",
              data,
              { encoding: "utf8" },
              (err, d) => {
                if (err) return util.log("wrong");
                util.log(util.colors.green("yes"));
                let spa = require("child_process").spawn("gulp");
                spa.stdout.on("data", function(d) {
                  util.log(d.toString());
                });
              }
            );
          }
        }
      );
    });
});

gulp.task("server", function() {
  bs.init({
    port: 8008,
    server: {
      baseDir: "dist"
    }
  });
  gulp.watch("src/*.html", ["html", "collectHtml"]);
  gulp.watch("src/*.less", ["less"]);
});

function concat(fileName, opt = {}) {
  if (!fileName) {
    throw new util.PluginError("concat", { message: "no filename" });
  }
  let res;
  let first = false;
  function stream(file, enc, cb) {
    if (util.isStream(file)) {
      throw new util.PluginError("concat", { message: "stream" });
    }
    first || util.log(fs.statSync(file.path));
    first = true;
    let fileOriginName = path.relative(process.cwd(), file.path);
    if (!res) {
      res = Buffer.concat([
        Buffer.from(fileOriginName),
        Buffer.from(opt.newline || "\n"),
        file.contents,
        Buffer.from(opt.newline || "\n")
      ]);
    } else {
      res = Buffer.concat([
        res,
        Buffer.from(fileOriginName),
        Buffer.from(opt.newline || "\n"),
        file.contents,
        Buffer.from(opt.newline || "\n")
      ]);
    }
    cb();
  }
  function endStream(cb) {
    let file = new util.File({
      path: process.cwd() + "/" + fileName,
      cwd: process.cwd(),
      contents: res
    });
    this.push(file);
    cb();
  }
  return through.obj(stream, endStream);
}

gulp.task("del", function(cb) {
  require("child_process").execSync("rm -rf dist");
  cb();
});

gulp.task("vendors", function(cb) {
  const basePath = path.resolve("node_modules");
  gulp
    .src([path.resolve(basePath, "exif-js", "exif.js")])
    .pipe(UglifyJS())
    .pipe(gulp.dest(path.resolve("src/vendors/")))
    .on("finish", cb);
});

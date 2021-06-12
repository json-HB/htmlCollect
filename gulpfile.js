const path = require('path');
const through = require('through2');
const gulp = require('gulp');
const util = require('gulp-util');
const less = require('gulp-less');
const bs = require('browser-sync').create();
const marked = require('marked');
const UglifyJS = require('uglify-js');
const fs = require('fs');
const sequence = require('run-sequence');
const Babel = require('@babel/core');
const htmlminify = require('html-minifier').minify;

let Tasks = ['vendors', 'del', 'react-lib', 'js', 'html', 'img', 'less'];

gulp.task('default', Tasks.slice(1), function(cb) {
  sequence(['collectHtml', 'mergePro', 'inject'], cb);
});

gulp.task('dev', function(cb) {
  sequence(Tasks, 'inject', 'collectHtml', 'i18n', 'server', cb);
});

gulp.task('mergePro', function(cb) {
  const BUILD_TIME = new Date().toISOString();
  gulp
    .src('dist/index.html')
    .pipe(
      through.obj(function(file, enc, next) {
        let contents = file.contents.toString();
        contents = contents.replace(/\{\{([^}]+)\}\}/g, function(full, part) {
          if (part == 'BUILD_TIME') {
            return process.env.BUILD_TIME || BUILD_TIME;
          }
          return full;
        });
        file.contents = Buffer.from(contents);
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest('dist'))
    .on('finish', cb);
});

gulp.task('collectHtml', function() {
  const paths = [];
  return gulp
    .src('dist/*.html')
    .pipe(
      through.obj(function(file, enc, next) {
        let extrName = path.extname(file.path);
        let basename = path.basename(file.path);
        if (extrName == '.html' && basename != 'index.html') {
          paths.push(basename);
        }
        this.push(file);
        next();
      })
    )
    .on('finish', function() {
      fs.readFile(path.resolve('dist/index.html'), 'utf8', function(err, data) {
        if (err) throw new Error(err);
        if (data) {
          let str = paths
            .map(
              item =>
                `<a data-text='${item.replace(/\.html$/g, '')}' href='${item}'>${item.replace(
                  /\.html$/g,
                  ''
                )}</a>`
            )
            .join('');
          data = data.replace(/\{\{\s*(_\w+_)\s*\}\}/g, function(full, part) {
            if (part == '_content_') {
              return str;
            }
            return full;
          });
          fs.writeFileSync(path.resolve('dist/index.html'), data, {
            encoding: 'utf8',
          });
        }
      });
    });
});

gulp.task('js', function(cb) {
  return gulp
    .src(['src/**/*.+(js|json|css)'], { base: 'src' })
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
});

gulp.task('less', function(cb) {
  return gulp
    .src(['src/css/*.less'], { base: 'src' })
    .pipe(less())
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
});

gulp.task('html', function(cb) {
  return gulp
    .src(['src/**/*.+(html|json|png|css|mp3)'])
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
});

gulp.task('img', function() {
  return gulp.src('assert/*.*').pipe(gulp.dest('dist/img'));
});

gulp.task('marked', function(cb) {
  let mardContent = '';
  return gulp
    .src(['*.md'])
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
    .pipe(gulp.dest('dist'))
    .on('finish', function() {
      fs.readFile(path.resolve(__dirname, 'src/md.html'), { encoding: 'utf8' }, function(
        err,
        data
      ) {
        if (err) return util.log('wrong');
        if (data) {
          data = data.replace(/{{\s__content__\s}}/g, mardContent);
          util.log(data);
          fs.writeFile('src/md.html', data, { encoding: 'utf8' }, (err, d) => {
            if (err) return util.log('wrong');
            util.log(util.colors.green('yes'));
            let spa = require('child_process').spawn('gulp');
            spa.stdout.on('data', function(d) {
              util.log(d.toString());
            });
          });
        }
      });
    });
});

gulp.task('server', function() {
  bs.init({
    port: 8008,
    server: {
      baseDir: 'dist',
    },
  });
  gulp.watch('src/*.html', () => {
    sequence('html', 'collectHtml', 'inject');
  });
  gulp.watch('src/*.less', ['less']);
  gulp.watch(['src/vendors/*.js', 'src/util/*.js'], ['js']);
  gulp.watch(['src/react/*.+(js|jsx)'], ['react-lib']);
});

function concat(fileName, opt = {}) {
  if (!fileName) {
    throw new util.PluginError('concat', { message: 'no filename' });
  }
  let res;
  let first = false;
  function stream(file, enc, cb) {
    if (util.isStream(file)) {
      throw new util.PluginError('concat', { message: 'stream' });
    }
    first || util.log(fs.statSync(file.path));
    first = true;
    let fileOriginName = path.relative(process.cwd(), file.path);
    if (!res) {
      res = Buffer.concat([
        Buffer.from(fileOriginName),
        Buffer.from(opt.newline || '\n'),
        file.contents,
        Buffer.from(opt.newline || '\n'),
      ]);
    } else {
      res = Buffer.concat([
        res,
        Buffer.from(fileOriginName),
        Buffer.from(opt.newline || '\n'),
        file.contents,
        Buffer.from(opt.newline || '\n'),
      ]);
    }
    cb();
  }
  function endStream(cb) {
    let file = new util.File({
      path: process.cwd() + '/' + fileName,
      cwd: process.cwd(),
      contents: res,
    });
    this.push(file);
    cb();
  }
  return through.obj(stream, endStream);
}

gulp.task('del', function(cb) {
  require('child_process').execSync('rm -rf dist');
  cb();
});

gulp.task('vendors', function(cb) {
  const basePath = path.resolve('node_modules');
  gulp
    .src([
      path.resolve(basePath, 'exif-js', 'exif.js'),
      path.resolve(basePath, 'pdfjs-dist/build', 'pdf.js'),
      path.resolve(basePath, 'pdfjs-dist/build', 'pdf.worker.js'),
      path.resolve(basePath, 'marked', 'marked.min.js'),
      path.resolve(basePath, 'qrcode/build', 'qrcode.min.js'),
      path.resolve(basePath, 'sanitize-html/dist', `sanitize-html.min.js`),
      path.resolve(basePath, 'react/umd', `react.production.min.js`),
      path.resolve(basePath, 'react-dom/umd', `react-dom.production.min.js`),
      path.resolve(basePath, 'mockjs/dist', `mock-min.js`),
      path.resolve(basePath, 'driver.js/dist', `driver.min.js`),
      path.resolve(basePath, 'driver.js/dist', `driver.min.css`),
      path.resolve(basePath, 'vue/dist/', `vue.min.js`),
      path.resolve(basePath, 'js-md5/build/md5.min.js'),
      path.resolve(basePath, 'js-md5/build/md5.min.js'),
    ])
    // .pipe(UglifyJS())
    .pipe(gulp.dest(path.resolve('src/vendors/')))
    .on('finish', cb);
});

gulp.task('url-load', function(cb) {
  gulp
    .src('src/template.html')
    .pipe(
      through.obj(function(file, enc, next) {
        let content = file.contents.toString();
        const imgType = ['jpeg', 'jpg', 'pbg'];
        content = content.replace(/img\s([^>]*)src="([^"]+)"/g, function(full, extra, part) {
          return full;
        });
        next();
      })
    )
    .pipe(gulp.dest('dist'));
});

function parseArgv(argv) {
  let rest = argv.slice(3);
  let obj = {};
  while (rest.length) {
    let key = rest.splice(0, 1)[0];
    if (key.startsWith('-')) {
      key = key.replace(/-/, '');
      if (rest[0] !== undefined && rest[0].startsWith('-')) {
        obj[key] = true;
      } else {
        obj[key] = rest[0];
        rest.splice(0, 1);
      }
    } else {
      obj[key] = true;
    }
  }
  return obj;
}

gulp.task('tem', function(cb) {
  const argv = parseArgv(process.argv);
  const baseDir = path.resolve(__dirname, 'src/template');
  fs.readFile(
    path.resolve(baseDir, `${argv.type || 'html'}.template`),
    { encoding: 'utf8' },
    function(err, data) {
      data = data.replace(/{{(.*)}}/g, function(full, part) {
        return argv[part] || 'N/A';
      });
      fs.writeFileSync(path.resolve(__dirname, `src/${argv['name']}.html`), data, {
        encoding: 'utf8',
      });
      cb();
    }
  );
});

gulp.task('inject', function() {
  return gulp
    .src('dist/*.html', { cwd: process.cwd() })
    .pipe(
      through.obj(function(file, enc, next) {
        let content = file.contents.toString();
        content = content.replace(
          /<!--[\s]*<require\s*src="([^"]*)"\s*([^>]*)\s*>\s*-->/gm,
          function(full, part, rest) {
            const lastFile = part
              .replace(/\./, '')
              .split(path.sep)
              .slice(-1)[0];
            let restObj;
            if (rest) {
              restObj = {};
              rest
                .split(/ /)
                .filter(item => item)
                .forEach(item => {
                  let child = item.split('=');
                  restObj[child[0]] = child[1];
                });
            }
            const extraName = path.extname(lastFile);
            if (extraName == '.css') {
              let data = fs.readFileSync(path.join(path.dirname(file.path), part), 'utf8');
              if (restObj) {
                if (restObj.inline == 'true') {
                  if (restObj.gzip == 'true') {
                    data = data.replace(/\s*|\t|\n/g, '');
                  }
                  return `<style>${data}</style>`;
                }
              }
              return `<link href="${rest}" rel="stylesheet"></link>`;
            } else if (extraName == '.js') {
              let data = fs.readFileSync(path.join(path.dirname(file.path), part), 'utf8');
              if (restObj) {
                if (restObj.inline == 'true') {
                  const option = JSON.parse(
                    fs.readFileSync(path.resolve(process.cwd(), '.babelrc.json'), 'utf8')
                  );
                  if (restObj.babel == 'true') {
                    data = Babel.transformSync(data, option).code;
                  }
                  if (restObj.gzip == 'true') {
                    data = UglifyJS.minify(data).code;
                  }
                  return `<script type='text/javascript' js-name='${
                    lastFile.split('.')[0]
                  }'>${data}</script>`;
                }
              }
              return `<script src="${part}" type='text/javascript'></script>`;
            } else if (extraName == '.html') {
              let data = fs.readFileSync(path.join(path.dirname(file.path), part), 'utf8');
              if (restObj) {
                if (restObj.gzip == 'true') {
                  const minifyOption = {
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true,
                  };
                  data = htmlminify(data, minifyOption);
                }
              }
              return data;
            } else if (['.png', '.jpg'].includes(extraName)) {
              let data = fs.readFileSync(path.join(path.dirname(file.path), part), 'base64');
              if (restObj) {
                if (restObj.inline == 'true') {
                  data = `data:image/${extraName.slice(1)};base64,${data}`;
                  const cn = restObj.class ? restObj.class.split('%').join(' ') : '';
                  return `<img src='${data}' class='${cn}' />`;
                }
              }
              return `<img src='${part}'/>`;
            }
            return full;
          }
        );
        file.contents = Buffer.from(content);
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest('dist'));
});

const transform = function(data) {
  const option = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.babelrc.json'), 'utf8'));
  let res = require('@babel/core').transform(data, option);
  return res.code;
};

gulp.task('react-lib', function(cb) {
  return gulp
    .src('src/react/*.+(js|jsx)', { sourcemaps: true, base: 'src' })
    .pipe(
      through.obj(function(file, enc, next) {
        const content = file.contents.toString();
        file.contents = Buffer.from(transform(content));
        file.path = file.path.replace(/x$/, '');
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
});

gulp.task('i18n', function(done) {
  const langArr = ['en', 'zh'];
  const defautlLang = 'zh';
  const getLangFile = function() {
    const files = fs.readdirSync('src/lang');
    const content = {};
    files.forEach((file, index) => {
      const key = file.split('.')[0];
      content[key] = JSON.parse(fs.readFileSync('src/lang/' + file).toString());
    });
    return content;
  };
  const langFile = getLangFile();
  return gulp
    .src(['dist/*.html'], { sourcemaps: false, base: 'src' })
    .pipe(
      through.obj(function(file, enc, cb) {
        let content = String(file.contents);
        const currentLang = langFile[defautlLang];
        content = content.replace(/<%\s*([a-zA-Z\.]+)\s*%>/g, function(full, part) {
          const ps = part.split('.');
          let t = currentLang;
          for (let i = 0; i < ps.length; i++) {
            if (i == 0) {
              continue;
            } else {
              t = t[ps[i]];
            }
          }
          return t;
        });
        langArr.forEach(lang => {
          let newFileContent = String(file.contents).replace(/<%\s*([a-zA-Z\.]+)\s*%>/g, function(
            full,
            part
          ) {
            const ps = part.split('.');
            let t = langFile[lang];
            for (let i = 0; i < ps.length; i++) {
              if (i == 0) {
                continue;
              } else {
                t = t[ps[i]];
              }
            }
            return t;
          });
          const newFile = new util.File({
            contents: Buffer.from(newFileContent),
            path: path.resolve(process.cwd(), `${lang}/${path.basename(file.path)}`),
          });
          this.push(newFile);
        });

        file.contents = Buffer.from(content);
        this.push(file);
        cb();
      })
    )
    .pipe(gulp.dest('dist'));
});

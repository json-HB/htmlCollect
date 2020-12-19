const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let modules = {};

function clearDist() {
  if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    require('child_process').execSync('rm -rf dist', {
      shell: true,
      stdio: 'inherit',
    });
  }
}

clearDist();

const fileToMudule = p => {
  const p1 = path.resolve(__dirname, p);
  const content = fs.readFileSync(p1).toString();
  return {
    id: p,
    dependencies: getDependencies(content),
    code: `function(require, exports) {
      ${content.toString()};
    }`,
  };
};

function getDependencies(fileContent) {
  const reg = /require\(['"]([^)]+)['"]\)/g;
  let result = null;
  let dep = [];
  while ((result = reg.exec(fileContent))) {
    dep.push(result[1]);
  }
  return dep;
}

function createGraph(filename) {
  let module = fileToMudule(filename);
  let queue = [module];
  for (let item of queue) {
    const dirname = path.dirname(filename);
    item.dependencies.forEach(child => {
      const absolutePath = path.join(dirname, child);
      const childContent = fileToMudule(absolutePath);
      queue.push(childContent);
    });
  }
  let modules = {};
  queue.forEach(item => {
    modules[item.id] = item.code;
  });
  return modules;
}

modules = createGraph('../example/index.js');

function createBundle(modules) {
  let _modules = '';
  for (let attr in modules) {
    _modules += `'${attr}': ${modules[attr]},`;
  }
  const result = `(function() {
      const path = require('path')
        const modules = {${_modules}};
        const exec = function(moduleId) {
            const fn = modules[moduleId];
            let exports = {};
            const require = function(filename) {
              const dirname = path.dirname(moduleId);
              const absolutePath = path.join(dirname, filename);
              return exec(absolutePath);
            };
            fn(require, exports);
            return exports;
          };
          exec('../example/index.js')
    })()`;
  if (!fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    fs.mkdirSync(path.resolve(process.cwd(), 'dist'));
  }
  fs.writeFileSync(path.resolve(process.cwd(), 'dist/bundle.js'), result);
  console.log(chalk.green('succcess'));
}

createBundle(modules);

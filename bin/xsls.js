const path = require('path'),
  fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

const p = path.resolve(process.cwd(), 'data/Translation Management_2.xlsx');

function resolvePath(p) {
  return path.resolve(process.cwd(), p);
}

const extraTraMap = {
  disbursementDetail: 'Detail Pencairan',
};

let sheetArr = [];
let content = {};

function getSheet() {
  return readXlsxFile(p, {
    getSheets: true,
  }).then(data => {
    sheetArr = data;
  });
}

function dealSheetName(name) {
  let res = '';
  const parts = name.split(/\s/);
  if (parts.length > 1) {
    for (let i = 0; i < parts.length; i++) {
      if (i == 0) {
        const firstPart =
          (name.length <= 4 && /^[A-Z]+$/g.test(name) && parts[0]) ||
          parts[0].charAt(0).toLowerCase();
        res += firstPart + parts[0].substring(1);
      } else {
        res += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
      }
    }
  } else {
    if (name.length <= 4 && /^[A-Z]+$/g.test(name)) {
      return name;
    }
    res = name.charAt(0).toLowerCase() + name.substring(1);
  }
  return res;
}

function dealData(data) {
  return data;
}

function dealSheet(name) {
  return readXlsxFile(p, {
    sheet: name,
    transformData(data) {
      data = data
        .map(item => {
          item = item.slice(item.length - 3);
          return [item[1], item[2]];
        })
        .filter(item => {
          return item.some(child => child != null);
        });
      return data;
    },
  }).then(data => {
    console.log(dealSheetName(name));
    content[dealSheetName(name)] = dealData(data);
  });
}

async function collectData() {
  for (let item of sheetArr) {
    await dealSheet(item.name);
  }
}

function translateExtra(value, type) {
  if (!value && value == null) {
    return extraTraMap[type];
  }
  return value;
}

function makeFile() {
  let fileNames = Object.keys(content);
  const distId = resolvePath('excel/id');
  const distEn = resolvePath('excel/en');
  if (!fs.existsSync(distId)) {
    fs.mkdirSync(distId);
  }
  if (!fs.existsSync(distEn)) {
    fs.mkdirSync(distEn);
  }
  for (let file of fileNames) {
    [distId, distEn].forEach((lang, index) => {
      const lf = path.join(lang, `${file}.json`);
      const data = {
        label: {},
      };
      content[file].forEach(a => {
        Reflect.set(
          data.label,
          dealSheetName(a[0]),
          translateExtra(index === 0 ? a[1] : a[0], dealSheetName(a[0]))
        );
      });
      let res = JSON.stringify(data, null, 2);
      res = res.concat('\n');
      fs.writeFileSync(lf, res, 'utf8');
    });
  }
}

async function run() {
  await getSheet();
  await collectData();
  makeFile();
}

run();

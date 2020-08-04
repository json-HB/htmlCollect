const fs = require("fs");
const path = require("path");

const oss = require("ali-oss");
const mime = require("mime");

const log = function(...args) {
  console.log(...args);
};

const client = new oss({
  accessKeyId: "LTAIUBLgD1OC7IBa",
  accessKeySecret: "gpGcMi16qtxTHQS1jUTiO6VOwCfyEJ",
  bucket: "haibo1991",
  endpoint: "oss-cn-shenzhen.aliyuncs.com"
});

async function listBuckets() {
  try {
    let result = await client.listBuckets();
    log(result.buckets);
  } catch (e) {
    console.error(err);
  }
}

async function list() {
  //   client.useBucket("jihaibo1991");
  try {
    const result = await client.listBuckets();
    console.log(result);
  } catch (e) {
    log(e);
  }
}

async function put() {
  try {
    let file = path.resolve(
      process.cwd(),
      "node_modules/minimatch/minimatch.js"
    );
    log(file);
    let res = await client.put(path.basename(file), fs.createReadStream(file), {
      mime: mime.getType(file),
      headers: {
        "Cache-Control": "public",
        Expires: 4000 * 1000
      }
    });
    log(res);
    if (res.url);
    require("child_process").spawn("open", [res.url], {
      env: process.env,
      stdio: "inherit",
      cwd: process.cwd()
    });
    // log(
    //   require("crypto")
    //     .createHash("")
    //     .update(fs.readFileSync(file))
    //     .end("hex")
    // );
  } catch (e) {
    log(e);
  }
}

async function get() {
  try {
    let result = await client.get(
      "index.html",
      fs.createWriteStream("data/a.txt")
    );
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function del() {
  try {
    let result = await client.delete("a.txt");
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

async function putBucket() {
  try {
    let res = await client.putBucket("lp-2019-8-1");
    log(res);
  } catch (e) {
    log(e);
  }
}

async function getBucket() {
  try {
    let res = await client.listBuckets();
    log(res);
  } catch (e) {
    log(e);
  }
}

// get();
// del();

// listBuckets();
// list();
put();
// putBucket();
// getBucket();

const base = path.resolve("../../webpack-2019-7-5/src");

// fs.readdir(base, async (err, files) => {
//   let farr = [];
//   let dir = [];
//   for (let file of files) {
//     let p = path.join(base, file);
//     if (fs.statSync(p).isFile()) {
//       try {
//         let res = await client.put(file, fs.createReadStream(p), {
//           mime: mime.getType(file),
//           headers: {
//             "Cache-Control": "public",
//             "Content-Encoding": "gzip",
//             Expires: 4000 * 1000
//           }
//         });
//         log(res);
//       } catch (e) {
//         log(e);
//       }
//       farr.push(file);
//     } else {
//       dir.push(file);
//     }
//   }
// });

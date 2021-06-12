let names = ['iPhone X', 'iPhone XS'];

let colors = ['黑色', '白色'];

let storages = ['64g', '256g'];

let combine = function(...chunks) {
  let res = [];

  let helper = function(chunkIndex, prev) {
    let chunk = chunks[chunkIndex];
    let isLast = chunkIndex === chunks.length - 1;
    for (let val of chunk) {
      let cur = prev.concat(val);
      if (isLast) {
        // 如果已经处理到数组的最后一项了 则把拼接的结果放入返回值中
        res.push(cur);
      } else {
        helper(chunkIndex + 1, cur);
      }
    }
  };

  // 从属性数组下标为 0 开始处理
  // 并且此时的 prev 是个空数组
  helper(0, []);

  return res;
};

// 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
let combineNum = function(n, k) {
  let ret = [];

  let helper = (start, prev) => {
    let len = prev.length;
    if (len === k) {
      ret.push(prev);
      return;
    }

    for (let i = start; i <= n; i++) {
      helper(i + 1, prev.concat(i));
    }
  };
  helper(1, []);
  return ret;
};

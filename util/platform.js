const userAgent = navigator.userAgent;
const appBrandName = (function() {
  const m = userAgent.match(/\bAppName\/(.*?)\//);
  return (m && m[1]) || "";
})();
const isApp = appBrandName != "";
const isAndroid = userAgent.indexOf("Android") >= 0;
const isIos =
  userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0;

const Platform = {
  get appBrandName() {
    return appBrandName;
  },

  get isApp() {
    return isApp;
  },

  get isAndroid() {
    return isAndroid;
  },

  get isAndroidApp() {
    return isApp && isAndroid;
  },

  get isIos() {
    return isIos;
  },

  get isIosApp() {
    return isApp && isIos;
  }
};

export default Platform;

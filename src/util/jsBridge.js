import Platform from "./platform";

const { isApp, isAndroidApp, isIos } = Platform;
const BRIDGE_NS = "WebViewJavascriptBridge";
const QUEUE_EXCLUDES = ["showLoading", "hideLoading"];
const queue = [];

// IOS 交互
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "https://__bridge_loaded__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

function pushQueue(type, args) {
  if (QUEUE_EXCLUDES.includes(args[0])) {
    return;
  }
  queue.length ||
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function() {
        while (queue.length) {
          const { type, args } = queue.shift();
          window[BRIDGE_NS][type](...args);
        }
      },
      false
    );
  queue.push({ type, args });
}

const Bridge = {
  registerHandler(...args) {
    if (isIos) {
      return setupWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler(...args);
      });
    }
    if (window[BRIDGE_NS]) {
      window[BRIDGE_NS].registerHandler(...args);
    } else {
      pushQueue("registerHandler", args);
    }
  },

  callHandler(...args) {
    if (isIos) {
      return setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(...args);
      });
    }
    if (window[BRIDGE_NS]) {
      window[BRIDGE_NS].callHandler(...args);
    } else {
      pushQueue("callHandler", args);
    }
  },

  openNativePage(url) {
    if (isApp) {
      this.callHandler("openNativePage", {
        url: url
      });
    }
  },

  openUrl(url) {
    if (isApp) {
      this.callHandler("openUrl", {
        url: url
      });
    } else {
      window.open(url);
    }
  }
};

export default Bridge;

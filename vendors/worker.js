self.addEventListener("message", function(event) {
  console.log(event);
  doSomethind(event.data);
});

function doSomethind(data) {
  const type = data.type;
  switch (type) {
    case "fetch":
      fetchApi(data);
      break;
    case "say":
      self.postMessage({ type: "say", data: { name: "haibo" } });
      break;
    case "close":
      closeWorker(data);
      break;
    default:
      postMessage({ type: "none" });
      break;
  }
}

function closeWorker(data) {
  console.log("worker has close");
  self.close();
}

function isLocal() {
  return location.href.includes("localhost");
}

function fetchApi(data) {
  const url = isLocal() ? "/mock/index.json" : "/htmlCollect/mock/index.json";
  fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    mode: "cors",
    referrer: "no-referrer",
    cash: "no-cache",
    credentials: "same-origin"
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      self.postMessage({
        type: "fetch",
        data: res.get.find(item => item.id == data.data.id)
      });
    });
}

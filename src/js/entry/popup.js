import Util from "chromane/js/Util.js";


(async function () {
  let util = new Util();
  util.create_window_api({
    storage_set: (storage) => {
      return chrome.storage.local.set(storage);
    },
    storage_get: (filter) => {
      return chrome.storage.local.get(filter);
    },
    close: () => {
      window.close();
    },
    fetch_json: (data) => {
      console.log("data", data);
      return util.fetch_json(data[0], data[1]);
    },
    open_home: () => {
      chrome.tabs.create({
        url: "https://speechy.dev/",
        active: true,
      });
    },
    reload: () => {
      chrome.tabs.reload();
    },
    send_message_to_tabs(data){
      
    }
  })
  // inject iframe
  let config = await fetch("/config.json");
  config = await config.json();
  let manifest = chrome.runtime.getManifest();
  let iframe = document.createElement("iframe");
  iframe.name = JSON.stringify({
    context: "iframe",
    config,
    manifest,
  });
  iframe.src = config.popup_urls[config.mode];
  document.body.append(iframe);
  // await util.wait( 1000);
  // let wrap = await util.create_window_wrap(window, iframe.contentWindow)
  // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //   console.log(request)
  //   sendResponse({res: 'success res'})
  //   wrap.exec("test")
  // })
  
})();

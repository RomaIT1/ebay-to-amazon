export default class Iframe {
  constructor(parent) {
    this.parent = parent;
    // iframe ui
    this.status = "not_active";
    this.iframe = null;
    this.container = null;
  }
  // iframe ui
  async inject() {
    if (window.config.mode === "dev") {
      var iframe_src = "http://localhost:1337";
    } else {
      var iframe_src = `chrome-extension://${this.parent.extension_id}/pages/app/index.html`;
    }

    let style = await window.util.fetch_text(`chrome-extension://${this.parent.extension_id}/css/content.css`);

    console.log("iframe_src", iframe_src);

    let iframe_name = JSON.stringify({
      context: "sidebar",
      config: window.config,
    });

    let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
      createHTML: (to_escape) => to_escape,
    });

    let style_element = document.createElement("style");
    style_element.innerHTML = escapeHTMLPolicy.createHTML(style);
    document.documentElement.append(style_element);

    let container = document.createElement("div");
    container.className = `speechy_iframe_container speechy_mode_notification speechy_hidden`;
    this.mode = "notification";

    let iframe = document.createElement("iframe");
    iframe.name = iframe_name;
    iframe.src = iframe_src;

    container.append(iframe);
    document.documentElement.append(container);
    this.iframe = iframe;
    this.container = container;

    this.container.addEventListener("click", () => {
      this.close();
    });
    console.log(1);
    this.iframe_wrap = window.util.create_window_wrap(window, this.iframe.contentWindow);
    console.log(2);
  }
  set_mode(mode) {
    this.mode = mode;
    this.container.classList.remove("speechy_mode_popup");
    this.container.classList.remove("speechy_mode_notification");
    this.container.classList.remove("speechy_mode_notification_extra");
    this.container.classList.add(`speechy_mode_${mode}`);
  }
  toggle_mode(mode_1, mode_2) {
    if (this.mode === mode_1) {
      this.set_mode(mode_2);
    } else {
      this.set_mode(mode_1);
    }
  }
  update_iframe_url() {
    let config = window.config;
    let site_location_id = this.parent.storage.site_location_id;

    if (config.mode === "cypress") {
      var iframe_src = "/dev/pages/mock/index.html";
      // var iframe_src = "sdf";
    } else {
      if (site_location_id || site_location_id === 0) {
        var iframe_src = config.app_root + config.urls.sidebar + `?iframe=true&site_location_id=${site_location_id}`;
      } else {
        var iframe_src = config.app_root + config.urls.sidebar + `?iframe=true`;
      }
    }

    window.log.write("iframe_src", iframe_src);
    let iframe_name = JSON.stringify({
      context: "sidebar",
      manifest: window.manifest,
    });
    document.querySelector("#versatrial-main iframe").src = iframe_src;
  }
  open(field_wrap) {
    this.status = "active";
    this.container.classList.remove("speechy_hidden");
  }
  open_simple(text) {
    this.status = "active";
    this.container.classList.remove("speechy_hidden");
    this.iframe.contentWindow.postMessage(
      {
        name: "set_query",
        data: {
          query: text,
          field_type: "TextInput",
        },
      },
      "*"
    );
    this.iframe.contentWindow.postMessage(
      {
        name: "track_event",
        data: {
          event_name: "Clicked Icon after selecting text",
          event_data: {
            extension_version: window.manifest.version,
            text,
            // question_text: question_text,
            // url: this.state.url,
          },
        },
      },
      "*"
    );
  }
  close() {
    this.container.classList.add("speechy_hidden");
    this.status = "not_active";
  }
}

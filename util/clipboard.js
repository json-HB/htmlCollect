class JasonClipboard {
  static displayName = "Clipboard";
  constructor(props) {
    this.dom = document.querySelector(`.${props.class}`);
    this.target = null;
    this.extraText = props.extraText ?? "";
    this.init();
  }

  init() {
    this.target = document.createElement("input");
    this.target.setAttribute("class", "copy-text");
    this.target.style.cssText = "position: absolute;left: -999999px";
    document.body.appendChild(this.target);
  }

  copy() {
    this.target.value = this.dom.value + this.extraText;
    this.target.select();
    document.execCommand("copy");
    alert("copy success");
  }

  setText(val) {
    this.target.value = val ?? "";
  }
}

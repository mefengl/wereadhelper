// ==UserScript==
// @name         📘微信读书阅读助手
// @namespace   https://github.com/mefengl
// @version      5.0.1
// @description  现有功能✔：功能1️⃣：自动隐藏顶栏和侧边栏📌；功能2️⃣：半透明顶栏和侧边栏🦋；功能3️⃣：宽度保持👁；功能4️⃣：一键搜📗豆瓣阅读或📙得到阅读
// @author       mefengl
// @match        https://weread.qq.com/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license MIT
// ==/UserScript==

(function () {
  ("use strict");

  var step = 0; // 🔧：修改宽度只需调节参数即可，❌：0为不修改

  // 功能1️⃣：宽屏
  function getCurrentMaxWidth(element) {
    if (!element) return;
    let currentValue = window.getComputedStyle(element).maxWidth;
    currentValue = currentValue.substring(0, currentValue.indexOf("px"));
    currentValue = parseInt(currentValue);
    return currentValue > 1000 ? currentValue : 1000;
  }
  function changeWidth() {
    const item = document.querySelector(".readerContent .app_content");
    if (!item) return;
    const currentValue = getCurrentMaxWidth(item);
    let changedValue;
    changedValue = currentValue + step;
    item.style["max-width"] = changedValue + "px";
    const myEvent = new Event("resize");
    window.dispatchEvent(myEvent);
  }
  changeWidth();

  // 功能2️⃣：自动隐藏顶栏和侧边栏，上划显示，下滑隐藏
  var windowTop = 0;
  $(window).scroll(function () {
    let scrollS = $(this).scrollTop();
    let selBtn = document.querySelector(".readerTopBar");
    let readerControl = document.querySelector(".readerControls");
    if (scrollS >= windowTop + 100) {
      // 上划显示
      selBtn.style.opacity = 0;
      readerControl.style.opacity = 0;
      windowTop = scrollS;
    } else if (scrollS < windowTop) {
      // 下滑隐藏
      selBtn.style.opacity = 0.4;
      readerControl.style.opacity = 0.4;
      windowTop = scrollS;
    }
  });

  // 功能4️⃣：一键搜📗豆瓣阅读或📙得到阅读

  const douban_info = [
    "https://read.douban.com/search?q=",
    "豆瓣阅读",
    "#389eac",
  ];
  const dedao_info = [
    "https://www.dedao.cn/search/result?q=",
    "得到阅读",
    "#b5703e",
  ];

  // 监听页面是否是搜索页面
  const handleListenChange = (mutationsList) => {
    const className = mutationsList[0].target.className;
    if (/search_show/.test(className)) {
      // 添加按钮
      if (get_searchBox().parentElement.lastChild.tagName == "BUTTON") return;
      add_btn(create_btn(...douban_info));
      add_btn(create_btn(...dedao_info));
    }
  };
  const mutationObserver = new MutationObserver(handleListenChange);
  const element = document.body;
  const options = {
    attributes: true,
    attributeFilter: ["class"],
  };
  mutationObserver.observe(element, options);

  function get_searchBox() {
    return document.body.getElementsByClassName("search_input_text")[0];
  }

  function create_btn(searchUrl, name, color = "#fff") {
    const btn = document.createElement("button");
    btn.innerHTML = "搜 " + name;
    btn.onclick = function () {
      const searchText = get_searchBox().value;
      GM_openInTab(searchUrl + searchText, { active: true, setParent: true });
    };
    add_btn_style();
    return btn;

    function add_btn_style() {
      btn.style.backgroundColor = color;
      btn.style.color = "#fff";
      btn.style.borderRadius = "1em";
      btn.style.margin = ".5em";
      btn.style.padding = ".5em";
    }
  }

  function add_btn(btn) {
    const searchBox = get_searchBox();
    searchBox.parentElement.insertBefore(btn, searchBox.nextSibling);
  }
})();

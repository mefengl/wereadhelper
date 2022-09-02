// ==UserScript==
// @name         📘微信读书阅读助手
// @namespace   https://github.com/mefengl
// @version      5.4.5
// @description  现有功能✔：功能1️⃣：优雅隐藏顶栏和侧边栏🦋；功能2️⃣：简化复杂的划线菜单📌；功能3️⃣：一键搜豆瓣、得到电子书，还可在孔夫子、多抓鱼买二手👁
// @author       mefengl
// @match        https://weread.qq.com/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
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

  // 功能3️⃣：一键搜📗豆瓣阅读或📙得到阅读
  const douban_book_info = [
    "https://search.douban.com/book/subject_search?search_text=",
    "豆瓣读书",
    "#027711",
  ];
  const dedao_info = [
    "https://www.dedao.cn/search/result?q=",
    "得到阅读",
    "#b5703e",
  ];
  const douban_info = [
    "https://read.douban.com/search?q=",
    "豆瓣阅读",
    "#389eac",
  ];
  const kongfuzi_info = [
    "https://search.kongfz.com/product_result/?key=",
    "孔夫子",
    "#701b22",
  ];
  const duozhuayu_info = [
    "https://www.duozhuayu.com/search/book/",
    "多抓鱼",
    "#497849",
  ];
  // 监听页面是否是搜索页面
  const handleListenChange = (mutationsList) => {
    const className = mutationsList[0].target.className;
    if (/search_show/.test(className)) {
      // 添加按钮
      if (get_searchBox().parentElement.lastChild.tagName == "BUTTON") return;
      add_multi_btn(
        add_btn,
        create_btn,
        douban_book_info,
        dedao_info,
        douban_info,
        kongfuzi_info,
        duozhuayu_info,
      );
      // 建议元素下移，避免遮挡按钮
      document.body.getElementsByClassName(
        "search_suggest_keyword_container"
      )[0].style.marginTop = "2.3em";
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
  // 添加按钮们
  function add_multi_btn(add_btn, create_btn, ...info_list) {
    info_list.reverse().forEach((info) => {
      add_btn(create_btn(...info));
    });
  }


  // 功能4️⃣：隐藏荧光和波浪划线样式和搜索（默认不开启
  const default_menu_all = {
    'simplify_underline': false
  }
  const menu_all = GM_getValue('menu_all', default_menu_all);
  const menu_id = GM_getValue('menu_id', {})
  function update_menu() {
    for (let name in menu_all) {
      const value = menu_all[name]
      switch (name) {
        case 'simplify_underline':
          // 卸载原来的
          if (menu_id[name]) {
            GM_unregisterMenuCommand(menu_id[name]);
          }
          // 添加新的
          menu_id[name] = GM_registerMenuCommand(' 简化划线：' + (value ? '✅' : '❌'), () => {
            menu_all[name] = !menu_all[name];
            GM_setValue('menu_all', menu_all);
            // 调用时触发，刷新菜单
            update_menu();
            // 该设置需刷新生效
            location.reload()
          })
          GM_setValue('menu_id', menu_id);
      }
    }
  }
  update_menu();
  if (menu_all.simplify_underline) {
    // 监听页面是否弹出工具框
    const handleListenChange = (mutationsList) => {
      const className = mutationsList[0].target.className;
      if (/reader_toolbar_container/.test(className)) {
        document.getElementsByClassName('underlineBg')[0].style.display = 'none';
        document.getElementsByClassName('underlineHandWrite')[0].style.display = 'none';
        document.getElementsByClassName('query')[0].style.display = 'none';
      }
    };
    const mutationObserver = new MutationObserver(handleListenChange);
    const element = document.body;
    const options = {
      attributes: true,
      subtree: true
    };
    mutationObserver.observe(element, options);
  }
})();

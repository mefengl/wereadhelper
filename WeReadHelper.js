// ==UserScript==
// @name         ðå¾®ä¿¡è¯»ä¹¦éè¯»å©æ
// @namespace   https://github.com/mefengl
// @version      5.3.2
// @description  ç°æåè½âï¼åè½1ï¸â£ï¼èªå¨éèé¡¶æ åä¾§è¾¹æ ðï¼åè½2ï¸â£ï¼åéæé¡¶æ åä¾§è¾¹æ ð¦ï¼åè½3ï¸â£ï¼ä¸é®æè±ç£ãå¾å°çµå­ä¹¦ï¼è¿å¯å¨å­å¤«å­ãå¤æé±¼ä¹°äºæð
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

  var step = 0; // ð§ï¼ä¿®æ¹å®½åº¦åªéè°èåæ°å³å¯ï¼âï¼0ä¸ºä¸ä¿®æ¹
  const simple_underline = false; // trueä¸ºç®åä¸åçº¿ï¼å³å·¥å·æ ä¸­çå é¤è§åãæ³¢æµªçº¿åçº¿åæç´¢ï¼falseä¸å

  // åè½1ï¸â£ï¼å®½å±
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

  // åè½2ï¸â£ï¼èªå¨éèé¡¶æ åä¾§è¾¹æ ï¼ä¸åæ¾ç¤ºï¼ä¸æ»éè
  var windowTop = 0;
  $(window).scroll(function () {
    let scrollS = $(this).scrollTop();
    let selBtn = document.querySelector(".readerTopBar");
    let readerControl = document.querySelector(".readerControls");
    if (scrollS >= windowTop + 100) {
      // ä¸åæ¾ç¤º
      selBtn.style.opacity = 0;
      readerControl.style.opacity = 0;
      windowTop = scrollS;
    } else if (scrollS < windowTop) {
      // ä¸æ»éè
      selBtn.style.opacity = 0.4;
      readerControl.style.opacity = 0.4;
      windowTop = scrollS;
    }
  });

  // åè½3ï¸â£ï¼ä¸é®æðè±ç£éè¯»æðå¾å°éè¯»
  const dedao_info = [
    "https://www.dedao.cn/search/result?q=",
    "å¾å°éè¯»",
    "#b5703e",
  ];
  const douban_info = [
    "https://read.douban.com/search?q=",
    "è±ç£éè¯»",
    "#389eac",
  ];
  const douban_book_info = [
    "https://search.douban.com/book/subject_search?search_text=",
    "è±ç£è¯»ä¹¦",
    "#027711",
  ];
  const kongfuzi_info = [
    "https://search.kongfz.com/product_result/?key=",
    "å­å¤«å­",
    "#701b22",
  ];
  const duozhuayu_info = [
    "https://www.duozhuayu.com/search/book/",
    "å¤æé±¼",
    "#497849",
  ];
  // çå¬é¡µé¢æ¯å¦æ¯æç´¢é¡µé¢
  const handleListenChange = (mutationsList) => {
    const className = mutationsList[0].target.className;
    if (/search_show/.test(className)) {
      // æ·»å æé®
      if (get_searchBox().parentElement.lastChild.tagName == "BUTTON") return;
      add_multi_btn(
        add_btn,
        create_btn,
        dedao_info,
        douban_info,
        douban_book_info,
        kongfuzi_info,
        duozhuayu_info,
      );
      // å»ºè®®åç´ ä¸ç§»ï¼é¿åé®æ¡æé®
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
    btn.innerHTML = "æ " + name;
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
  // æ·»å æé®ä»¬
  function add_multi_btn(add_btn, create_btn, ...info_list) {
    info_list.reverse().forEach((info) => {
      add_btn(create_btn(...info));
    });
  }

  // åè½4ï¸â£ï¼éèè§ååæ³¢æµªåçº¿æ ·å¼åæç´¢ï¼é»è®¤ä¸å¼å¯
  if (simple_underline) {
    // çå¬é¡µé¢æ¯å¦å¼¹åºå·¥å·æ¡
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

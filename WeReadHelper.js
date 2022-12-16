// ==UserScript==
// @name         📘微信读书阅读助手
// @namespace   https://github.com/mefengl
// @version      5.12.2
// @description  读书人用的脚本
// @author       mefengl
// @match        https://weread.qq.com/*
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// ==/UserScript==

(function () {
  ("use strict");

  // 书城运行脚本闪烁严重，直接跳过
  if (location.pathname.includes("category")) return;

  // 功能1️⃣：宽屏
  $(function () {
    $(".app_content").css("maxWidth", 1000);
    $(".readerTopBar").css("display", "flex");
  });

  // 功能2️⃣：自动隐藏顶栏和侧边栏，上划显示，下滑隐藏
  let windowTop = 0;
  $(window).scroll(() => {
    const scrollS = $(this).scrollTop();
    if (scrollS >= windowTop + 100) {
      // 下滑隐藏
      $(".readerTopBar, .readerControls").fadeOut();
      windowTop = scrollS;
    }
    else if (scrollS < windowTop) {
      // 上划显示
      $(".readerTopBar, .readerControls").fadeIn();
      windowTop = scrollS;
    }
  });

  // 功能3️⃣：一键搜📗豆瓣阅读或📙得到阅读
  // 监听页面是否是搜索页面
  const handleListenChange = (mutationsList) => {
    const className = mutationsList[0].target.className;
    if (/search_show/.test(className)) {
      // 开始添加按钮
      if (get_searchBox().parentElement.lastChild.tagName == "BUTTON") return;
      // 添加按钮们
      [
        { name: "豆瓣读书", color: "#027711", searchUrl: "https://search.douban.com/book/subject_search?search_text=", },
        { name: "豆瓣阅读", color: "#389eac", searchUrl: "https://read.douban.com/search?q=", },
        { name: "得到阅读", color: "#b5703e", searchUrl: "https://www.dedao.cn/search/result?q=", },
        { name: "孔夫子", color: "#701b22", searchUrl: "https://search.kongfz.com/product_result/?key=", },
        { name: "多抓鱼", color: "#497849", searchUrl: "https://www.duozhuayu.com/search/book/", },
      ].forEach(({ name, color, searchUrl }) =>
        $(".search_input_text").parent().append(
          $('<button>').text("搜 " + name)
            .css({ backgroundColor: color, color: "#fff", borderRadius: "1em", margin: ".5em", padding: ".5em", cursor: "pointer", })
            .click(() => {
              GM_openInTab(searchUrl + $(".search_input_text").val(), { active: true, setParent: true });
            })
        )
      );

      // 建议元素下移，避免遮挡按钮
      $(".search_suggest_keyword_container").css("margin-top", "2.3em");
    }
  };
  const mutationObserver = new MutationObserver(handleListenChange);
  mutationObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  const get_searchBox = () => $(".search_input_text")[0];

  // 菜单更新的逻辑
  const default_menu_all = {
    simplify_underline: true,
    play_turning_sound: false,
    simplify_main_page: true,
    new_book_shelf: false,
  };
  const menu_all = GM_getValue("menu_all", default_menu_all);
  // 检查是否有新增菜单
  for (let name in default_menu_all) {
    if (!(name in menu_all)) {
      menu_all[name] = default_menu_all[name];
    }
  }
  const menu_id = GM_getValue("menu_id", {});
  function update_menu() {
    for (let name in menu_all) {
      const value = menu_all[name];
      // 卸载原来的
      if (menu_id[name]) {
        GM_unregisterMenuCommand(menu_id[name]);
      }
      switch (name) {
        case "simplify_underline":
          // 添加新的
          menu_id[name] = GM_registerMenuCommand(
            " 简化划线：" + (value ? "✅" : "❌"),
            () => {
              menu_all[name] = !menu_all[name];
              GM_setValue("menu_all", menu_all);
              // 调用时触发，刷新菜单
              update_menu();
              // 该设置需刷新生效
              location.reload();
            }
          );
          break;
        case "play_turning_sound":
          // 添加新的
          menu_id[name] = GM_registerMenuCommand(
            " 翻页声：" + (value ? "✅" : "❌"),
            () => {
              menu_all[name] = !menu_all[name];
              GM_setValue("menu_all", menu_all);
              // 调用时触发，刷新菜单
              update_menu();
            }
          );
          break;
        case "simplify_main_page":
          // 添加新的
          menu_id[name] = GM_registerMenuCommand(
            " 简化首页：" + (value ? "✅" : "❌"),
            () => {
              menu_all[name] = !menu_all[name];
              GM_setValue("menu_all", menu_all);
              // 调用时触发，刷新菜单
              update_menu();
              // 该设置需刷新生效
              location.reload();
            }
          );
          break;
        case "new_book_shelf":
          // 添加新的
          menu_id[name] = GM_registerMenuCommand(
            " 新书架外观：" + (value ? "✅" : "❌"),
            () => {
              menu_all[name] = !menu_all[name];
              GM_setValue("menu_all", menu_all);
              // 调用时触发，刷新菜单
              update_menu();
              // 该设置需刷新生效
              location.reload();
            }
          );
          break;
      }
    };
    GM_setValue("menu_id", menu_id);
  }
  update_menu();

  // 功能4️⃣：简化划线菜单，包括想法页面
  if (menu_all.simplify_underline) {
    // 监听页面是否弹出工具框
    const handleListenChange = (mutationsList) => {
      const className = mutationsList[0].target.className;
      if (/reader_toolbar_container/.test(className)) {
        $(".underlineBg, .underlineHandWrite, .query").remove();
        // 在这里完成简化想法页面的功能
        $("#readerReviewDetailPanel").css("padding-top", "12px");
        $("#readerReviewDetailPanel .title").remove();
        // 如果找到了有删除划线的按钮，就隐藏有直线划线的按钮，否则显示（因为之前隐藏了）
        $(".removeUnderline").length
          ? $(".underlineStraight").hide()
          : $(".underlineStraight").show();
      }
    };
    const mutationObserver = new MutationObserver(handleListenChange);
    mutationObserver.observe(document.body, { attributes: true, subtree: true });
  }

  // 功能5️⃣：加入翻页的仪式感
  // 统计阅读章节数功能尚在考虑，可在console查看
  let odd_page = true;
  const odd_page_sound = new Audio(
    "data:audio/mpeg;base64,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"
  );
  const even_page_sound = new Audio(
    "data:audio/mpeg;base64,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"
  );
  odd_page_sound.controls = true;
  even_page_sound.controls = true;
  function playTurningSound() {
    (odd_page ? odd_page_sound : even_page_sound).play();
    odd_page = !odd_page;
  }
  const daily_chapter_count = GM_getValue("daily_chapter_count", {});
  const add_one_chapter_count = () => {
    menu_all.play_turning_sound && playTurningSound();
    const now = new Date();
    const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    today in daily_chapter_count
      ? (daily_chapter_count[today] += 1)
      : (daily_chapter_count[today] = 0);
    GM_setValue("daily_chapter_count", daily_chapter_count);
    console.log(daily_chapter_count[today]);
  };
  {
    // 监听页面是否到页底，会多次到达页底，但只会添加一个监听
    const handleListenChange = (mutationsList) => {
      const className = mutationsList[0].target.className;
      // 使用相同外部函数，监听之前先去除，是防止重复添加的一种方法
      // 但jQuery有one方法，可以只添加一次监听
      /readerBottomBar/.test(className)
        && $(".readerFooter_button").one("click", add_one_chapter_count);
    };
    const mutationObserver = new MutationObserver(handleListenChange);
    mutationObserver.observe(document.body, { attributes: true, subtree: true });
  }

  // 功能6️⃣：首页及书架页面简化
  menu_all.simplify_main_page && $(() => {
    const $login = $(".navBar_link_Login").detach();
    $(
      ".shelf_header, .navBar_link_ink, .navBar_link_Phone, .ranking_topCategory_container, .recommend_preview_container, .app_footer_copyright"
    ).remove();
    // 书架页面上多余的separator
    $(".navBar_separator").slice(1, 4).remove();
    $(".navBar_inner").append($login);
    // 阅读界面的听书和手机阅读的按钮
    $(".lecture, .download").hide();
    $(".readerTopBar").stop().css({ maxWidth: "1000px", opacity: "0.6" });
    $(".readerControls").stop().css("opacity", "0.8");
    // 解决有时用户头像无法正常工作的问题
    setTimeout(() => $(".wr_avatar_img").attr("src").includes("wx.qlogo.cn") || location.reload(), 500);
  })

  // 功能7️⃣：Ctrl/Command + Enter，提交笔记（不用点提交按钮）
  {
    // 监听页面是否是想法页面
    const handleListenChange = (mutationsList) => {
      const className = mutationsList[1].target.className;
      /readerWriteReviewPanel/.test(className) && $("#WriteBookReview").keydown((e) => {
        const isCtrlEnter = (e.keyCode == 10 || e.keyCode == 13) && (e.ctrlKey || e.metaKey);
        isCtrlEnter && $(".writeReview_submit_button").click();
      });
    };
    const mutationObserver = new MutationObserver(handleListenChange);
    mutationObserver.observe(document.body, { attributes: true, subtree: true });
  }

  // 功能8️⃣：新的书架页面
  menu_all.new_book_shelf && $(() => {
    if (location.pathname.includes("reader")) return;
    $(".shelfBook").height(70).width(128).css({
      "background-color": "rgba(0,0,0,.1)", "border-radius": ".2em", "margin": ".8em",
      "display": "grid", "place-items": "center", "box-shadow": "0 0 .5em rgba(0,0,0,.3)"
    });
    $(".shelfBook .title").css("margin", "0");
    $(".shelfBook_add_cover").height(70).width(128);
    $(".wr_bookCover, .shelfBook_placeholder").remove();
    $(".navBar_logo, .navBar_avatar").css('opacity', '0.54');
    // 随机书籍，魔法！呱呱
    $(".shelfBook_add").clone()
      .removeClass("shelfBook_add").addClass("shelfBook")
      .attr("href", $(".shelfBook").map((_, e) => e.href).toArray().sort(() => Math.random() - 0.5)[0])
      .html(`
        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path fill-rule="evenodd" clip-rule="evenodd" d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z" fill="currentColor" /> </svg> 
          <div>漫步</div>
        </div>
      `)
      .insertBefore($(".shelfBook_add"));
    // 如果 .wr_bookCover 依然存在的话，就刷新页面，重试
    setTimeout(() => $(".wr_bookCover").length && location.reload(), 500);
  });
})();

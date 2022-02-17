// ==UserScript==
// @name         📘微信读书阅读助手
// @namespace   Violentmonkey Scripts
// @version      4.6
// @description  现有功能✔：功能1️⃣：自动隐藏顶栏和侧边栏📌；功能2️⃣：半透明顶栏和侧边栏🦋；功能3️⃣：宽度保持👁；
// @author       mefengl
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_log
// @grant        GM_addStyle
// @license MIT
// ==/UserScript==

(function () {
    'use strict';
    
    var step = 0;  // 🔧：修改宽度只需调节参数即可，❌：0为不修改

    // 功能1️⃣：宽屏
    function getCurrentMaxWidth(element) {
        let currentValue = window.getComputedStyle(element).maxWidth;
        currentValue = currentValue.substring(0, currentValue.indexOf('px'));
        currentValue = parseInt(currentValue);
        return currentValue>1000? currentValue:1000;
    }
    function changeWidth() {
        const item = document.querySelector(".readerContent .app_content");
        const currentValue = getCurrentMaxWidth(item);
        let changedValue;
        changedValue = currentValue + step;
        item.style['max-width'] = changedValue + 'px';
        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent)
    }
    changeWidth();
  
    // 功能2️⃣：自动隐藏顶栏和侧边栏，上划显示，下滑隐藏
    var windowTop=0;
    $(window).scroll(function(){
        let scrollS = $(this).scrollTop();
        let selBtn = document.querySelector('.readerTopBar');
        let readerControl = document.querySelector(".readerControls");
        if(scrollS >= windowTop+100){
            // 上划显示
            selBtn.style.opacity = 0;
            readerControl.style.opacity = 0;
            windowTop = scrollS;
        }else if(scrollS < windowTop){
            // 下滑隐藏
            selBtn.style.opacity = 0.4;
            readerControl.style.opacity = 0.4;
            windowTop=scrollS;
        }
    });
})();

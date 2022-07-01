// 界面简化，但会有跳动，效果不好，故暂时不使用
try {
  document.getElementsByClassName('download')[0].style.display = 'none';
} catch (e) { };
try {
  document.getElementsByClassName('shelf_header')[0].style.display = 'none';
} catch (e) { };
document.getElementsByClassName('navBar_inner')[0].style.opacity = '0.35';

document.getElementsByClassName('recommend_preview_container')[0].style.display = 'none';
document.getElementsByClassName('ranking_topCategory_container')[0].style.display = 'none';
document.getElementsByClassName('app_footer')[0].style.display = 'none';

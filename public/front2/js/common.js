/**
 * Created by Jepson on 2018/4/9.
 */

$(function() {
  // mui(".box") 相当于选择器
  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
  });

  // 配置轮播图自动轮播
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
  });
})
//  获取拼接的地址
function getSearch(key){
  var search = decodeURI(location.search);
  //去掉?
  search = search.slice(1);
  search = search.split('&');
  var obj={};
  search.forEach(function(v,i){
    var key = v.split('=')[0];
    var v = v.split('=')[1];
    obj[key]=v;
  });
  return obj[key];
};

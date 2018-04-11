$(function(){
  //功能1.渲染搜索历史记录
   render();
    function render(){
         var arr = getHistory();
         $('.history').html(template('search',{arr:arr}));
    };
    //获取本地存储的数据
    function getHistory(){
         var history = localStorage.getItem('search_list')||'[]';
         var arr =JSON.parse(history);
         return arr;
    };
  // 功能2: 删除功能, 删除本地历史记录数组里面一项
  $('.history').on('click','.btn_delete',function(){
          var that =this;
         mui.confirm('你确定要删除吗','温馨提示',['确认','取消'],function(e){
          if(e.index===0){
            var index = $(that).data('id');
            var arr = getHistory();
            arr.splice(index,1);
            localStorage.setItem('search_list',JSON.stringify(arr));
            render();
          }
    })



  });

  // 功能3: 清空功能
  $('.history').on('click','.btn-empty',function(){
    mui.confirm('是否清空所有的历史记录','温馨提示',['确认','取消'],function(e){
       if(e.index==0){
         var arr = getHistory();
         //removeItem清除的是（key）,而clear清除的是所有的数据
         localStorage.removeItem('search_list',arr);
         render();
       }
    })

  });
  // 功能4: 添加功能
   $('.search_btn').click(function(){
     //获取输入框的值
     var key = $('.lt_search .seach_input').val().trim();
     //获取本地的数据
     var arr = getHistory();
     // 判断是否为空
     if(key==""){
          mui.toast('请输入搜索信息');
           return false;
     }
     // 判断是否存在
     if(arr.indexOf(key)!==-1){
           var index = arr.indexOf(key);
           arr.splice(index,1);
     }
       //向最前面添加
       arr.unshift(key);
     if(arr.length>=10){
        arr.pop();
     }
        //实现数据持久化
        localStorage.setItem('search_list',JSON.stringify(arr));
        render();
       //清空
       $('.lt_search .seach_input').val('');
       //跳转
       location.href="searchlist.html?key="+key;
   })

})
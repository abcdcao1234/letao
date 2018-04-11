$(function(){
    //  获取地址栏的数据
    var key =getSearch("key");
    //设置输入框的值
    $('.lt_search input').val(key);
    render();
    //渲染数据
    function render(){
      $('.lt_product').html('<div class="loading"></div>');
      var params={};
      params.page=1;
      params.pageSize=100;
      params.proName=$('.lt_search input').val();
      //判断是否需要排序
      var $current =$('.lt_sort .current');
      //设置排序
      if($current.length>0){
          var sortName = $current.data('type');
          var sortValue = $current.find('i').hasClass('fa fa-angle-down')?2:1;
          params[sortName] =sortValue;
      }
      // 发送ajax请求
      setTimeout(function(){
         $.ajax({
          type:'get',
          url:"/product/queryProduct",
          data:params,
          success:function( info ){
            console.log(info);
            $('.lt_product').html(template('product',info));
          }
        });
      },500)

    };
  // 功能2: 点击搜索按钮, 需要渲染一次, 用户修改了proName
    $('.search_btn').click(function(){
       render();
       var key = $('.lt_search input').val().trim();
       var str = localStorage.getItem('search_list')||'[]';
       var arr = JSON.parse(str);
      // 判断是否为空
      if(key==""){
        mui.toast('请输入搜索信息');
        return false;
      }
      if(arr.indexOf(key)!== -1){
           var index = arr.indexOf(key);
           arr.splice(index,1);
      }
      if(arr.length>=10){
         arr.pop();
      }
      arr.unshift(key);
      localStorage.setItem('search_list',JSON.stringify(arr));
    });
  // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
  $('.lt_sort a[data-type]').click(function(){
      if($(this).hasClass('current')){
          //
            $(this).find('i').toggleClass('fa fa-angle-up').toggleClass('fa fa-angle-down');
      }else{
          $(this).addClass('current').siblings().removeClass('current');
          $(this).find('i').removeClass('fa fa-angle-down').addClass('fa fa-angle-down');
      }
      render();
  })

})
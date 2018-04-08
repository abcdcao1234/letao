  //禁用小圆环
    NProgress.configure({showSpinner:false});
     //ajaxStart所有的ajax开始调用
     $(document).ajaxStart(function(){
       NProgress.start();
     });
    ////ajaxSop所有的ajax结束调用
    $(document).ajaxStop(function(){
      //模拟网络延迟
       setTimeout(function(){
         NProgress.done();
       },500);

    })
//  拦截功能的实现,根据地址后面有无login.html进行判断
  if(location.href.indexOf("login.html")===-1){
    $.ajax({
        url:"/employee/checkRootLogin",
        type:'get',
        success:function( info ){
            console.log( info );
          if(info.error==400){
             location.href="login.html";
          }
        }
    })
  }
$(function(){
//   1.二级功能的实现
  $('.categrory').click(function(){
      $(this).next().slideToggle();
  })
 // 2. 顶部菜单栏切换显示功能
  $('.icon_menu').click(function(){
    $('.lt_aisde').toggleClass('hide_menu');
    $('.lt_main').toggleClass('hide_menu');
    $('.lt_topbar').toggleClass('hide_menu');
  })
  // 3. 点击退出图标显示退出模态框
  $('.icon_logout').click(function(){
    $('#logoutModal').modal("show");
    });
  // 4. 在外面注册 logoutBtn 退出按钮, 点击事件，要不然效率低
  $('#logoutBtn').click(function() {
    $.ajax({
      url: '/employee/employeeLogout',
      type:'get',
      dataType:'json',
      success:function( info ){
         console.log( info );
        if(info.success){
           location.href="login.html";
        }
      }
    })
  })

})



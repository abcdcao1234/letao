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


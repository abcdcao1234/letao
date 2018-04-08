//入口函数可以避免全局污染
$(function(){
    //1.表单校验
    $('#form').bootstrapValidator({
      //2. 指定校验时的图标显示，默认是bootstrap风格
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields:{
           //用户名校验
           username:{
             validators:{
               notEmpty:{
                 message:"用户名不能为空"
               },
               stringLength:{
                 min:2,
                 max:6,
                 message:"用户名必须在2-6位之间"
               },
               callback:{
                 message:'用户不存在'
               }
             }

           },
           //密码校验
           password:{
              validators:{
                 notEmpty:{
                    message:'密码不能为空',
                 },
                //长度校验
                stringLength:{
                   min:6,
                   max:12,
                   message:'密码必须在6-12位之间'
                },
                //专门用于配制回调信息的校验规则
                callback:{
                   message:'密码错误'
                }
              }
           },

      },
    });
   //  2.登录请求
  //进行ajax进行登录请求
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
        url:'/employee/employeeLogin',
        type:'post',
        dataType:'json',
        data:$('#form').serialize(),
        success:function( info ){
           if( info.success){
             location.href="index.html";
           }
          if(info.error===1000){
            $('#form').data('bootstrapValidator').updateStatus('username',"INVALID","callback")
          }
          if(info.error===1001){
              //alert('密码错误');
            //参数1：字段名称，参数二:校验状态，参数三：检验规则，可以设置检验文本
            $('#form').data('bootstrapValidator').updateStatus('password',"INVALID","callback")
          }
        }

    })
  })
//  3.表单重置功能的实现
  $('[type="reset"]').on('click',function(){
    $('#form').data('bootstrapValidator').resetForm();
  })

})
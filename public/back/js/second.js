$(function(){
    //页面的渲染
    var currentPage=1;
    var pageSize =5;
    render();
    function render(){
      $.ajax({
        url: "/category/querySecondCategoryPaging",
        type: "get",
        data: {
          page: currentPage,
          pageSize: pageSize
        },
        success:function( info ){
              console.log(info);
            var htmlStr = template('second',info);
           $('.lt_content tbody').html(htmlStr);
          //  页码的渲染
          $('#paginator').bootstrapPaginator({
            //版本
                bootstrapMajorVersion:3,
            //总页数
               totalPages:Math.ceil(info.total/info.size),
          //  当前页码
            currentPage:info.page,
            //点击页码进行渲染
            onPageClicked:function(a,b, c,page){
                currentPage = page;
                render();
            },
          //  每一个按钮的显示文字,每次都会调用这个方法，他的返回值就是按钮的文本内容
            itemTexts:function(type, page, current){
               switch(type){
                 case 'first':
                   return '首页';
                 case 'prev':
                   return '上一页';
                 case 'next':
                     return '下一页';
                 case 'last':
                     return '尾页';
                 case 'page':
                   return page;

               }
            },
          // 提示框的配置
            tooltipTitles:function( type, page, current){
              switch(type){
                case 'first':
                  return '首页';
                case 'prev':
                  return '上一页';
                case 'next':
                  return '下一页';
                case 'last':
                  return '尾页';
                case 'page':
                  return "前往第"+page+"页";

              }
            }

          })

        }

      })
    }
// 点击添加分类，让模态框显示
   $('#addBtn').click(function(){
       $('#addModal').modal('show');
     //请求一级分类,渲染一级菜单
     $.ajax({
       url: "/category/queryTopCategoryPaging",
       type: "get",
       data: {
         page: 1,
         pageSize: 100
       },
       success:function( info ){
         var htmlStr = template('dropdowmTpl',info);
         $('.dropdown-menu').html(htmlStr);
       }
     })
   })
// 3. 注册委托事件，让一级菜单里的内容显示
   $('.dropdown-menu').on('click','a',function(){
      $('#dropdownText').html($(this).text());
      var id = $(this).data('id');
     // 将选中的 id 设置到 input 表单元素中
     $('[name="categoryId"]').val(id);
     // 需要将校验状态置成 VALID
     // 参数1: 字段
     // 参数2: 校验状态
     // 参数3: 配置规则, 来配置我们的提示文本
     $('#form').data("bootstrapValidator").updateStatus('categoryId','VALID');
   });
//  4.配置图片上传
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var picAddr = data.result.picAddr;
      $('#imgBox img').attr('src',picAddr);
      $('[name="brandLogo"]').val(picAddr);
    }
  });
//  5.表单校验功能
  $('#form').bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded:[],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
     //校验的字段
     fields:{
       categoryName:{
          validators:{
             notEmpty:{
               message:'请输入二级分类呢名称'
             }
          }
       },
       categoryId:{
          validators:{
             notEmpty:{
                message:'请选择一级分类'
             }
          }
       },
       brandLogo:{
          validators:{
            notEmpty:{
               message:'请上传图片'
            }
          }
       }
     }
  });
//  6.注册校验成功事件
   $('#form').on('success.form.bv',function(e){
     e.preventDefault();
     $.ajax({
       url: "/category/addSecondCategory",
       type: "post",
       data:$('#form').serialize(),
       success:function( info ){
         console.log(info);
         $('#addModal').modal("hide");
         $('#form').data('bootstrapValidator').resetForm(true);
         currentPage=1;
         render();
         $('#dropdownText').text('请选择一级菜单');
         $('#imgBox img').attr('src',"/images/default.png");

       }

     })
   })

})
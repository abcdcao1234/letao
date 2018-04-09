$(function(){
   var currentPage =1;
   var pageSize=5;
  render();
  function render(){
    $.ajax({
      url: "/category/queryTopCategoryPaging",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success:function(info){
         //console.log(info);
        $('.lt_content tbody').html(template('first',info));
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),

          // 给页码添加点击事件
          onPageClicked: function( a, b, c, page ) {
            // 将选中的页码更新到 currentPage
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  }
//  点击添加分类，添加分类
  $('#addBtn').click(function(){
      $('#addModal').modal("show");
  })


  //3.添加校验功能
  $('#form').bootstrapValidator({
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
                message:'请输入一个一级分类名称'
             }
          }
       }
    }
  });
  //4. 注册表单校验成功事件
  //    表单校验插件, 会在表单提交时, 进行校验
  //    如果通过校验, 默认会进行提交, 需要阻止, 通过 ajax 进行提交

  // (使用form="form", 通过了校验, 也不会提交了, 可以省去 e.preventDefault() )
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      url: "/category/addTopCategory",
      type: "POST",
      data: $('#form').serialize(),
      success:function( info ){
           if(info.success){
               $('#addModal').modal('hide');
           //重新渲染页面, 添加的项会在第一页, 所以应该重新渲染第一页
             currentPage=1;
             render();
             // 传 true 不仅可以重置 状态, 还可以重置内容
             $('#form').data('bootstrapValidator').resetForm(true);
           }
      }
    })
  })



})
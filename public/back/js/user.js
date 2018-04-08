$(function(){
    var currentPage=1;
    var pageSize =5;
   render();
   function render(){
    $.ajax({
      url:'/user/queryUser',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function( info ){
        $('.lt_content tbody').html(template('tmp',info));
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          //当前页码
          currentPage:info.page,
          //总页数
          totalPages:Math.ceil(info.total/info.size),
          //  点击页码触发
          onPageClicked:function(a,b, c,page){
            currentPage=page;
           render();
          }

        })
      }
    })
  }
  // 禁用启用模态框的渲染
  $('.lt_content tbody').on('click','.btn',function(){
        $('#userModal').modal('show');
        var id = $(this).parent().data('id');
         var isDelete = $(this).hasClass('btn-success')?1:0;
        $('#userBtn').off('click').on('click',function(){
          $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
              id: id,
              isDelete: isDelete
            },
            success:function( info ){
               if( info.success){
                 $('#userModal').modal('hide');
                 render();
               }
            }
          })
     })
  })
})
$(function(){
     var currentPage=1;
     var pageSize =5;
    var picArr=[];
     render();
     //1.页面的渲染
     function render() {
       $.ajax({
         url: "/product/queryProductDetailList",
         type: "get",
         data: {
           page: currentPage,
           pageSize: pageSize
         },
         success:function( info ){
            var htmlStr = template('product',info);
           $('.lt_content tbody').html(htmlStr);
         //  页码的渲染
            $('#paginator').bootstrapPaginator({
                bootstrapMajorVersion:3,
              // 当前页
              currentPage: info.page,
              // 总页数
              totalPages: Math.ceil(  info.total / info.size ),
              onPageClicked:function(a, b,c,page){
                   currentPage=page;
                  render();
              },
              itemTexts: function( type, page, current ) {
                // first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
                // page 是当前按钮指向第几页
                // current 是指当前是第几页 (相对于整个分页来说的)
                switch( type ) {
                  case "first":
                    return "首页";
                  case "last":
                    return "尾页";
                  case "prev":
                    return "上一页";
                  case "next":
                    return "下一页";
                  case "page":
                    return page;
                }
              },
              tooltipTitles: function( type, page, current) {
                switch( type ) {
                  case "first":
                    return "首页";
                  case "last":
                    return "尾页";
                  case "prev":
                    return "上一页";
                  case "next":
                    return "下一页";
                  case "page":
                    return "前往第" + page + "页";
                }
              },
            })
         }

       })
     }
//      2.点击添加按钮，显示模态框
     $('#addBtn').click(function(){
         $('#addModal').modal('show');
       $.ajax({
         url: "/category/querySecondCategoryPaging",
         type: "get",
         data: {
           page: 1,
           pageSize: 100
         },
         success:function( info ){
            console.log(info);
            var htmlStr = template('dropdowmTpl',info)
            $('.dropdown-menu ').html(htmlStr);

         }
       })
     });
// 3. 注册委托事件，渲染二级菜单
   $('.dropdown-menu').on('click','a',function(){
      $('#dropdownText').text($(this).text());
      var id = $(this).data('id');
     $('[name="brandId"]').val(id);
   });
//  4.配置上传图片的回调函数
  $('#fileupload').fileupload({
    // 返回数据类型
    dataType: "json",
    // 上传完图片, 响应的回调函数配置
    // 每一张图片上传, 都会响应一次
    done: function (e, data) {
      //console.log(data);
      // 获取图片地址对象
        var picObj = data.result;
      // 获取图片地址
        var picAddr = picObj.picAddr;
      // 新得到的图片对象, 应该推到数组的最前面
        picArr.unshift(picObj);
      $('#imgBox').prepend('<img src="'+ picAddr +'" width="100">');
      if(picArr.length>3){
           picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if ( picArr.length === 3 ) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
      }

    }

  });
//  5.表单的校验
  $('#form').bootstrapValidator({
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
    //  商品库存
      num:{
         validators:{
            notEmpty:{
               message:"请输入商品库存"
            },
         //  正则校验
           regexp: {
             regexp: /^[1-9]\d*$/,
             message: '商品库存格式, 必须是非零开头的数字'
           }

         }
      },
    //  尺码校验
      size:{
         validators:{
            notEmpty:{
              message:"请输入商品尺码"
            },
           //正则校验
           regexp: {
             regexp: /^\d{2}-\d{2}$/,
             message: '尺码格式, 必须是 32-40'
           }

         }
      },
      // 商品价格
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }

  });
// 6.注册校验成功状态
  $("#form").on("success.form.bv", function( e ) {
    // 阻止默认的提交
    e.preventDefault();

    // 表单提交得到的参数字符串
    var params = $('#form').serialize();

    console.log(picArr);

    // 需要在参数的基础上拼接上这些参数
    // &picName1=xx&picAddr1=xx
    // &picName2=xx&picAddr2=xx
    // &picName3=xx&picAddr3=xx
    params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    console.log(params);

    // 通过 ajax 进行添加请求
    $.ajax({
      url: "/product/addProduct",
      type: "post",
      data: params,
      success: function( info ) {
        console.log( info )
        if (info.success) {
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重置校验状态和文本内容
          $('#form').data("bootstrapValidator").resetForm(true);
          // 重新渲染第一页
          currentPage = 1;
          render();

          // 手动重置, 下拉菜单
          $('#dropdownText').text("请选择二级分类")

          // 删除结构中的所有图片
          $('#imgBox img').remove();
          // 重置数组 picArr
          picArr = [];

        }
      }
    })
  })
})
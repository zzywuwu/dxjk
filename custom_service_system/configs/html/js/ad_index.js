// JavaScript Document

// JavaScript Document

var testData = {
"account_list":[
	{"id": "1",
"zhcn_msg": "你们好",
"en_msg": "hello",
"zhtw_msg": "繁体你们好",
"status": "已发布"}
]
};


var TableAdvanced = function() {

	var initTableList =  function() {

			 TendaAjax.getData({"script":"ad_get_list"}, function(result){
				
				if(result.error == GLOBAL.SUCCESS) {
			
					initTable1(result.ad_list);
				}
				

			});
			 //initTable1(testData.account_list);
			// initTable1(testData.account_list2);

		}

	var initTable1 = function(account_list) {
		
		var oTable = jQuery("#ad_list").dataTable({
			"bDestroy": true,
			"oLanguage": {
				"sLengthMenu": "每页显示 _MENU_ 条记录",
				"sZeroRecords": "抱歉，没有找到",
				"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
				"sInfoEmpty": "没有数据",
				"sInfoFiltered": "(从 _MAX_ 条数据中检索)",
				"sSearch": "搜索",
				"oPaginate": {
					"sFirst": "首页",
					"sPrevious": "前一页",
					"sNext": "下一页",
					"sLast": "尾页"
				}
				//sProcessing : "<img src=... /loading.gif/>"
			},
			
			"aoColumnDefs": [{"aTargets":[0],
							"data":"id",
							"mRender": function(data, type, full) {
								return '<input type="checkbox" class="checkboxes" value="' + data +  '"/>';
								}

							},{
								"aTargets":[2],
								"mRender":function(data, type, full) {
									var curr_time = (new Date()).valueOf();
									var start_time = (new Date(full.start_time)).valueOf();
									var end_time = (new Date(full.end_time)).valueOf();

									if(curr_time < start_time) {
										return "未发布";
									} else if (curr_time > end_time) {
										return "已发布";
									} else {
										return "发布中";
									}
								}
							}
							],
			"aaSorting": [[1, 'asc']],
			"aLengthMenu": [
				[1,5, 15, 20, -1],
				[1,5, 15, 20, "所有"]
			],
			"iDisplayLength": 10,
			
			"aaData": account_list,

			"aoColumns": [{"mDataProp": "id", "bSortable":false},
				{"mDataProp": "title"},
				{"mDataProp": "start_time", "sClass":"hidden-480"}]

		});

		

		jQuery("#ad_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#ad_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#ad_list .checkboxes");
	}

	

	return {
		init: function () {

			$(".ad-form").validate({

				errorElement: 'span', //default input error message container
	            errorClass: 'error', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	           
				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证
					
					var submitData = {};
					
					
					submitData.title = form.ad_title.value;
					
					submitData.start_time = form.ad_start.value;
					submitData.end_time = form.ad_end.value;
					submitData.zhcn_msg = form.ad_zh.value;
					submitData.en_msg = form.ad_en.value;
					submitData.zhtw_msg = form.ad_tw.value;
					
						
					submitData.script = "ad_add";
					

					TendaAjax.getData(submitData, function(result){
						//提示成功或失败
						//console.log(result);
						alert(result.error);
						initTableList();
						$("#ad_modal").modal("hide");

					});

				}
			});
			
			$(".form-datetime").datetimepicker({
				format:"yyyy-mm-dd hh:ii:ss",
				autoclose: true,
				todayBtn: true,
				pickerPosition:"bottom-left"
			});

			jQuery('#ad_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text']").val('');

					
			
  				//alert("hidden");
  				//TODO:remove错误提示，初始化错误码
			});

			jQuery('.ad-index>li').on("click", function(){

				
				var set = jQuery("#ad_list .group-checkable").attr("data-set");
                var arr = [];
                var arr_id = [];
                var oTable = $("#ad_list").dataTable();
                jQuery(set).each(function () {
                	if($(this).is(':checked')) {
                		
                		var nTr = $(this).parents("tr");

                		var tmpObj = oTable.fnGetData(nTr[0]);

                		if(tmpObj) {
                			arr.push(tmpObj);
                			arr_id.push(tmpObj.id);
                		}

                	}
                });

                if(arr.length == 0) {
                	alert("请至少选择一条数据");
                	return;
                }

                //console.log(arr);

                
            	//删除数据
            	var submitData = {};
            	submitData.script = "ad_del";
            	submitData.id = arr_id;

            	TendaAjax.getData(submitData, function(result){
            		alert(result.error);
            		initTableList();
            	});
                



			});


			jQuery('#ad_list .group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });

			if(!jQuery().dataTable){
				return;
			}

			//initTable1([]);
			App.initUniform();
			initTableList();
		}
	};

}();


TableAdvanced.init();

//App.init();
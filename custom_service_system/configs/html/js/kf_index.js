// JavaScript Document

/*var testData = {
"account_list":[
	{"name": "admin1",
"create_time": "2015-10-24 13:54:44",
"email": "null",
"id":2,
"last_login_time": "2015-10-28 09:25:06",
"password": "12345678",
"privilege": 63,
"status": 1,
"update_time": "0000-00-00 00:00:00"},
{"name": "admin2",
"create_time": "2015-10-24 13:54:44",
"email": "null",
"id":2,
"last_login_time": "2015-10-28 09:25:06",
"password": "12345678",
"privilege": 63,
"status": 1,
"update_time": "0000-00-00 00:00:00"}
]
};
*/

var KFTableAdvanced = function() {

	var initTableList =  function() {

			 TendaAjax.getData({"script":"ac_get_list", "privilege":4}, function(result){
				
			 	if(result.error == GLOBAL.SUCCESS) {
			
			 		initTable1(result.user_list);
			 	}
				

			 });
			 //initTable1(testData.account_list);
			// initTable1(testData.account_list2);

		}

	var initTable1 = function(account_list) {
		
		var oTable = jQuery("#kf_list").dataTable({
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
								"aTargets":[6],
								"data":"status",
								"mRender": function(data, type, full) {
									var result = "";
									switch(data) {
										case "actived":
											result = "激活";
											break;
										case "not actived":
											result = "未激活";
											break;
										
									}
									return result;
								}
							}],
			"aaSorting": [[1, 'asc']],
			"aLengthMenu": [
				[1,5, 15, 20, -1],
				[1,5, 15, 20, "所有"]
			],
			"iDisplayLength": 10,
			
			"aaData": account_list,

			"aoColumns": [{"mDataProp": "id", "bSortable":false},
				{"mDataProp": "name"},
				{"mDataProp": "email", "sClass":"hidden-480"},
				{"mDataProp": "create_time", "sClass":"hidden-480"},
				{"mDataProp": "update_time", "sClass":"hidden-480"},
				{"mDataProp": "last_login_time", "sClass":"hidden-480"},
				{"mDataProp": "status", "sClass":"hidden-480"}

				]

		});

		

		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");
	}

	var initModalCheck = function(num) {

        //var checked = jQuery(this).is(":checked");
        jQuery(".kf-form .kf-group").each(function () {
            var val = +jQuery(this).val();
            if(num & val) {
            	jQuery(this).attr("checked", true).parent("span").addClass("checked");
            } else {
            	jQuery(this).attr("checked", false).parent("span").removeClass("checked");
            }
        });
              
	}

	var getModalCheckVal = function() {
		
		var num = 1;

		jQuery(".kf-form .kf-group:checked").each(function () {
            var val = +jQuery(this).val();
            num = num | val;
        });

		return num;
	}

	return {
		init: function () {

			$(".kf-form").validate({

				errorElement: 'span', //default input error message container
	            errorClass: 'error', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                kf_username: {
	                    required: false
	                },
	                kf_email: {
	                    required: false,
	                    email:false
	                }
	            },

	            messages:{
                    kf_username:{
                        required:"必填"
                    },
                    kf_email:{
                        required:"必填",
                        email:"E-Mail格式不正确"
                    }
                                                   
                },
				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证
					var submitData = {};
					var operation = $("#kf_username").prop("disabled") ? "MODIFY" : "ADD";
					
					submitData.email = form.kf_email.value;
					submitData.privilege = 4;
					submitData.name = form.kf_username.value;
					if(operation == "MODIFY") {
						
						submitData.script = "ac_modify";
					} else {
						submitData.password = form.kf_password.value;
						submitData.script = "ac_add";
					}

					TendaAjax.getData(submitData, function(result){
						//提示成功或失败
						//console.log(result);
						alert(result.error);
						initTableList();
						$("#kf_modal").modal("hide");

					});

				}
			});

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("#kf_username").prop("disabled", false);
				$("#kf_password").parents(".control-group").css("display", "block").end().val("");
  				//alert("hidden");
  				//TODO:remove错误提示，初始化错误码
			});

			jQuery('.kf-index>li').on("click", function(){

				var operation = $(this).find("i").hasClass("icon-pencil") ? "MODIFY" : "DELETE";
				var set = jQuery("#kf_list .group-checkable").attr("data-set");
                var arr = [];
                var arr_name = [];
                var oTable = $("#kf_list").dataTable();
                jQuery(set).each(function () {
                	if($(this).is(':checked')) {
                		
                		var nTr = $(this).parents("tr");

                		var tmpObj = oTable.fnGetData(nTr[0]);

                		if(tmpObj) {
                			arr.push(tmpObj);
                			arr_name.push(tmpObj.name);
                		}

                	}
                });

                if(arr.length == 0) {
                	alert("请至少选择一条数据");
                	return;
                }

                //console.log(arr);

                if(operation == "MODIFY") {
                	//默认编辑第一条
                	//显示模态框，并将数据显示到模态框中
                	$("#kf_username").val(arr[0].name).prop("disabled", true);
                	$("#kf_email").val(arr[0].email);
                	$("#kf_password").parents(".control-group").css("display", "none");

                	
                	$("#kf_modal").modal("show");


                } else {
                	//删除数据
                	var submitData = {};
                	submitData.script = "ac_del";
                	submitData.name = arr_name;

                	TendaAjax.getData(submitData, function(result){
                		alert(result.error);
                		initTableList();
                	});
                }



			});


			jQuery('#kf_list .group-checkable').change(function () {
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


KFTableAdvanced.init();

//App.init();

var KFTableAdvanced = function() {

	var operation_customer_id = $("#kf_list").attr("data");

	var initTableList =  function() {
		TendaAjax.getData({"script":"record_get_list","customer_id":operation_customer_id}, function(result){
		if(result.error == GLOBAL.SUCCESS) {
			$("#record_title").html('<i class="icon-heart"></i>陪诊记录('+result.username+')');
			initTable1(result.user_record);
		}
		else 
			alert(result.error);
		});
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
			
			"aoColumnDefs": [
							{
								"aTargets":[0],
								"data":"id",
								"mRender": function(data, type, full) {
									return '<input type="checkbox" class="checkboxes" value="' + data +  '"/>';
								}
							},
							{
								"aTargets":[1],
								"mRender":function(data, type, full){
									return data.split(" ",1);
								}
							},
							{
								"aTargets":[2],
								"mRender":function(data, type, full){
									return data.split(" ",1);
								}
							},
							{
								"aTargets":[5],
								"mRender":function(data, type, full){
									if (data)
							        	return '已审核';
							        else
							        	return '未审核';
								}
							},
							{
								"aTargets":[7],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close desc'></span>";
								}
							}
			],
			"aaSorting": [[1, 'desc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id","bSortable":false,"sWidth":"5px"}, 
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "next_visit_date","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "servicename","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "verify","sClass":"hidden-480","sWidth":"40px"},
				{"mDataProp": "result","sClass":"hidden-480","sWidth":"400px"},
				{"mDataProp": "id","sWidth":"40px"}
				]

		});

		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");
	}

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td>就诊日期:</td><td>'+aData.visit_date.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>就诊时间:</td><td>'+aData.visit_time+'</td></tr>';
        sOut += '<tr><td>复诊日期:</td><td>'+aData.next_visit_date.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>陪诊人员:</td><td>'+aData.servicename+'</td></tr>';
        sOut += '<tr><td>就诊项目:</td><td>'+aData.visit_type+'</td></tr>';
		sOut += '<tr><td>就诊医生:</td><td>'+aData.visit_doctor_name+'</td></tr>';
		sOut += '<tr><td>结果:</td><td>'+aData.result+'</td></tr>';
        sOut += '<tr><td>医嘱:</td><td>'+aData.doctor_advise+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';
        if (aData.verify)
        	sOut += '<tr><td>备注:</td><td>已审核</td></tr>';
        else
        	sOut += '<tr><td>备注:</td><td>未审核</td></tr>';
        sOut += '</table>';  
        return sOut;
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

	var operation_modal;

	return {
		init: function () {

			$(".kf-form").validate({

				errorElement: 'span', //default input error message container
	            errorClass: 'error', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                kf_username: {
	                    required: false
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
					if(operation_modal == "MODIFY") {
						submitData.script = "record_modify";
					}
					else {
						submitData.script = "record_add";
					}
					
					submitData.id = $("#kf_id").val();
					submitData.customer_id = operation_customer_id;
					submitData.visit_date = form.kf_visit_date.value;
					submitData.visit_time = jQuery('#record_visit_time').val();
					submitData.visit_type = jQuery('#record_project_option').val();
					submitData.visit_doctor_name = form.kf_visit_doctor_name.value;
					submitData.result = form.kf_result.value;
					submitData.doctor_advise = form.kf_doctor_advise.value;
					submitData.remarks = form.kf_remarks.value;
					submitData.next_visit_date = form.kf_next_visit_date.value;
					submitData.servicename = jQuery('#record_servicename').val();

					TendaAjax.getData(submitData, function(result){
						if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#kf_modal").modal("hide");
						}				
                		else
                			alert(result.error);	
					});

				}
			});

			jQuery('#addbutton').on("click", function(){

				operation_modal = "ADD";
				TendaAjax.getData({"script":"ac_get_list"}, function(result){
				 	if(result.error == GLOBAL.SUCCESS) {
				 		for(var i = 0; i < result.user_list.length; i++) {
				 			jQuery('#record_servicename').append("<option>" + result.user_list[i].name + "</option>");
				 		}
				 	}
				 	else 
				 		alert(result.error);				 	
				});
			});

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("textarea").val('');
				jQuery("#record_servicename").empty();
			});

			jQuery('.kf-index>li').on("click", function(){

				var operation;
				if ($(this).find("i").hasClass("icon-pencil")) {
					operation = "MODIFY";
				}
				else if ($(this).find("i").hasClass("icon-trash")) {
					operation = "DELETE";
				}
				else if ($(this).find("i").hasClass("icon-search")) {
					operation = "SEARCH";	
				}
				else {
					alert("开发中,请耐心等待");
					return 
				}

				var set = jQuery("#kf_list .group-checkable").attr("data-set");
                var arr = [];
                var arr_name = [];
                var arr_id = [];
                var oTable = $("#kf_list").dataTable();
                jQuery(set).each(function () {
                	if($(this).is(':checked')) {
                		var nTr = $(this).parents("tr");
                		var tmpObj = oTable.fnGetData(nTr[0]);
                		if(tmpObj) {
                			arr.push(tmpObj);
                			arr_name.push(tmpObj.name);
                			arr_id.push(tmpObj.id);
                		}
                	}
                });
          
                if(operation == "MODIFY") {

                	operation_modal = "MODIFY";

                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }
	                TendaAjax.getData({"script":"ac_get_list"}, function(result){
					 	if(result.error == GLOBAL.SUCCESS) {
					 		for(var i = 0; i < result.user_list.length; i++) {
					 			jQuery('#record_servicename').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	else
					 		alert(result.error);
					 	
						jQuery('#record_servicename option').each(function(){
							if (arr[0].servicename == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});
          			
					$("#kf_id").val(arr[0].id).prop("disabled", true);
					$("#kf_visit_date").val(arr[0].visit_date.split(" ",1));
					jQuery('#record_visit_time option').each(function(){
						if (arr[0].visit_time == $(this).text()){
							$(this).attr("selected",true);
						}
					});
					jQuery('#record_project_option option').each(function(){
						if (arr[0].visit_type == $(this).text()){
							$(this).attr("selected",true);
						}
					});
					$("#kf_visit_doctor_name").val(arr[0].visit_doctor_name);	
					$("#kf_result").val(arr[0].result);
					$("#kf_doctor_advise").val(arr[0].doctor_advise);
					$("#kf_remarks").val(arr[0].remarks);
					$("#kf_next_visit_date").val(arr[0].next_visit_date.split(" ",1));	
                	$("#kf_modal").modal("show");
                }
                else if (operation == "DELETE") {

                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }
                	var submitData = {};
                	submitData.script = "record_del";
                	submitData.id = arr_id;

                	TendaAjax.getData(submitData, function(result){
                		if(result.error == GLOBAL.SUCCESS) {
							initTableList();
						}				
                		else
                			alert(result.error);
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

            $('#kf_list').on('click', '  tbody td .desc', function () {

            	var oTable = $("#kf_list").dataTable();
	            var nTr = $(this).parents('tr')[0];
	            if ( oTable.fnIsOpen(nTr) )
	            {
	                /* This row is already open - close it */
	                $(this).addClass("row-details-close").removeClass("row-details-open");
	                oTable.fnClose( nTr );
	            }
	            else
	            {
	                /* Open this row */                
	                $(this).addClass("row-details-open").removeClass("row-details-close");
	                oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
	            }
	        });

			if(!jQuery().dataTable){
				return;
			}

			App.initUniform();
			initTableList();
		}
	};

}();


KFTableAdvanced.init();
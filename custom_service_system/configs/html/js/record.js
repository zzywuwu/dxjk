
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
									if (full.verify)
										return "";
									else
										return '<input type="checkbox" class="checkboxes" value="' + data +  '"/>';
								}
							},
							{
								"aTargets":[1],
								"mRender":function(data, type, full){
									if (data) {										
										return "记录";
									}
									else {
										return "事件";										
									}
								}
							},
							{
								"aTargets":[2],
								"mRender":function(data, type, full){
									if (full.status) {
										if (full.verify)
											return "已审核";
										else
											return "未审核";
									}
									else {
										if (full.order_success)
											return "已预约";
										else
											return "未预约";
									}
								}
							},
							{
								"aTargets":[3],
								"mRender":function(data, type, full){
									return data.split(" ",1);
								}
							},
							{
								"aTargets":[9],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close desc'></span>";
								}
							}
			],
			// "aaSorting": [[1, 'asc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id","bSortable":false,"sWidth":"5px"}, 
				{"mDataProp": "status","sWidth":"40px"},
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "visit_time","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "visit_doctor_name","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"400px"},
				{"mDataProp": "user_id_name","sWidth":"70px"},
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
		sOut += '<tr><td>就诊项目:</td><td>'+aData.visit_type+'</td></tr>';
		sOut += '<tr><td>就诊医生:</td><td>'+aData.visit_doctor_name+'</td></tr>';
        if (aData.status == 1) {
			// 记录 
			sOut += '<tr><td>陪诊人员:</td><td>'+aData.servicename+'</td></tr>';
			sOut += '<tr><td>就诊记录:</td><td>'+aData.result+'</td></tr>';
			sOut += '<tr><td>医嘱:</td><td>'+aData.doctor_advise+'</td></tr>';
			if (aData.verify)
   				sOut += '<tr><td>审核状态:</td><td>已审核</td></tr>';
  			else
   			    sOut += '<tr><td>审核状态:</td><td>未审核</td></tr>';
        }
        else {
        	// 事件
        	sOut += '<tr><td>创建者:</td><td>'+aData.user_id+'</td></tr>';
        	if (aData.order_success)
        		sOut += '<tr><td>预约状态:</td><td>已预约</td></tr>';
        	else
        		sOut += '<tr><td>预约状态:</td><td>未预约</td></tr>';
        	sOut += '<tr><td>就诊地址:</td><td>'+aData.visit_address+'</td></tr>';
        }
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';  
        if (aData.status == 1) {
	        if (aData.next_visit_date != '') {
	        	if (aData.next_order_success)
					sOut += '<tr><td>复诊时间:</td><td>'+aData.next_visit_date.split(" ",1)+ ' '+ aData.next_visit_time + ' (已预约)' + '</td></tr>';
				else
					sOut += '<tr><td>复诊时间:</td><td>'+aData.next_visit_date.split(" ",1)+ ' '+ aData.next_visit_time + ' (未预约)' + '</td></tr>';
				sOut += '<tr><td>复诊医生:</td><td>'+aData.next_visit_doctor_name+'</td></tr>';
	        }
	        else {
	        	sOut += '<tr><td>复诊时间:</td><td></td></tr>';
	        	sOut += '<tr><td>复诊医生:</td><td></td></tr>';
	        }
	    }
        sOut += '</table>';  
        return sOut;
    }

	var operation_modal;

	return {
		init: function () {

			var v_kf_form = $('.kf-form');
			v_kf_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
	            
	            highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                },

				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证
					var submitData = {};
					
					submitData.script = "record_modify";
					
					submitData.id = $("#kf_id").val();
					submitData.visit_date = form.kf_visit_date.value;
					submitData.visit_time = jQuery('#kf_visit_time').val();
					submitData.visit_type = jQuery('#kf_visit_type').val();
					submitData.visit_doctor_name = form.kf_visit_doctor_name.value;
					submitData.result = form.kf_result.value;
					submitData.doctor_advise = form.kf_doctor_advise.value;
					submitData.remarks = form.kf_remarks.value;
					submitData.servicename = jQuery('#kf_servicename').val();

					submitData.next_visit_date = form.kf_next_visit_date.value;
					submitData.next_visit_time = form.kf_next_visit_time.value;
					if (jQuery('#kf_next_order_success').val() == "已预约")
						submitData.next_order_success = 1;
					else
						submitData.next_order_success = 0;
					submitData.next_visit_doctor_name = form.kf_next_visit_doctor_name.value;

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

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("textarea").val('');
				$(".controls span",$(this)).remove();
				$(".control-group").removeClass('success').removeClass('error')
			});
		
			var v_event_form = $('.event-form');
           
			v_event_form.validate({

	   			errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {
	                event_visit_doctor_name: {
	                    minlength: 2,
                        required: function() {
                        	if (jQuery('#event_visit_type').val() == "复诊" ) {
                                return true;
                        	}
                        	else{
                        		return false;
                        	}
                        }
	                },
	                event_visit_date: {
	                    required: true,
                        date: true
	                }
	            },

	            messages:{
                    event_visit_doctor_name:{
                        required:"必填"
                    },
                    event_visit_date:{
                        required:"必填"
                    }                                                     
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                },

				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证
					var submitData = {};
					if(operation_modal == "MODIFY") {
						submitData.script = "event_modify";
					}
					else {
						submitData.script = "event_add";
						submitData.customer_id = operation_customer_id;
					}
					submitData.id = $("#event_id").val();
					submitData.visit_date = form.event_visit_date.value;
					submitData.visit_time = jQuery('#event_visit_time').val();
					submitData.visit_type = jQuery('#event_visit_type').val();
					if (jQuery('#event_order_success').val() == "已预约")
						submitData.order_success = 1;
					else
						submitData.order_success = 0;
					submitData.visit_address = form.event_visit_address.value;
					submitData.visit_doctor_name = form.event_visit_doctor_name.value;
					submitData.remarks = form.event_remarks.value;
					
					TendaAjax.getData(submitData, function(result){
						if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#event_modal").modal("hide");
						}				
                		else
                			alert(result.error);
					});

				}
			});

        	jQuery('#event_visit_type').change(function () {
        		$("#event_visit_doctor_name_group .controls span").remove();
				$("#event_visit_doctor_name_group").removeClass('success').removeClass('error');
            	if (jQuery('#event_visit_type').val() == "复诊" ) {
	        		var html = '<span class="required">*</span>';
	        		$('#event_visit_doctor_name_group').children('label').append(html);	
	        	}
	        	else{
	        		$('#event_visit_doctor_name_group').children('label').children('span').remove();	
	        	}
            });

			jQuery('#event_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("textarea").val('');
				$(".controls span",$(this)).remove();
				$(".control-group").removeClass('success').removeClass('error');	
			});

			jQuery('.kf-index>li').on("click", function(){

				var operation;
				if ($(this).find("i").hasClass("icon-pencil")) {
					operation = "MODIFY";
				}
				else if ($(this).find("i").hasClass("icon-trash")) {
					operation = "DELETE";
				}
				else if ($(this).find("i").hasClass("icon-plus")) {
					operation = "RECORD";	
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

          			$("#event_id").val(arr[0].id).prop("disabled", true);
					$("#event_visit_date").val(arr[0].visit_date.split(" ",1));
					jQuery('#event_visit_time option').each(function(){
						if (arr[0].visit_time == $(this).text()){
							$(this).attr("selected",true);
						}
					});
					jQuery('#event_visit_type option').each(function(){
						if (arr[0].visit_type == $(this).text()){
							$(this).attr("selected",true);
						}
					});
					jQuery('#event_order_success option').each(function(){
						if ("已预约" == $(this).text() && arr[0].order_success){
							$(this).attr("selected",true);
							return false;
						}
					});
					$("#event_visit_doctor_name").val(arr[0].visit_doctor_name);
					$("#event_visit_address").val(arr[0].visit_address);	
					$("#event_remarks").val(arr[0].remarks);
                	$("#event_modal").modal("show");
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
                else if (operation == "RECORD") {
                	
                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }

					$("input[type='text'], input[type='hidden']").val('');
					$("input[type='date']").val('');
					$("textarea").val('');
					jQuery("#kf_servicename").empty();
					
	                TendaAjax.getData({"script":"ac_get_list"}, function(result){
					 	if(result.error == GLOBAL.SUCCESS) {
					 		jQuery('#kf_servicename').append("<option></option>");
					 		for(var i = 0; i < result.user_list.length; i++) {
					 			jQuery('#kf_servicename').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	else
					 		alert(result.error);
					 	
						jQuery('#kf_servicename option').each(function(){
							if (arr[0].servicename == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});
          			
					$("#kf_id").val(arr[0].id).prop("disabled", true);
					$("#kf_visit_date").val(arr[0].visit_date.split(" ",1));
					jQuery('#kf_visit_time option').each(function(){
						if (arr[0].visit_time == $(this).text()){
							$(this).attr("selected",true);
						}
					});
					jQuery('#kf_visit_type option').each(function(){
						if (arr[0].visit_type == $(this).text()){
							$(this).attr("selected",true);
						}
					});
					$("#kf_visit_doctor_name").val(arr[0].visit_doctor_name);	
					$("#kf_result").val(arr[0].result);
					$("#kf_doctor_advise").val(arr[0].doctor_advise);
					$("#kf_remarks").val(arr[0].remarks);

					$("#kf_next_visit_date").val(arr[0].next_visit_date.split(" ",1));	
                	jQuery('#kf_next_visit_time option').each(function(){
						if (arr[0].next_visit_time == $(this).text()){
							$(this).attr("selected",true);
						}
					});
                	jQuery('#kf_next_order_success option').each(function(){
						if ("已预约" == $(this).text() && arr[0].next_order_success){
							$(this).attr("selected",true);
							return false;
						}
					});
                	$("#kf_next_visit_doctor_name").val(arr[0].next_visit_doctor_name);	

                	$("#kf_modal").modal("show");	
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
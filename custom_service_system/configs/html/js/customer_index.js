
var KFTableAdvanced = function() {

	var initTableList =  function() {

		 TendaAjax.getData({"script":"customer_get_list"}, function(result){
			
		 	if(result.error == GLOBAL.SUCCESS) {
		
		 		initTable1(result.user_list);
		 	}
		 	else 
		 		alert(result.error)
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
								"aTargets":[3],
								"mRender":function(data, type, full){
									// var last_menses_data = data.split(" ",1);	
									// var startTime = new Date(last_menses_data).getTime();     
								 	// var endTime = new Date().getTime();   
								 	// var dates = Math.abs((endTime - startTime))/(1000*60*60*24);     
								    // return  dates
								    return data;
								}
							},
							{
								"aTargets":[6],
								"mRender":function(data, type, full){
									if (data.length > 40)
										return data.substr(1,40)+'..';
									else
										return data;
								}
							},
							{
								"aTargets":[7],
								"mRender":function(data, type, full){
									return'<a href="#" class="record" data="' + data + '">记录</a>'
								}
							},
							{
								"aTargets":[8],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close desc'></span>";
								}
							}
			],
			// "aaSorting": [[3, 'asc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id", "bSortable":false,"sWidth":"5px"}, 
				{"mDataProp": "name","sWidth":"60px"},
				{"mDataProp": "phonenumber","sClass":"hidden-480","sWidth":"80px"},
				{"mDataProp": "customer_type","sClass":"hidden-480","sWidth":"60px"},
				{"mDataProp": "doctor_name","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "sellname","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"400px"},
				{"mDataProp": "id","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "id","sWidth":"40px"}
				]

		});

		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");

		jQuery(".record").click(function(){
			 var data = {"page":"record_index.html","customer_id":$(this).attr("data")};
			 TendaAjax.getHtml(data, function(result){
				$(".page-content .container-fluid").html(result);
			});  
		});
	}

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td style="width:100px;">姓名:</td><td>'+aData.name+'</td></tr>';
        sOut += '<tr><td>电话:</td><td>'+aData.phonenumber+'</td></tr>';
        sOut += '<tr><td>客户类型:</td><td>'+aData.customer_type+'</td></tr>';
        if (aData.customer_type == GLOBAL.YUNMM) {
        	sOut += '<tr><td>孕周:</td><td>'+aData.diffdays+'</td></tr>';
        	sOut += '<tr><td>末次月经:</td><td>'+aData.last_menses_time.split(" ",1)+'</td></tr>';
			sOut += '<tr><td>预产期:</td><td>'+aData.due_time.split(" ",1)+'</td></tr>';
        }
        sOut += '<tr><td>建卡医生:</td><td>'+aData.doctor_name+'</td></tr>';
        sOut += '<tr><td>销售员:</td><td>'+aData.sellname+'</td></tr>';
        sOut += '<tr><td>身份证:</td><td>'+aData.idnumber+'</td></tr>';
        sOut += '<tr><td>微信号:</td><td>'+aData.wx+'</td></tr>';
        sOut += '<tr><td>年龄:</td><td>'+aData.age+'</td></tr>';
        sOut += '<tr><td>地址:</td><td>'+aData.address+'</td></tr>';
        sOut += '<tr><td>家属姓名:</td><td>'+aData.familyname+'</td></tr>';
        sOut += '<tr><td>家属电话:</td><td>'+aData.familyphonenumber+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';
        sOut += '</table>';  
        return sOut;
    }

	return {
		init: function () {

			var v_kf_form = $('.kf-form');
			v_kf_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {
	                kf_last_menses_time: {
	                	date: true,
                        required: function() {
                        	if (jQuery('#kf_customer_type').val() == GLOBAL.YUNMM ) {
                                return true;
                        	}
                        	else{
                        		return false;
                        	}
                        }
	                },
	                kf_due_time: {
	                	date: true,
                        required: function() {
                        	if (jQuery('#kf_customer_type').val() == GLOBAL.YUNMM ) {
                                return true;
                        	}
                        	else{
                        		return false;
                        	}
                        }
	                }, 	
	                kf_username: {
	                    minlength: 2,
                        required: true
	                },
	                kf_age: {
	                	maxlength: 2,
	                    digits: true,
                        required: true
	                },
	                kf_phonenumber: {
	                	minlength: 8,
	                    digits: true,
                        required: true
	                },
	                kf_wx: {
	                	minlength: 6,
                        required: true
	                }
	            },

	            messages:{
                    kf_username:{
                        required:"必填",
                        minlength: "请输入最少2位"	
                    },
                    kf_age:{
                        required:"必填",
                        maxlength: "请输入最多2位数字",
                        digits: "请输入数字"
                    },
                    kf_phonenumber:{
                        required:"必填",
                        minlength: "请输入最少8位数字"
                    },
                    kf_due_time:{
                        required:"必填",
                        date:"请输入日期"
                    },
                    kf_last_menses_time:{
                        required:"必填",
                        date:"请输入日期"
                    },
                    kf_wx:{
                        required:"必填",
                         minlength: "请输入最少6位"
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

					var operation = $("#kf_username").prop("disabled") ? "MODIFY" : "ADD";
					if(operation == "MODIFY") {
						submitData.script = "customer_modify";
					} else {
						submitData.script = "customer_add";
					}

					submitData.name = form.kf_username.value;
					submitData.phonenumber = form.kf_phonenumber.value;
					submitData.id = $("#kf_customer_id").val();
					submitData.doctor_name = form.kf_doctor_name.value;
					submitData.due_time = form.kf_due_time.value;
					submitData.idnumber = form.kf_idnumber.value;
					submitData.wx = form.kf_wx.value;
					submitData.last_menses_time = form.kf_last_menses_time.value;
					submitData.sellname = jQuery('#kf_sellname').val();
					submitData.customer_type = jQuery('#kf_customer_type').val();
					submitData.remarks = form.kf_remarks.value;
					
					submitData.address = form.kf_address.value;
					submitData.familyname = form.kf_familyname.value;
					submitData.familyphonenumber = form.kf_familyphonenumber.value;
					submitData.age = form.kf_age.value;

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

			jQuery('#kf_customer_type').change(function () {
        		$("#kf_due_time_group .controls span").remove();
				$("#kf_due_time_group").removeClass('success').removeClass('error');
				$("#kf_last_menses_time_group .controls span").remove();
				$("#kf_last_menses_time_group").removeClass('success').removeClass('error');
	         	if (GLOBAL.YUNMM == $(this).val()){
					jQuery('#kf_due_time_group').show(100);
					jQuery('#kf_last_menses_time_group').show(100);
				}
				else {
					jQuery('#kf_due_time_group').hide(100);
					jQuery('#kf_last_menses_time_group').hide(100);
				}
            });

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("#kf_username").prop("disabled", false);
				$("textarea").val('');
				jQuery("#kf_sellname").empty();
				$(".controls span",$(this)).remove();
				$(".control-group").removeClass('success').removeClass('error')
				jQuery('#kf_customer_type').val(GLOBAL.YUNMM);
				jQuery('#kf_due_time_group').show(100);
					jQuery('#kf_last_menses_time_group').show(100);
			});

			jQuery('#addbutton').on("click", function(){
				/*每次选择第一个*/
				jQuery('#kf_customer_type option').each(function(){
					$(this).attr("selected",true);
					return false;
				});

				jQuery('#kf_doctor_name option').each(function(){
					$(this).attr("selected",true);
					return false;
				});
			});

			jQuery('#kf_modal').on('show.bs.modal', function (e) {
				TendaAjax.getData({"script":"ac_get_list"}, function(result){
				 	if(result.error == GLOBAL.SUCCESS) {
				 		for(var i = 0; i < result.user_list.length; i++) {
				 			jQuery('#kf_sellname').append("<option>" + result.user_list[i].name + "</option>");
				 		}
				 	}
				 	else 
				 		alert(result.error);				 	
				});
			});

            var v_upvip_form = $('.upvip-form');
			v_upvip_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {
	                upvip_order_time: {
	                	date: true,
                        required: true
	                },
	                upvip_order_over_time: {
	                	date: true,
                        required: true
	                }
	            },

	            messages:{
                    
                    upvip_order_time:{
                        required:"必填"
                    },
                    upvip_order_over_time:{
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
                	submitData.script = "customer_upvip";
                	submitData.id = $("#upvip_id").val();
                	submitData.order_time = form.upvip_order_time.value;
                	submitData.order_over_time = form.upvip_order_over_time.value;
                	TendaAjax.getData(submitData, function(result){
                		if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#upvip_modal").modal("hide");
						}				
                		else
                			alert(result.error);
                	});
				}
			});

			jQuery('.kf-index>li').on("click", function(){
				var operation;
				if ($(this).find("i").hasClass("icon-pencil")) {
					operation = "MODIFY";
				}
				else if ($(this).find("i").hasClass("icon-trash")) {
					operation = "DELETE";
				}
				else if ($(this).find("i").hasClass("icon-user")) {
					operation = "UPVIP";	
				}
				else if ($(this).find("i").hasClass("icon-remove")) {
					operation = "REMOVE";	
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

                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }

          			TendaAjax.getData({"script":"ac_get_list"}, function(result){
					 	if(result.error == GLOBAL.SUCCESS) {
					 		for(var i = 0; i < result.user_list.length; i++) {
					 			jQuery('#kf_sellname').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	else
					 		alert(result.error);
					 	
						jQuery('#kf_sellname option').each(function(){
							if (arr[0].sellname == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});

					jQuery('#kf_customer_type option').each(function(){
						if (arr[0].customer_type == $(this).text()){
							$(this).attr("selected",true);
							if (arr[0].customer_type == GLOBAL.YUNMM) {
								$("#kf_due_time").val(arr[0].due_time.split(" ",1));
								$("#kf_last_menses_time").val(arr[0].last_menses_time.split(" ",1));
								jQuery('#kf_due_time_group').show(100);
								jQuery('#kf_last_menses_time_group').show(100);
							}
							else {
								jQuery('#kf_due_time_group').hide(100);
								jQuery('#kf_last_menses_time_group').hide(100);
							}
							return false;
						}
					});

					$("#kf_username").val(arr[0].name).prop("disabled", true);
					$("#kf_customer_id").val(arr[0].id).prop("disabled", true);
                	$("#kf_phonenumber").val(arr[0].phonenumber);
                	$("#kf_doctor_name").val(arr[0].doctor_name);
                	$("#kf_idnumber").val(arr[0].idnumber);
                	$("#kf_wx").val(arr[0].wx);
                	$("#kf_remarks").val(arr[0].remarks);
                	$("#kf_address").val(arr[0].address);
                	$("#kf_familyname").val(arr[0].familyname);
                	$("#kf_familyphonenumber").val(arr[0].familyphonenumber);
                	$("#kf_age").val(arr[0].age);

                	$("#kf_modal").modal("show");

                } 
                else if (operation == "DELETE") {

                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }
                	//删除数据
                	var submitData = {};
                	submitData.script = "customer_del";
                	submitData.id = arr_id;

                	TendaAjax.getData(submitData, function(result){
                		if(result.error == GLOBAL.SUCCESS) {
							initTableList();
						}				
                		else
                			alert(result.error);
                	});
                }
                else if (operation == "UPVIP") {

                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }

					$("#upvip_id").val(arr_id);//.prop("disabled", true);
					$("#upvip_order_time").val('');
                	$("#upvip_order_over_time").val('');
                	$("#upvip_modal").modal("show");
           
                }
                else if (operation == "REMOVE") {
                	
                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }
                	//删除数据
                	var submitData = {};
                	submitData.script = "customer_remove";
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
			
			TendaAjax.getData({"script":"get_privilege"}, function(result){
			 	if(result.error == GLOBAL.SUCCESS) {
			 		if ((result.privilege & 1) == 1) {
	            
			 		}
			 		else {
	      				$('#tools_upvip').hide(100);	
	                	$('#tools_remove').hide(100);		
			 		}
			 	} 
			 	else
			 		alert(result.error);
			});

			App.initUniform();
			initTableList();
		}
	};

}();

KFTableAdvanced.init();

var KFTableAdvanced = function() {

	var initTableList =  function() {

		 TendaAjax.getData({"script":"customer_get_list"}, function(result){
			
		 	if(result.error == GLOBAL.SUCCESS) {
		
		 		initTable1(result.user_list);
		 	}
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
								"aTargets":[3],
								"data":"next_visit_time",
								"mRender": function(data, type, full) {
									var result = data.split(" ",1);
									return result;
								}
							},
							{
								"aTargets":[6],
								"data":"due_time",
								"mRender": function(data, type, full) {
									var result = data.split(" ",1);
									return result;
								}
							},
							{
								"aTargets":[8],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close xiangqing'></span>";
								}
							}
			],
			"aaSorting": [[3, 'asc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id", "bSortable":false,"sWidth":"0px"}, 
				{"mDataProp": "name"},
				{"mDataProp": "phonenumber","sClass":"hidden-480","sWidth":"95px"},
				{"mDataProp": "next_visit_time","sClass":"hidden-480","sWidth":"95px"},
				{"mDataProp": "doctor_name","sClass":"hidden-480"},
				{"mDataProp": "sellname","sClass":"hidden-480"},
				{"mDataProp": "due_time","sClass":"hidden-480","sWidth":"95"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"300px"},
				{"mDataProp": "id"}
				]

		});

		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");
	}

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td>姓名:</td><td>'+aData.name+'</td></tr>';
        sOut += '<tr><td>电话:</td><td>'+aData.phonenumber+'</td></tr>';
        sOut += '<tr><td>建卡医生:</td><td>'+aData.doctor_name+'</td></tr>';
        sOut += '<tr><td>销售员:</td><td>'+aData.sellname+'</td></tr>';
        sOut += '<tr><td>下次就诊日:</td><td>'+aData.next_visit_time.split(" ",1)+'</td></tr>';
		sOut += '<tr><td>末次月经:</td><td>'+aData.last_menses_time.split(" ",1)+'</td></tr>';
		sOut += '<tr><td>预产期:</td><td>'+aData.due_time.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>身份证:</td><td>'+aData.idnumber+'</td></tr>';
        sOut += '<tr><td>微信号:</td><td>'+aData.wx+'</td></tr>';
        sOut += '<tr><td>会员:</td><td>'+(aData.vip == 1 ? "会员" : "非会员")+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';
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

					var operation = $("#kf_username").prop("disabled") ? "MODIFY" : "ADD";
					if(operation == "MODIFY") {
						submitData.script = "customer_modify";
					} else {
						submitData.script = "customer_add";
					}

					submitData.name = form.kf_username.value;
					submitData.phonenumber = form.kf_phonenumber.value;
					submitData.next_visit_time = form.kf_next_visit_time.value;
					submitData.doctor_name = form.kf_doctor_name.value;
					submitData.due_time = form.kf_due_time.value;
					submitData.idnumber = form.kf_idnumber.value;
					submitData.wx = form.kf_wx.value;
					submitData.last_menses_time = form.kf_last_menses_time.value;
					submitData.sellname = jQuery('#sellname_option').val();
					submitData.remarks = form.kf_remarks.value;
					// if($('#kf_vip').is(':checked')) {	
					// 	submitData.vip = 1;
					// }
					// else {
					// 	submitData = 0;
					// }
					TendaAjax.getData(submitData, function(result){
						//提示成功或失败
						//console.log(result);
						//alert(result.error);
						initTableList();
						$("#kf_modal").modal("hide");
					});

				}
			});

			jQuery('#addbutton').on("click", function(){
				TendaAjax.getData({"script":"ac_get_list"}, function(result){
				 	if(result.error == GLOBAL.SUCCESS) {
						jQuery('#sellname_option').append("<option> </option>");
				 		for(var i = 0; i < result.user_list.length; i++) {
				 			jQuery('#sellname_option').append("<option>" + result.user_list[i].name + "</option>");
				 		}
				 	}				 	
				});
				
				TendaAjax.getData({"script":"get_privilege"}, function(result){
				 	if(result.error == GLOBAL.SUCCESS) {
				 		if (result.privilege & 1) {
			 				jQuery('#kf_vip').attr("disabled",false);
				 		}
				 		else {
			 				jQuery('#kf_vip').attr("disabled",true);
				 		}
				 	}	 	
				});
			});

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("#kf_username").prop("disabled", false);
				jQuery("#sellname_option").empty();
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
				else {
					alert("error");
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
					 			jQuery('#sellname_option').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	
						jQuery('#sellname_option option').each(function(){
							if (arr[0].sellname == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});

					$("#kf_username").val(arr[0].name).prop("disabled", true);
                	$("#kf_phonenumber").val(arr[0].phonenumber);
                	$("#kf_next_visit_time").val(arr[0].next_visit_time.split(" ",1));
                	$("#kf_doctor_name").val(arr[0].doctor_name);
                	$("#kf_due_time").val(arr[0].due_time.split(" ",1));
                	$("#kf_idnumber").val(arr[0].idnumber);
                	$("#kf_wx").val(arr[0].wx);
                	$("#kf_last_menses_time").val(arr[0].last_menses_time.split(" ",1));
                	$("#kf_remarks").val(arr[0].remarks);
                	$("#kf_modal").modal("show");

                } 
                else if (operation == "DELETE") {

                	if(arr.length == 0) {
	                	alert("请至少选择一条数据!");
	                	return;
	                }
                	//删除数据
                	var submitData = {};
                	submitData.script = "customer_del";
                	submitData.id = arr_id;

                	TendaAjax.getData(submitData, function(result){
                		initTableList();
                	});
                }
                else if (operation == "UPVIP") {
                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }
            
                	var submitData = {};
                	submitData.script = "customer_up";
                	submitData.id = arr_id;
                	TendaAjax.getData(submitData, function(result){
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

	        $('#kf_list').on('click', '  tbody td .xiangqing', function () {

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

			//initTable1([]);
			App.initUniform();
			initTableList();
		}
	};

}();


KFTableAdvanced.init();

//App.init();
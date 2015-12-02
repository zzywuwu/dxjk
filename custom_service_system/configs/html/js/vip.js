
var KFTableAdvanced = function() {

	var initTableList =  function() {

		 TendaAjax.getData({"script":"vip_get_list"}, function(result){
			
		 	if(result.error == GLOBAL.SUCCESS) {
		 		initTable1(result.user_list);
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
				{"mDataProp": "diffweeks","sClass":"hidden-480","sWidth":"60px"},
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
        sOut += '<tr><td>姓名:</td><td>'+aData.name+'</td></tr>';
        sOut += '<tr><td>电话:</td><td>'+aData.phonenumber+'</td></tr>';
        sOut += '<tr><td>孕周:</td><td>'+aData.diffdays+'</td></tr>';
        sOut += '<tr><td>建卡医生:</td><td>'+aData.doctor_name+'</td></tr>';
        sOut += '<tr><td>销售员:</td><td>'+aData.sellname+'</td></tr>';
		sOut += '<tr><td>末次月经:</td><td>'+aData.last_menses_time.split(" ",1)+'</td></tr>';
		sOut += '<tr><td>预产期:</td><td>'+aData.due_time.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>身份证:</td><td>'+aData.idnumber+'</td></tr>';
        sOut += '<tr><td>微信号:</td><td>'+aData.wx+'</td></tr>';
        sOut += '<tr><td>年龄:</td><td>'+aData.age+'</td></tr>';
        sOut += '<tr><td>地址:</td><td>'+aData.address+'</td></tr>';
        sOut += '<tr><td>家属姓名:</td><td>'+aData.familyname+'</td></tr>';
        sOut += '<tr><td>家属电话:</td><td>'+aData.familyphonenumber+'</td></tr>';
        if (aData.order_time)
        	sOut += '<tr><td>会员签单日:</td><td>'+aData.order_time.split(" ",1)+'</td></tr>';
        else
        	sOut += '<tr><td>会员签单日:</td><td>'+'未设置'+'</td></tr>';
        if (aData.order_over_time)
        	sOut += '<tr><td>会员到期日:</td><td>'+aData.order_over_time.split(" ",1)+'</td></tr>';
    	else
    		sOut += '<tr><td>会员到期日:</td><td>'+'未设置'+'</td></tr>';
        // sOut += '<tr><td>会员:</td><td>'+(aData.vip == 1 ? "会员" : "非会员")+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';
        sOut += '</table>';
         
        return sOut;
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
						submitData.script = "vip_modify";
					} else {
						alert("error");
					}

					submitData.name = form.kf_username.value;
					submitData.phonenumber = form.kf_phonenumber.value;
					submitData.id = $("#kf_customer_id").val();
					submitData.doctor_name = form.kf_doctor_name.value;
					submitData.due_time = form.kf_due_time.value;
					submitData.idnumber = form.kf_idnumber.value;
					submitData.wx = form.kf_wx.value;
					submitData.last_menses_time = form.kf_last_menses_time.value;
					submitData.sellname = jQuery('#sellname_option').val();
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

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("#kf_username").prop("disabled", false);
				$("textarea").val('');
				jQuery("#sellname_option").empty();
			});

			jQuery('.kf-index>li').on("click", function(){

				var operation;
				if ($(this).find("i").hasClass("icon-pencil")) {
					operation = "MODIFY";
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
					 			
					 			jQuery('#sellname_option').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	else
					 		alert(result.error);

					 	

						jQuery('#sellname_option option').each(function(){
							if (arr[0].sellname == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});

					$("#kf_username").val(arr[0].name).prop("disabled", true);
                	$("#kf_customer_id").val(arr[0].id).prop("disabled", true);
                	$("#kf_phonenumber").val(arr[0].phonenumber).prop("disabled", true);
                	$("#kf_idnumber").val(arr[0].idnumber).prop("disabled", true);
                	$('#sellname_option').prop("disabled",true);
                	$("#kf_wx").val(arr[0].wx).prop("disabled", true);
                	$("#kf_address").val(arr[0].address).prop("disabled", true);
                	$("#kf_familyname").val(arr[0].familyname).prop("disabled", true);
                	$("#kf_familyphonenumber").val(arr[0].familyphonenumber).prop("disabled", true);
                	$("#kf_age").val(arr[0].age).prop("disabled", true);

                	$("#kf_doctor_name").val(arr[0].doctor_name);
                	$("#kf_due_time").val(arr[0].due_time.split(" ",1));
                	$("#kf_last_menses_time").val(arr[0].last_menses_time.split(" ",1));
                	$("#kf_remarks").val(arr[0].remarks);


                	$("#kf_modal").modal("show");
                }
                else if (operation == "REMOVE") {

                	if(arr.length != 1) {
	                	alert("请选择一条数据!");
	                	return;
	                }

                	var submitData = {};
                	submitData.script = "vip_remove";
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

            $('#kf_list').on('click', ' tbody td .desc', function () {

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
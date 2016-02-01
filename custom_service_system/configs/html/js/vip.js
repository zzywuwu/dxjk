
var vipmodule = function() {

	var search_str = "";

	var initTableList =  function() {

		 TendaAjax.getData({"script":"vip_get_list"}, function(result){
			
		 	if(result.error == GLOBAL.SUCCESS) {
		 		initTable1(result.user_list);
		 	}
		 	else 
		 		mainindex.modalwarn(result.error);;
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
								"aTargets":[2],
								"data":"name",
								"mRender": function(data, type, full) {
									return '<a href="#" class="record" data="' + full.id + '">'+data+'</a>';
								}
							},
							{
								"aTargets":[4],
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
									if (data.length > 26) {
										var str =  data.substr(0,26)+'..';
										return '<span class="tooltip_view">'+str+'</span>';	
									}
									else
										return data;
								}
							},						
							{
								"aTargets":[8],
								"mRender":function(data, type, full){
									var md5 = hex_md5(full.create_time + "TSL");
									var md5sub8 =  md5.substr(0,8);
									return "<a target='_black' href=http://"+GLOBAL.SERVER+"/s/i?p="+md5sub8+full.id+">病历</a>";
								}
							},
							{
								"aTargets":[9],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close desc'></span>";
								}
							}
			],
			"aaSorting": [[4, 'asc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id", "bSortable":false,"sWidth":"5px"}, 
				{"mDataProp": "id", "sWidth":"25px"},
				{"mDataProp": "name","sWidth":"60px"},
				{"mDataProp": "phonenumber","sClass":"hidden-480","sWidth":"80px"},
				{"mDataProp": "diffweeks","sClass":"hidden-480","sWidth":"60px"},
				{"mDataProp": "doctor_name","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "sellname","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"400px"},
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "update_time","sWidth":"40px"}
				]				
		});
  
		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");

		jQuery("#kf_list").on("click",' tbody td .record',function(){	
			var data = {"page":"record.html","customer_id":$(this).attr("data")};
			TendaAjax.getHtml(data, function(result){
				$(".page-content .container-fluid").html(result);
			});  
		});	

		jQuery('.tooltip_view').mouseover(function(){		
			var arr = [];           
            var oTable = $("#kf_list").dataTable();
    		var nTr = $(this).parents("tr");
    		var tmpObj = oTable.fnGetData(nTr[0]);   		
    		arr.push(tmpObj);
    		var str = "";
    		var obj = $(this).text();
    		nTr.children().each(function(i,n){
    			if (obj == $(n).text()) {
    				switch(i) {
			    		
			    		case 7:
				    		str = arr[0].remarks;
			    			break;
			    		
			    		default:
			    			break;
			    	}	
    			}
		    });
		    $(this).attr('data-original-title', str);          	     
			$(this).tooltip({
				html:false,           
				placement:'bottom'
			});
			$(this).tooltip('show');
		});

		if (search_str != "") {
			jQuery('#kf_list_filter input').val(search_str);
			jQuery('#kf_list_filter input').focus();	
			var e = jQuery.Event("keyup");//模拟一个键盘事件
            e.keyCode =13;//keyCode=13是回车
            $("#kf_list_filter input").trigger(e);
		}
		
		jQuery('#kf_list_filter input').on('input',function(e){
      		search_str = $(this).val();
        });
	}

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td style="width:100px;">姓名:</td><td>'+aData.name+'</td></tr>';
        sOut += '<tr><td>年龄:</td><td>'+aData.age+'</td></tr>';
        sOut += '<tr><td>就诊卡号:</td><td>'+aData.cordnumber+'</td></tr>';
        sOut += '<tr><td>电话:</td><td>'+aData.phonenumber+'</td></tr>';
        sOut += '<tr><td>微信号:</td><td>'+aData.wx+'</td></tr>';
        sOut += '<tr><td>销售员:</td><td>'+aData.sellname+'</td></tr>';
        sOut += '<tr><td>客户类型:</td><td>'+aData.customer_type+'</td></tr>';
        if (aData.customer_type == GLOBAL.YUNMM) {
        	sOut += '<tr><td>孕周:</td><td>'+aData.diffweeks+'</td></tr>';
        	sOut += '<tr><td>末次月经:</td><td>'+aData.last_menses_time+'</td></tr>';
			sOut += '<tr><td>预产期:</td><td>'+aData.due_time+'</td></tr>';
			sOut += '<tr><td>建卡医生:</td><td>'+aData.doctor_name+'</td></tr>';
        }
        sOut += '<tr><td>身份证:</td><td>'+aData.idnumber+'</td></tr>';
        sOut += '<tr><td>地址:</td><td>'+aData.address+'</td></tr>';
       	sOut += '<tr><td>身高:</td><td>'+aData.height+'</td></tr>';
        sOut += '<tr><td>体重:</td><td>'+aData.weight+'</td></tr>';
        sOut += '<tr><td>家属姓名:</td><td>'+aData.familyname+'</td></tr>';
        sOut += '<tr><td>家属电话:</td><td>'+aData.familyphonenumber+'</td></tr>';
        sOut += '<tr><td>家属年龄:</td><td>'+aData.familyage+'</td></tr>';
        sOut += '<tr><td>会员签单日:</td><td>'+aData.order_time+'</td></tr>';
        sOut += '<tr><td>会员到期日:</td><td>'+aData.order_over_time+'</td></tr>';
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
	                	maxlength: 11,
	                	minlength: 11,
	                    digits: true,
                        required: true
	                },
	                kf_wx: {
	                	minlength: 6,
                        required: true
	                },
	                kf_height : {
	                	number: true
	                },
	                kf_weight : {
	                	number: true	
	                },
	                kf_sellname : {
	                	required: true	
	                },
	                kf_cordnumber : {
	                	required: true	
	                },
	                kf_familyage : {
	                	maxlength: 2,
	                    digits: true
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
                        maxlength: "请输入11位数字",
                        minlength: "请输入11位数字"
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
                    },
                    kf_height : {
	                	number: "请输入数字"	
	                },
	                kf_weight : {
	                	number: "请输入数字"	
	                },
	                kf_sellname : {
	                	required:"必填"
	                },
	                kf_cordnumber : {
	                	required:"必填"
	                },
	                kf_familyage : {
	                	maxlength: "请输入最多2位数字",
                        digits: "请输入数字"	
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
						submitData.script = "vip_modify";
					} else {
						mainindex.modalwarn("error");
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
					submitData.remarks = form.kf_remarks.value;
					submitData.address = form.kf_address.value;
					submitData.familyname = form.kf_familyname.value;
					submitData.familyphonenumber = form.kf_familyphonenumber.value;
					submitData.age = form.kf_age.value;
					submitData.height = form.kf_height.value;
					submitData.weight = form.kf_weight.value;
					submitData.cordnumber = form.kf_cordnumber.value;
					submitData.familyage = form.kf_familyage.value;
					TendaAjax.getData(submitData, function(result){
						if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#kf_modal").modal("hide");
						}				
                		else
                			mainindex.modalwarn(result.error);;
						
					});

				}
			});

			jQuery('#kf_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text'], input[type='hidden']").val('');
				$("input[type='date']").val('');
				$("#kf_username").prop("disabled", false);
				$("textarea").val('');
				jQuery("#kf_sellname").empty();
				jQuery('#kf_list_filter input').val(search_str);
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
					mainindex.modalwarn("开发中,请耐心等待");
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
	                	mainindex.modalwarn("请选择一条数据!");
	                	return;
	                }

          			TendaAjax.getData({"script":"ac_get_list"}, function(result){
					 	if(result.error == GLOBAL.SUCCESS) {
					 		jQuery('#kf_sellname').append("<option></option>");
					 		for(var i = 0; i < result.user_list.length; i++) {					 			
					 			jQuery('#kf_sellname').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	else
					 		mainindex.modalwarn(result.error);;

						jQuery('#kf_sellname option').each(function(){
							if (arr[0].sellname == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});

          			$("#kf_username").val(arr[0].name).prop("disabled", true);
          			$("#kf_customer_id").val(arr[0].id).prop("disabled", true);

          			$("#kf_phonenumber").val(arr[0].phonenumber);
                	$("#kf_idnumber").val(arr[0].idnumber);
                	$('#kf_sellname').val(arr[0].sellname);
                	$("#kf_wx").val(arr[0].wx);
                	$("#kf_age").val(arr[0].age);
                	$("#kf_height").val(arr[0].height);
                	$("#kf_weight").val(arr[0].weight);	
                	$("#kf_familyname").val(arr[0].familyname);
                	$("#kf_familyphonenumber").val(arr[0].familyphonenumber);
                	$("#kf_doctor_name").val(arr[0].doctor_name);
                	$("#kf_due_time").val(arr[0].due_time);
                	$("#kf_last_menses_time").val(arr[0].last_menses_time);
                	$("#kf_remarks").val(arr[0].remarks);
                	$("#kf_address").val(arr[0].address);
                	$("#kf_cordnumber").val(arr[0].cordnumber);
                	$("#kf_familyage").val(arr[0].familyage);	
                	$("#kf_modal").modal("show");
                }
                else if (operation == "REMOVE") {

                	if(arr.length != 1) {
	                	mainindex.modalwarn("请选择一条数据!");
	                	return;
	                }

                	$("#confirm_modal_title").html('结束服务');
                	$("#confirm_modal_content").html('你确定结束对<font color="red"> ' + arr[0].name +' </font>的服务吗?');
                	$("#confirm_modal_content").attr('data_id',arr[0].id);
                	$("#confirm_modal_content").attr('data_script','vip_remove');
                	$("#confirm_modal").modal("show");
                }

			});

			$("#confirm_button").on("click",function(){
				var submitData = {};
				submitData.script = $('#confirm_modal_content').attr('data_script');
				var arr = [];
				arr.push($('#confirm_modal_content').attr('data_id'));
				submitData.id = arr;
				TendaAjax.getData(submitData, function(result){
					if(result.error == GLOBAL.SUCCESS) {
						initTableList();
						$("#confirm_modal").modal("hide");
					}				
					else
						mainindex.modalwarn(result.error);;
				});

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

			if ((GLOBAL.PRIVILEGE & 1) != 1) {
  				$("#kf_phonenumber_group").hide(100);
            	$("#kf_idnumber_group").hide(100);
            	$("#kf_wx_group").hide(100);
            	$("#kf_age_group").hide(100);
            	$('#tools_remove').hide(100);		
            	// $('#tools_phone').hide(100);
	 		}
			
			App.initUniform();
			initTableList();



		}
	};

}();

// vipmodule.init();

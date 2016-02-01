
var sms_notify_module = function() {

	var operation_customer_id;
	var operation_customer_name;
	var search_str = "";

	var initTableList =  function() {
		TendaAjax.getData({"script":"sms_get_list"}, function(result){
		if(result.error == GLOBAL.SUCCESS) {
			initTable1(result.user_record);
		}
		else 
			mainindex.modalwarn(result.error);
		});
	}

	var format_sms = function(name,gender,job,date,time,phone,link,type) {
		var objstr = "";
		var obj = jQuery.parseJSON(job);
        if (Array.isArray(obj)) {
            if (obj.length != 0) {
                for (var i = 0; i < obj.length; i++) {              
                    objstr += obj[i]+"，";
                }   
            }
        }
        else
      		objstr = job+"，";

		var str = '【鼎鑫孕妈妈】';
		str += name.substring(0, 1);
		if (gender == "男")
			str += '先生：';
		else
			str += '女士：';

		if (type == GLOBAL.YUNMM)
			str += '请您'+date+'日'+time+'到医院，项目：'+objstr+'联系电话'+phone+'，咨询电话18908182406，详情：'+link;
		else
			str += '请您'+date+'日'+time+'到医院，项目：'+objstr+'联系电话'+phone+'，咨询电话18908182406';
		return str;
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
								"mRender":function(data, type, full){								
						  			return '<a href="#" class="event_action">'+data+'</a>';	
								}
							},	
							{
								"aTargets":[1],
								"data":"customer_name",
								"mRender": function(data, type, full) {
									return '<a href="#" class="record" data="' + full.customer_id + '">'+data+'</a>';
								}
							},	
							{
								"aTargets":[4],
								"mRender":function(data, type, full){
									if (data.length > 10) {
										var str =  data.substr(0,10)+'..';
										return '<span class="tooltip_view">'+str+'</span>';	
									}
									else
										return data;
								}
							},
							{
								"aTargets":[5],
								"mRender":function(data, type, full){
									if (data.length > 20) {
										var str =  data.substr(0,20)+'..';
										return '<span class="tooltip_view">'+str+'</span>';	
									}
									else
										return data;
								}
							},
							{
								"aTargets":[6],
								"mRender":function(data, type, full){
									var md5 = hex_md5(full.customer_create_time + "TSL");
									var md5sub8 =  md5.substr(0,8);
									return "<a target='_black' href=http://"+GLOBAL.SERVER+"/s/i?p="+md5sub8+full.customer_id+">病历</a>";
								}
							},
							{
								"aTargets":[7],
								"mRender":function(data, type, full){
									var md5 = hex_md5(full.customer_create_time + "TSL");
									var md5sub8 =  md5.substr(0,8);
									var link = "http://"+GLOBAL.SERVER+"/s/i?p="+md5sub8+full.customer_id;
									var sms_send_info = format_sms(full.customer_name,full.gender,full.visit_type,full.visit_date,full.visit_time,"15390401180",link,full.customer_type);
									return '<a href="#" class="sms_send" sms_phonenumber=' + full.phonenumber + ' sms_id=' + full.id + ' sms_send_info=\'' + sms_send_info + '\' >发送</a>';	
								}
							}

			],
			"aaSorting": [[2, 'asc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			"aaData": account_list,
			//"bPaginate": true, //翻页功能
			//"bFilter": true, 

			"aoColumns": [
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "customer_name","sWidth":"40px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "visit_time","sClass":"hidden-480","sWidth":"50px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"140px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"300px"},
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "id","sWidth":"50px"},
				{"mDataProp": "sms_count","sWidth":"30px"}
				]

		});

        jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");

		jQuery("#kf_list").on("click",' tbody td .event_action',function(){	
			var arr = [];           
            var oTable = $("#kf_list").dataTable();
    		var nTr = $(this).parents("tr");
    		var tmpObj = oTable.fnGetData(nTr[0]);   		
    		arr.push(tmpObj);

    		operation_customer_id = arr[0].customer_id;
			operation_customer_name = arr[0].customer_name;
			
			$("#event_id").val(arr[0].id).prop("disabled", true);
			$("#event_visit_date").val(arr[0].visit_date);
			jQuery('#event_visit_time option').each(function(){
				if (arr[0].visit_time == $(this).text()){
					$(this).attr("selected",true);
				}
			});
			
			var obj = jQuery.parseJSON(arr[0].visit_type);
			if (Array.isArray(obj)) {
				for (var i = 0; i < obj.length; i++) {
					jQuery('#event_visit_type option').each(function(){
						if (obj[i] == $(this).text()){
							$(this).attr("selected",true);
							return false;
						}
					});
				};
			}

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
		});

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
			    		case 4:
			    			str = arr[0].visit_type;
			    			break;
			    		case 5:
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

		jQuery("#kf_list").on("click",' tbody td .sms_send',function(){	
			$("#sms_modal_title").html('发送短信'); 
        	$("#sms_info").val($(this).attr("sms_send_info"));    
        	$("#sms_info").attr("sms_id",$(this).attr("sms_id")); 	
        	$("#sms_info").attr("sms_phonenumber",$(this).attr("sms_phonenumber")); 	
        	$("#sms_modal").modal("show");	
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

	var operation_modal;

	return {
		init: function () {

			var v_event_form = $('.event-form');        
			v_event_form.validate({
	   			errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {
	    
	                event_visit_date: {
	                    required: true,
                        date: true
	                },
	                event_visit_type: {
	                    required: true,                
	                }
	            },

	            messages:{
            
                    event_visit_date:{
                        required:"必填"
                    },
                    event_visit_type:{
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
					submitData.script = "event_modify";
					submitData.id = $("#event_id").val();
					submitData.customer_id = operation_customer_id;
					submitData.customer_name = operation_customer_name;
					submitData.visit_date = form.event_visit_date.value;
					submitData.visit_time = jQuery('#event_visit_time').val();					
					if (jQuery('#event_order_success').val() == "已预约")
						submitData.order_success = 1;
					else
						submitData.order_success = 0;
					submitData.visit_address = form.event_visit_address.value;
					submitData.visit_doctor_name = form.event_visit_doctor_name.value;
					submitData.remarks = form.event_remarks.value;
					
					var visit_type_arr = [];
					$("#event_visit_type option:selected").each(function(){			      
			            visit_type_arr.push($(this).text());
			        });
			        submitData.visit_type = JSON.stringify(visit_type_arr);			       
					TendaAjax.getData(submitData, function(result){
						if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#event_modal").modal("hide");
						}				
                		else
                			mainindex.modalwarn(result.error);;
					});

				}
			});

			$("#sms_confirm_button").on("click",function(){
				var submitData = {};
				submitData.script = "sms_send";
				submitData.content = $("#sms_info").val();
				submitData.id = $("#sms_info").attr("sms_id");
				submitData.phonenumber = $("#sms_info").attr("sms_phonenumber");
				TendaAjax.smsSend(submitData, function(result){
					if(result.error == GLOBAL.SUCCESS) {
						initTableList();
						$("#sms_modal").modal("hide");
					}				
					else {
						$("#sms_modal").modal("hide");
						mainindex.modalwarn(result.error);
					}
				});
			});

			if(!jQuery().dataTable){
				return;
			}

			App.initUniform();
			initTableList();
		}
	};

}();


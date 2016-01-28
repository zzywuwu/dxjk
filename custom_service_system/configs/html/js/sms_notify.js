
var sms_notify_module = function() {

	var search_str = "";

	var initTableList =  function() {
		TendaAjax.getData({"script":"sms_get_list"}, function(result){
		if(result.error == GLOBAL.SUCCESS) {
			initTable1(result.user_record);
		}
		else 
			mainindex.modalwarn(result.error);;
		});
	}

	var format_sms = function(name,gender,job,date,time,phone) {
		var str = '【鼎鑫孕妈妈】';
		str += name.substring(0, 1);
		if (gender == "男")
			str += '先生：';
		else
			str += '女士：';
		str += '请您于'+date+'日'+time+'到医院，项目：'+job+'，热线'+phone+'或17708009229';
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
									var sms_send_info = format_sms(full.customer_name,full.gender,full.visit_type,full.visit_date,full.visit_time,"15390401180");
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

			"aoColumns": [
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "customer_name","sWidth":"40px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "visit_time","sClass":"hidden-480","sWidth":"50px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"140px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"300px"},
				{"mDataProp": "id","sWidth":"50px"},
				{"mDataProp": "sms_count","sWidth":"30px"}
				]

		});

		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

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

		App.initUniform("#kf_list .checkboxes");

		jQuery(".sms_send").click(function(){
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


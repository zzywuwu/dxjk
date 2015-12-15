
var verifyrecordmodule = function() {

	var search_str = "";

	var initTableList =  function() {
		TendaAjax.getData({"script":"record_get_list_verify"}, function(result){
		if(result.error == GLOBAL.SUCCESS) {
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
								"mRender":function(data, type, full){								
									if ((GLOBAL.PRIVILEGE & 32) == 32) {
						  				return '<a href="#" class="verify_record">'+data+'</a>';	
							 		}
							 		else
							 			return data;
								}
							},						
							{
								"aTargets":[1],
								"data":"name",
								"mRender": function(data, type, full) {
									return '<a href="#" class="record" data="' + full.customer_id + '">'+data+'</a>';
								}
							},
							{
								"aTargets":[2],
								"mRender":function(data, type, full){
									return data.split(" ",1);
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
									if (data.length > 16) {
										var str =  data.substr(0,16)+'..';
										return '<span class="tooltip_view">'+str+'</span>';	
									}
									else
										return data;
								}
							},
							{
								"aTargets":[6],
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
									return "<span class='row-details row-details-close desc'></span>";
								}
							}

			],
			"aaSorting": [[8, 'desc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "customer_name","sClass":"hidden-480","sWidth":"50px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"85px"},
				{"mDataProp": "servicename","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"140px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"200px"},
				{"mDataProp": "result","sClass":"hidden-480","sWidth":"300px"},
				{"mDataProp": "username","sClass":"hidden-480","sWidth":"60px"},
				{"mDataProp": "update_time","sWidth":"40px"}
				]

		});

		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#kf_list .checkboxes");

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

		jQuery(".record").click(function(){
			var data = {"page":"record_index.html","customer_id":$(this).attr("data")};
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
			    		case 6:
				    		str = arr[0].result;
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

		jQuery(".verify_record").click(function(){
			var arr = [];           
            var oTable = $("#kf_list").dataTable();
    		var nTr = $(this).parents("tr");
    		var tmpObj = oTable.fnGetData(nTr[0]);   		
    		arr.push(tmpObj);
 
    		$("#verify_id").val(arr[0].id);
            $("#verify_name").text(arr[0].customer_name);
            $("#verify_visit_date").text(arr[0].visit_date.split(" ",1));
			$("#verify_servicename").text(arr[0].servicename);
			$("#verfiy_visit_type").text(arr[0].visit_type);
			$("#verfiy_visit_doctor_name").text(arr[0].visit_doctor_name);
			$("#verify_result").text(arr[0].result);
			$("#verify_doctor_advise").text(arr[0].doctor_advise);
			$("#verify_remarks").text(arr[0].remarks);
					       	
	       	var html = '<ol>';
	        var obj = jQuery.parseJSON(arr[0].fzinfo);
			if (Array.isArray(obj)) {
				
				for (var i = 0, j = 1; i < obj.length; i++,j++) {
					if (obj[i].next_order_success)
						html += '<li>'+obj[i].next_visit_date.split(" ",1)+ ' '+ obj[i].next_visit_time + ' (已预约) 项目:' + obj[i].next_visit_type;
					else
						html += '<li>'+obj[i].next_visit_date.split(" ",1)+ ' '+ obj[i].next_visit_time + ' <font color="red">(未预约)</font> 项目:' + obj[i].next_visit_type;
					if ( obj[i].next_visit_doctor_name != '') {
							html += ' 医生:'+ obj[i].next_visit_doctor_name;
						if ( obj[i].next_visit_doctor_name != '')
							html += ' 地址:'+ obj[i].next_visit_address;
						if ( obj[i].next_visit_doctor_name != '')
							html += ' 备注:'+ obj[i].next_visit_remarks;
					}
					html += '</li>';
				}						
			}
			html +='</ol>';
        	jQuery('#verify_next_vist_info').html(html);

			$("#verify_modal").modal("show");	
		});
	}

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td style="width:100px;">姓名:</td><td>'+aData.customer_name.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>就诊时间:</td><td>'+aData.visit_date.split(" ",1)+' '+ aData.visit_time+'</td></tr>';
        sOut += '<tr><td>陪诊人员:</td><td>'+aData.servicename+'</td></tr>';
        sOut += '<tr><td>就诊项目:</td><td>'+aData.visit_type+'</td></tr>';
		sOut += '<tr><td>就诊医生:</td><td>'+aData.visit_doctor_name+'</td></tr>';
		sOut += '<tr><td>就诊记录:</td><td>'+aData.result+'</td></tr>';
        sOut += '<tr><td>医嘱:</td><td>'+aData.doctor_advise+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';

   		var obj = jQuery.parseJSON(aData.fzinfo);
		if (Array.isArray(obj)) {
			sOut += '<tr><td></br></td><td></td></tr>';
			if (obj.length == 0) {
				sOut += '<tr><td>复诊信息:</td><td>' + '<font color="red">无</font>';	
			}
			else {
				for (var i = 0, j = 1; i < obj.length; i++,j++) {
					if (obj[i].next_order_success)
						sOut += '<tr><td>复诊信息[' + j + ']:</td><td>'+obj[i].next_visit_date.split(" ",1)+ ' '+ obj[i].next_visit_time + ' (已预约) 项目:' + obj[i].next_visit_type;
					else
						sOut += '<tr><td>复诊信息[' + j + ']:</td><td>'+obj[i].next_visit_date.split(" ",1)+ ' '+ obj[i].next_visit_time + ' <font color="red">(未预约)</font> 项目:' + obj[i].next_visit_type;
					if ( obj[i].next_visit_doctor_name != '') {
							sOut += ' 医生:'+ obj[i].next_visit_doctor_name;
						if ( obj[i].next_visit_doctor_name != '')
							sOut += ' 地址:'+ obj[i].next_visit_address;
						if ( obj[i].next_visit_doctor_name != '')
							sOut += ' 备注:'+ obj[i].next_visit_remarks;
					}
				}	
			}
			sOut += '</td></tr>';			
		}
	   
        sOut += '</table>';  
        return sOut;
    }

	var operation_modal;

	return {
		init: function () {

			var v_verify_form = $('.verify-form');
			v_verify_form.validate({

				submitHandler: function(form){
					
                	var submitData = {};
                	submitData.script = "record_verify";
            		
                	submitData.id = [];
                	submitData.id.push($("#verify_id").val());
                	TendaAjax.getData(submitData, function(result){
                		if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#verify_modal").modal("hide");
						}				
                		else
                			alert(result.error);
                	});
				}
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


// verifyrecordmodule.init();

var verifyrecordmodule = function() {

	var search_str = "";

	var initTableList =  function() {
		TendaAjax.getData({"script":"record_get_list_verify"}, function(result){
		if(result.error == GLOBAL.SUCCESS) {
			initTable1(result.user_record);
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
									return data;
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
									if (data.length > 20) {
										var str =  data.substr(0,20)+'..';
										return '<span class="tooltip_view">'+str+'</span>';	
									}
									else
										return data;
								}
							},
							{
								"aTargets":[8],
								"mRender":function(data, type, full){
									var obj = jQuery.parseJSON(full.image);
									if (Array.isArray(obj)) {
										Gallery.init();
										var img = '';				
										for (var i = 0; i < obj.length; i++) {
											var path = obj[i];
											var arr = obj[i].split('_',2);
											var file = arr[1].split('.',2);
											if (i == 0)
												var str = '<a class="fancybox-button" data-rel="fancybox-button" title="' +file[0]+ '" href="/temp/file/' +path+ '">' +obj.length+ '</a>';
											else
												var str = '<a class="fancybox-button" data-rel="fancybox-button" title="' +file[0]+ '" href="/temp/file/' +path+ '"></a>';
											img += str;
										}
										return img;	
									}
									return "";
								}
							},
							{
								"aTargets":[9],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close desc'></span>";
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
				{"mDataProp": "customer_name","sClass":"hidden-480","sWidth":"50px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"85px"},
				{"mDataProp": "servicename","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"140px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"200px"},
				{"mDataProp": "result","sClass":"hidden-480","sWidth":"300px"},
				{"mDataProp": "username","sClass":"hidden-480","sWidth":"60px"},
				{"mDataProp": "image","sClass":"hidden-480","sWidth":"40px"},
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

		jQuery("#kf_list").on("click",' tbody td .verify_record',function(){	
			var arr = [];           
            var oTable = $("#kf_list").dataTable();
    		var nTr = $(this).parents("tr");
    		var tmpObj = oTable.fnGetData(nTr[0]);   		
    		arr.push(tmpObj);
 
    		$("#verify_id").val(arr[0].id);
            $("#verify_name").text(arr[0].customer_name);
            $("#verify_visit_date").text(arr[0].visit_date+' '+arr[0].visit_time);
			$("#verify_servicename").text(arr[0].servicename);
			$("#verfiy_visit_type").text(arr[0].visit_type);
			$("#verfiy_visit_doctor_name").text(arr[0].visit_doctor_name);
			$("#verify_womb_height").text(arr[0].womb_height);
			$("#verify_belly_length").text(arr[0].belly_length);
			$("#verify_blood_pre").text(arr[0].blood_pre);
			$("#verify_body_weight").text(arr[0].body_weight);
			$("#verify_gest_weeks").text(arr[0].gest_weeks);
			$("#verify_result").text(arr[0].result);
			$("#verify_doctor_advise").text(arr[0].doctor_advise);
			$("#verify_remarks").text(arr[0].remarks);
					       	
	       	var html = '<ol>';
	        var obj = jQuery.parseJSON(arr[0].fzinfo);
			if (Array.isArray(obj)) {
				
				for (var i = 0, j = 1; i < obj.length; i++,j++) {
					if (obj[i].next_order_success)
						html += '<li>'+obj[i].next_visit_date+ ' '+ obj[i].next_visit_time + ' (已预约) 项目:' + obj[i].next_visit_type;
					else
						html += '<li>'+obj[i].next_visit_date+ ' '+ obj[i].next_visit_time + ' <font color="red">(未预约)</font> 项目:' + obj[i].next_visit_type;
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
		Gallery.init();
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td style="width:100px;">姓名:</td><td>'+aData.customer_name+'</td></tr>';
        sOut += '<tr><td>就诊时间:</td><td>'+aData.visit_date+' '+ aData.visit_time+'</td></tr>';
        sOut += '<tr><td>陪诊人员:</td><td>'+aData.servicename+'</td></tr>';
        sOut += '<tr><td>就诊项目:</td><td>'+aData.visit_type+'</td></tr>';
		sOut += '<tr><td>就诊医生:</td><td>'+aData.visit_doctor_name+'</td></tr>';
		sOut += '<tr><td>宫高(Cm):</td><td>'+aData.womb_height+'</td></tr>';
		sOut += '<tr><td>腹围(Cm):</td><td>'+aData.belly_length+'</td></tr>';
		sOut += '<tr><td>血压(Kpa):</td><td>'+aData.blood_pre+'</td></tr>';
		sOut += '<tr><td>体重(Kg):</td><td>'+aData.body_weight+'</td></tr>';
		sOut += '<tr><td>孕周:</td><td>'+aData.gest_weeks+'</td></tr>';
		sOut += '<tr><td>就诊记录:</td><td>'+aData.result+'</td></tr>';
        sOut += '<tr><td>医嘱:</td><td>'+aData.doctor_advise+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';

        var obj = jQuery.parseJSON(aData.image);
		if (Array.isArray(obj)) {
			if (obj.length != 0) {
				sOut += '<tr><td>图片:</td><td>';				
				for (var i = 0; i < obj.length; i++) {
					var path = obj[i];
					var arr = obj[i].split('_',2);
					var file = arr[1].split('.',2);
					var str = '<a class="fancybox-button" data-rel="fancybox-button" title="' +file[0]+ '" href="/temp/file/' +path+ '">' +file[0]+ '</a>';
					sOut += "[" + str + "]" + "&nbsp&nbsp&nbsp&nbsp";
				}	
				sOut += '</td></tr>';	
			}
		}

   		var obj = jQuery.parseJSON(aData.fzinfo);
		if (Array.isArray(obj)) {
			sOut += '<tr><td></br></td><td></td></tr>';
			if (obj.length == 0) {
				sOut += '<tr><td>复诊信息:</td><td>' + '<font color="red">无</font>';	
			}
			else {
				for (var i = 0, j = 1; i < obj.length; i++,j++) {
					if (obj[i].next_order_success)
						sOut += '<tr><td>复诊信息[' + j + ']:</td><td>'+obj[i].next_visit_date+ ' '+ obj[i].next_visit_time + ' (已预约) 项目:' + obj[i].next_visit_type;
					else
						sOut += '<tr><td>复诊信息[' + j + ']:</td><td>'+obj[i].next_visit_date+ ' '+ obj[i].next_visit_time + ' <font color="red">(未预约)</font> 项目:' + obj[i].next_visit_type;
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
                			mainindex.modalwarn(result.error);;
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
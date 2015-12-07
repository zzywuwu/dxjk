
var KFTableAdvanced = function() {

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
								"data":"id",
								"mRender": function(data, type, full) {
									return '<input type="checkbox" class="checkboxes" value="' + data +  '"/>';
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
									if (data.length > 10)
										return data.substr(1,10)+'..';
									else
										return data;
								}
							},
							{
								"aTargets":[5],
								"mRender":function(data, type, full){
									if (data.length > 16)
										return data.substr(1,16)+'..';
									else
										return data;
								}
							},
							{
								"aTargets":[5],
								"mRender":function(data, type, full){
									if (data.length > 40)
										return data.substr(1,40)+'..';
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
			// "aaSorting": [[2, 'desc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id","bSortable":false,"sWidth":"5px"}, 
				{"mDataProp": "customer_name","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"80px"},
				{"mDataProp": "servicename","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"120px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"160px"},
				{"mDataProp": "result","sClass":"hidden-480","sWidth":"400px"},
				{"mDataProp": "username","sClass":"hidden-480","sWidth":"50px"},
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
            
                	submitData.id = $("#verify_id").val();
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

			jQuery('.kf-index>li').on("click", function(){

				var operation;
				if ($(this).find("i").hasClass("icon-search")) {
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
          
                if(operation == "SEARCH") {

                	if(arr.length == 0) {
	                	alert("请至少选择一条数据!");
	                	return;
	                }

	                $("#verify_id").val(arr_id);
					jQuery('#verify_content').html("");
					var html = '<ul>';
					html += '<li>姓名:'+arr[0].customer_name+'</li>';
			       	html += '<li>就诊时间:'+arr[0].visit_date.split(" ",1)+' '+arr[0].visit_time +'</li>';
			       	html += '<li>陪诊人员:'+arr[0].servicename+'</li>';
			       	html += '<li>就诊项目:'+arr[0].visit_type+'</li>';
			       	html += '<li>就诊医生:'+arr[0].visit_doctor_name+'</li>';	       	
			       	html += '<li>就诊记录:'+arr[0].result+'</li>';			       	
			       	html += '<li>医嘱:'+arr[0].doctor_advise+'</li>';
			       	html += '<li>备注:'+arr[0].remarks+'</li>';
			       	html += '</br>';
			       	 
			        var obj = jQuery.parseJSON(arr[0].fzinfo);
					if (Array.isArray(obj)) {
						if (obj.length == 0) {
							html += '<li>复诊信息&nbsp&nbsp&nbsp&nbsp:' + '<font color="red">无</font></li>';	
						}
						else {	
							for (var i = 0, j = 1; i < obj.length; i++,j++) {
								if (obj[i].next_order_success)
									html += '<li>复诊信息(' + j + '):'+obj[i].next_visit_date.split(" ",1)+ ' '+ obj[i].next_visit_time + ' (已预约) 项目:' + obj[i].next_visit_type;
								else
									html += '<li>复诊信息(' + j + '):'+obj[i].next_visit_date.split(" ",1)+ ' '+ obj[i].next_visit_time + ' <font color="red">(未预约)</font> 项目:' + obj[i].next_visit_type;

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
					}
					html +='</ul>';

                	jQuery('#verify_content').append(html);
					$("#verify_modal").modal("show");	
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

			$('#tools_verify').hide(100);	
			TendaAjax.getData({"script":"get_privilege"}, function(result){
			 	if(result.error == GLOBAL.SUCCESS) {
			 		if ((result.privilege & 32) == 32) {           
			 			$('#tools_verify').show(100);	
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
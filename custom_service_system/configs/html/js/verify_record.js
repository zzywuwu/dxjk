
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
								"aTargets":[3],
								"mRender":function(data, type, full){
									return data.split(" ",1);
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
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "next_visit_date","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "servicename","sClass":"hidden-480","sWidth":"65px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"65px"},
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
        sOut += '<tr><td>姓名:</td><td>'+aData.customer_name.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>就诊日期:</td><td>'+aData.visit_date.split(" ",1)+'</td></tr>';
        sOut += '<tr><td>就诊时间:</td><td>'+aData.visit_time+'</td></tr>';
        sOut += '<tr><td>陪诊人员:</td><td>'+aData.servicename+'</td></tr>';
        sOut += '<tr><td>就诊项目:</td><td>'+aData.visit_type+'</td></tr>';
		sOut += '<tr><td>就诊医生:</td><td>'+aData.visit_doctor_name+'</td></tr>';
		sOut += '<tr><td>就诊记录:</td><td>'+aData.result+'</td></tr>';
        sOut += '<tr><td>医嘱:</td><td>'+aData.doctor_advise+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';

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
    
        sOut += '</table>';  
        return sOut;
    }

	var operation_modal;

	return {
		init: function () {

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

      //           	var submitData = {};
      //           	submitData.script = "record_verify";
      //           	submitData.id = arr_id;

      //           	TendaAjax.getData(submitData, function(result){
      //           		if(result.error == GLOBAL.SUCCESS) {
						// 	initTableList();
						// }				
      //           		else
      //           			alert(result.error);
      //           	});
					jQuery('#verify_content').html("");
					jQuery('#verify_content').append(html);
					var html = '<ul>';
					html += '<li>姓名:\t\t\t'+arr[0].customer_name+'</li>';
			       	html += '<li>就诊日期:\t\t\t'+arr[0].visit_date.split(" ",1)+'</li>';
			       	html += '<li>就诊时间:\t\t\t'+arr[0].visit_time+'</li>';
			       	html += '<li>陪诊人员:\t\t\t'+arr[0].servicename+'</li>';
			       	html += '<li>就诊项目:\t\t\t'+arr[0].visit_type+'</li>';
			       	html += '<li>就诊医生:\t\t\t'+arr[0].visit_doctor_name+'</li>';

			        html +='</ul>';
                	jQuery('#verify_content').append(html);
					$("#event_modal").modal("show");	
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
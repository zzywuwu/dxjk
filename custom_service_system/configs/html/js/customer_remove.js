
var customer_remove_module = function() {

	var search_str = "";

	var initTableList =  function() {

		 TendaAjax.getData({"script":"customer_remove_get_list"}, function(result){
			
		 	if(result.error == GLOBAL.SUCCESS) {
		
		 		initTable1(result.user_list);
		 	}
		 	else 
		 		mainindex.modalwarn(result.error);
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
								"aTargets":[2],
								"data":"name",
								"mRender": function(data, type, full) {
									return '<a href="#" class="record" data="' + full.id + '">'+data+'</a>';
								}
							},
							{
								"aTargets":[4],
								"mRender":function(data, type, full){
									
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
			"aaSorting": [[8, 'desc']],
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
				{"mDataProp": "customer_type","sClass":"hidden-480","sWidth":"60px"},
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
				// ,trigger:'click'
			});
			$(this).tooltip('show');
		});		

		if (search_str != "") {
			jQuery('#kf_list_filter input').val(search_str);
			jQuery('#kf_list_filter input').focus();	
			var e = jQuery.Event("keyup");//模拟一个键盘事件
            e.keyCode = 13;//keyCode=13是回车
            jQuery("#kf_list_filter input").trigger(e);
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
        	sOut += '<tr><td>末次月经:</td><td>'+aData.last_menses_time+'</td></tr>';
			sOut += '<tr><td>预产期:</td><td>'+aData.due_time+'</td></tr>';
			sOut += '<tr><td>建卡医生:</td><td>'+aData.doctor_name+'</td></tr>';
        }
        else {
        	sOut += '<tr><td>性别:</td><td>'+aData.gender+'</td></tr>';	
        }
        sOut += '<tr><td>身份证:</td><td>'+aData.idnumber+'</td></tr>';
        sOut += '<tr><td>地址:</td><td>'+aData.address+'</td></tr>';
        sOut += '<tr><td>身高:</td><td>'+aData.height+'</td></tr>';
        sOut += '<tr><td>体重:</td><td>'+aData.weight+'</td></tr>';
        sOut += '<tr><td>家属姓名:</td><td>'+aData.familyname+'</td></tr>';
        sOut += '<tr><td>家属电话:</td><td>'+aData.familyphonenumber+'</td></tr>';
        sOut += '<tr><td>家属年龄:</td><td>'+aData.familyage+'</td></tr>';
        sOut += '<tr><td>备注:</td><td>'+aData.remarks+'</td></tr>';
        sOut += '</table>';  
        return sOut;
    }

	return {
		init: function () {

			jQuery('.kf-index>li').on("click", function(){
				var operation;
				if ($(this).find("i").hasClass("icon-unlock")) {
					operation = "RESERVER";	
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
          
                if (operation == "RESERVER") {
                	
                	if(arr.length != 1) {
	                	mainindex.modalwarn("请选择一条数据!");
	                	return;
	                }

                	$("#confirm_modal_title").html('重启服务');
                	$("#confirm_modal_content").html('你确定重新开启对<font color="red"> ' + arr[0].name +' </font>的服务吗?');
                	$("#confirm_modal_content").attr('data_id',arr[0].id);
                	$("#confirm_modal_content").attr('data_script','customer_reserver');
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
			
			if ((GLOBAL.PRIVILEGE & 32) != 32) {
  				$('#tools_unlock').hide(100);		
	 		}

			App.initUniform();
			initTableList();
		}
	};

}();

// customermodule.init();
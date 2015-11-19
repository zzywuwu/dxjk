// JavaScript Document

// JavaScript Document

/*var testData = {
"version_list":[
	{"id": "1",
"production": "F1204",
"soft_ver": "1.0.1",
"support": "1",
"password": "123",
"next_ver_id":"2",
"hard_ver":"bcm4403",
"system":"linux",
"description":"这是一个测试版本",
"create_time":"2015-10-01 13:59",
"recursion ":"1"}
]
};*/


var TableAdvanced = function() {

	var initTableList =  function() {

			 TendaAjax.getData({"script":"pd_get_list"}, function(result){
				
			 	if(result.error == GLOBAL.SUCCESS) {
			
			 		initTable1(result.version_list);
			 	}
				

			 });
			 //initTable1(testData.version_list);
			// initTable1(testData.account_list2);

		}

	var initTable1 = function(version_list) {

		
		var oTable = jQuery("#pd_list").dataTable({
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
			
			"aoColumnDefs": [{"aTargets":[0],
							"data":"id",
							"mRender": function(data, type, full) {
								return '<input type="checkbox" class="checkboxes" value="' + data +  '"/>';
								}

							},{
								"aTargets":[7],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close'></span>";
								}
							}
							],
			"aaSorting": [[1, 'asc']],
			"aLengthMenu": [
				[1,5, 15, 20, -1],
				[1,5, 15, 20, "所有"]
			],
			"iDisplayLength": 10,
			
			"aaData": version_list,

			"aoColumns": [{"mDataProp": "id", "bSortable":false},
				{"mDataProp": "id"},
				{"mDataProp": "production"},
				{"mDataProp": "soft_ver", "sClass":"hidden-480"},
				
				{"mDataProp": "password", "sClass":"hidden-480"},
				
				{"mDataProp": "next_ver_id", "sClass":"hidden-480"},
				
				
				{"mDataProp": "create_time", "sClass":"hidden-480", "sWidth":"155px"},
				{"mDataProp": "id"}]

		});

		

		jQuery("#pd_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#pd_list_wrapper .dataTables_length select").addClass("m-wrap small");

		App.initUniform("#pd_list .checkboxes");
	}

	/* Formating function for row details */

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td>产品型号:</td><td>'+aData.production+'</td></tr>';
        sOut += '<tr><td>软件版本:</td><td>'+aData.soft_ver+'</td></tr>';
        sOut += '<tr><td>硬件版本:</td><td>'+aData.hard_ver+'</td></tr>';
        sOut += '<tr><td>禁用该版本:</td><td>'+ (aData.support == "0" ? "禁用" : "不禁用")+'</td></tr>';
        sOut += '<tr><td>升级是否可以跳过该版本:</td><td>'+ (aData.recursion  == "0" ? "否" : "是")+'</td></tr>';
        sOut += '<tr><td>系统:</td><td>' + aData.system + '</td></tr>';
        sOut += '<tr><td>描述:</td><td>' + aData.description + '</td></tr>';
        sOut += '</table>';
         
        return sOut;
    }

	return {
		init: function () {

			$(".pd-form").validate({

				errorElement: 'span', //default input error message container
	            errorClass: 'error', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	           
				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证
					
					var submitData = {};
					
					submitData.id = form.pd_id.value;
					submitData.production = form.production.value;
					submitData.soft_ver = form.soft_ver.value;
					submitData.password = form.password.value;
					submitData.support = $(".pd-group:checked").val();
					submitData.recursion = $(".pd-recursion:checked").val();
					submitData.next_ver_id = form.next_ver_id.value;
					submitData.hard_ver = form.hard_ver.value;
					submitData.system = form.system.value;
					submitData.description = form.description.value;
					submitData.create_time = form.create_time.value;
					
						
					submitData.script = "pd_update";
					
					if($(".fileupload").hasClass("fileupload-exists")) {
						$("#pd_modal").modal("hide");
						$("#pd_upload_modal").modal("show");
						TendaAjax.uploadFile($(form), "#upload_container", submitData, function(result){
							initTableList();
							$("#pd_upload_modal").modal("hide");
						});
					} else {
						TendaAjax.getData(submitData, function(result){
							//提示成功或失败
							//console.log(result);
							alert(result.error);
							initTableList();
							$("#pd_modal").modal("hide");

						});
					}

					

				}
			});
			
			$(".form-datetime").datetimepicker({
				format:"yyyy-mm-dd hh:ii",
				autoclose: true,
				todayBtn: true,
				pickerPosition:"bottom-left"
			});

			jQuery('#pd_modal').on('hidden.bs.modal', function (e) {
				$("input[type='text']").val('');

					
			
  				//alert("hidden");
  				//TODO:remove错误提示，初始化错误码
			});

			
	        

			jQuery('.pd-list>li').on("click", function(){

				var operation = $(this).find("i").hasClass("icon-pencil") ? "MODIFY" : "DELETE";
				

                var set = $("#pd_list .checkboxes:checked");
                var arr = [];
                
                var arr_id = [];
                var oTable = $("#pd_list").dataTable();

                if(set.length > 0) {
                	var nTr = $(set[0]).parents("tr");

            		var tmpObj = oTable.fnGetData(nTr[0]);

            		if(tmpObj) {
            			arr.push(tmpObj);
            			arr_id.push(tmpObj.id);
            		}
                } else {

                }

                

                if(set.length == 0) {
                	alert("请至少选择一条数据");
                	return;
                }

                if(set.length > 1) {
                	var oprMsg = (operation == "MODIFY" ? "修改" : "删除"); 
                	alert("仅可以" + oprMsg + "一条数据");
                	return;
                }

                //console.log(arr);

                $(".pd-group").parent("span").removeClass("checked");
                $(".pd-recursion").parent("span").removeClass("checked");
            	if(operation == "MODIFY") {
                	//默认编辑第一条
                	//显示模态框，并将数据显示到模态框中
                	$("#pd_id").val(arr[0].id);
                	$("#production").val(arr[0].production);
                	$("#soft_ver").val(arr[0].soft_ver);
                	$("#password").val(arr[0].password);
                	$("#hard_ver").val(arr[0].hard_ver);
                	$("#next_ver_id").val(arr[0].next_ver_id);
                	$(".fileupload-exists[data-dismiss='fileupload']").click();

                	if(arr[0].support == 1) {
                		//表示支持，即不禁用
                		$(".pd-group:eq(1)").attr("checked", true).parent("span").addClass("checked");
                		
            		} else {
            			$(".pd-group:eq(0)").attr("checked", true).parent("span").addClass("checked");
            		}

            		if(arr[0].recursion == 1) {

                		$(".pd-recursion:eq(0)").attr("checked", true).parent("span").addClass("checked");
                		
            		} else {
            			$(".pd-recursion:eq(1)").attr("checked", true).parent("span").addClass("checked");
            		}



                	$("#system").val(arr[0].system);
                	$("#description").val(arr[0].description);
                	$("#create_time").val(arr[0].create_time);
                	$("#pd_modal").modal("show");


                } else {
                	//删除数据
                	var submitData = {};
                	submitData.script = "pd_del";
                	submitData.id = arr_id[0];

                	TendaAjax.getData(submitData, function(result){
                		alert(result.error);
                		initTableList();
                	});
                }
                



			});


			// jQuery('#pd_list .group-checkable').change(function () {
   //              var set = jQuery(this).attr("data-set");
   //              var checked = jQuery(this).is(":checked");
   //              jQuery(set).each(function () {
   //                  if (checked) {
   //                      $(this).attr("checked", true);
   //                  } else {
   //                      $(this).attr("checked", false);
   //                  }
   //              });
   //              jQuery.uniform.update(set);
   //          });

            $('#pd_list').on('click', ' tbody td .row-details', function () {

            	var oTable = $("#pd_list").dataTable();
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


TableAdvanced.init();

//App.init();

var recordmodule = function() {

	var operation_customer_id;
	var operation_customer_name;

	var initTableList =  function() {
		TendaAjax.getData({"script":"record_get_list","customer_id":operation_customer_id}, function(result){
		if(result.error == GLOBAL.SUCCESS) {
			$("#record_title").html('<i class="icon-heart"></i>陪诊记录');
			$("#personinfo").html('<i class="icon-user"></i> '+result.username);
			operation_customer_name = result.username;
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
				
			},
			
			"aoColumnDefs": [
							{
								"aTargets":[0],
								"data":"id",
								"mRender": function(data, type, full) {
									if (full.verify)
										return "";
									else
										return '<input type="checkbox" class="checkboxes" value="' + data +  '"/>';
								}
							},
							{
								"aTargets":[2],
								"mRender":function(data, type, full){
									if (data) {										
										return "记录";
									}
									else {
										return "事件";										
									}
								}
							},
							{
								"aTargets":[3],
								"mRender":function(data, type, full){
									if (full.status) {
										if (full.verify)
											return '<font color="green">已审核</font>';
										else
											return '<font color="red">未审核</font>';
									}
									else {
										if (full.order_success)
											return "已预约";
										else
											return '<font color="red">未预约</font>';
									}
								}
							},
							{
								"aTargets":[4],
								"mRender":function(data, type, full){
									return data;
								}
							},
							{
								"aTargets":[5],
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
								"aTargets":[7],
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
								"aTargets":[9],
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
								"aTargets":[10],
								"mRender":function(data, type, full){
									if (data == null) {
										return '<a href="#" class="review" data_id="' + full.id + '" data_time="" data_content=""' +'>回访</a>';	
									}
									if (data.split(" ",1) == '0000-00-00')
										return '<a href="#" class="review" data_id="' + full.id + '" data_time="" data_content=""' +'>回访</a>';
									else{
										if ((GLOBAL.PRIVILEGE & 1) == 1) {
											return '<a href="#" class="review" data_id="' + full.id + '" data_time="' + full.review_time +'" data_content="' + full.review_content + '">'+data.split(" ",1)+'</a>';
										}
										else
											return '<a href="#" class="review" data_id="' + full.id + '" data_time="" data_content=""' +'>回访</a>';
									}
								}
							},
							{
								"aTargets":[11],
								"mRender":function(data, type, full){
									return "<span class='row-details row-details-close desc'></span>";
								}
							}
			],
			"aaSorting": [[4, 'desc']],
			// "aLengthMenu": [
			// 	[1,5, 15, 20, -1],
			// 	[1,5, 15, 20, "所有"]
			// ],
			"iDisplayLength": "100",
			
			"aaData": account_list,

			"aoColumns": [
				{"mDataProp": "id","bSortable":false,"sWidth":"5px"}, 
				{"mDataProp": "id","sWidth":"40px"},
				{"mDataProp": "status","sWidth":"50px"},
				{"mDataProp": "id","sWidth":"50px"},
				{"mDataProp": "visit_date","sClass":"hidden-480","sWidth":"85px"},
				{"mDataProp": "visit_type","sClass":"hidden-480","sWidth":"140px"},
				{"mDataProp": "visit_doctor_name","sClass":"hidden-480","sWidth":"70px"},
				{"mDataProp": "remarks","sClass":"hidden-480","sWidth":"300px"},
				{"mDataProp": "user_id_name","sClass":"hidden-480","sWidth":"80px"},
				{"mDataProp": "image","sClass":"hidden-480","sWidth":"40px"},
				{"mDataProp": "review_time","sClass":"hidden-480","sWidth":"90px"},
				{"mDataProp": "update_time","sWidth":"40px"}
				]
		});

		
		jQuery("#kf_list_wrapper .dataTables_filter input").addClass("m-wrap small");
		jQuery("#kf_list_wrapper .dataTables_length select").addClass("m-wrap small");

		jQuery("#kf_list").on("click",' tbody td .review',function(){	
			$("#kf_review_id").val($(this).attr("data_id"));
            $("#kf_review_content").val($(this).attr("data_content"));
            $("#kf_review_time").text($(this).attr("data_time"));
            $("#review_modal").modal("show");	
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
			    		case 5:
			    			str = arr[0].visit_type;
			    			break;
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

		App.initUniform("#kf_list .checkboxes");
	}

	var fnFormatDetails = function( oTable, nTr ) {
		Gallery.init();
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
		sOut += '<tr><td style="width:100px;">就诊时间:</td><td>'+aData.visit_date+ ' '+ aData.visit_time + '</td></tr>';
		sOut += '<tr><td>就诊项目:</td><td>'+aData.visit_type+'</td></tr>';
		sOut += '<tr><td>就诊医生:</td><td>'+aData.visit_doctor_name+'</td></tr>';
        if (aData.status == 1) {
			// 记录 
			sOut += '<tr><td>陪诊人员:</td><td>'+aData.servicename+'</td></tr>';
			sOut += '<tr><td>宫高(Cm):</td><td>'+aData.womb_height+'</td></tr>';
   			sOut += '<tr><td>腹围(Cm):</td><td>'+aData.belly_length+'</td></tr>';
   			sOut += '<tr><td>血压(Kpa):</td><td>'+aData.blood_pre+'</td></tr>';
   			sOut += '<tr><td>体重(Kg):</td><td>'+aData.body_weight+'</td></tr>';
   			sOut += '<tr><td>孕周:</td><td>'+aData.gest_weeks+'</td></tr>';
			sOut += '<tr><td>就诊记录:</td><td>'+aData.result+'</td></tr>';
			sOut += '<tr><td>医嘱:</td><td>'+aData.doctor_advise+'</td></tr>';
			if (aData.verify)
   				sOut += '<tr><td>审核状态:</td><td><font color="green">已审核</font></td></tr>';
  			else
   			    sOut += '<tr><td>审核状态:</td><td><font color="red">未审核</font></td></tr>';   			
        }
        else {
        	// 事件
        	sOut += '<tr><td>创建者:</td><td>'+aData.user_id_name+'</td></tr>';
        	if (aData.order_success)
        		sOut += '<tr><td>预约状态:</td><td>已预约</td></tr>';
        	else
        		sOut += '<tr><td>预约状态:</td><td><font color="red">(未预约)</font></td></tr>';
        	sOut += '<tr><td>就诊地址:</td><td>'+aData.visit_address+'</td></tr>';
        }
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

        if (aData.status == 1) {
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
	    }

		if ((GLOBAL.PRIVILEGE & 1) == 1 && aData.review_time != null) {
  			if (aData.review_time.split(" ",1) != '0000-00-00') {
	        	sOut += '<tr><td>回访时间:</td><td>'+aData.review_time+'</td></tr>';
	        	sOut += '<tr><td>回访内容:</td><td>'+aData.review_content+'</td></tr>';
	        }		
 		}

        sOut += '</table>';  
        return sOut;
    }

	var operation_modal;

	return {
		init: function () {

			operation_customer_id = $("#kf_list").attr("data");
			operation_customer_name = "";

			var v_kf_form = $('.kf-form');
			v_kf_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

                rules: {
            
	                kf_servicename: {
	                    required: true
	                },
	                kf_visit_date: {
	                    required: true,
                        date: true
	                },
	                kf_visit_type: {
	                    required: true,                     
	                },	
	                kf_womb_height: {
	                    number: true	                    
	                },
	                kf_belly_length: {
	                    number: true                     
	                },
	                kf_body_weight: {
	                    number: true	                    
	                }           
	            },

	            messages:{
	        
                    kf_servicename:{
                        required:"必填"
                    },
                    kf_visit_date:{
                        required:"必填"
                    },
                    kf_visit_type:{
                    	required:"最少选一个"
                    },
                    kf_womb_height: {
	                	number: "请输入数字"	                   
	                },
	                kf_belly_length: {
	                    number: "请输入数字"	                    
	                },
	                kf_body_weight: {
	                    number: "请输入数字"		                    
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
					
					submitData.script = "record_modify";					
					submitData.id = $("#kf_id").val();
					submitData.customer_name = operation_customer_name;
					submitData.visit_date = form.kf_visit_date.value;
					submitData.visit_time = jQuery('#kf_visit_time').val();	
					var visit_type_arr = [];
					$("#kf_visit_type option:selected").each(function(){			      
			            visit_type_arr.push($(this).text());
			        });
			        submitData.visit_type = JSON.stringify(visit_type_arr);			
					submitData.visit_doctor_name = form.kf_visit_doctor_name.value;
					submitData.result = form.kf_result.value;
					submitData.doctor_advise = form.kf_doctor_advise.value;
					submitData.remarks = form.kf_remarks.value;
					submitData.servicename = jQuery('#kf_servicename').val();
					submitData.womb_height = form.kf_womb_height.value;
					submitData.belly_length = form.kf_belly_length.value;
					submitData.body_weight = form.kf_body_weight.value;
					submitData.blood_pre = form.kf_blood_pre.value;
					submitData.gest_weeks = form.kf_gest_weeks.value;

					var fzinfoarr = [];
					for (var i = 0; i < 4; i++) {
						var fzinfo = {};						
						if (jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_date"]').val() == '')
							continue;
						fzinfo.next_visit_date = jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_date"]').val();
						fzinfo.next_visit_time = jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_visit_time"]').val();
						if (jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_order_success"]').val() == "已预约") 
							fzinfo.next_order_success = 1;
						else
							fzinfo.next_order_success = 0;
						fzinfo.next_visit_doctor_name = jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_doctor_name"]').val();
						
						var next_visit_type_arr = [];
						jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_visit_type"] option:selected').each(function(){			      
				            next_visit_type_arr.push($(this).text());
				        });
				        fzinfo.next_visit_type = JSON.stringify(next_visit_type_arr);	
						fzinfo.next_visit_address = jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_address"]').val();
						fzinfo.next_visit_remarks = jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') textarea[name="kf_next_remarks"]').val();
						
						fzinfoarr.push(fzinfo);
					};
					
					submitData.fzinfo = JSON.stringify(fzinfoarr);

					if ($('#kf_next_visit_date1').val() !='') {
						$('#kf_next_visit_type1').rules("add", {
							required: true,
							messages: {
								required: "最少选一个"
							}
						});
						var flag = false;		
						jQuery('#kf_next_visit_type1 option:selected').each(function(){			      
				            flag = true;
				            return false;
				        });
				        if (flag == false)
				        	return;
					}
					else {
						$('#kf_next_visit_type1').rules("remove" );
					}

					if ($('#kf_next_visit_date2').val() !='') {
						$('#kf_next_visit_type2').rules("add", {
							required: true,                 			                	
							messages: {
								required: "最少选一个"
							}
						});
						var flag = false;		
						jQuery('#kf_next_visit_type2 option:selected').each(function(){			      
				            flag = true;
				            return false;
				        });
				        if (flag == false)
				        	return;
					}
					else {
						$('#kf_next_visit_type2').rules( "remove" );
					}

					if ($('#kf_next_visit_date3').val() !='') {
						$('#kf_next_visit_type3').rules("add", {
							required: true,                 			                	
							messages: {
								required: "最少选一个"
							}
						});
						var flag = false;		
						jQuery('#kf_next_visit_type3 option:selected').each(function(){			      
				            flag = true;
				            return false;
				        });
				        if (flag == false)
				        	return;
					}
					else {
						$('#kf_next_visit_type3').rules( "remove" );
					}

					if ($('#kf_next_visit_date4').val() !='') {
						$('#kf_next_visit_type4').rules("add", {
							required: true,                 			                	
							messages: {
								required: "最少选一个"
							}
						});
						var flag = false;		
						jQuery('#kf_next_visit_type4 option:selected').each(function(){			      
				            flag = true;
				            return false;
				        });
				        if (flag == false)
				        	return;
					}
					else {
						$('#kf_next_visit_type4').rules( "remove" );
					}

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

			var v_review_form = $('.review-form');
			v_review_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
	                          
				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证

					var submitData = {};
                	submitData.script = "record_review";
                	submitData.id = $("#kf_review_id").val();
                	submitData.review_content = $("#kf_review_content").val();
                	TendaAjax.getData(submitData, function(result){
                		if(result.error == GLOBAL.SUCCESS) {
							initTableList();
							$("#review_modal").modal("hide");
						}				
                		else
                			mainindex.modalwarn(result.error);;
                	});
				}
			});
			        
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
					if(operation_modal == "MODIFY") {
						submitData.script = "event_modify";
					}
					else {
						submitData.script = "event_add";
					}
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

            for (var i = 0,j = 1; i < 4; i++,j++) {
				// 给每一个对象零时设置内容，在事件发生的时候取出来
				jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_date"]').attr("data",i);
				jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_date"]').on('change', function () {
					var index = parseInt($(this).attr("data")) + 1;
	            	if ($(this).val() != '') {	    	            	
	            		jQuery('#portlet_tab2 .accordion-heading:eq(' + $(this).attr("data") + ') .accordion-toggle').text('复诊'+index+'(已设置)');
	            	}
	            	else {
	            		jQuery('#portlet_tab2 .accordion-heading:eq(' + $(this).attr("data") + ') .accordion-toggle').text('复诊'+index);
	            	}
		        });
			}
	
			$('#portlet_tab2 .accordion-heading:eq(0)').on("click",function(){
				$('#collapse_2').collapse('hide');
				$('#collapse_3').collapse('hide');
				$('#collapse_4').collapse('hide');
			});

			$('#portlet_tab2 .accordion-heading:eq(1)').on("click",function(){
				$('#collapse_1').collapse('hide');
				$('#collapse_3').collapse('hide');
				$('#collapse_4').collapse('hide');
			});

			$('#portlet_tab2 .accordion-heading:eq(2)').on("click",function(){
				$('#collapse_1').collapse('hide');
				$('#collapse_2').collapse('hide');
				$('#collapse_4').collapse('hide');
			});

			$('#portlet_tab2 .accordion-heading:eq(3)').on("click",function(){
				$('#collapse_1').collapse('hide');
				$('#collapse_2').collapse('hide');
				$('#collapse_3').collapse('hide');
			});
      
			jQuery('.kf-index>li').on("click", function(){

				var operation;
				if ($(this).find("i").hasClass("icon-pencil")) {
					operation = "MODIFY";
				}
				else if ($(this).find("i").hasClass("icon-trash")) {
					operation = "DELETE";
				}
				else if ($(this).find("i").hasClass("icon-plus")) {
					operation = "RECORD";	
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

	                if (arr[0].status == 1) {
	                	mainindex.modalwarn("这是一条记录，不能当做事件来处理!");
	                	return;
	                }

	                operation_modal = "MODIFY";
	           
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
                }
                else if (operation == "DELETE") {

                	if(arr.length != 1) {
	                	mainindex.modalwarn("请选择一条数据!");
	                	return;
	                }
                	
                	$("#confirm_modal_title").html('删除记录');
                	$("#confirm_modal_content").html('你确定将记录<font color="red"> ' + arr[0].id +' </font>删除吗?');
                	$("#confirm_modal_content").attr('data_id',arr[0].id);
                	$("#confirm_modal_content").attr('data_script','record_del');
                	$("#confirm_modal").modal("show");
                }      
                else if (operation == "RECORD") {
                	
                	if(arr.length != 1) {
	                	mainindex.modalwarn("请选择一条数据!");
	                	return;
	                }

	                $(".tab-content .tab-pane").removeClass('active');
                	$(".tab-content .tab-pane:first").addClass('active');
                	$(".nav-tabs li").removeClass('active');
                	$(".nav-tabs li:last").addClass('active');
                	$("#kf_modal input[type='text'], input[type='hidden']").val('');
					$("#kf_modal input[type='date']").val('');
					$("#kf_modal textarea").val('');
					jQuery("#kf_servicename").empty();
					$("#kf_modal .controls span",$(this)).remove();
					$("#kf_modal .control-group").removeClass('success').removeClass('error');
					for (var i = 0,j = 1; i < 4; i++,j++) {
						jQuery('#portlet_tab2 .accordion-heading:eq(' + i + ') .accordion-toggle').text('复诊'+j);
					}
					$('#collapse_1').collapse('show');
					$('#collapse_2').collapse('hide');
					$('#collapse_3').collapse('hide');
					$('#collapse_4').collapse('hide');
					$("#kf_visit_type").val('');
					for (var i = 0; i < 4; i++) {
						$('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_visit_type"]').val('');	
					};
				
	                TendaAjax.getData({"script":"ac_get_list"}, function(result){
					 	if(result.error == GLOBAL.SUCCESS) {
					 		jQuery('#kf_servicename').append("<option></option>");
					 		for(var i = 0; i < result.user_list.length; i++) {
					 			jQuery('#kf_servicename').append("<option>" + result.user_list[i].name + "</option>");
					 		}
					 	}
					 	else
					 		mainindex.modalwarn(result.error);;
					 	
						jQuery('#kf_servicename option').each(function(){
							if (arr[0].servicename == $(this).text()){
								$(this).attr("selected",true);
							}
						});
					});
          			
					$("#kf_id").val(arr[0].id).prop("disabled", true);
					$("#kf_visit_date").val(arr[0].visit_date);
					jQuery('#kf_visit_time option').each(function(){
						if (arr[0].visit_time == $(this).text()){
							$(this).attr("selected",true);
						}
					});

					var obj = jQuery.parseJSON(arr[0].visit_type);
					if (Array.isArray(obj)) {
						for (var i = 0; i < obj.length; i++) {
							jQuery('#kf_visit_type option').each(function(){
								if (obj[i] == $(this).text()){
									$(this).attr("selected",true);
									return false;
								}
							});
						};
					}
				
					$("#kf_visit_doctor_name").val(arr[0].visit_doctor_name);	
					$("#kf_result").val(arr[0].result);
					$("#kf_doctor_advise").val(arr[0].doctor_advise);
					$("#kf_remarks").val(arr[0].remarks);
					$("#kf_womb_height").val(arr[0].womb_height);
					$("#kf_belly_length").val(arr[0].belly_length);
					$("#kf_body_weight").val(arr[0].body_weight);
					$("#kf_blood_pre").val(arr[0].blood_pre);
					$("#kf_gest_weeks").val(arr[0].gest_weeks);

					var obj = jQuery.parseJSON(arr[0].fzinfo);
					if (Array.isArray(obj)) {
						for (var i = 0,j = 1; i < obj.length; i++,j++) {
							jQuery('#portlet_tab2 .accordion-heading:eq(' + i + ') .accordion-toggle').text('复诊'+j+'(已设置)');
							jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_date"]').val(obj[i].next_visit_date);
							jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_visit_time"] option').each(function(){
								if (obj[i].next_visit_time == $(this).text()){
									$(this).attr("selected",true);
									return false;
								}
							});
							jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_order_success"] option').each(function(){
								if ("已预约" == $(this).text() && obj[i].next_order_success){
									$(this).attr("selected",true);
									return false;
								}
							});
							jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') input[name="kf_next_visit_doctor_name"]').val(obj[i].next_visit_doctor_name);
							
							var next_visit_obj = jQuery.parseJSON(obj[i].next_visit_type);
							if (Array.isArray(next_visit_obj)) {
								for (var k = 0; k < next_visit_obj.length; k++) {
									jQuery('#portlet_tab2 .accordion-body:eq(' + i + ') select[name="kf_next_visit_type"] option').each(function(){
										if (next_visit_obj[k] == $(this).text()){
											$(this).attr("selected",true);
											return false;
										}
									});
								};
							}

							jQuery('#portlet_tab2 .accordion-body:eq(' + i + ')  input[name="kf_next_visit_address"]').val(obj[i].next_visit_address);
							jQuery('#portlet_tab2 .accordion-body:eq(' + i + ')  textarea[name="kf_next_remarks"]').val(obj[i].next_visit_remarks);
						};	
					}
                	$("#kf_modal").modal("show");	
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

			jQuery('#addbutton').on("click", function(){
				 operation_modal = "";
			});

			jQuery('#personinfo').on("click", function(){
				var submitData = {};
				submitData.script = "customer_query_by_id";					
				submitData.id = operation_customer_id;
				TendaAjax.getData(submitData, function(result){
				if(result.error == GLOBAL.SUCCESS) {
						result.user_info.name
            		$("#personinfo_name").text(result.user_info.name+'(Id: '+result.user_info.id+')');
            		$("#personinfo_age").text(result.user_info.age);

            		$("#personinfo_phonenumber").text(result.user_info.phonenumber);
            		$("#personinfo_wx").text(result.user_info.wx);
            		
            		$("#personinfo_sellname").text(result.user_info.sellname);
            		$("#personinfo_customer_type").text(result.user_info.customer_type);
            		
            		if(result.user_info.customer_type ==  GLOBAL.YUNMM) {
            			jQuery('.ymm_group').show(100);
						jQuery('.normal_group').hide(100);
            			$("#personinfo_last_menses_time").text(result.user_info.last_menses_time);
            			$("#personinfo_due_time").text(result.user_info.due_time);
            			$("#personinfo_doctor_name").text(result.user_info.doctor_name);
            		}
            		else {
            			jQuery('.ymm_group').hide(100);
						jQuery('.normal_group').show(100);
            			$("#personinfo_gender").text(result.user_info.gender);
            		}
            		$("#personinfo_idnumber").text(result.user_info.idnumber);
            		$("#personinfo_address").text(result.user_info.address);

            		$("#personinfo_height").text(result.user_info.height);
            		$("#personinfo_weight").text(result.user_info.weight);
            		
            		$("#personinfo_familyname").text(result.user_info.familyname);
            		$("#personinfo_familynamenumber").text(result.user_info.familynamenumber);
            		
            		$("#personinfo_remarks").text(result.user_info.remarks);

            		if(result.user_info.vip == 1) {
            			
            			$("#personinfo_order_time").text(result.user_info.order_time);
            			$("#personinfo_order_over_time").text(result.user_info.order_over_time);
            		}

					$("#personinfo_modal").modal("show");	
				}
				else 
					mainindex.modalwarn(result.error);;
				});
			});

			jQuery('#event_modal').on('hidden.bs.modal', function (e) {
				$("#event_modal input[type='text'], input[type='hidden']").val('');
				$("#event_modal input[type='date']").val('');
				$("#event_modal textarea").val('');
				$("#event_modal .controls span",$(this)).remove();
				$("#event_modal .control-group").removeClass('success').removeClass('error');	
				$("#event_visit_type").val('');				
				jQuery('#event_order_success option').each(function(){
					$(this).attr("selected",true);
					return false;
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

			App.initUniform();
			initTableList();
		}
	};
}();

// recordmodule.init();

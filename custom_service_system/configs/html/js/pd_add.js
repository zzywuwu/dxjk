
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
"create_time":"2015-10-01 13:59"}
"recursion ":"1"}
]
};*/
var AddVerFormWizard = function () {

	var initVersionList =  function() {

			 TendaAjax.getData({"script":"pd_get_list", "production":$("#search_production").val()}, function(result){
				
			 	if(result.error == GLOBAL.SUCCESS) {
			
			 		initTable1(result.version_list);
			 	}
				

			 });
			 //initTable1(testData.version_list);
			

	}
	var initTable1 = function(version_list) {

		if(version_list.length == 0) {
			$("#version_selected").hide();
		} else {
			$("#version_selected").show();
		}
		var oTable = jQuery("#pd_add_list").dataTable({
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

		App.initUniform("#pd_add_list .checkboxes");
	}

	/* Formating function for row details */

	var fnFormatDetails = function( oTable, nTr ) {
        var aData = oTable.fnGetData( nTr );
        var sOut = '<table>';
        sOut += '<tr><td>产品型号:</td><td>'+aData.production+'</td></tr>';
        sOut += '<tr><td>软件版本:</td><td>'+aData.soft_ver+'</td></tr>';
        sOut += '<tr><td>硬件版本:</td><td>'+aData.hard_ver+'</td></tr>';
        sOut += '<tr><td>禁用该版本:</td><td>'+ (aData.support == "0" ? "禁用" : "不禁用")+'</td></tr>';
        sOut += '<tr><td>升级是否可以跳过该版本:</td><td>'+ (aData.recursion  == "1" ? "是" : "否")+'</td></tr>';
        sOut += '<tr><td>系统:</td><td>' + aData.system + '</td></tr>';
        sOut += '<tr><td>描述:</td><td>' + aData.description + '</td></tr>';
        sOut += '</table>';
         
        return sOut;
    }

    

	return {
		init: function () {
			if(!jQuery().bootstrapWizard) {
				return;
			}
			if(!jQuery().dataTable){
				return;
			}
			var form = $('#submit_form');
            var error = $('.alert-error', form);
            var success = $('.alert-success', form);

            form.validate({
            	doNotHideMessage: true,
            	errorElement: 'span',
            	errorClass: 'validate-inline',
            	focusInvalid: false,
            	rules: {

            	},
            	message: {

            	},
            	errorPlacement: function (error, element) {
            		 error.insertAfter(element);
            	},

            	invalidHandler: function (event, validator) {
            		success.hide();
            		error.show();
            		App.scrollTo(error, -200);
            	},

            	highlight: function (element) {
            		$(element).closest(".help-inline").removeClass('OK');
            		$(element).closest('.control-group').removeClass('success').addClass('error');
            	},
            	unhighlight: function (element) { // revert the change dony by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    
                        label
                            .addClass('valid ok') // mark the current input as valid and display OK icon
                        .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                    
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }
            });

			var displayConfirm = function () {
				$(".display-value", form).each(function() {
					var input = $('[name="' + $(this).attr("data-display") + '"]', form);
					if(input.is(":text") || input.is("textarea") || input.is(":file")) {
						$(this).html(input.val());
					} else if (input.is(":radio") && input.is(":checked")) {
						var value = $('[name=' + $(this).attr("data-display") + ']:checked').val()
						$(this).html(value);
					}
				});
			}

			var initForm = function(operation) {
				$(".fileupload-exists[data-dismiss='fileupload']").click();
				$(".pd-group").parent("span").removeClass('checked');
				$(".pd-recursion").parent("span").removeClass('checked');
				if(operation == "reset") {
					$("input[type='text']").val("");
					$("#production_id").val(0);
					$(".pd-group:eq(1)").attr("checked", true).parent("span").addClass("checked");
					$(".pd-recursion:eq(0)").attr("checked", true).parent("span").addClass("checked");
				} else {
					var set = $("#pd_add_list .checkboxes:checked");
	                var arr = [];
	                
	                var oTable = $("#pd_add_list").dataTable();

	                if(set.length > 0) {
	                	var nTr = $(set[0]).parents("tr");

                		var tmpObj = oTable.fnGetData(nTr[0]);

                		if(tmpObj) {
                			arr.push(tmpObj);
                			
                		}
	                } else {
	                	return;
	                }

	                

	                $("#production_id").val(arr[0].id);
                	$("#production").val(arr[0].production);
                	$("#soft_ver").val(arr[0].soft_ver);
                
                	$("#hard_ver").val(arr[0].hard_ver);
                	$("#password").val(arr[0].password);
                	
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
                	
				}
			}

			$("#form_wizard_1").bootstrapWizard({
				'nextSelector': '.button-next',
				'previousSelector': '.button-previous',
				onTabClick: function (tab, navigation, index) {
					return false;
				},
				onNext: function (tab, navigation, index) {
					success.hide();
					error.hide();
					if(form.valid() == false) {
						return false;
					}

					var total = navigation.find('li').length;
					var current = index + 1;

					if(current == 2) {
						//获取数据列表
						initVersionList();
					}

					if(current == 3) {
						var select_len = $("#pd_add_list .checkboxes:checked").length;
						if($("#pd_add_list_wrapper tr td").hasClass('dataTables_empty')) {
							initForm("reset");
						} else if(select_len == 0) {
							//表示没有进行选择
							alert("请从以上列表中选择一个版本后再继续下一步操作");
							return false;
						} else if(select_len > 1) {
							alert("只能选择一个版本");
							return false;
						} else if(select_len == 1) {
							initForm("init");
						}

					}

					$('.step-title', $('#form_wizard_1')).text('第' + (index + 1) + '/' + total);

					jQuery('li', $('#form_wizard_1')).removeClass("done");
					var li_list = navigation.find('li');
					for(var i = 0; i < index; i++) {
						jQuery(li_list[i]).addClass('done');
					}



					if(current == 1) {
						$('#form_wizard_1').find('.button-previous').hide();
					} else {
						$('#form_wizard_1').find('.button-previous').show();
					}

					if(current >= total) {
						$('#form_wizard_1').find('.button-previous').hide();
						$('#form_wizard_1').find('.button-next').hide();
						$('#form_wizard_1').find('#button-submit').hide();
						
					} else if(current == total - 1) {
						$('#form_wizard_1').find('.button-next').hide();
						$('#form_wizard_1').find('#button-submit').show();
						displayConfirm();
					} else {

						$('#form_wizard_1').find('.button-next').show();
						$('#form_wizard_1').find('#button-submit').hide();

					}
					App.scrollTo($('.page-title'));

					
				},
				onPrevious: function (tab, navigation, index) {
					success.hide();
					error.hide();

					var total = navigation.find('li').length;
					var current = index + 1;

					$('.step-title', $('#form_wizard_1')).text('第' + (index + 1) + '/' + total);

					jQuery('li', $('#form_wizard_1')).removeClass('done');

					var li_list = navigation.find('li');

					for(var i = 0; i < index; i++) {

						jQuery(li_list[i]).addClass('done');
					}

					if (current == 1) {
                        $('#form_wizard_1').find('.button-previous').hide();
                    } else {
                        $('#form_wizard_1').find('.button-previous').show();
                    }

                    if (current == total -1) {
                        $('#form_wizard_1').find('.button-next').hide();
                        $('#form_wizard_1').find('#button-submit').show();
                    } else {
                        $('#form_wizard_1').find('.button-next').show();
                        $('#form_wizard_1').find('#button-submit').hide();
                    }

                    App.scrollTo($('.page-title'));
				},
				onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('#bar .bar').css({
                        width: $percent + '%'
                    });
                }
			});

			$('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 #button-submit').click(function () {
                var submitData = form.serialize();
               
          		TendaAjax.uploadFile(form, "#upload_container", submitData, function(data){
          			$(".form-wizard .navbar li:last").removeClass("active").addClass('done');
          		});
            }).hide();

           


            $('#pd_add_list').on('click', ' tbody td .row-details', function () {

            	var oTable = $("#pd_add_list").dataTable();
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

			App.initUniform();
		}
	}
}();

//App.init();
AddVerFormWizard.init();


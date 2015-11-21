// JavaScript Document


jQuery(document).ready(function() {     

	App.init();
	
	ResetPwd.init();
	
});

var ResetPwd = function () {
    
    return {
        //main function to initiate the module
        init: function () {
        	
	        $('.reset-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            ignore: "",
	            rules: {
	          
	                new_password: {
	                    required: true
	                },
	                rpassword: {
	                    equalTo: "#new_password"
	                }
	                
	            },

	            messages: {
	                new_password: {
	                    required: "请输入新密码"
	                },
	                rpassword: {
	                    required: "请输入确认密码",
	                    equalTo: "两次输入密码不一致"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   

	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	                
	            },

	            submitHandler: function (form) {
	                var new_password = form.new_password.value;
		
					var data = {"script":"update_password","new_password":new_password};
					
					TendaAjax.getData(data, function(result){
					 	ResetPwd.resetPwdHandle(result);
					});

	            }
	        });

	        jQuery(".close").click(function(){
				$('.alert-error', $('.login')).hide();
			});
        },
		
		
		resetPwdHandle: function(obj){
							
			//TODO:跳转路径修改
			switch(obj.error) {
				case "成功":
					window.location = "/html/index";
					break;
				// case 5:
				// 	window.location = "chpwd";
				// 	break;
				
				default:
					$('.alert-error span', $('.login')).text(obj.error);
	                $('.alert-error', $('.login')).show();
					//$("#err_msg").html(err_obj[data]).removeClass("hidden");	
			}
		}
			
	
		
		

    };

}();

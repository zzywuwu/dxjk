// JavaScript Document


jQuery(document).ready(function() {     

	App.init();
	
	ResetPwd.init();
	
});

var ResetPwd = function () {
    
    return {
        //main function to initiate the module
        init: function () {
        	
	        var v_reset_form = $('.reset-form');
			v_reset_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {	                
	                new_password: {
	                	required: true,
	                    minlength: 6                      
	                },	                
	                rpassword: {
                        required: true,
                        minlength: 6,
                        equalTo: "#new_password"
	                }
	            },

	            messages:{
                    new_password:{
                        required:"必填",
                        minlength: "请输入最少6位"	
                    },
                    rpassword:{
                        required:"必填",
                        minlength: "请输入最少6位",	
                        equalTo: "两次输入密码不一致"                 
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
							
			switch(obj.error) {
				case "成功":
					window.location = "/html/index";
					break;
				
				default:
					break;
					
			}
		}
		
    };

}();

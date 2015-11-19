

var ProfileConfig = function(){
	return {
		init:function(){
			jQuery(".close").click(function(){
				$('.alert-error', $('#profile_resetpwd')).hide();
			});
			$('#profile_resetpwd').validate({
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
	                
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.controls'));
	                
	            },

	            submitHandler: function (form) {
	                var new_password = form.new_password.value;
					//var data = transformSubmit({"name":name, "password":hex_md5(password), "randcode":randcode});
					
					//var data = "script=au_login&name=" + name + "&password=" + password + "&randcode=" + randcode;
					
					var obj = {};
					obj.script = "update_password";
					obj.new_password = new_password;

					TendaAjax.getData(obj, function(result){
					 	//TODO:跳转路径修改
						switch(result.error) {
							case "成功":
								window.location = GLOBAL.domain;
								break;
							
							
							default:
								$('#profile_resetpwd .alert-error span').text(result.error);
				                $('#profile_resetpwd .alert-error').show();
								//$("#err_msg").html(err_obj[data]).removeClass("hidden");	
						}
					});

	            }
	        });
		}
	}
}();

ProfileConfig.init();
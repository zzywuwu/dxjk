
jQuery(document).ready(function() {     

	App.init();
	
	Login.init();
	
	Login.getCodeReq();
});

var Login = function () {
    
    return {
        //main function to initiate the module
        init: function () {
        	
           $('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "请输入用户名"
	                },
	                password: {
	                    required: "请输入密码"
	                }
	            },

	            invalidHandler: function (event, validator) { //display error alert on form submit   
					$('.alert-error span', $('.login')).text("请输入用户名和密码");
	                $('.alert-error', $('.login')).show();
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



	                var name = form.username.value,
						password = form.password.value,
						randcode = form.randcode.value.toUpperCase();	
					//var data = transformSubmit({"name":name, "password":hex_md5(password), "randcode":randcode});
					
					//var data = "script=au_login&name=" + name + "&password=" + password + "&randcode=" + randcode;
					
					//var obj = {};
					//obj.script = "au_login";


					var data = {"script":"login","name":name, "password": password, "randcode":randcode};


					TendaAjax.getData(data, function(result){
					 	Login.loginHandle(result);
					});

	            }
	        });

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                    //window.location.href = "index.html";
	                }
	                return false;
	            }
	        });

			jQuery(".close").click(function(){
				$('.alert-error', $('.login')).hide();
			});

			jQuery('#img-code').click(function () {
				Login.getCodeReq();
			});
        },
		
		getCodeReq: function(){
			// $.get("au_captcha", function(data){
			// 	var url = "/captcha/" + data + ".jpg";
		
			// 	$("#img-code").attr("src", url);	
			// });

			TendaAjax.getCaptcha(function(result){
				var url = "/temp/captcha/" + result + ".jpg";
				$("#img-code").attr("src", url);
			});
		},
			
		loginHandle: function(obj){
			
			
			//TODO:跳转路径修改
			switch(obj.error) {
				case "成功":
					window.location = "/html/index";
					break;
				case "帐号未激活":
					window.location = "/html/chpwd";
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
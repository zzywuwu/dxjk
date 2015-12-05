
jQuery(document).ready(function() {     

	App.init();
	
	Login.init();
	
	Login.getCodeReq();
});

var Login = function () {
    
    return {
        //main function to initiate the module
        init: function () {
        	
	        var v_login_form = $('.login-form');
			v_login_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {
	                
	                username: {
	                    minlength: 2,
                        required: true
	                },
	                
	                password: {
	                	minlength: 6,
                        required: true
	                },
	                randcode: {
	                	minlength: 4,
	                	maxlength: 4,
                        required: true
	                }
	            },

	            messages:{
                    username:{
                        required:"必填",
                        minlength: "请输入最少2位"	
                    },
                    password:{
                        required:"必填",
                        minlength: "请输入最多6位"                   
                    },
                    randcode:{
                        required:"必填",
                        minlength: "请输入最少4位",
                        maxlength: "请输入最多4位"
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

	                var name = form.username.value,
						password = form.password.value,
						randcode = form.randcode.value.toUpperCase();	
				
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
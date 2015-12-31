// JavaScript Document

var TendaAjax = function(){

	return {

		getHtml: function(obj, func) {

			jQuery.ajax({
				cache: true,
				url: '/html/view',
				type: 'get',
				dataType: 'html',
				data: obj,
				success: function(data) {
					func(data);
				},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			});
			

		},

		getData: function(obj, func) {

			jQuery.ajax({
				url: '/data/lua',
				type: 'post',
				dataType: 'json',
				data: obj,
				success: function(data) {
					if (data.error == "长时间未操作,请重新登录"){
			 			// alert(data.error);
			 			window.location = "/html/login";
			 		}
			 		else
						func(data);
				},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			});
			
		},

		getLoginout: function(obj, func) {

			var longAjax = jQuery.ajax({
				url: '/data/loginout',
				type: 'post',
				dataType: 'json',
				data: obj,
				success: function(data) {
					func(data);
				},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			});
			
			return longAjax;
		},

		getKFData: function(obj, func) {

			var longAjax = jQuery.ajax({
				url: '/data/kfsub',
				type: 'get',
				dataType: 'json',
				data: obj,
				success: function(data) {
					func(data);
				},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			});
			
			return longAjax;
		},

		getCaptcha: function(func) {
			jQuery.ajax({
				url: '/data/captcha',
				type: 'post',
				dataType: 'text',
				data: "1",
				success: function(data) {
					func(data);
				},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			});
			
		},

		uploadFile: function($form, submitData, successfunc, errorfunc) {
			
			var options = {
			 	beforeSend: function() {
			 		
			 	},
			 	uploadProgress: function(event, position, total, percentComplete) {
			 		$('#upload_container .bar').css("width", percentComplete + '%');
            		$('#upload_container .imgpercent').removeClass("hide");
            		$('#upload_container .imgpercent span').html(percentComplete);
			 	},
			 	data: submitData,
			 	dataType: 'json',
			 	error: function(data) {			 		
					errorfunc(data);
			 	},
			 	success: function(data) {
			 		successfunc(data);
			 	},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			};

		 	$form.ajaxSubmit(options);
		}

	} 
}();
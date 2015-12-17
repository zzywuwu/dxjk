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

		uploadFile: function($form, filecontainerId, submitData, successfunc, errorfunc) {
			var $infoContainer = $(filecontainerId);
			var progress_info = $infoContainer.find(".upload-progress");
			var progress = $infoContainer.find(".progress");
			var bar = $infoContainer.find(".bar");
			var options = {
			 	beforeSend: function() {
			 		//$(filecontainerId).html("上传中...");
			 	},
			 	uploadProgress: function(event, position, total, percentComplete) {
			 		if(progress_info.hasClass('hide')) {
			 			progress_info.removeClass("hide");
			 			progress.removeClass('hide');
			 		}

			 		progress_info.find("span").html(percentComplete);

			 		progress.find(".bar").css("width", percentComplete + '%');

			 	},
			 	data: submitData,
			 	dataType: 'json',
			 	error: function(data) {
			 		
			 		$infoContainer.find(".upload-info").html("上传失败");
			 	},
			 	success: function(data) {
			 		$infoContainer.find(".upload-info").html("上传成功");

			 		progress_info.find("span").html(100);

			 		progress.find(".bar").css("width", 100 + '%');

			 		if(typeof successfunc == "function") {
			 			successfunc(data);
			 		}
			 	},
				complete: function(xhr, textStatus) {
					xhr = null;
				}
			 };

		 $form.ajaxSubmit(options);
		}

	} 
}();
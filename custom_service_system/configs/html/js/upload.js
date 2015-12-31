
var uploadmodule = function() {

	return {
		init: function () {

			var v_form = $('#submit_form');
			v_form.validate({

				errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

	            rules: {
	                record_id: {
	                	digits: true,
                        required: true
	                },
                    image_name: {
                        required: true
                    }
	            },
	            messages:{
                    record_id:{
                    	digits:"请填写数字",
                        required:"必填"
                    },
                    image_name:{
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
                    var fileext = $('#filename_desc').text().split('.').pop().toLowerCase();
                    if ($('#filename_desc').text() == "") {
                        alert("请选择图片");     
                    }
                    else if (fileext != "jpg" && fileext != "jpeg" && fileext != "png" && fileext != "gif") {
                        alert("图片文件必须是 jpg,png,jepg,gif");
                    }
                    else {
                        $('.portlet-body .submit_start').hide();
                        $('.portlet-body .submit_end').show();
                        $('.portlet-body .image_start').show();
                        $('.portlet-body .image_end').hide();
                        $('#org_name').val($('#filename_desc').text());
                        var submitData = v_form.serialize();
                        TendaAjax.uploadFile(v_form, submitData,
                        function(result){
                            if(result.error == "成功") {
                                var url = "/temp/file/"  + $('#record_id').val()+ "_" +$('#image_name').val() + "." + fileext;
                                $('#photo_href').attr("href",url);
                                $('#photo_img').attr("src",url);
                                $('.portlet-body .image_start').hide();
                                $('.portlet-body .image_end').show();
                            }
                        },
                        function(result){
                            $('#upload_container .imginfo').removeClass("hide");
                            $('#upload_container .imginfo span').html('<h3 style="color:red;">上传失败</h3>');
                            $('#upload_container .progress').addClass("hide");
                        });  
                    }
				}
			});

            $('#org_name').hide();
            $('.portlet-body .submit_end').hide();

            $('#again_submit').on('click',function(){
                window.location.reload();
            });
		}
	};
}();




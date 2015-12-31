
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
	                
                    image_name: {
                        required: true
                    }
	            },
	            messages:{
                   
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
                        $('#org_name').val($('#filename_desc').text());
                        $('#record_id').val($('#record_id_first').val());
                        var submitData = v_form.serialize();
                        TendaAjax.uploadFile(v_form, submitData,
                        function(result){
                            if(result.error == "成功") {
                                var url = "/temp/file/"  + $('#record_id').val()+ "_" +$('#image_name').val() + "." + fileext;
                                $('#photo_href').attr("href",url);
                                $('#photo_img').attr("src",url);
                                $('#upload_container .imgzoom').removeClass("hide");
                                $('#imginfo span').html('<h3 style="color:green;">上传成功</h3>');
                                $('#upload_container .progress').addClass("hide");
                            }
                        },
                        function(result){
                            
                            $('#upload_container .imginfo span').html('<h3 style="color:red;">上传失败</h3>');
                            $('#upload_container .progress').addClass("hide");
                        });  
                    }
				}
			});

            var v_kf_form = $('.kf-form');
            v_kf_form.validate({

                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",

                rules: {
                    record_id_first: {
                        digits: true,
                        required: true
                    }
                },
                messages:{
                    record_id_first:{
                        digits:"请填写数字",
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
                    
                    var submitData = {}; 
                    submitData.script = "record_query_by_id";
                    submitData.id = $("#record_id_first").val();
                    TendaAjax.getData(submitData, function(result){
                        if(result.error == "成功") {
                            var obj = jQuery.parseJSON(result.user_info.image);
                            var image_str = "";
                            if (Array.isArray(obj)) {
                                if (obj.length != 0) {
                                    for (var i = 0; i < obj.length; i++) {
                                        var path = obj[i];
                                        var arr = obj[i].split('_',2);
                                        var file = arr[1].split('.',2);
                                        image_str += file[0] + "&nbsp&nbsp";
                                    }   
                                }
                            }
                            var html = '<h4 style="color:purple;">姓名： ' + result.user_info.customer_name +' (Id:'+result.user_info.customer_id+')</br>日期： '+ result.user_info.visit_date +'('+ result.user_info.visit_time +')'+'</br>事件：'+ result.user_info.visit_type + '</br>已有图片： '+ image_str +'</h4>';
                            $('#imginfo span').html(html);
                            $('.portlet-body .submit_first').hide();
                            $('.portlet-body .submit_start').show();
                        }               
                    });
                }
            });

            $('#org_name').hide();
            $('#record_id').hide();
            $('.portlet-body .submit_start').hide();
            $('.portlet-body .submit_end').hide();

            $('#again_submit').on('click',function(){
                window.location.reload();
            });
            $('#return_query').on('click',function(){
                window.location.reload();
            });
		}
	};
}();




var RDIndex = function() {

	// var startObj = {};

	// var QObj = {};



	// var startLongAjax = null;

	var startListener = function() {
		//点击开始按钮，开始工作，显示正在接收中，此为长连接，可能10几20分钟没有返回消息
		GLOBAL.RDINDEX.startObj = {};
		//禁用消息发送按钮，禁用接收按钮，隐藏开始按钮
		GLOBAL.RDINDEX.startLongAjax = TendaAjax.getKFData({"name":$(".user .username").html()}, function(result){
			if(result == null){
				startListener();
				return;	
			}


			//有数据后，启用接收按钮，并提示有问题单过来了
			$(".inbox-loading").hide();
			$(".inbox-tip").show();
			$(".rd-show .badge").html('1').show();


			GLOBAL.RDINDEX.startObj = result;
			
		});


		// $(".inbox-loading").hide();
		// $(".inbox-tip").show();
		// $(".rd-show .badge").html('1').show();
		// startObj = {"text":"2"};

	}

	var startShowContent = function()  {
		//点击接收按钮，禁用接收按钮
		
		if(GLOBAL.RDINDEX.startObj.text) {
			GLOBAL.RDINDEX.QObj = {};
			TendaAjax.getData({script:"rd_get_msg", id: GLOBAL.RDINDEX.startObj.text, type:"kefu"}, function(result){

				//初始化订单内容，启用发送按钮，
				if(result.error == GLOBAL.SUCCESS){
					GLOBAL.RDINDEX.QObj = result.rd_list[0];
					$(".rd-send").removeClass('active');
					$(".rd-msg").addClass('active');
					//初始化content
					$(".rd-operated .inbox-content").show();
					initChatContent(GLOBAL.RDINDEX.QObj, "#rd_content");
				}
				
			});
		} else {
			alert("没有拿到开始数据");
			resetStart();
		}
		// $(".rd-send").removeClass('active');
		// $(".rd-msg").addClass('active');
		// //初始化content
		// $(".inbox-content").show();
		// QObj = {
  //               "id" : 1,                                                        //问题单id
  //               "update_time" : "2015-11-9 12:12:00",      //问题单最后更新时间
  //               "status" : "actived",
  //               "user_id" : 1,                                                //用户id，不用管该字段，只是在提交新消息的时候需要用到
  //               "kf_id" : 1,                                                    //客服id，不用管该字段
  //               "contents":[{"type" : 0,                       //0表示客服发的，1表示app发的
  //                             "add_time" : "2015-11-9 09-58-00",    //这条消息发送的事件
  //                              "content" : "tenda的路由器有问题",    //问题内容
  //                              "picture" : ["media/image/avatar1.jpg"]                                                           //图片
  //                            },{"type" : 1,                       //0表示客服发的，1表示app发的
  //                             "add_time" : "2015-11-9 09-58-00",    //这条消息发送的事件
  //                              "content" : "tenda的路由器有问题",    //问题内容
  //                              "picture" : ["media/image/avatar1.jpg"]                                                           //图片
  //                            }]
  //               };
  //       initChatContent(QObj);
	}

	

	var initChatContent = function(obj, container) {
		
		var chatContent = obj.contents;
		var	len = chatContent.length,
			i = 0;
		var chatHtml = "";
		for(; i < len; i++) {
			var tmpCnt = chatContent[i];
			//默认为客户信息
			var typeClass = "in";
			var userImg = "/media/image/avatar1.jpg";
			var userName = "客户";
			var imgDirection = "";
			if(tmpCnt.type == "kefu") {
				typeClass = "out";
				userImg = "/media/image/avatar2.jpg";
				userName = "客服";
				imgDirection = " pull-right";
			}

			chatHtml += '<li class="' + typeClass + '">';
			chatHtml += '<img src="' + userImg + '" alt="" class="avatar">';
			chatHtml += '<div class="message"><span class="arrow"></span>';
			chatHtml += '<a href="#" class="name">' + userName + ' </a>';
			chatHtml += '<span class="datetime"> ' + tmpCnt.add_time + '</span>';
			chatHtml += '<span class="body">' + tmpCnt.content.replace(/\n/g, "<br>") + '<span>';

			if(tmpCnt.file && tmpCnt.file.length > 0) {
				chatHtml += '<div class="img row-fluid"><div class="span6 span2' + imgDirection + '" style="margin-left:15px;">';
				chatHtml += '<a href="#"><img src="' + GLOBAL.domain + tmpCnt.file[0] + '" alt="" style="height:100px; display:block;"></a></div>';
				for(var j = 1, lenJ = tmpCnt.file.length; j < lenJ; j++) {
					chatHtml += '<div class="span6 span2' + imgDirection + '">';
					chatHtml += '<a href="#"><img src="' + GLOBAL.domain + tmpCnt.file[j] + '" alt="" style="height:100px; display:block;"></a></div>';
					
				}
				chatHtml += '</div>';
			}


			chatHtml += '</div></li>';
		}

		$(container + " .chats").html(chatHtml);
	
								
	}

	var resetStart = function () {
		$(".rd-start").show();
		$(".rd-show").hide();
		$(".rd-operated").find(".inbox-loading, .inbox-tip, .inbox-content").hide();
		$(".rd-operated").show();
		$(".rd-search-content").hide();
		$(".rd-msg, .rd-send").removeClass('active');

		GLOBAL.RDINDEX = {};

	}

	var resetFileName = function() {
		var len = $("#file_arr .tag").length;
		if(len > 5) {
			alert("不能上传超过5个文件");
			return;
		}
		
		//删除没有值得file选项
		$("#file_arr [type='file']").each(function(){
			if(this.value == "") {
				$(this).remove();
			}
		});
		$("#file_arr .tag").each(function(i){
			var attr_data = $(this).attr("data");
			var inputfile = $("#file_arr [name='" + attr_data + "']");

			inputfile.attr("name", "file" + i);
			$(this).attr("data", "file" + i);
		});
	}

	var generateTag = function(filename, fileNameAttr){
		var html = "";
		html += '<span class="tag" data="' + fileNameAttr + '"><span>' + filename + '</span><a href="javascript:;" title="删除"> &times;</a>';
		
		$(html).appendTo("#file_arr");

	}

	var showLastStatus = function(obj) {
		if(obj.startLongAjax && obj.startLongAjax.readyState != 4) {
			//表示仍然在进行长连接
			$(".rd-start").hide();
			$(".rd-show, .inbox-loading").show();
		} else {
			if(obj.startObj && typeof obj.startObj.text != "undefined") {
				$(".rd-start").hide();
				$(".rd-show").show();
				if(obj.QObj && typeof obj.QObj.id != "undefined") {
					//显示消息内容

					$(".rd-send").removeClass('active');
					$(".rd-msg").addClass('active');
					//初始化content
					$(".rd-operated .inbox-content").show();
					initChatContent(obj.QObj, "#rd_content");
				} else {
					//显示接收消息提示
					$(".inbox-loading").hide();
					$(".inbox-tip").show();
					$(".rd-show .badge").html('1').show();
				}

			}
		}
	}

	return {
		init: function(){
			showLastStatus(GLOBAL.RDINDEX);
			$("#rd_reply_form").validate({

				errorElement: 'span', //default input error message container
	            errorClass: 'error', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	           
				submitHandler: function(form){
					//根据获取的ID来进行判断，是修改还是添加
					//TODO验证还需要进行权限是否为空的验证
					var QObj = GLOBAL.RDINDEX.QObj;
					var submitData = {};
					
					submitData.id = QObj.id;
					submitData.type = "kefu";
					submitData.user_id = QObj.user_id;

					submitData.content = $("#rd_reply #rd_reply_content").val();
							
					submitData.script = "rd_add";
					resetFileName();
					if($("#file_arr .tag").length > 0) {
						
						$("#rd_upload_modal").modal("show");
						TendaAjax.uploadFile($(form), "#upload_container", submitData, function(result){
							//
							$("#file_arr").html("");
							resetStart();
							$("#rd_upload_modal").modal("hide");
						});
					} else {
						TendaAjax.getData(submitData, function(result){
							//提示成功或失败
							$("#file_arr").html("");
							resetStart();
							//$("#rd_modal").modal("hide");

						});
					}

					

				}
			});


			jQuery(".inbox-nav li").on("click", function(){

				var $this = $(this);

				if($this.hasClass('rd-search')) {

					$(".rd-operated").hide();
					$(".rd-search-content").show();

				} else {
					$(".rd-operated").show();
					$(".rd-search-content").hide();
					if($this.hasClass('rd-start')) {

						$(".rd-start").hide();
						$(".rd-show, .inbox-loading").show();

						startListener();

					} else if($this.hasClass('rd-show')) {

						//判断是否有消息
						var infoTag = $this.find(".badge");
						if(infoTag.html() == "0") {
							return;
						} else {
							$(".inbox-tip").hide();

							infoTag.html('0').hide();
							startShowContent();
						}

					} else {
						$(".rd-msg, .rd-send").removeClass('active');
						$(this).addClass('active');
					}
				}
				

			});

			jQuery("#btn_search").on("click", function(){
				TendaAjax.getData({script:"rd_search", id: $("#search_id").val(), type:"kefu"}, function(result){

					//初始化订单内容，启用发送按钮，
					if(result && result.error == GLOBAL.SUCCESS){
						$(".search-result").html("");
						$(".rd-send").removeClass('active');
						$(".rd-msg").removeClass('active');
						//初始化content
						
						initChatContent(result.rd_list[0], ".rd-search-content");
					} else {
						$(".search-result").html("没有查找到对应的订单内容");
					}
				
				});
			});
			jQuery("#add_file").on("click", function(){
				resetFileName();
				var next_id = $("#file_arr .tag").length;
				var html = "<input type=file class='hide' name='file" + next_id + "'>";
				$("#file_arr").append(html);
				$("#file_arr").find('[name="file' + next_id + '"]')[0].click();

			});

			jQuery("#file_arr").on("change", "[type='file']", function(){
				var file = $(this)[0];
				fileNameAttr = $(this).attr("name");
				
				generateTag(file.files[0].name, fileNameAttr);

				if($("#file_arr input[type='file']").length > 0) {
					$("#file_arr").show();
				} else {
					$("#file_arr").hide();
				}
			});

			jQuery("#file_arr").on("click", ".tag a", function(){
				var tag = $(this).parent();
				var fileName = tag.attr("data");

				var file = $("#file_arr").find("[name='" + fileName + "']");

				file.remove();
				tag.remove();

				resetFileName();
			});

			//图片放大
			jQuery(".rd-index .chats").on("click", ".img img", function(){
				var imgSrc = $(this).attr("src");

				//显示modal, 并填充图片
				$("#rd_img_show").attr("src", imgSrc);
				$("#rd_image_modal").modal("show");
			});
		},
		RDGlobalObj: function() {
			return GLOBAL.RDINDEX;
		}
	}
}();

RDIndex.init();

// http://192.168.0.101/s/i?p=2794c8c146
var bingli = function() {

    var format_visit_type = function(ori) {
        var visit_type_str = "";
        var visit_type_obj = jQuery.parseJSON(ori);
        if (Array.isArray(visit_type_obj)) {
            if (visit_type_obj.length != 0) {
                for (var ii = 0; ii < visit_type_obj.length; ii++) {
                    if (ii != 0) {
                        visit_type_str += "，";
                    }            
                    visit_type_str += visit_type_obj[ii];
                }   
            }
        }
        else
            visit_type_str = ori;

        return visit_type_str;
    }

	return {
		init: function () {
            var p = $("#bingli").attr("p");
            TendaAjax.getData({"script":"query_bingli","p":p}, function(result){
            if(result.error == "成功") {
                if (Array.isArray(result.user_info)) {
                    var obj = result.user_info;
                    var html = "";
                    var ehtml = "";
                    var name ="";
                    var gender="";
                    for (var i = 0; i < obj.length; i++) {
                        name = obj[i].customer_name;
                        gender = obj[i].customer_gender;
                        if (obj[i].status == 1) {
                            html += '<div class="top-news">';
                            html += '<a href="#" class="btn blue" style="background-color: rgb(118, 84, 60)">';
                            html += '<span>'+obj[i].visit_date+'（完成）</span>';
                            html += '<em>';
                            html += '<i class="icon-tags"></i>';
                            html += '<strong>'+format_visit_type(obj[i].visit_type)+'</strong>';
                            html += '</em>';
                            html += '<i class="icon-trophy top-news-icon"></i>';
                            html += '</a>';
                            html += '</div>';
                            html += '<div class="news-blocks">';

                            html += '<h4>就诊记录：</h4> ';
                            html += '<div class="news-block-tags">';
                            if (obj[i].womb_height != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp宫高：'+obj[i].womb_height+'cm</em></br>';
                            if (obj[i].belly_length != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp腹围：'+obj[i].belly_length+'cm</em></br>';
                            if (obj[i].body_weight != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp体重：'+obj[i].body_weight+'kg</em></br>';
                            if (obj[i].blood_pre != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp血压：'+obj[i].blood_pre+'kpa</em></br>';
                            if (obj[i].gest_weeks != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp孕周：'+obj[i].gest_weeks+'</em></br>';
                            if (obj[i].result != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp其他：'+obj[i].result+'</em>';
                            html += '</div>';

                            html += '<h4>医生建议：</h4>';
                            html += '<div class="news-block-tags">';
                            if (obj[i].doctor_advise != "")
                                html += '<em>&nbsp&nbsp&nbsp&nbsp'+obj[i].doctor_advise+'</em>';
                            else
                                html += '<em>&nbsp&nbsp&nbsp&nbsp'+"无"+'</em>';
                            html += '</div>';
     
                            var imgobj = jQuery.parseJSON(obj[i].image);
                            if (Array.isArray(imgobj)) {
                                html += '<h4>图片：</h4>';
                                html += '<div class="imgzoom" style="margin-left:0px;">';
                                html += '<div>';
                                Gallery.init();
                                for (var j = 0; j < imgobj.length; j++) {
                                    var path = imgobj[j];
                                    var arr = imgobj[j].split('_',2);
                                    var file = arr[1].split('.',2);
                                        var str = '<a class="fancybox-button" data-rel="fancybox-button" title="' +file[0]+ '" href="/temp/file/' +path+ '">' + file[0] + '</a>';
                                        // str += '<img class="news-block-img" src="/temp/file/' +path+'" alt="">'
                                        // str += '<div class="zoom"><img class="news-block-img" src="/temp/file/'+path+'" id="photo_img" alt="Photo" /> <div class="zoom-icon"></div></div>';
                                    html += "&nbsp&nbsp&nbsp&nbsp"+str+"</br>";
                                }
                                html += '</div>';
                                html += '</div>';
                            }
                            html += '</div>';       
                        }
                        else {
                            ehtml += '<div class="top-news">';
                            ehtml += '<a href="#" class="btn blue" style="background-color: #9E490C">'; 
                            ehtml += '<span>'+obj[i].visit_date+'（预约）</span>';
                            ehtml += '<em>';
                            ehtml += '<i class="icon-tags"></i>';
                            ehtml += '<strong>'+format_visit_type(obj[i].visit_type)+'</strong>';
                            ehtml += '</em>';
                            ehtml += '<i class="icon- icon-bullhorn top-news-icon"></i>';
                            ehtml += '</a>';
                            ehtml += '</div>';
                        }
                    }

                    if (gender == "男")
                        $("#title").text(name.substring(0, 1)+"帅哥的私密空间");
                    else
                        $("#title").text(name.substring(0, 1)+"美女的私密空间");
                    $("#event").html(ehtml);
                    $("#bingli").html(html);
                }  
                else {
                    
                    $("#title").text("你还没有记录！");
                }            
            }
            else 
                bingli.modalwarn(result.error);;
            });
		},

        modalwarn: function(str) {
            $("#warn_modal_title").html('警告');
            $("#warn_modal_content").html(str);
            $("#warn_modal").modal("show");
        }
	};
}();




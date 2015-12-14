var GLOBAL = {};
GLOBAL.SUCCESS = "成功";
GLOBAL.LOOKDOCTOR = "就诊";
GLOBAL.REVIEWDOCTOR = "复诊";
GLOBAL.CREATE = "建卡全套";
GLOBAL.YUNMM = "孕妈妈";
GLOBAL.PRIVILEGE = 0;

jQuery(document).ready(function() {    

   App.init(); // initlayout and core plugins

   Index.initNavInfo();

   Index.initNavEvent();

});

var Index = function () {


    return {

        //main function to initiate the module
        init: function () {

            App.addResponsiveHandler(function () {
                Index.initCalendar();
                jQuery('.vmaps').each(function () {
                    var map = jQuery(this);
                    map.width(map.parent().width());
                });
            });
        },

        initNavInfo: function () {           

            TendaAjax.getData({"script":"get_privilege"}, function(result){
                if(result.error == GLOBAL.SUCCESS) {
                    GLOBAL.PRIVILEGE = result.privilege;
                } 
                // 以免弹出两次窗口
                // else
                //     alert(result.error);
            });

            TendaAjax.getData({"script":"au_menu"}, function(obj) {
                
                //var obj = $.parseJSON(data);
                if(obj.error != GLOBAL.SUCCESS) {
                    alert(obj.error);
                    return;
                }
                var menu_arr = obj.menu;
                
                var len = menu_arr.length;

                var html = "";

                $(".user .username").html(obj.name);

                //TODO: 现在是没有二级菜单，需要查看是否有二级菜单
                for(var i = 0; i < len; i++) {

                    var first_menu = '<li class="">';
                        //tmp_menu += '<a href="/' + menu_arr[i].url + '">';
                        first_menu += '<a href="javascript:;">';
                        first_menu += '<i class="'+ menu_arr[i].img +'"></i>';

                        if(menu_arr[i].url) {
                            first_menu += '<span class="title" data="' + menu_arr[i].url + '">' + menu_arr[i].title + '</span>';
                        } else {
                            first_menu += '<span class="title">' + menu_arr[i].title + '</span>';
                        }

                        
                        if(menu_arr[i].child) {
                            first_menu += '<span class="arrow"></span>';
                            
                            first_menu += '</a>';

                            var sub_menu = '<ul class="sub-menu">';
                            var child = menu_arr[i].child;
                            for(var j = 0, lenJ = child.length; j < lenJ; j++) {

                                sub_menu += '<li><a href="javascript:;" ';
                                if(child[j].url) {
                                    sub_menu += 'data="' + child[j].url + '">';
                                } else {
                                    sub_menu += '>';
                                }
                                sub_menu += child[j].title + '</a></li>'
                            }

                            sub_menu += '</ul>';

                            first_menu = first_menu + sub_menu;

                        } else {

                            first_menu += '</a>';
                        }
                        

                    first_menu += '</li>';
                        
                        
                    html += first_menu;
                }
                
                $(".page-sidebar-menu li:gt(1)").remove();

                $(".page-sidebar-menu").append(html);

                var firstNav = "";

                if($(".page-sidebar-menu>li:eq(2)>a").next().hasClass("sub-menu")) {
                    firstNav = ".page-sidebar-menu>li:eq(2) .sub-menu a";
                } else {
                    firstNav = ".page-sidebar-menu>li:eq(2)>a";
                }
                Index.showSubMenu(firstNav);
            });

            jQuery("#loginout").click(function(){
                var data = {};
                TendaAjax.getLoginout(data,function(result){
                    if(result.error == GLOBAL.SUCCESS) {
                        window.location = "/html/login";
                    }
                    else 
                        alert(result.error);
                 });
            });
        },

        initNavEvent: function () {

            $(".page-sidebar").on("click", ".page-sidebar-menu>li:gt(1)>a", Index.showSubMenu);

            $(".page-sidebar-menu").on("click", ".sub-menu li>a", Index.showSubMenu);

            $(".navbar .user .dropdown-menu li").on("click", function(){
                var script = $(this).attr("data");
               
                if(script !== "") {

                    TendaAjax.getHtml({"page":script + ".html"}, function(data){

                        $(".page-content .container-fluid").html(data);
                    });  
                }
            });

        },

        showSubMenu: function (event) {

            //查看当前有无url,分一级菜单和2级菜单
            var $this = typeof event == "string" ? $(event) : $(this);
            
            var script = "";
            var parent_ul = $this.parent().parent();
            var brother_ul = $this.next();
            //一级菜单，且没有二级目录
            if(parent_ul.hasClass("sub-menu") == false && brother_ul.hasClass("sub-menu") == false) {
               
                $this.parents(".page-sidebar-menu").find("li").removeClass("active");
                $this.parent().addClass("active");

                var parent_li = $(this).parent();

                if($this.children("span").hasClass('selected') == false){

                    $this.parents(".page-sidebar-menu").find(".selected").remove();

                    $this.append('<span class="selected"></span>');

                }
                script = $this.children(".title").attr("data");

                //TODO 跳转

            } else if (parent_ul.hasClass("sub-menu") == true && brother_ul.hasClass("sub-menu") == false) {
                //二级菜单
                $this.parents(".page-sidebar-menu").find("li").removeClass("active");
                var parents_li = $this.parent().parent().parent();
                var parent_li = $this.parent(); 
                parent_li.addClass("active");

                parents_li.addClass("active");

                if(parents_li.children("a").find("span").hasClass("selected") == false){

                    $this.parents(".page-sidebar-menu").find(".selected").remove();

                    parents_li.children("a").append('<span class="selected"></span>');
                    
                    
                } 
                script = $this.attr("data"); 
            }
            
            if(script !== "") {

                TendaAjax.getHtml({"page":script + ".html"}, function(data){

                    $(".page-content .container-fluid").html(data);
                });     
            }

        }

    };

}();
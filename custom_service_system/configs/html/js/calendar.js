var Calendar = function () {

    return {
        //main function to initiate the module

        init: function () {

            

            var submitData = {};
            submitData.script = "event_get_list";
            TendaAjax.getData(submitData, function(result){
                var arr = [];
                for (i = 0; i < result.user_event.length; i++) {
                    var object = {};
                    var datearr = result.user_event[i].visit_date.split("-",3);
                    var visit_type_str = "";
                    if (result.user_event[i].visit_type.length > 20)
                        visit_type_str = result.user_event[i].visit_type.substr(0,20)+'..';
                    else
                        visit_type_str = result.user_event[i].visit_type;
                    object.title = result.user_event[i].customer_name + visit_type_str + result.user_event[i].visit_doctor_name;
                    var timearr = result.user_event[i].visit_time.split(":",2); 
                    object.start = new Date(parseInt(datearr[0]),parseInt(datearr[1])-1,parseInt(datearr[2]),parseInt(timearr[0]),parseInt(timearr[1]));
                    object.end = new Date(parseInt(datearr[0]),parseInt(datearr[1])-1,parseInt(datearr[2]),parseInt(timearr[0]),parseInt(timearr[1])+30);
                    object.allDay = false;    
                    var obj = jQuery.parseJSON(result.user_event[i].visit_type);
                    if (Array.isArray(obj)) {
                        var flag = false;
                        for (var j = 0; j < obj.length; j++) {                       
                            if (obj[j] == GLOBAL.CREATE || obj[j] == GLOBAL.LOOKDOCTOR ||
                                obj[j] == GLOBAL.REVIEWDOCTOR) {
                                flag = true;
                                break;
                            }
                        };
                        if (flag == true) {
                            if (result.user_event[i].order_success)
                                object.backgroundColor = App.getLayoutColorCode('green');
                            else
                                object.backgroundColor = App.getLayoutColorCode('red');     
                        }
                        else {
                            object.backgroundColor = App.getLayoutColorCode('green');   
                        }                                  
                    }
                    else {
                        alert("error");
                    }
                    object.description = "</br>姓名: " + result.user_event[i].customer_name;
                    object.description += "</br>项目: " + result.user_event[i].visit_type;
                    if (result.user_event[i].visit_doctor_name != '') {
                        object.description +=  "</br>医生: " + result.user_event[i].visit_doctor_name;
                    }
                    if (result.user_event[i].visit_address != '') {
                        object.description +=  "</br>地点: " + result.user_event[i].visit_address;
                    }
                    if (result.user_event[i].remarks != '') {
                        object.description +=  "</br>备注: " + result.user_event[i].remarks;
                    }
                    // object.url = "http://www.baidu.com";
                    arr[i] = object;  
                }
             
                App.addResponsiveHandler(function () {
                    Calendar.initCalendar(arr);
                });
                 
                $('.page-sidebar .sidebar-toggler').click(function () {
                    Calendar.initCalendar(arr);
                });
                
                Calendar.initCalendar(arr);
            });  
        },

        initCalendar: function (arr) {
            
            if (!jQuery().fullCalendar) {
                return;
            }

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            var h = {};

            if (App.isRTL()) {
                 if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        right: 'title, prev, next',
                        center: '',
                        right: 'agendaDay, agendaWeek, month, today'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        right: 'title',
                        center: '',
                        left: 'agendaDay, agendaWeek, month, today, prev,next'
                    };
                }                
            } else {
                 if ($('#calendar').parents(".portlet").width() <= 720) {
                    $('#calendar').addClass("mobile");
                    h = {
                        left: 'title, prev, next',
                        center: '',
                        right: 'today,month,agendaWeek,agendaDay'
                    };
                } else {
                    $('#calendar').removeClass("mobile");
                    h = {
                        left: 'title',
                        center: '',
                        right: 'prev,next,today,month,agendaWeek,agendaDay'
                    };
                }
            }
           
            var initDrag = function (el) {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim(el.text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                el.data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                el.draggable({
                    zIndex: 999,
                    revert: true, // will cause the event to go back to its
                    revertDuration: 0 //  original position after the drag
                });
            }

            var addEvent = function (title,ic) {
                title = title.length == 0 ? "Untitled Event" : title;
                var str = '<div class="external-event label" '+ ic + '>' + title + '</div>'
                var html = $(str);
                jQuery('#event_box').append(html);
                initDrag(html);
            }

            $('#external-events div.external-event').each(function () {
                initDrag($(this))
            });

            $('#event_box').html("");
            var submitData = {};
            submitData.script = "get_no_event_user_list";
            TendaAjax.getData(submitData, function(result){
                for(var i = 0; i<result.user_list.length; i++) {
                    var str = result.user_list[i].name;
                    var color;
                    if (result.user_list[i].vip == 1) {
                        // str = str + "(会员)";
                        var color = 'style="background-color:#ff0000"';
                    }
                    else {
                        // str = str + "(预签)"
                        var color = 'style="background-color:#852b99"';
                    }                    
                    addEvent(str,color);//icon-star-empty
                }
            }); 

            $('#calendar').fullCalendar('destroy'); // destroy the calendar
            $('#calendar').fullCalendar({ //re-initialize the calendar
                header: h,
                //slotMinutes: 15,
                editable: false,
                droppable: false, // this allows things to be dropped onto the calendar !!!
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],    
                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],    
                dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],    
                dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],    
                today: ["今天"],  
                firstDay: 0,    
                buttonText: {    
                    today: '今天',    
                    month: '月',    
                    week: '周',    
                    day: '日',    
                    prev: '向前',    
                    next: '向后'    
                },   
                allDaySlot:true,  
                selectable: true,  
                selectHelper: true,   
                aspectRatio:1.6,
                eventMouseover: function(calEvent, jsEvent, view) {
                    var fstart  = $.fullCalendar.formatDate(calEvent.start, "HH:mm");//yyyy/MM/dd    
                    $(this).attr('data-original-title', "时间: " + fstart + calEvent.description);          
                    $(this).tooltip({
                        html:true,
                        placement:'bottom'
                        // trigger:'click'
                    });
                    $(this).tooltip('show');
                },
                eventMouseout: function(calEvent, jsEvent, view) {   
                    $(this).tooltip('hide');
                },
                // dayClick: function (date, allDay, jsEvent, view) {
                //     alert("3");
                // },     
                // eventClick: function(calEvent, jsEvent, view) {
                //      alert(3)
                // },
                drop: function (date, allDay) { // this function is called when something is dropped
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }
                },
                events: arr              
            });

        }

    };

}();

// Calendar.init();

// var layoutColorCodes = {
//     'blue': '#4b8df8',
//     'red': '#e02222',
//     'green': '#35aa47',
//     'purple': '#852b99',
//     'grey': '#555555',
//     'light-grey': '#fafafa',
//     'yellow': '#ffb848'
// };
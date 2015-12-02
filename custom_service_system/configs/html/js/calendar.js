var Calendar = function () {

    return {
        //main function to initiate the module

        init: function () {
            var submitData = {};
            submitData.script = "event_get_all";
            TendaAjax.getData(submitData, function(result){
                var arr = [];
                for (i = 0; i < result.user_event.length; i++) {
                    var object = {};
                    var date = result.user_event[i].visit_date.split(" ",1); 
                    var datearr = date[0].split("-",3);
                    object.title = result.user_event[i].customer_name + "(" + result.user_event[i].visit_type + ")" + "[" + result.user_event[i].visit_doctor_name + "]";
                    var timearr = result.user_event[i].visit_time.split(":",2); 
                    object.start = new Date(parseInt(datearr[0]),parseInt(datearr[1])-1,parseInt(datearr[2]),parseInt(timearr[0]),parseInt(timearr[1]));
                    object.end = new Date(parseInt(datearr[0]),parseInt(datearr[1])-1,parseInt(datearr[2]),parseInt(timearr[0]),parseInt(timearr[1])+30);
                    object.allDay = false;
                    if (result.user_event[i].visit_type == "看医生" || result.user_event[i].visit_type == "建卡") {
                        if (result.user_event[i].order_success)
                            object.backgroundColor = '#35aa47';//App.getLayoutColorCode('green');
                        else
                            object.backgroundColor = '#e02222';//App.getLayoutColorCode('red');
                    }
                    else {
                        object.backgroundColor = App.getLayoutColorCode('green');
                    }
                    object.description = result.user_event[i].visit_type;
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

            // $('#event_add').unbind('click').click(function () {
            //     var title = $('#event_title').val();
            //     addEvent(title);
            // });

            $('#event_box').html("");
            var submitData = {};
            submitData.script = "get_no_event_user";
            TendaAjax.getData(submitData, function(result){
                $('#event_box').html("");
                for(var i = 0; i<result.user_list.length; i++) {
                    var str = result.user_list[i].name;
                    var color = 'style="background-color:#852b99"';
                    if (result.user_list[i].vip == 1) {
                        str = str + "(会员)";
                        // color = 'style="background-color:#ffb848"';
                    }
                    else {
                        str = str + "(预签)" 
                    }
                    // if (result.user_list[i].visit_date) {
                    //     // var time = result.user_list[i].visit_date.split(" ",1);
                    //     str = str + "[过期]"
                    // }
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
                // events: [{
                //     title: 'All Day Event',
                //     start: new Date(y, m, 1),
                //     backgroundColor: Metronic.getBrandColor('yellow')
                // }, {
                //     title: 'Long Event',
                //     start: new Date(y, m, d - 5),
                //     end: new Date(y, m, d - 2),
                //     backgroundColor: Metronic.getBrandColor('green')
                // }, {
                //     title: 'Repeating Event',
                //     start: new Date(y, m, d - 3, 16, 0),
                //     allDay: false,
                //     backgroundColor: Metronic.getBrandColor('red')
                // }, {
                //     title: 'Repeating Event',
                //     start: new Date(y, m, d + 4, 16, 0),
                //     allDay: false,
                //     backgroundColor: Metronic.getBrandColor('green')
                // }, {
                //     title: 'Meeting',
                //     start: new Date(y, m, d, 10, 30),
                //     allDay: false,
                // }, {
                //     title: 'Lunch',
                //     start: new Date(y, m, d, 12, 0),
                //     end: new Date(y, m, d, 14, 0),
                //     backgroundColor: Metronic.getBrandColor('grey'),
                //     allDay: false,
                // }, {
                //     title: 'Birthday Party',
                //     start: new Date(y, m, d + 1, 19, 0),
                //     end: new Date(y, m, d + 1, 22, 30),
                //     backgroundColor: Metronic.getBrandColor('purple'),
                //     allDay: false,
                // }, {
                //     title: 'Click for Google',
                //     start: new Date(y, m, 28),
                //     end: new Date(y, m, 29),
                //     backgroundColor: Metronic.getBrandColor('yellow'),
                //     url: 'http://google.com/',
                // }]
            });

        }

    };

}();

Calendar.init();

    // var layoutColorCodes = {
    //     'blue': '#4b8df8',
    //     'red': '#e02222',
    //     'green': '#35aa47',
    //     'purple': '#852b99',
    //     'grey': '#555555',
    //     'light-grey': '#fafafa',
    //     'yellow': '#ffb848'
    // };
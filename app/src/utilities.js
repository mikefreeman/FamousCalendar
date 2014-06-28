//utilities

define(function(require, exports, module){

	 //Retrieve _calendar for date from local storage
	var _calendar = JSON.parse(window.localStorage.getItem('calendar')) || {};
	_calendar.repeat = _calendar.repeat || {};
	_calendar.repeat['daily'] = _calendar.repeat['daily'] || {};
	_calendar.repeat['weekly'] = _calendar.repeat['weekly'] || {};
	_calendar.repeat['monthly'] = _calendar.repeat['monthly'] || {};
	_calendar.repeat['yearly'] = _calendar.repeat['yearly'] || {};

	var Utilities = {};


	Utilities.saveEvent = function saveEvent(newEvent) {

	  var eventDate = newEvent.date;
	  var dateObj = new Date(newEvent.date);
	  var recurrence = newEvent.repeat;

	  // //Check if any _calendar exist
	  // if(_calendar === null){
	  //   //Initialize _calendar to object
	  //   _calendar = {};
	  // }else{

	  //   //Parse _calendar array from string
	  //   _calendar = JSON.parse(_calendar);
	  // }


	  //Object schema:
	  //{date: eventToBeSaved.date, 
	  // start: eventToBeSaved.start, 
	  // end: eventEndTime, 
	  // repeat: eventRepetition,
	  // title: eventTitle, 
	  // description: eventBody};
	  if(recurrence !== 'false'){
	  	if(recurrence === 'daily'){
	  		
	  		_calendar.repeat['daily'].push(newEvent);
	  	}else if(recurrence === 'weekly'){
	  		
	  		_calendar.repeat['weekly'][dateObj.getDay()] = _calendar.repeat['weekly'][dateObj.getDay()] || [];
	  		_calendar.repeat['weekly'][dateObj.getDay()].push(newEvent);
	  	}else if(recurrence === 'monthly'){
	  		
	  		_calendar.repeat[recurrence][eventDate.slice(-2)] = _calendar.repeat.recurrence[eventDate.slice(-2)] || [];
	  		_calendar.repeat[recurrence][eventDate.slice(-2)].push(newEvent);
	  	}else if(recurrence === 'yearly'){
	  		_calendar.repeat[recurrence][eventDate.slice(5)] = _calendar.repeat.recurrence[eventDate.slice(5)] || [];
	  		_calendar.repeat[recurrence][eventDate.slice(5)].push(newEvent);
	  	}
	  }

	  _calendar[eventDate] = _calendar[eventDate] || [];
	  //add new event to _calendar array
	  _calendar[eventDate].push(newEvent);

	  //Store updated _calendar array in local storage
	  window.localStorage.setItem('calendar', JSON.stringify(_calendar));
	};

	Utilities.getCalendar = function(){
		return _calendar;
	}

	Utilities.hasEvents = function hasEvents(date){
		var dailyEvents = _calendar.repeat.daily || [];
		var weeklyEvents = _calendar.repeat.weekly[new Date(date).getDay()] || [];
		var monthlyEvents = _calendar.repeat.monthly[date.slice(-2)] || [];
		var yearlyEvents = _calendar.repeat.yearly[date.slice(5)] || [];
		if(_calendar[date].concat(dailyEvents, weeklyEvents, monthlyEvents, yearlyEvents) !== undefined){
			return true;
		}
		return false;
	}

	Utilities.getEvents = function getEvents(date){
      var result = [];
      var dailyEvents = _calendar.repeat.daily || [];
      var weeklyEvents = _calendar.repeat.weekly[new Date(date).getDay()] || [];
      var monthlyEvents = _calendar.repeat.monthly[date.slice(-2)] || [];
      var yearlyEvents = _calendar.repeat.yearly[date.slice(5)] || [];
      //console.log(_calendar);
	  //returns _calendar array for given date
	  return result.concat(_calendar[date], dailyEvents, weeklyEvents, monthlyEvents, yearlyEvents);

	};
  
  var testing = true;
  if (testing) {
    for (var y = 2010; y < 2020; y++) {
      for (var m = 1; m < 13; m++) {
        for (var d = 1; d < 29; d++) {
          var day = (d < 10) ? '0'+d : ''+d;
          var mon = (m < 10) ? '0'+m : ''+m;
          var date = '' + y + '-' + mon + '-' + day;
          var start = Math.floor((Math.random() * 4) + 8);
          var end = Math.floor((Math.random() * 2) + 1) + start;
          start = '' + ((start < 10) ? '0' + start : '' + start) + ':00';
          end = '' + ((end < 10) ? '0' + end : '' + end) + ':00';
          
          _calendar[date] = [{
            'date': date,
            'start': start,
            'end' : end,
            'title': 'Event for ' + date,
            'description': ''
          }];
        }
      }
    }
    
    _calendar['repeat'] = {};
  }

	module.exports = Utilities;
});
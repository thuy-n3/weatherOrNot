console.log('hello weather')

var router = function() {
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		viewType = routeParts[0],
		lat = routeParts[1],
		lng = routeParts[2]

	if (route === "") { //default route
		handleDefault()
	}

	if (viewType === "current") {
		handleCurrentView(lat,lng)
	}
	if (viewType === "daily") {
		handleDailyView(lat,lng)
	}
	if (viewType === "hourly") {
		handleHourlyView(lat,lng)
	}
}


var WeatherRouter = Backbone.Router.extend({

	routes: {
		"current/:lat/:lng": handleCurrentView,
		"daily/:lat/:lng": handleDailyView,
		"hourly/:lat/:lng": handleHourlyView,
	}

})

var changeView = function(clickEvent) {
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		lat = routeParts[1],
		lng = routeParts[2]

	var buttonEl = clickEvent.target,
		newView = buttonEl.value
	location.hash = newView + "/" + lat + "/" + lng
}


var handleCurrentView = function(lat,lng) {
	var promise = makeWeatherPromise(lat,lng)
	promise.then(renderCurrentWeather)
}

var handleDailyView = function(lat,lng) {
	var promise = makeWeatherPromise(lat,lng)
	promise.then(renderDailyWeather)
}

var handleDefault = function() {
	// get current lat long, write into the route
	var successCallback = function(positionObject) {
		var lat = positionObject.coords.latitude 
		var lng = positionObject.coords.longitude 
		location.hash = "current/" + lat + "/" + lng
	}
	var errorCallback = function(error) {
		console.log(error)
	}
	window.navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
}

var handleHourlyView = function(lat,lng) {
	var promise = makeWeatherPromise(lat,lng)
	promise.then(renderHourlyWeather)	
}

var makeWeatherPromise = function(lat,lng) {
	var url = baseUrl + "/" + apiKey + "/" + lat + "," + lng + "?callback=?"
	var promise = $.getJSON(url)
	return promise
}

var renderCurrentWeather = function(jsonData) {
	container.innerHTML = '<p class="temp">' + jsonData.currently.temperature.toPrecision(2) + '&deg;</p>'
}

var renderDailyWeather = function(jsonData) {
	var htmlString = ''
	var daysArray = jsonData.daily.data
	for (var i = 0; i < daysArray.length; i ++) {
		var dayObject = daysArray[i]
		htmlString += '<div class="day">'
		htmlString += '<p class="max">' + dayObject.temperatureMax.toPrecision(2) + '&deg;</p>'
		htmlString += '<p class="min">' + dayObject.temperatureMin.toPrecision(2) + '&deg;</p>'
		htmlString += '</div>'
	}
	container.innerHTML = htmlString
}


var renderHourlyWeather = function(jsonData) {
	var htmlString = ''
	var hoursArray = jsonData.hourly.data
	for (var i = 0; i < 24; i ++) {
		var hourObject = hoursArray[i]
		htmlString += '<div class="hour">'
		htmlString += '<p class="hourTemp">' + hourObject.temperature.toPrecision(2) + '&deg;</p>'
		htmlString += '</div>'
	}
	container.innerHTML = htmlString
}


// https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

var apiKey = "976151b2336a5cba8b9ad9404c7cc25e"
var baseUrl = "https://api.forecast.io/forecast"
var container = document.querySelector("#container")
var buttonsContainer = document.querySelector("#buttons")

window.addEventListener('hashchange',router)
buttonsContainer.addEventListener('click',changeView)
router()
// navigator.geolocation.getCurrentPosition(successCallback,errorCallback)



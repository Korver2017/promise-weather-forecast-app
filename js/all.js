// jQuery UI Auto Complete
var woeidList = {
	'台北': 2306179,
	'高雄': 2306180,
	'台中': 2306181,
	'台南': 2306182,
	'花蓮': 2306187,
	'新北': 2306211
};
var woeidListKey = Object.keys(woeidList);
$(document).ready(function () {
	$('.form-control').autocomplete({
		source: woeidListKey
	});
	$('.form-control').autocomplete("close");
});
// Vanilla JS
var formControl = document.querySelector('.form-control');
formControl.addEventListener('keydown', function (e) {
	if (e.key == 'Enter') {
		check();
	}
}, false);

var thumbnail = document.querySelector('.thumbnail');

function check() {
	thumbnail.style.display = 'block';
	var userValue = formControl.value;
	var len = woeidListKey.length;
	var info = document.querySelector('.dailyInfo');
	document.querySelector('h2').innerHTML = '查詢結果';
	console.log(xhr);
	for (var i = 0; i < len; i++) {
		if (userValue == woeidListKey[i]) {
			var value = woeidList[woeidListKey[i]];
	}

	var data = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20('
							+value+')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	var xhr = new XMLHttpRequest();
	xhr.open('get', data, true);
	xhr.send(null);
	xhr.onload = function(){
		var json = JSON.parse(xhr.responseText);
		var city = json.query.results.channel.location.city;
		var str = '';
		var image = '';
		var forecast = json.query.results.channel.item.forecast
		var forecastLen = forecast.length;
		info.innerHTML = '<h3>' + city + '</h3>';
		for (var i = 0; i < forecastLen; i++) {
			switch (forecast[i].text){
				case 'Partly Cloudy':
					image = '<img src="./img/partly_cloudy.svg">'
					break;
				case 'Thunderstorms':
					image = '<img src="./img/storm.svg">'
				case 'Scattered Thunderstorms':
					image = '<img src="./img/storm.svg">'
					break;
				case 'Mostly Cloudy':
					image = '<img src="./img/mostly_cloudy.svg">'
					break;
				case 'Scattered Showers':
				case 'Showers':
				case 'Rain':
					image = '<img src="./img/showers.svg">'
					break;
				default:
					image = '<img src="./img/no_image.svg">';
			}
			str += '<p>' + forecast[i].date + ' ' + forecast[i].day
			+'<br>'+'High: '+forecast[i].high+'°F'
			+'<br>'+'Low: '+forecast[i].low+'°F'
			+'<br>'+forecast[i].text+image+'</p>';
		}
		info.innerHTML = str+'<div class="clearfix"></div>';
}

var submit = document.querySelector('.btn');
submit.addEventListener('click', check, false);

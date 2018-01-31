var woeidList = {
	'台北': 2306179,
	'高雄': 2306180,
	'台中': 2306181,
	'台南': 2306182,
	'花蓮': 2306187,
	'新北': 2306211
};
var woeidListKey = Object.keys(woeidList);
$(document).ready(function(){
	$('.form-control').autocomplete({
		source: woeidListKey
	});
	$('.form-control').autocomplete("close");
});

document.querySelector('.form-control').addEventListener('keydown', function(e){
	if(e.key === 'Enter'){
		document.querySelector('.form-control').onclick = check();
	}
}, false);

function check(){
	document.querySelector('.thumbnail').style.display='block';
	var userValue = document.querySelector('.form-control').value;
	var len = woeidListKey.length;
	var x = '查詢結果';
	document.querySelector('h2').innerHTML=x;
	for(var i = 0; i < len; i ++){
		if(userValue === woeidListKey[i]){
			var value = woeidList[woeidListKey[i]];
		}else{
			document.querySelector('.dailyInfo').innerHTML='<h3>Sorry, not found.</h3>';
		}
	}
	var data = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20('+value+')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	var xhr = new XMLHttpRequest();
	xhr.open('get', data, true);
	xhr.send(null);
	xhr.onload = function(){
		var json = JSON.parse(xhr.responseText);
		var city = json.query.results.channel.location.city;
		document.querySelector('.dailyInfo').innerHTML='<h3>'+city+'</h3>';
		var str='';
		var image = '';
		var forecast = json.query.results.channel.item.forecast
		for(var i = 0; i < forecast.length; i ++){
			if(forecast[i].text == 'Partly Cloudy'){
				image = '<img src="./img/partly_cloudy.svg">';
			}else if(forecast[i].text == 'Thunderstorms'){
				image = '<img src="./img/storm.svg">';
			}else if(forecast[i].text == 'Scattered Thunderstorms'){
				image = '<img src="./img/storm.svg">';
			}else if(forecast[i].text == 'Mostly Cloudy'){
				image = '<img src="./img/mostly_cloudy.svg">';
			}else if(forecast[i].text == 'Scattered Showers'){
				image = '<img src="./img/showers.svg">';
			}else if(forecast[i].text == 'Showers'){
				image = '<img src="./img/showers.svg">';
			}else if(forecast[i].text == 'Rain'){
				image = '<img src="./img/showers.svg">';
			}else{
				image = '<img src="./img/no_image.svg">';
			}
			str +='<p>'+forecast[i].date+' '+forecast[i].day
			+'<br>'+'High: '+forecast[i].high+'°F'
			+'<br>'+'Low: '+forecast[i].low+'°F'
			+'<br>'+forecast[i].text+image+'</p>';
		}
		document.querySelector('.dailyInfo').innerHTML=str+'<div class="clearfix"></div>';
	}
}

var submit = document.querySelector('.btn');
submit.addEventListener('click', check, false);

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
let info = document.querySelector('.dailyInfo');
let formControl = document.querySelector('.form-control');
formControl.addEventListener('keydown', (e) => {
	if (e.key == 'Enter') {
		info.innerHTML = '';
		let userValue = formControl.value;
		callAPI(userValue).then(() => {
			console.log('Success!')
		}).catch(() => {
			console.log('Error!')
			info.innerHTML = 'Sorry! Not found.';
		});
	};
}, false);

var submit = document.querySelector('.btn');
submit.addEventListener('click', () => {
	info.innerHTML = '';
	let userValue = formControl.value;
	callAPI(userValue).then(() => {
		console.log('Success Click');
	}).catch(() => {
		console.log('Error Click');
		info.innerHTML = 'Sorry! Not found.'
	});
}, false);

let thumbnail = document.querySelector('.thumbnail');
let callAPI = (location) => {
	return new Promise((resolve, reject) => {
		thumbnail.style.display = 'block';
		let len = woeidListKey.length;
		document.querySelector('h2').innerHTML = '查詢結果';
		let result = woeidListKey.filter((key) => {
			return key == location;
		});
		console.log(result);
		if (result.length) {
			let value = woeidList[result];
			let data = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(' +
				value + ')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
			let xhr = new XMLHttpRequest();
			xhr.open('get', data, true);
			xhr.send(null);
			xhr.onload = function () {
				let json = JSON.parse(xhr.responseText);
				let city = json.query.results.channel.location.city;
				let str = '';
				let image = '';
				let forecast = json.query.results.channel.item.forecast
				let forecastLen = forecast.length;
				for (let i = 0; i < forecastLen; i++) {
					switch (forecast[i].text) {
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
					str += '<p>' + forecast[i].date + ' ' + forecast[i].day +
						'<br>' + 'High: ' + forecast[i].high + '°F' +
						'<br>' + 'Low: ' + forecast[i].low + '°F' +
						'<br>' + forecast[i].text + image + '</p>';
				};
				info.innerHTML = str + '<div class="clearfix"></div>';
			};
			resolve();
		} else {
			reject();
		}
	});
};

// jQuery UI Auto Complete
const woeidList = {
	'台北': 2306179,
	'高雄': 2306180,
	'台中': 2306181,
	'台南': 2306182,
	'花蓮': 2306187,
	'新北': 2306211
};
const woeidListKey = Object.keys(woeidList);
$(document).ready(function () {
	$('.form-control').autocomplete({
		source: woeidListKey
	});
	$('.form-control').autocomplete("close");
});
// Vanilla JS
let info = document.querySelector('.dailyInfo');
let callAPI = (location) => {
	return new Promise((resolve, reject) => {
		let result = woeidListKey.filter((key) => {
			return key === location;
		});
		if (result.length) {
			let value = woeidList[result];
			let data = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(${value})&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
			let xhr = new XMLHttpRequest();
			xhr.open('get', data, true);
			xhr.send(null);
			xhr.onload = function () {
				resolve(xhr);
			}
		} else {
			reject('Failed...');
		};
	})
};

let formControl = document.querySelector('.form-control');
formControl.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		let thumbnail = document.querySelector('.thumbnail');
		thumbnail.style.display = 'block';
		document.querySelector('h2').innerHTML = '查詢結果';
		info.innerHTML = '';
		let userValue = formControl.value;
		callAPI(userValue).then((res) => {
			console.log(res, 123);
			let json = JSON.parse(res.responseText);
			let str = '';
			let image = '';
			let forecast = json.query.results.channel.item.forecast;
			for (let i = 0; i <= 8; i++) {
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
				str += `<p>${forecast[i].date} ${forecast[i].day}<br>High: ${forecast[i].high}°F<br>Low: ${forecast[i].low}°F<br>${forecast[i].text}${image}</p>`;
			};
			info.innerHTML = str + '<div class="clearfix"></div>';
		}).catch((err) => {
			console.log(err);
			info.innerHTML = 'Sorry! Not found.';
		});
	};
});
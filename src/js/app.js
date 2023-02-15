const container = document.querySelector('.container');
const inputText = container.querySelector('.input-text');
const postsList = container.querySelector('.posts-list');
const errorModal = container.querySelector('.error-modal');
const form = container.querySelector('.form');
const inputLocation = container.querySelector('.input-location');
const cancelButton = container.querySelector('.cancel-button');

const now = new Date();
const year = now.getFullYear();
const month = showCorrectDate(now.getMonth() + 1);
const day = showCorrectDate(now.getDate());
const hours = showCorrectDate(now.getHours());
const minutes = showCorrectDate(now.getMinutes());

let latitude;
let longitude;

const posts = [];

function save(arr) {
	localStorage.editorData = JSON.stringify({
		arr,
	});
}

function restore() {
	const json = localStorage.editorData;

	if (!json) {
		return;
	}

	const data = JSON.parse(json);

	for (let i = 0; i < data.arr.length; i++) {

		const li = document.createElement('li');
		li.classList.add('post');
		li.innerHTML = `
		<div class="post-header">
			<span class="date">${data.arr[i].day}.${data.arr[i].month}.${data.arr[i].year}</span>
			<span class="time">${data.arr[i].hours}:${data.arr[i].minutes}</span>
		</div>
		<p>${data.arr[i].text}</p>
		<span class="geolocation">[${data.arr[i].latitude}, ${data.arr[i].longitude}]</span>
		`;

		postsList.prepend(li);

		posts.push(data.arr[i]);
	}
}

window.onload = function() {
	restore();
};

navigator.geolocation.getCurrentPosition(
	function (position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
	},
	function () {
		errorModal.classList.add('showed');

		cancelButton.addEventListener('click', () => {
			errorModal.classList.remove('showed');
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (inputLocation.value !== '') {
				getUserGeolocation();

				checkUserGeolocation(latitude, longitude);
			}
		});
	},
);

document.addEventListener('keyup', (e) => {

	if (e.key === 'Enter' && inputText.value !== '') {

		const li = document.createElement('li');
		li.classList.add('post');
		li.innerHTML = `
		<div class="post-header">
			<span class="date">${day}.${month}.${year}</span>
			<span class="time">${hours}:${minutes}</span>
		</div>
		<p>${inputText.value}</p>
		<span class="geolocation">[${latitude}, ${longitude}]</span>
		`;

		postsList.prepend(li);

		posts.push({
			day,
			month,
			year,
			hours,
			minutes,
			text: inputText.value,
			latitude,
			longitude,
		});

		save(posts);

		inputText.value = '';
	}
});

function showCorrectDate(number) {
	if (number < 10) {
		return `0${number}`;
	}

	return number;
}

function getUserGeolocation() {
	const coords = inputLocation.value.split(',');

	latitude = coords[0].trim();
	longitude = coords[1].trim();

	if (latitude.startsWith('[')) {
		latitude = latitude.substring(1);
	}

	if (longitude.endsWith(']')) {
		longitude = longitude.slice(0, -1);
	}

}

function checkUserGeolocation(lati, longi) {
	console.log(lati);
	console.log(longi);

	const regExp = /[A-Za-z]\S*$/;

	if (regExp.test(lati) || regExp.test(longi)) {
		console.log('Ошибка!');

		inputLocation.validity.valid = false;
	}

	console.dir(inputLocation.validity);
	console.dir(inputLocation.validity.valid);
}

function saveOptions() {
	var tempUnit = document.getElementById('temp-unit').value;
	var hideCalendar = document.getElementById('hide-calendar').checked;
	var hideWeather = document.getElementById('hide-weather').checked;
	var hideTopSites = document.getElementById('hide-top-sites').checked;
	var status = document.getElementById('status');

	chrome.storage.sync.set({
		optsTempUnit: tempUnit,
		optsHideCalendar: hideCalendar,
		optsHideWeather: hideWeather,
		optsHideTopSites: hideTopSites
	}, function() {
		status.textContent = 'Your options have been saved.';

		setTimeout(function() {
			status.textContent = '';
		}, 2000);
	});
}

function restoreOptions() {
	var tempUnit = document.getElementById('temp-unit');
	var hideCalendar = document.getElementById('hide-calendar');
	var hideWeather = document.getElementById('hide-weather');
	var hideTopSites = document.getElementById('hide-top-sites');

	chrome.storage.sync.get({
		optsTempUnit: '',
		optsHideCalendar: false,
		optsHideWeather: false,
		optsHideTopSites: false
	}, function(items) {
		tempUnit.value = items.optsTempUnit;
		hideCalendar.checked = items.optsHideCalendar;
		hideWeather.checked = items.optsHideWeather;
		hideTopSites.checked = items.optsHideTopSites;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);

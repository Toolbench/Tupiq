var moment = require('moment'),
	_ = require('underscore'),
	pluralize = require('pluralize');

function NumbersToWords(num) {
	var ones = new Array('', ' one', ' two', ' three', ' four', ' five', ' six', ' seven', ' eight', ' nine', ' ten', ' eleven', ' twelve', ' thirteen', ' fourteen', ' fifteen', ' sixteen', ' seventeen', ' eighteen', ' nineteen');
	var tens = new Array('', '', ' twenty', ' thirty', ' forty', ' fifty', ' sixty', ' seventy', ' eighty', ' ninety');
	var hundred = ' hundred';
	var output = '';
	var numString = num.toString();

	if (num == 0) {
		return 'zero';
	}
	//the case of 10, 11, 12 ,13, .... 19
	if (num < 20) {
		output = ones[num];
		return output;
	}

	//100 and more
	if (numString.length == 3) {
		output = ones[parseInt(numString.charAt(0))] + hundred;
		output += tens[parseInt(numString.charAt(1))];
		output += ones[parseInt(numString.charAt(2))];
		return output;
	}

	output += tens[parseInt(numString.charAt(0))];
	output += ones[parseInt(numString.charAt(1))];

	return output;
}

function prepNextEvent(nextEvent, moment) {
	nextEvent.momentStart = moment(nextEvent.start.dateTime || nextEvent.start.date);
	nextEvent.momentEnd = moment(nextEvent.end.dateTime || nextEvent.end.date);
	nextEvent.fromNow = nextEvent.momentStart.fromNow();

	if (nextEvent.location !== undefined) {
		nextEvent.actualLocation = ' at ' + nextEvent.location;
	} else {
		nextEvent.actualLocation = '';
	}

	return nextEvent;
}

var TupiqTools = {

	isNumberBetween: function(num, a, b) {
		var min = Math.min.apply(Math, [a,b]),
			max = Math.max.apply(Math, [a,b]);
		return num >= min && num <= max;
	},

	getRandomIntFromInterval: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	agenda: function(upcomingEvents) {
		if (upcomingEvents && upcomingEvents.length > 0) {
			var momentNow = moment(),
				momentTomorrow = moment().add(1, 'days').endOf('day'),
				primaryNote,
				secondaryNote,
				nextEvent = upcomingEvents[0],
				nextEventName,
				eventsRemaining,
				isNextEventToday,
				isNextEventTomorrow,
				isNextEventRightNow,
				eventsRemainingTodayNumber,
				eventsRemainingTomorrowNumber,
				eventsRemainingToday = 'zero',
				eventsRemainingTomorrow = 'zero';

			nextEvent = prepNextEvent(nextEvent, moment);
			nextEventName = nextEvent.summary === undefined ? 'Untitled' : _.escape(nextEvent.summary);

			isNextEventToday = nextEvent.momentStart.isSame(momentNow, 'day');
			isNextEventTomorrow = nextEvent.momentStart.isAfter(momentNow, 'day') && nextEvent.momentStart.isBefore(momentTomorrow);
			isNextEventRightNow = nextEvent.momentStart.isBefore(momentNow) && nextEvent.momentEnd.isAfter(momentNow);

			if (upcomingEvents.length > 1 && (isNextEventToday || isNextEventTomorrow)) {
				eventsRemaining = upcomingEvents.slice(1).filter(function(event) {
					return moment(event.start.dateTime || event.start.date).isSame(momentNow, 'day');
				});

				eventsRemainingTodayNumber = eventsRemaining.length;
				eventsRemainingTomorrowNumber = upcomingEvents.length - 1;
				eventsRemainingToday = NumbersToWords(eventsRemainingTodayNumber);
				eventsRemainingTomorrow = NumbersToWords(eventsRemainingTomorrowNumber);
			}

			// If upcoming event is today...
			if (isNextEventToday) {

			  // The event is happening right now
			  if (isNextEventRightNow) {
				primaryNote = `<span class="event-name">${nextEventName}</span> started ${nextEvent.fromNow} and goes until ${nextEvent.momentEnd.format('h:mma')}.`;

			  // The event is yet to happen
			  } else {
				primaryNote = `You've got <span class="event-name">${nextEventName}</span> ${nextEvent.fromNow}.`;
			  }

			  if (eventsRemainingTodayNumber > 0) {
				secondaryNote = `Plus ${eventsRemainingToday} other upcoming ${pluralize('event', eventsRemainingTodayNumber)} today.`;
			  } else if (eventsRemainingTomorrowNumber > 0) {
				secondaryNote = `And then you're clear till tomorrow.`;
			  } else {
				secondaryNote = `After that you're clear for the next few days.`;
			  }

			// If upcoming event is tomorrow...
			} else if (isNextEventTomorrow) {
			  primaryNote = `Tomorrow your day starts with <span class="event-name">${nextEventName}</span> at ${nextEvent.momentStart.format('h:mma')}.`;

			  if (eventsRemainingTomorrowNumber > 0) {
				secondaryNote = `Plus ${eventsRemainingTomorrow} other ${pluralize('event', eventsRemainingTomorrowNumber)}.`;
			  } else {
				secondaryNote = `After that you're clear for the rest of the day.`;
			  }

			// If upcoming event is in the future...
			} else {
				primaryNote = `Today and tomorrow look clear.`,
				secondaryNote = `Your next event is <span class="event-name">${nextEventName}</span> ${nextEvent.fromNow}.`;
			}

		// No upcoming events today or tomorrow
		} else {
			primaryNote = `Today and tomorrow look clear.`,
			secondaryNote = `And there are no events on the horizon.`;
		}

		return {
			primaryNote: primaryNote,
			secondaryNote: secondaryNote
		}
	},

	/**
	 * Compare two software version numbers (e.g. 1.7.1)
	 * Returns:
	 *
	 *  0 if they're identical
	 *  negative if v1 < v2
	 *  positive if v1 > v2
	 *  Nan if they in the wrong format
	 *
	 *  E.g.:
	 *
	 *  assert(version_number_compare("1.7.1", "1.6.10") > 0);
	 *  assert(version_number_compare("1.7.1", "1.7.10") < 0);
	 *
	 *  "Unit tests": http://jsfiddle.net/ripper234/Xv9WL/28/
	 *  Thanks to: http://stackoverflow.com/a/6832721/11236
	 */
	compareVersionNumbers: function(v1, v2){
		var v1parts = v1.split('.');
		var v2parts = v2.split('.');

		function isPositiveInteger(x) {
			// http://stackoverflow.com/a/1019526/11236
			return /^\d+$/.test(x);
		}

		// First, validate both numbers are true version numbers
		function validateParts(parts) {
			for (var i = 0; i < parts.length; ++i) {
				if (!isPositiveInteger(parts[i])) {
					return false;
				}
			}
			return true;
		}
		if (!validateParts(v1parts) || !validateParts(v2parts)) {
			return NaN;
		}

		for (var i = 0; i < v1parts.length; ++i) {
			if (v2parts.length === i) {
				return 1;
			}

			if (v1parts[i] === v2parts[i]) {
				continue;
			}
			if (v1parts[i] > v2parts[i]) {
				return 1;
			}
			return -1;
		}

		if (v1parts.length != v2parts.length) {
			return -1;
		}

		return 0;
	}

}

module.exports = TupiqTools;

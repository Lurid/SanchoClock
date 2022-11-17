{ // Variables
	var ClockParent, ClockPrefab;
	var clocks = [];
}

{ // Small Functions
	var zeroPad = (num, places) => String(num).padStart(places, '0');
	var v0l = (value) => (((value < 10) ? "0" : "") + value);


	function CtBwFaR(number, length) { // convert to binary with filling and reverse
		let num = number;
		let binary = [num % 2];
		for (; num > 1;) {
			num = parseInt(num / 2);
			binary.push(num % 2);
		}
		binary = binary.reverse();
		if (length > binary.length) {
			binary = (Array(length - binary.length).fill(0)).concat(binary);
		}
		return binary;
	}

	function convertToBinary(number) {
		let num = number;
		let binary = [num % 2];
		for (; num > 1;) {
			num = parseInt(num / 2);
			binary.push(num % 2);
		}
		return binary;
	}

	function test() {

	}
}

{ //Tabs
	var tabParent;
	var headerButtonParent;
	var tabPages = [];
	var tabButtons = [];
	var pageCount;

	function LoadTabs(params) {
		tabParent = document.getElementById("tabPages");
		pageCount = tabParent.children.length;

		headerButtonParent = document.getElementById("tabButtons");

		for (let i = 1; i <= pageCount; i++) {
			tabPages[i] = tabParent.children[i - 1];
			tabButtons[i] = headerButtonParent.children[i - 1];
		}

		TabPage(1);
	}

	function TabPage(PageID) {
		for (let i = 1; i <= pageCount; i++) {
			tabPages[i].style.display = (i == PageID) ? "block" : "none";
			//tabButtons[i].style.borderColor = (i == PageID) ? 'var(--text-color1)' : '';
		}
	}
}

{ // Load Page Script
	document.addEventListener("DOMContentLoaded", function () {
		LoadTabs();

		LoadDefaultElements();

		CreateMainClock();

		CreateCustomClocks();
	});
}

{ // Main Clock
	var timer = {
		timer_main: null,
		timer_h: null,
		timer_m: null,
		timer_s: null,
		t_hour: null,
		t_minute: null,
		t_second: null,
	}

	function CreateMainClock() {
		timer.timer_main = document.getElementById("timer");
		timer.timer_h = timer.timer_main.querySelector(".hour");
		timer.timer_m = timer.timer_main.querySelector(".minute");
		timer.timer_s = timer.timer_main.querySelector(".second");
	}

	function mainClock() {
		let date = new Date();
		timer.timer_h.innerText = timer.t_hour = v0l(date.getHours());
		timer.timer_m.innerText = timer.t_minute = v0l(date.getMinutes());
		timer.timer_s.innerText = timer.t_second = v0l(date.getSeconds());
		customClocksTick();
	};
}

{ // Custom Clocks 
	function LoadDefaultElements() {
		ClockParent = document.getElementById("clocks-parent");
		ClockPrefab = document.getElementById("clocks-prefab");
		ClockPrefab.removeAttribute('id');
	}

	function CreateCustomClocks() {
		CreateClock01();
		CreateClock02();
		CreateClock03();

		CheckFunctionsExist();

		customClocksEnableAll();
		mainClock();
		setTimeout(function () {
			setInterval(mainClock, 1000);
		}, (new Date()).getMilliseconds());
	}

	function CheckFunctionsExist() {
		clocks.forEach(c => { if (c.hasOwnProperty("tick") == false) c.timerEnabled = false; });
	}

	function customClocksTick() {
		clocks.forEach(c => {
			let date_h = timer.t_hour, date_m = timer.t_minute, date_s = timer.t_second;
			if (c.timerEnabled) {
				if (c.values.hour != date_h) {
					c.values.hour = date_h;
					c.elements.time.children[0].innerText = zeroPad(date_h, 2);
					c.functions.hour(date_h);
				}
				if (c.values.minute != date_m) {
					c.values.minute = date_m;
					c.elements.time.children[1].innerText = zeroPad(date_m, 2);
					c.functions.minute(date_m);
				}
				c.values.second = date_s;
				c.elements.time.children[2].innerText = zeroPad(date_s, 2);
				c.functions.second(date_s);
			}
		});
	}

	function customClocksEnableAll() {
		clocks.forEach(c => { setClockState(c.element, true); });
	}

	function setClockState(sender, enabled) {
		let clock = clocks[sender.closest(".one-clock").value];
		clock.timerEnabled = enabled;
		clock.elements.status.innerText = enabled ? "работают" : "отключены";
	}

	function CreateNewClock() {
		let newClock = {};
		newClock.element = ClockPrefab.cloneNode(true);
		newClock.elements = {};
		newClock.elements.name = newClock.element.querySelector(".name");
		newClock.elements.status = newClock.element.querySelector(".status");
		newClock.elements.time = newClock.element.querySelector(".time");
		newClock.elements.description = newClock.element.querySelector(".description");
		newClock.elements.body = newClock.element.querySelector(".body");
		newClock.body = {};
		newClock.body.hours = newClock.elements.body.querySelector(".c-hours");
		newClock.body.minutes = newClock.elements.body.querySelector(".c-minutes");
		newClock.body.seconds = newClock.elements.body.querySelector(".c-seconds");

		newClock.elements.time.innerHTML = '<div></div>:<div></div>:<div></div>';

		newClock.timerEnabled = true;

		newClock.values = {};
		newClock.values.hour = 0;
		newClock.values.minute = 0;
		newClock.values.second = 0;

		newClock.newName = function (name) { newClock.elements.name.innerText = name; }
		newClock.newDescription = function (description) { newClock.elements.description.innerText = description; }

		newClock.functions = {};
		newClock.functions.hour = function () { };
		newClock.functions.minute = function () { };
		newClock.functions.second = function () { };

		newClock.tick = function () {
		};

		clocks.push(newClock);

		newClock.element.value = clocks.indexOf(newClock);
		ClockParent.appendChild(newClock.element);

		return newClock;
	}

	function CreateClock01() {
		var clock = CreateNewClock();
		clock.newName("Часы №1");
		clock.newDescription("Классическая бинарная система для каждого числа: [ 32, 16, 8, 4, 2, 1 ]");
		clock.body.hours.innerHTML = '<hr e="f" v="16"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';
		clock.body.minutes.innerHTML = '<hr e="f" v="32"><hr e="f" v="16"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';
		clock.body.seconds.innerHTML = '<hr e="f" v="32"><hr e="f" v="16"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';

		var i, hMass, mMass, sMass;
		clock.functions.hour = function (hour) {
			hMass = CtBwFaR(hour, 5);
			for (i = 0; i < 5; i++) clock.body.hours.children[i].setAttribute('e', Boolean(hMass[i]) ? 't' : 'f');
		};
		clock.functions.minute = function (min) {
			mMass = CtBwFaR(min, 6);
			for (i = 0; i < 6; i++) clock.body.minutes.children[i].setAttribute('e', Boolean(mMass[i]) ? 't' : 'f');
		};
		clock.functions.second = function (sec) {
			sMass = CtBwFaR(sec, 6);
			for (i = 0; i < 6; i++) clock.body.seconds.children[i].setAttribute('e', Boolean(sMass[i]) ? 't' : 'f');
		};
	}

	function CreateClock02() {
		let clock = CreateNewClock();
		clock.newName("Часы №2");
		clock.newDescription("Двоично-десятичный код (BCD) отдельно для каждой цифры: [ 8, 4, 2, 1 ]");
		clock.elements.body.classList.add("clock-3");
		clock.body.hours.innerHTML = '<div class="flex-row"><hr e="f" v="2"><hr e="f" v="1"></div><div class="flex-row"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div>';
		clock.body.minutes.innerHTML = '<div class="flex-row"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div><div class="flex-row"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div>';
		clock.body.seconds.innerHTML = '<div class="flex-row"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div><div class="flex-row"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div>';

		var i, j, hMass, mMass, sMass;
		var hLength = [2, 4], otherLength = [3, 4];
		clock.functions.hour = function (hour) {
			hMass = zeroPad(hour.toString(), 2).split("");
			for (i = 0; i < 2; i++) {
				hMass[i] = CtBwFaR(parseInt(hMass[i]), hLength[i]);
				for (j = 0; j < hMass[i].length; j++) clock.body.hours.children[i].children[j].setAttribute('e', Boolean(hMass[i][j]) ? 't' : 'f');
			}
		};
		clock.functions.minute = function (min) {
			mMass = zeroPad(min.toString(), 2).split("");
			for (i = 0; i < 2; i++) {
				mMass[i] = CtBwFaR(parseInt(mMass[i]), otherLength[i]);
				for (j = 0; j < mMass[i].length; j++) clock.body.minutes.children[i].children[j].setAttribute('e', Boolean(mMass[i][j]) ? 't' : 'f');
			}
		};
		clock.functions.second = function (sec) {
			sMass = zeroPad(sec.toString(), 2).split("");
			for (i = 0; i < 2; i++) {
				sMass[i] = CtBwFaR(parseInt(sMass[i]), otherLength[i]);
				for (j = 0; j < sMass[i].length; j++) clock.body.seconds.children[i].children[j].setAttribute('e', Boolean(sMass[i][j]) ? 't' : 'f');
			}
		};
	}

	function CreateClock03() {
		let clock = CreateNewClock();
		clock.newName("Часы №3");
		clock.newDescription("Комбинированная система счисления. Значения битов для: Cекции часа: [ 12, 6, 3, 2, 1 ]; Cекции минут и секунд: [ 30, 15, 8, 4, 2, 1 ].");
		clock.body.hours.innerHTML = '<hr e="f" v="12"><hr e="f" v="6"><hr e="f" v="3"><hr e="f" v="2"><hr e="f" v="1">';
		clock.body.minutes.innerHTML = '<hr e="f" v="30"><hr e="f" v="15"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';
		clock.body.seconds.innerHTML = '<hr e="f" v="30"><hr e="f" v="15"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';

		var i, min_, sec_;
		clock.functions.hour = function (hour) {
			clock.body.hours.children[0].setAttribute('e', (hour >= 12) ? 't' : 'f');
			clock.body.hours.children[1].setAttribute('e', ((hour % 12) >= 6) ? 't' : 'f');
			clock.body.hours.children[2].setAttribute('e', ((hour % 6) >= 3) ? 't' : 'f');
			clock.body.hours.children[3].setAttribute('e', ((hour % 3) == 2) ? 't' : 'f');
			clock.body.hours.children[4].setAttribute('e', ((hour % 3) == 1) ? 't' : 'f');
		};
		clock.functions.minute = function (min) {
			clock.body.minutes.children[0].setAttribute('e', (min >= 30) ? 't' : 'f');
			clock.body.minutes.children[1].setAttribute('e', ((min % 30) >= 15) ? 't' : 'f');
			min_ = CtBwFaR(min % 15, 4);
			for (i = 0; i < 4; i++) clock.body.minutes.children[i + 2].setAttribute('e', Boolean(min_[i]) ? 't' : 'f');
		};
		clock.functions.second = function (sec) {
			clock.body.seconds.children[0].setAttribute('e', (sec >= 30) ? 't' : 'f');
			clock.body.seconds.children[1].setAttribute('e', ((sec % 30) >= 15) ? 't' : 'f');
			sec_ = CtBwFaR(sec % 15, 4);
			for (i = 0; i < 4; i++) clock.body.seconds.children[i + 2].setAttribute('e', Boolean(sec_[i]) ? 't' : 'f');
		};
	}
}
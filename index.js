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

		for(let i = 1; i <= pageCount; i++) {
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

document.addEventListener("DOMContentLoaded", function () {
	LoadTabs();

	LoadDefaultElements();

	CreateMainClock();

	CreateCustomClocks();
});


function LoadDefaultElements() {
	ClockParent = document.getElementById("clocks-parent");
	ClockPrefab = document.getElementById("clocks-prefab");
	ClockPrefab.removeAttribute('id');
}

function CreateMainClock() {
	let timer = document.getElementById("timer");
	let timer_h = timer.querySelector(".hour");
	let timer_m = timer.querySelector(".minute");
	let timer_s = timer.querySelector(".second");

	let mainClock = function () {
		let date = new Date();
		timer_h.innerText = v0l(date.getHours());
		timer_m.innerText = v0l(date.getMinutes());
		timer_s.innerText = v0l(date.getSeconds());
	}; mainClock(); setInterval(mainClock, 1000);
}

function CreateCustomClocks() {
	CreateClock01();
	CreateClock02();
	CreateClock03();

	CheckFunctionsExist();

	setInterval(customClocksTick, 1000);
}

function CheckFunctionsExist() {
	clocks.forEach(c => { if (c.hasOwnProperty("tick") == false) c.timerEnabled = false; });
}

function customClocksTick() {
	clocks.forEach(c => { if (c.timerEnabled) c.tick(); });
}

function CreateNewClock() {
	let newClock = {};
	newClock.element = ClockPrefab.cloneNode(true);
	newClock.elements = {};
	newClock.elements.name = newClock.element.querySelector(".name");
	newClock.elements.description = newClock.element.querySelector(".description");
	newClock.elements.body = newClock.element.querySelector(".body");
	newClock.body = {};
	newClock.body.hours = newClock.elements.body.querySelector(".c-hours");
	newClock.body.minutes = newClock.elements.body.querySelector(".c-minutes");
	newClock.body.seconds = newClock.elements.body.querySelector(".c-seconds");

	newClock.timerEnabled = true;

	newClock.newName = function (name) { newClock.elements.name.innerText = name; }
	newClock.newDescription = function (description) { newClock.elements.description.innerText = description; }

	clocks.push(newClock);
	ClockParent.appendChild(newClock.element);
	return newClock;
}

function CreateClock01() {
	let clock = CreateNewClock();

	clock.newName("Часы №1");
	clock.newDescription("Классическая бинарная система для каждого числа: [ 32, 16, 8, 4, 2, 1 ]");

	clock.body.hours.innerHTML = '<hr e="f" v="16"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';
	clock.body.minutes.innerHTML = '<hr e="f" v="32"><hr e="f" v="16"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';
	clock.body.seconds.innerHTML = '<hr e="f" v="32"><hr e="f" v="16"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';

	var hour_last = 0, minute_last = 0, hour, min, sec, i, j, k;

	clock.tick = function () {
		let date = new Date();
		if (hour_last != date.getHours()) {
			hour_last = date.getHours();
			hour = CtBwFaR(hour_last, 5);
			for (i = 0; i < 5; i++) clock.body.hours.children[i].setAttribute('e', Boolean(hour[i]) ? 't' : 'f');
		}

		if (minute_last != date.getMinutes()) {
			minute_last = date.getMinutes();
			min = CtBwFaR(minute_last, 6);
			for (j = 0; j < 6; j++) clock.body.minutes.children[j].setAttribute('e', Boolean(min[j]) ? 't' : 'f');
		}

		sec = CtBwFaR(date.getSeconds(), 6);
		for (k = 0; k < 6; k++) clock.body.seconds.children[k].setAttribute('e', Boolean(sec[k]) ? 't' : 'f');
	};
	clock.tick();
}

function CreateClock02() {
	let clock = CreateNewClock();

	clock.newName("Часы №2");
	clock.newDescription("Двоично-десятичный код (BCD) отдельно для каждой цифры: [ 8, 4, 2, 1 ]");

	clock.elements.body.classList.add("clock-3");
	clock.body.hours.innerHTML = '<div class="flex-row"><hr e="f" v="2"><hr e="f" v="1"></div><div class="flex-row"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div>';
	clock.body.minutes.innerHTML = '<div class="flex-row"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div><div class="flex-row"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div>';
	clock.body.seconds.innerHTML = '<div class="flex-row"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div><div class="flex-row"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1"></div>';


	var hour_last = 0, minute_last = 0;

	var hour, h0, h1, min, m0, m1, sec, s0, s1;

	clock.tick = function () {
		let date = new Date();
		if (hour_last != date.getHours()) {
			hour_last = date.getHours();
			hour = hour_last.toString();
			h0 = convertToBinary(parseInt(hour[0]));
			clock.body.hours.children[0].children[0].setAttribute('e', ((h0.length > 1) && Boolean(h0[1])) ? 't' : 'f');
			clock.body.hours.children[0].children[1].setAttribute('e', ((h0.length > 0) && Boolean(h0[0])) ? 't' : 'f');

			h1 = convertToBinary(parseInt(hour[1]));

			clock.body.hours.children[1].children[0].setAttribute('e', ((h1.length > 3) && Boolean(h1[3])) ? 't' : 'f');
			clock.body.hours.children[1].children[1].setAttribute('e', ((h1.length > 2) && Boolean(h1[2])) ? 't' : 'f');
			clock.body.hours.children[1].children[2].setAttribute('e', ((h1.length > 1) && Boolean(h1[1])) ? 't' : 'f');
			clock.body.hours.children[1].children[3].setAttribute('e', ((h1.length > 0) && Boolean(h1[0])) ? 't' : 'f');
		}

		if (minute_last != date.getMinutes()) {
			minute_last = date.getMinutes();

			min = zeroPad(minute_last, 2);
			m0 = convertToBinary(parseInt(min[0]));
			clock.body.minutes.children[0].children[0].setAttribute('e', ((m0.length > 2) && Boolean(m0[2])) ? 't' : 'f');
			clock.body.minutes.children[0].children[1].setAttribute('e', ((m0.length > 1) && Boolean(m0[1])) ? 't' : 'f');
			clock.body.minutes.children[0].children[2].setAttribute('e', ((m0.length > 0) && Boolean(m0[0])) ? 't' : 'f');

			m1 = convertToBinary(parseInt(min[1]));
			clock.body.minutes.children[1].children[0].setAttribute('e', ((m1.length > 3) && Boolean(m1[3])) ? 't' : 'f');
			clock.body.minutes.children[1].children[1].setAttribute('e', ((m1.length > 2) && Boolean(m1[2])) ? 't' : 'f');
			clock.body.minutes.children[1].children[2].setAttribute('e', ((m1.length > 1) && Boolean(m1[1])) ? 't' : 'f');
			clock.body.minutes.children[1].children[3].setAttribute('e', ((m1.length > 0) && Boolean(m1[0])) ? 't' : 'f');
		}

		sec = zeroPad(date.getSeconds(), 2);
		s0 = convertToBinary(parseInt(sec[0]));
		clock.body.seconds.children[0].children[0].setAttribute('e', ((s0.length > 2) && Boolean(s0[2])) ? 't' : 'f');
		clock.body.seconds.children[0].children[1].setAttribute('e', ((s0.length > 1) && Boolean(s0[1])) ? 't' : 'f');
		clock.body.seconds.children[0].children[2].setAttribute('e', ((s0.length > 0) && Boolean(s0[0])) ? 't' : 'f');

		s1 = convertToBinary(parseInt(sec[1]));
		clock.body.seconds.children[1].children[0].setAttribute('e', ((s1.length > 3) && Boolean(s1[3])) ? 't' : 'f');
		clock.body.seconds.children[1].children[1].setAttribute('e', ((s1.length > 2) && Boolean(s1[2])) ? 't' : 'f');
		clock.body.seconds.children[1].children[2].setAttribute('e', ((s1.length > 1) && Boolean(s1[1])) ? 't' : 'f');
		clock.body.seconds.children[1].children[3].setAttribute('e', ((s1.length > 0) && Boolean(s1[0])) ? 't' : 'f');
	};
	clock.tick();
}

function CreateClock03() {
	let clock = CreateNewClock();

	clock.newName("Часы №3");
	clock.newDescription("Комбинированная система счисления. Значения битов для: Cекции часа: [ 12, 6, 3, 2, 1 ]; Cекции минут и секунд: [ 30, 15, 8, 4, 2, 1 ].");


	clock.body.hours.innerHTML = '<hr e="f" v="12"><hr e="f" v="6"><hr e="f" v="3"><hr e="f" v="2"><hr e="f" v="1">';
	clock.body.minutes.innerHTML = '<hr e="f" v="30"><hr e="f" v="15"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';
	clock.body.seconds.innerHTML = '<hr e="f" v="30"><hr e="f" v="15"><hr e="f" v="8"><hr e="f" v="4"><hr e="f" v="2"><hr e="f" v="1">';

	var hour_last = 0, minute_last = 0, seconds = 0;

	clock.tick = function () {
		let date = new Date();
		if (hour_last != date.getHours()) {
			hour_last = date.getHours();
			clock.body.hours.children[0].setAttribute('e', (hour_last >= 12) ? 't' : 'f');
			clock.body.hours.children[1].setAttribute('e', ((hour_last % 12) >= 6) ? 't' : 'f');
			clock.body.hours.children[2].setAttribute('e', ((hour_last % 6) >= 3) ? 't' : 'f');
			clock.body.hours.children[3].setAttribute('e', ((hour_last % 3) == 2) ? 't' : 'f');
			clock.body.hours.children[4].setAttribute('e', ((hour_last % 3) == 1) ? 't' : 'f');
		}

		if (minute_last != date.getMinutes()) {
			minute_last = date.getMinutes();
			clock.body.minutes.children[0].setAttribute('e', (minute_last >= 30) ? 't' : 'f');
			clock.body.minutes.children[1].setAttribute('e', ((minute_last % 30) >= 15) ? 't' : 'f');
			let min = convertToBinary(minute_last % 15);
			clock.body.minutes.children[2].setAttribute('e', ((min.length > 3) && Boolean(min[3])) ? 't' : 'f');
			clock.body.minutes.children[3].setAttribute('e', ((min.length > 2) && Boolean(min[2])) ? 't' : 'f');
			clock.body.minutes.children[4].setAttribute('e', ((min.length > 1) && Boolean(min[1])) ? 't' : 'f');
			clock.body.minutes.children[5].setAttribute('e', ((min.length > 0) && Boolean(min[0])) ? 't' : 'f');
		}

		seconds = date.getSeconds();
		clock.body.seconds.children[0].setAttribute('e', (seconds >= 30) ? 't' : 'f');
		clock.body.seconds.children[1].setAttribute('e', ((seconds % 30) >= 15) ? 't' : 'f');
		let sec = convertToBinary(seconds % 15);
		clock.body.seconds.children[2].setAttribute('e', ((sec.length > 3) && Boolean(sec[3])) ? 't' : 'f');
		clock.body.seconds.children[3].setAttribute('e', ((sec.length > 2) && Boolean(sec[2])) ? 't' : 'f');
		clock.body.seconds.children[4].setAttribute('e', ((sec.length > 1) && Boolean(sec[1])) ? 't' : 'f');
		clock.body.seconds.children[5].setAttribute('e', ((sec.length > 0) && Boolean(sec[0])) ? 't' : 'f');
	};
	clock.tick();
}
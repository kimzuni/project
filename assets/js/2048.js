const container = document.querySelector("#container");
const board = document.querySelector("#board");

const Board = {
	x: 4, y: 4, n_create: 1, n_mv: 0,
	lock: true,
	score: 0,
	attr: "num",
	state: [],
	block: [],
	play: function() {
		if (!this.state.length) {
			this.init();
		} else {
			container.classList.add("play");
			this.lock = false;
		}
	},
	pause: function() {
		container.classList.remove("play");
		this.lock = true;
	},
	init: function(x, y, n) {
		if (this.state.length && !confirm("Restart?")) {
			return;
		}

		if (x) this.x = x*1;
		if (y) this.y = y*1;
		if (n) this.n_create = n*1;
		this.state = Array(this.x*this.y).fill(null);

		board.innerHTML = "";
		for (let y=0; y<this.y; y++) {
			const row = document.createElement("div");
			for (let x=0; x<this.x; x++) {
				row.innerHTML += "<span></span>";
			}
			board.append(row);
		}

		this.n_mv = 0;
		this.score = 0;
		this.create(2);
		this.update();
		this.play();
	},
	nextIdxs: function(idx) {
		if (this.x*this.y <= idx) return false;
		const lineStart = parseInt(idx/this.x)*this.x;
		const lineEnd = lineStart+3;

		const idxs = {};
		if (this.x <= idx)
			idxs.up = idx - this.x;
		if (idx < this.x*this.y-this.x)
			idxs.down = idx + this.x;
		if (idx !== lineStart)
			idxs.left = idx - 1;
		if (idx !== lineEnd)
			idxs.right = idx + 1;
		return idxs;
	},
	end: function() {
		for (let idx=0; idx<this.state.length; idx++) {
			const idxs = this.nextIdxs(idx);
			for (let action in idxs) {
				const next = idxs[action];
				if (this.state[next] === null) return false;
				else if (this.state[idx] === this.state[next]) return false;
			}
		}
		return true;
	},
	update: function() {
		document.querySelector("#move-value").innerText = this.n_mv;
		document.querySelector("#score-value").innerText = this.score;
		for (let i=0; i<this.state.length; i++) {
			const num = this.state[i];
			const box = board.querySelectorAll("span")[i];
			if (num)
				box.setAttribute(this.attr, num);
			else
				box.removeAttribute(this.attr);
		}
		if (this.end()) {
			alert("The End!");
		}
	},
	create: function(n) {
		const cnt = n || this.n_create;
		let idxs = [];
		for (let i=0; i<this.state.length; i++) {
			if (this.state[i] === null) idxs.push(i)
		}
		idxs = idxs.sort(() => Math.random() - 0.5).slice(0, cnt);

		for (let idx of idxs) {
			const num = parseInt(Math.random()*100%10);
			this.state[idx] = num != 0 ? 2 : 4;
		}
		this.update();
	},
	move: function(move) {
		let idxs = [];
		for (let i=0; i<this.state.length; i++) {
			if (this.state[i] !== null) idxs.push(i)
		}
		if (['right', 'down'].includes(move)) idxs.reverse();

		let action = false;
		for (let idx of idxs) {
			if (this.action(idx, idx, move)) action = true;
		}
		this.block = [];
		if (action) {
			this.n_mv += 1;
			this.update();
			this.create();
		}
	},
	action: function(orig, idx, action) {
		const next = this.nextIdxs(idx)[action];
		if (next === undefined) return false;

		if (this.state[next] !== null) {
			if (this.block.includes(idx) || this.block.includes(next)) {
				return false;
			} else if (this.state[idx] === this.state[next]) {
				const score = this.state[idx] * 2;
				this.state[idx] *= 2;
				this.score += this.state[idx];
				this.block.push(idx);
			} else {
				return false;
			}
		}

		const indexOf = this.block.indexOf(idx);
		if (indexOf !== -1) this.block[indexOf] = next;
		this.state[next] = this.state[idx];
		this.state[idx] = null;
		this.action(orig, next, action);
		return true;
	},
}

let timeout;
const btnClick = function(e) {
	const btn = e.target;
	if (btn.classList.contains('click')) clearTimeout(timeout);
	btn.classList.add('click');
	timeout = setTimeout(function() {
		btn.classList.remove('click');
	}, 50);
	if (!Board.lock) Board.move(btn.innerText.trim().toLowerCase());
}

for (let btn of document.querySelectorAll("#controller button")) {
	btn.onclick = btnClick;
}

document.querySelector("form").x.focus();



window.addEventListener("keydown", function(e) {
	const key = e.key;
	if (e.altKey) return;
	else if (!key.startsWith("Arrow")) return;
	e.preventDefault();
	document.getElementById(key.slice(5).toLowerCase() + "Btn").click();
});

const resizeEvent = function() {
	container.style.setProperty("--board-height", container.clientWidth + "px");
}
resizeEvent();
window.addEventListener("resize", resizeEvent);

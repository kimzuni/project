window.addEventListener("DOMContentLoaded", function() {
	const board = document.querySelector("#board");

	const Board = {
		x: 4, y: 4,
		num: 1,
		score: 0,
		attr: "num",
		state: [],
		block: [],
		init: function() {
			for (let i=0; i<this.x*this.y; i++) {
				this.state[i] = null;
			}

			board.innerHTML = "";
			const tbody = document.createElement("tbody");
			for (let y=0; y<this.y; y++) {
				const tr = document.createElement("tr");
				for (let x=0; x<this.x; x++) {
					tr.innerHTML += "<td></td>";
				}
				tbody.append(tr);
			}
			board.append(tbody);

			this.score = 0;
			this.create();
			this.create();
			this.update();
		},
		nextIdxs: function(idx) {
			if (this.x*this.y <= idx) return false;
			const lineStart = parseInt(idx/this.x)*this.x;
			const lineEnd = lineStart+3;

			const idxs = {};
			if (this.x <= idx)
				idxs.up = idx - 4;
			if (idx < this.x*this.y-this.x)
				idxs.down = idx + 4;
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
			document.querySelector("#score span").innerText = this.score;
			for (let i=0; i<this.state.length; i++) {
				const num = this.state[i];
				const box = document.querySelectorAll("table tbody td")[i];
				if (num)
					box.setAttribute(this.attr, num);
				else
					box.removeAttribute(this.attr);
			}
			if (this.end()) {
				alert("The End!");
			}
		},
		create: function() {
			const cnt = this.num;
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
		}, 100);
		Board.move(btn.innerText.trim().toLowerCase());
	}

	window.addEventListener("keydown", function(e) {
		const key = e.key;
		if (e.altKey) return;
		else if (!key.startsWith("Arrow")) return;
		e.preventDefault();
		document.getElementById(key.slice(5).toLowerCase() + "Btn").click();
	});



	for (let btn of document.querySelectorAll("main button")) {
		btn.onclick = btnClick;
	}
	Board.init();
});

const msgbox = html.querySelector("#msgbox-container");
const f_msgbox = function(event) {
	let type = event.type ? event.type : "normal";
	let title = event.title;
	let msg = event.message;

	let x = document.createElement("div");
	x.className = "msgbox";
	x.innerHTML = `<div class="${type}">${title ? "<p class='title'>" + title + "</p>" : ""}<div class="content">${msg}</div></div>`;
	msgbox.prepend(x);

	let box_height = x.querySelector(`.${type}`).offsetHeight;
	set_style(x, "--height", box_height + "px");

	setTimeout(function() {
		x.classList.add("show");
	}, 10);

	function msg_hide() {
		x.classList.add("hide");
		setTimeout(function() {
			x.remove();
		}, 500);
	}

	let timeout = 2000;
	if (type == "warning") { timeout = 3000; }
	else if (type == "error") { timeout =  4000; }
	setTimeout(msg_hide, timeout);
}

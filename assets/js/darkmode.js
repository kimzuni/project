const mode_toggle_click = function() {
	if (!mode_toggle) return;
	let checked = mode_toggle.getAttribute("aria-checked");
	checked = checked == "true" ? "false" : "true";
	darkmode(checked);
}

const darkmode = function(mode) {
	if (typeof mode !== "boolean") {
		localStorage.darkmode = mode;
	}
	html.setAttribute("darkmode", mode);
	mode_toggle?.setAttribute("aria-checked", mode);
}

const mode_toggle = html.querySelector("#mode-toggle button");
darkmode(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false);

let main, header, siteTitle, nav, sitesNav;

const document_resize = function() {
	header.clientHeight == siteTitle.clientHeight ? header.classList.remove("over") : header.classList.add("over");
}

window.addEventListener("DOMContentLoaded", function() {
	main = html.querySelector("#main");
	header = html.querySelector("#header");
	siteTitle = html.querySelector("#site-title");
	nav = html.querySelector("#nav");
	sitesNav = html.querySelector("#sites-nav");

	for (let a of html.querySelectorAll('a[href]')) {
		if (a.innerText.trim() == a.getAttribute("href").trim()) {
			if (100 < a.innerText.length) {
				let arr = a.innerText.split("/");
				if (7 < arr.length) {
					arr.splice(4, arr.length-2-4, "...");
					a.innerText = arr.join("/");
				} else {
					/* ... */
				}
			}
		}
	}
	for (let a of html.querySelectorAll('a[href]:not([target])')) {
		if (["http:", "https:", ""].includes(a.getAttribute("href").split("//")[0])) {
			a.target = "_blank";
		}
	}
	for (let a of html.querySelectorAll('#page a[target="_blank"]:not(.noicon)')) {
		a.innerHTML = `<svg draw="externalLink"></svg>` + a.innerHTML;
	}

	document_resize();
	window.addEventListener("resize", function() {
		document_resize();
	});
});



/*
window.addEventListener("load", function() {
	for (let a of html.querySelectorAll("a[href^='#']")) {
		a.addEventListener("click", function(e) {
			e.preventDefault();
			let pos = html.querySelector(`[id="${this.getAttribute("href").slice(1)}"]`).getBoundingClientRect();
			let xpos = pos.left + html.scrollLeft;
			let ypos = pos.top + html.scrollTop;
			window.scrollTo({
				top: ypos - to_px(get_style("--header-height")),
				left: xpos - to_px(get_style("--nav-width"))
			});
		});
	}
});
*/

window.addEventListener("offline", function () {
    main.page.toast({body: {content: "<b>You are offline.</b><br>You can continue using the platform, but some pages and features may not function as expected."},theme: {background: "dark",color: "white",close: "white"},delay: 8000})
});
window.addEventListener("online", function () {
    main.page.toast({body: {content: "You are back online"},theme: {background: "success",color: "white",close: "white"},delay: 3000})
});

main.uiUtils = {
	//fetch the session data into localstorage so we know we're logged in easily
	fetchSession: function () {
		return main.api.session(function (s) {
			if (typeof s.error !== "undefined") localStorage.setItem("__session", false);
			else localStorage.setItem("__session", JSON.stringify(s));
		});
	},
	enableTooltops: function () {
		[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (el) {
		  return new bootstrap.Tooltip(el, {
		  	delay: {
		  	"show": 500, "hide": 100
		  	},
		  	template: `<div class="tooltip p-0" role="tooltip"><div class="tooltip-inner"></div></div>`
		  })
		})
	}
}

if (localStorage.__session === undefined) main.uiUtils.fetchSession();

$(document).on("main.page.print ready", function () {
	if (typeof bootstrap === "object") main.uiUtils.enableTooltops();
	else $(document).on("main.page.scriptLoaded", function (e) {
	    if (e.detail.scripts.includes("/r/js/bs.js")) main.uiUtils.enableTooltops();
	});
});

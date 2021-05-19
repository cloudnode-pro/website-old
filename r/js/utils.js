main.page.toast = function (options) {
	let id = Date.now();
	if (typeof options !== "object") options = {};
	if (typeof options.theme !== "object") options.theme = {};
	if (typeof options.autohide !== "boolean") options.autohide = true;
	if (typeof options.delay !== "number") options.delay = 5000;
	if (!options.body) options.body = {};
	if (!options.body.content) options.body.content = "";
	let html = `<div class="toast${typeof options.header !== "object" ? " align-items-center" : ""}${options.theme.color ? ` text-${options.theme.color}` : ""}${options.theme.background ? ` bg-${options.theme.background} border-0` : ""}" role="alert" aria-live="assertive" aria-atomic="true" data-toast="${id}">`;
	if (typeof options.header === "object") {
		html += `<div class="toast-header">`;
		if (typeof options.header.image === "object" && options.header.image.url && options.header.image.alt) html += `<img src="${options.header.image.url}" class="rounded me-2" alt="${options.header.image.alt}" height=20 width=20>`;
		if (options.header.title) html += `<strong class="me-auto">${options.header.title}</strong>`;
		if (options.header.time) html += `<small>${options.header.time instanceof Date ? getRelativeTime(options.header.time).capitalise() : getRelativeTime(new Date(options.header.time)).capitalise()}</small>`;
		html += `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
	}
	if (typeof options.header !== "object") html += `<div class="d-flex">`;
	html += `<div class="toast-body">${options.body.content}</div>`;
	if (typeof options.header !== "object") html += `<button type="button" class="btn-close${options.theme.close ? ` btn-close-${options.theme.close}` : ""} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
	html += `</div>`;
	let $toast = $(".toast-container").append(html).find(`[data-toast="${id}"]`);
	new bootstrap.Toast($toast[0], {
		delay: options.delay,
		autohide: options.autohide
	}).show();
	$toast[0].addEventListener('hidden.bs.toast', function () {
		this.remove();
	})
	return $toast;
}


function getRelativeTime (d1, d2 = new Date()) {
	let rtf = new Intl.RelativeTimeFormat("en", {numeric: "auto"}),
		elapsed = d1 - d2,
		units = {
			year  : 24 * 60 * 60 * 1000 * 365,
			month : 24 * 60 * 60 * 1000 * 365/12,
			day   : 24 * 60 * 60 * 1000,
			hour  : 60 * 60 * 1000,
			minute: 60 * 1000,
			second: 1000
		}

	for (let u in units) 
		if (Math.abs(elapsed) > units[u] || u == "second") 
			return rtf.format(Math.round(elapsed/units[u]), u)
}

function parseQuery (queryString) {
    let query = {},
    	pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let pair of pairs) {
        pair = pair.split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

main.utils = {
	readableBytes: function (input, suffix = "B") {
		if (input < 1000) return `${input}${suffix}`;
		else {
			let i = Math.floor(Math.log(input) / Math.log(1000));
            return (input / Math.pow(1000, i) * 100) / 100 + ' KMGTP'.charAt(i) + suffix;
        }
	}
}
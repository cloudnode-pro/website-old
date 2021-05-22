if (typeof main !== "object") throw new Error("module main missing");
main.currency = {
	selected: localStorage.currency ?? "EUR",
	list: sessionStorage.currencies === undefined ? {EUR:{iso: "EUR", symbol: "€", rate: 1, updated:0}} : JSON.parse(sessionStorage.currencies)
}

$("#currencySelect").html(`<span class="align-middle me-2">${main.currency.selected.symbol}</span><span class="align-middle">${main.currency.selected.currency}</span>`);

if ([undefined, null].includes(sessionStorage.currencies)) {
	main.api.currency(function (data) {
		sessionStorage.setItem("currencies", JSON.stringify(data));
		main.currency.list = data;
	})
}
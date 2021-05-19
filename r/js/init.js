const MinecraftColorCodes = {
    toHTML: function(s) {
        let d = document.createElement("div");
        return d.appendChild(MinecraftColorCodes.parseStyle(s)), d.innerHTML;
    },
    styleMap: {
        "§4": "font-weight:normal;text-decoration:none;color:#ec0505",
        "§c": "font-weight:normal;text-decoration:none;color:#ff495a",
        "§6": "font-weight:normal;text-decoration:none;color:#ff9800",
        "§e": "font-weight:normal;text-decoration:none;color:#ffeb3b",
        "§2": "font-weight:normal;text-decoration:none;color:#4caf50",
        "§a": "font-weight:normal;text-decoration:none;color:#50ff57",
        "§b": "font-weight:normal;text-decoration:none;color:#0dcaf0",
        "§3": "font-weight:normal;text-decoration:none;color:#20c997",
        "§1": "font-weight:normal;text-decoration:none;color:#0d6efd",
        "§9": "font-weight:normal;text-decoration:none;color:#7070e6",
        "§d": "font-weight:normal;text-decoration:none;color:#e8559e",
        "§5": "font-weight:normal;text-decoration:none;color:#7c10f2",
        "§f": "font-weight:normal;text-decoration:none;color:#ffffff",
        "§7": "font-weight:normal;text-decoration:none;color:#bfbfbf",
        "§8": "font-weight:normal;text-decoration:none;color:#6c757d",
        "§0": "font-weight:normal;text-decoration:none;color:#343a40",
        "§l": "font-weight:bold",
        "§n": "text-decoration:underline;text-decoration-skip:spaces",
        "§o": "font-style:italic",
        "§m": "text-decoration:line-through;text-decoration-skip:spaces"
    },
    applyCode: function(s, c) {
        let t = document.createElement("span");
        for (let s of c) t.style.cssText += MinecraftColorCodes.styleMap[s] + ";";
        return t.innerHTML = s, t;
    },
    parseStyle: function(s) {
        let e, t, n = s.match(/§.{1}/g) || [],
            r = [],
            l = [],
            a = document.createDocumentFragment();
        s = s.replace(/\n|\\n/g, "<br>");
        for (let e of n) r.push(s.indexOf(e)), s = s.replace(e, "\0\0");
        if (r[0] !== 0) a.appendChild(MinecraftColorCodes.applyCode(s.substring(0, r[0]), []));
        for (let c = 0; c < n.length; ++c) {
            if (2 === (t = r[c + 1] - r[c])) {
                for (; 2 === t;) l.push(n[c]), t = r[++c + 1] - r[c];
                l.push(n[c])
            }
            else l.push(n[c]);
            l.includes("§r") && (l = l.slice(l.lastIndexOf("§r") + 1));
            e = s.substring(r[c], r[c + 1]);
            a.appendChild(MinecraftColorCodes.applyCode(e, l));
        }
        return a
    }
};



if (typeof main !== "object") throw new Error("core library missing; nothing to extend");
main.init = function (app, $el, options = {}) {
	const apps = {
		codeInput: function ($el, options) {
			typeof options.digits !== "number" ? options.digits = 6 : void(0);
			let $oel = $el;
			$el.html(`<div class="input-group input-group-digit" style="width:${Math.ceil(options.digits * 42.5)}"px></div><input type="hidden" name="code">`);
			$el = $el.find(".input-group");
			for (let i = 0; i < options.digits; ++i) $el.append(`<input type="text" class="form-control form-control-digit" placeholder="-" autocomplete="one-time-code" name="n${Date.now()}${i}">`)
			let $codeInput = $el.find("input"),
			    inputs = [];
			$codeInput.iterator(function (i) {
			  inputs.push(i);
			})
			for (let input of inputs) {
			  let $input = $(input),
			      i = inputs.indexOf(input);
			  $input.input(function () {
			    input.value = input.value.replace(/[^\d]/g, "");
			    if (input.value.length > 1) {
			      let val = input.value.substr(0, inputs.length - i).split(""); //if not split, string prototypes are looped as well...
			      for (let j in val) inputs[+j + i].value = val[j];
			      if (i + val.length < inputs.length) inputs[i + val.length].focus();
			      else inputs[i + val.length - 1].focus()
			    }
			    else if (input.value.length > 0 && i < inputs.length - 1) inputs[i+1].focus();
			    input.value[0] ? input.value = input.value[0] : void(0);
			  });
			  if (i > 0) {
			    $input.keyup(function (e) {
			      let code = "";
			      $codeInput.iterator(function (j) {
			        code += j.value;
			      });
			      $("[name=code]").val(code);
			      $("[name=code]").trigger("change");
			      if ([8, 46, 37].includes(e.keyCode)) {
			        inputs[i - 1].focus();
			        inputs[i - 1].setSelectionRange(0, inputs[i - 1].value.length);
			      }
			    })
			  }
			}
		},
		console: function ($el, options) {
			if (typeof options !== "object") options = {text:"",callbacks:{},label:"$"};
			if (typeof options.label !== "string") options.label = "$";
			if (typeof options.text !== "string") options.text = "";
			if (typeof options.callbacks !== "object") options.callbacks = {};
			let lines = options.text.split("\n");
			let inputHistory = [];
			for (let i in lines) lines[i] = `<div class="line">${MinecraftColorCodes.toHTML(lines[i])}</div>`;
			$el.html(`<div class="console"><div class="console-view">${lines.join("")}</div><div class="console-input"><div class="input-group"><label class="input-group-text" for="consoleInput">${options.label}</label><input type="text" class="form-control px-0" placeholder="Type a command..." aria-label="${options.label}" id="consoleInput"></div></div></div>`);
		}
	}
	if (typeof apps[app] === "function") return apps[app]($el, options);
	throw new Error(`init.js: enoent application "${app}"`)
}
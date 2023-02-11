// Returns an element
function addElement(elType, content, id, classType, type, parentEl)
{
	let el = document.createElement(elType);
	el.className = classType;
	el.id = id;
	el.textContent = content;

	parentEl.appendChild(el);
	return el;
}

function updateExportButton()
{
	const dt = JSON.parse(window.localStorage.getItem("youyinCardData"))["cards"];

	var file = new Blob([JSON.stringify(dt)], { type: "application/json;charset=utf-8" });

	const link = document.createElement("a");
	link.href = URL.createObjectURL(file);
	link.download = "deck.yydeck.json";
	link.click();
	URL.revokeObjectURL(link.href);
}

function importDeck(f) {
	var bExecuted = confirm("Importing a deck WILL merge your current deck with the new one, to replace it first clear your current deck!");
	if (bExecuted)
	{
		var dt = JSON.parse(window.localStorage.getItem("youyinCardData"));
		const reader = new FileReader();
		reader.addEventListener("load", function(){
			var dt = JSON.parse(window.localStorage.getItem("youyinCardData"));
			dt["cards"].push.apply(dt["cards"], JSON.parse(this.result));

			window.localStorage.setItem("youyinCardData", JSON.stringify(dt));
			document.location.reload();
		});
		reader.readAsText(f.target.files[0])
	}
}

function clearDeck() {
	var bExecuted = confirm("Are you sure you want to DELETE the current deck, THIS CANNOT BE UNDONE! Export your data to save it just in case!");
	if (bExecuted)
	{
		var dt = JSON.parse(window.localStorage.getItem("youyinCardData"));
		dt["cards"] = [];

		window.localStorage.setItem("youyinCardData", JSON.stringify(dt));
		document.location.reload();
	}
}

function deckmain()
{
	if (window.localStorage.getItem('youyinCardData') === null)
	{
		const data = {
			sessions: 0,
			streak: 0,
			lastDate: 0,
			cards: [],
		};
		window.localStorage.setItem("youyinCardData", JSON.stringify(data))
		return;
	}

	document.getElementById("export-deck-button").addEventListener("click", updateExportButton);
	document.getElementById("clear-deck-button").addEventListener("click", clearDeck);
	document.getElementById("import-deck-button").addEventListener("click", function(){
		document.getElementById("fileupload").click();
	});
	document.getElementById("fileupload").addEventListener("change", importDeck);

	const data = JSON.parse(window.localStorage.getItem('youyinCardData'));
	var deck = document.getElementById("deck");

	for (var val in data["cards"])
	{
		const it = data["cards"][val];

		let div = document.createElement("div");
		div.className = "card centered";
		div.id = `${val}`

		addElement("h3", `${it["name"]} ${it["knowledge"]}/5`, "", "", "", div);
		const target = addElement("div", "", `card-character-target-div-${val}`, "", "", div);
		addElement("p", "Definitions:", "", "", "", div);

		let list = document.createElement("ol");
		for (var i in it["definitions"])
		{
			let f = it["definitions"][i];
			addElement("li", `${f}`, "", "", "", list);
		}
		div.appendChild(list);

		addElement("button", "Edit", `${val}`, "card-button-edit", "submit", div).addEventListener("click", function()
		{
			location.href = `./deck-edit-card.html?edit=${this.id}`;
		});

		deck.appendChild(div);

		let writer = HanziWriter.create(`card-character-target-div-${val}`, it["character"],
		{
			width: 100,
			heigt: 100,
			padding: 5,
			showOutline: true,
			strokeAnimationSpeed: 1.25,
			delayBetweenStrokes: 50,
		})
		target.addEventListener('mouseover', function() 
		{
			writer.animateCharacter();
		});
	}
}

deckmain();

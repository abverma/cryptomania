function addCoin() {

	var tableBody = document.getElementById("tableBody");

	var row = document.createElement("TR");

	var coinColumn = createDropdown(["BTC", "ETH", "XRP"]);
	var holdingColumn = createTableColumn("text");
	var priceColumn = createTableColumn("text");

	row.appendChild(coinColumn);
	row.appendChild(holdingColumn);
	row.appendChild(priceColumn);

	tableBody.appendChild(row);
	alert('Coin added');
}

function createTableColumn(type) {
	var column = document.createElement("TD");
	var coinText = document.createElement("INPUT");
	var typeAttribute = document.createAttribute("type");
	//var scopeAttribute = document.createAttribute()

	typeAttribute.value = type;
	coinText.setAttributeNode(typeAttribute);
	column.appendChild(coinText);
	return column;
}

function createDropdown(list) {

	var size = list.length;
	var select = document.createElement("select");
	var classAttribute = document.createAttribute("class");
	classAttribute.value = "dropdown";

	select.setAttributeNode(classAttribute);

	console.log(size);

	for (var i = 0; i < size; i++) {
		console.log(i);
		var option = document.createElement("option");

		var valueAttribute = document.createAttribute("value");
		valueAttribute.value = i;

		var classAttribute = document.createAttribute("class");
		classAttribute.value = "dropdown-item";
		option.setAttributeNode(valueAttribute);
		option.setAttributeNode(classAttribute);

		var text = document.createTextNode(list[i]);
		option.appendChild(text);

		select.appendChild(option);
	}
	return select;
}
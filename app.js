const word = document.querySelector(".word");
const wordOutput = document.querySelector(".word-output");
const defsOutput = document.querySelector(".list");
const addWordButton = document.querySelector(".add-word");
const wordBankButton = document.querySelector(".word-bank-button");
const wordBankList = document.querySelector(".word-bank-list");
const subHeading = document.querySelector(".sub-heading");
const form = document.querySelector(".word-search-form");
const searchButton = document.querySelector(".search-button");
const testMe = document.querySelector(".test-me-button");

let searchQuery;
let state = "search";
const wordBank = [];

// Search for word and recieve definitions
document.querySelector("form").addEventListener("submit", getJsonFromAPI);

function getJsonFromAPI(e){
    e.preventDefault();
    searchQuery = word.value;

    fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${searchQuery}?key=80f91304-6373-46c7-811a-96206ee6cb73`)
    .then(res => res.json())
    .then(data => {
		if(data.length === 0){
			alert("Couldn't find a matching word. Please ensure you entered the correct word and spelling")
			searchQuery = "";
		} else {
			let definitions = data[0].shortdef;
			console.log(typeof definitions)

			if(definitions === undefined){
				alert("Word Not found")
				searchQuery = "";

			} else {
				// Display current word in UI
				displayWordInUI(searchQuery);
				// Display definitions in UI
				displayDefinitionsInUI(definitions);
			}
			
		}
		
    })
	.catch(err => console.log(err))
	
	word.value = "";

}

function displayWordInUI(currentWord){
	wordOutput.textContent = currentWord;
}

function displayDefinitionsInUI(defs){
	let output = "";
	if(defs.length === 1){
		output = `<li>${defs}</li>`;
	} else {
		defs.forEach(function(def){
			output += `<li>${def}</li>`;
		});
	}
	

	defsOutput.innerHTML = output;
}

// Add words to bank
addWordButton.addEventListener("click", (e) => {
	if(searchQuery === ""){
		alert("Cannot add word to bank");
	} else {
		addWordToStorage(searchQuery);
	}
	
	console.log(wordBank);
})

function addWordToStorage(word){
	
	if(word === undefined){
		alert("No word selected")
	} else if (wordBank.indexOf(word) > -1){
		alert(`You have already added ${word} to your bank!`)
	} else {
		wordBank.push(word);
	}
	
}

// Display Word bank
wordBankButton.addEventListener("click", (e) =>{
	e.preventDefault();


	let output = "";
	if(state === "search" || state === "test"){
		if(wordBank.length === 0){
			alert("Your Word bank is empty! Add a new word first!")
		} else {
			// Hide search bar
			form.style.display = "none";
			// Change word heading from word search word to word bank title
			wordOutput.textContent = "Word Bank";
	
			// Hide the subheading
			subHeading.style.display = "none";
	
	
			wordBank.forEach(word => {
				output += `<li>${word}</li>`
			})
	
			console.log("this is the output: ", output)
			defsOutput.innerHTML = output;
		}
	}
	

	// Change state to word bank
	state = "word bank"
	
})

// Search button click functionality
searchButton.addEventListener("click", e => {
	e.preventDefault();
	if(state === "word bank" || state === "test"){
		// Show search bar
		form.style.display = "block";

		// Change word bank title to nothing
		wordOutput.textContent = "";

		// Show sub-heading
		subHeading.style.display = "block";

		// Remove word bank items
		defsOutput.innerHTML = "";
	}

	

	// change state to search
	state = "search";

})


// Test button functionality
testMe.addEventListener("click", e => {
	e.preventDefault();

	if(state === "search" || state === "word bank"){
		// Hide search bar
		form.style.display = "block";

		// Change heading to test
		wordOutput.textContent = "Test";

		// Show sub-heading
		subHeading.style.display = "none";

		// Hide list of words
		defsOutput.style.display = "none";
	}

	// Change state to test
	state = "test";
})
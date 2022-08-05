// Util function to shorten getting elements by id
_$ = (x) => document.querySelectorAll(`#${x}`)[0];

let ingredients = []; // List of ingredients to be used in recipie generation
let position = "run"; // The current section of the page
let theme = "light";
let currentRecipe = [];

window.onload = function() {
    // Trigger the scroll event so the navbat is updated properly
    window.dispatchEvent(new Event("scroll"));

    // Clear the input on load, preventing browser cache from saving previous input
    _$("input").value = "";

    // Random prompts
    var prompts = [
        "What's cookin'?",
        "What's in your fridge?",
        // ...
    ];

    let selected = prompts[Math.floor(Math.random() * prompts.length)];
    console.log(selected);
    _$("title").innerText = selected;

    // Ramdom ingredient placeholders
    var sampleIngredients = [
        "dough",
        "flour",
        "tomato",
        "tomato sauce",
        "mozzarella",
        "cheese",
        "pepperoni",
        "sausage",
        "ham",
        "bacon",
        "canadian bacon",
        "anchovies",
        "chicken",
        "onion",
        "pepper",
        "green bell pepper",
        "red pepper",
        "jalapeno",
        "pineapple",
        "mushroom",
        "olive",
        "spinach",
        "garlic",
        "basil",
        "oregano",
        "parsley",
        "rosemary",
        "thyme",
        "chives",
        "cilantro",
        "bell pepper",
        "yellow pepper",
        "green pepper",
    ];

    let selectedIngredient = sampleIngredients[Math.floor(Math.random() * sampleIngredients.length)];
    _$("input").placeholder = selectedIngredient + "...";

    // Every 5 seconds, change the placeholder text
    setInterval(() => {
        selectedIngredient = sampleIngredients[Math.floor(Math.random() * sampleIngredients.length)];
        _$("input").placeholder = selectedIngredient + "...";
    }, 5000);
  
  checkRecipe()
}

// Listen for the enter key to be pressed
// Additionally, clear any errors as soon as the user starts typing
document.addEventListener("keydown", (event) => {
    // If Alt+Enter or Shift+Enter is pressed, run the sendResults function
    if (event.key === "Enter" && (event.altKey || event.shiftKey || event.ctrlKey)) {
        return sendResults();
    }
  
    if (event.key === "Enter" && _$("input").value !== "") {
        addItem();
    }

    if (_$("error").innerText !== "" && event.key !== "Enter") {
        setTimeout(() => _$("error").innerText = "", 200);
    }

});

// Edit the 'scroll' event to track the page position, and update the 
// position of the navbar indicator proportional to the scroll position
window.addEventListener("scroll", () => {
    //console.log(window.scrollY >= _$("team").offsetTop, window.scrollY, _$("team").offsetTop);
    // Get the percentage of the page scrolled
    let scrollPercentage = 100 * (window.scrollY / (document.body.scrollHeight - window.innerHeight));

    // Even though we have a percentage, the navbar indicator's width is not 
    // factored, so we need to divide our percentage by an arbitrary number to 
    // offset the width of the indicator (This works for any page or nav size !!)
    _$("pos").children[0].style.marginLeft = `calc(${scrollPercentage / 1.39}%)`;

    //console.log(window.innerWidth, position);
    let navbarItems = _$("nav").children;

    if (window.scrollY < _$("about").offsetTop) {
        position = "run";
        // If we're on the run section, change the first navbar-item's 
        // content's colors to match the theme
        if (theme === "light") {
            navbarItems[0].children[0].src = "https://img.icons8.com/ios-glyphs/30/ffa845/play-button-circled--v1.png"
            navbarItems[0].children[1].style.color = "#ffa845";
        } else {
            navbarItems[0].children[0].src = "https://img.icons8.com/ios-glyphs/30/71deff/play-button-circled--v1.png"
            navbarItems[0].children[1].style.color = "#71deff";
        }

        // Reset the other navbar-items when not focused
        for (let i = 1; i < navbarItems.length; i++) {
            let img = navbarItems[i].children[0].src;
            if (theme === "light") {
                navbarItems[i].children[0].src = img.replace("ffa845", "000000");
                navbarItems[i].children[1].style.color = "#000000";
            } else {
                navbarItems[i].children[0].src = img.replace("71deff", "ffffff");
                navbarItems[i].children[1].style.color = "#ffffff";
            }
        }

    } else if (window.scrollY >= _$("about").offsetTop && window.scrollY < _$("team").offsetTop) {
        position = "about";

        // If we're on the about section, change the second navbar-item's
        // content's colors to match the theme
        if (theme === "light") {
            navbarItems[1].children[0].src = "https://img.icons8.com/ios-glyphs/30/ffa845/info--v1.png"
            navbarItems[1].children[1].style.color = "#ffa845";
        } else {
            navbarItems[1].children[0].src = "https://img.icons8.com/ios-glyphs/30/71deff/info--v1.png"
            navbarItems[1].children[1].style.color = "#71deff";
        }

        // Reset the other navbar-items when not focused
        for (let i = 0; i < navbarItems.length; i++) {
            if (i !== 1) {
                let img = navbarItems[i].children[0].src;
                if (theme === "light") {
                    navbarItems[i].children[0].src = img.replace("ffa845", "000000");
                    navbarItems[i].children[1].style.color = "#000000";
                } else {
                    navbarItems[i].children[0].src = img.replace("71deff", "ffffff");
                    navbarItems[i].children[1].style.color = "#ffffff";
                }
            }
        }
    } else if (window.scrollY >= _$("team").offsetTop) {
        //console.log("team");
        position = "team";

        // If we're on the team section, change the third navbar-item's
        // content's colors to match the theme
        if (theme === "light") {
            navbarItems[2].children[0].src = "https://img.icons8.com/ios-glyphs/30/ffa845/leadership--v1.png"
            navbarItems[2].children[1].style.color = "#ffa845";
        } else {
            navbarItems[2].children[0].src = "https://img.icons8.com/ios-glyphs/30/71deff/leadership--v1.png"
            navbarItems[2].children[1].style.color = "#71deff";
        }

        // Reset the other navbar-items when not focused
        for (let i = 0; i < navbarItems.length - 1; i++) {
            let img = navbarItems[i].children[0].src;
            if (theme === "light") {
                navbarItems[i].children[0].src = img.replace("ffa845", "000000");
                navbarItems[i].children[1].style.color = "#000000";
            } else {
                navbarItems[i].children[0].src = img.replace("71deff", "ffffff");
                navbarItems[i].children[1].style.color = "#ffffff";
            }
        }
    }

    // If our position is at the last section, change the down arrow to an up arrow
    if (position === "team") {
        if (theme === "light") {
            _$("next").src = "https://img.icons8.com/ios-glyphs/30/ffa845/collapse-arrow.png";
        } else {
            _$("next").src = "https://img.icons8.com/ios-glyphs/30/71deff/collapse-arrow.png";
        }
    }

    // Otherwise, change it back
    if (position !== "team") {
        if (theme === "light") {
            _$("next").src = "https://img.icons8.com/ios-glyphs/30/ffa845/expand-arrow--v1.png";
        } else {
            _$("next").src = "https://img.icons8.com/ios-glyphs/30/71deff/expand-arrow--v1.png";
        }
    }
});
    


const addItem = () => {
    // ADD MULTI ITEM HANDLING PLEASE !!!!! 

    // Handle any input errors
    if (_$("input").value.trim() === "") {
        // If the input field is empty or only contains whitespace, show an error
        _$("error").innerText = "Please enter an ingredient!";  
        _$("input").value = "";

        setTimeout(() => _$("error").innerText = "", 3000);
        return;
    } else if (ingredients.includes(_$("input").value)) {
        // If the input field contains an ingredient that is already in the list, show an error
        _$("error").innerText = "You already have that ingredient!";
        _$("input").value = "";

        setTimeout(() => _$("error").innerText = "", 3000);
        return;
    } else if (!/^[a-zA-Z\u00C0-\u00FF ]+$/.test(_$("input").value)) {
        // If the input field contains a non-alphanumeric character, OR any characters that
        // are not in the Latin Supplement range (accented letters) \u00C0-\u00FF, show an error
        _$("error").innerText = "Please enter a valid ingredient!";
        _$("input").value = "";

        setTimeout(() => _$("error").innerText = "", 3000);
        return;
    }

    let ingredient = _$("input").value;
    _$("input").value = "";

    // Add the ingredient to the list
    ingredients.push(ingredient);

    // Create HTML code for the new list item
    let listItem = document.createElement("div");
    listItem.id = ingredient.trim().replace(/\s/g, "-"); // "unsalted butter" -> "unsalted-butter" 
    listItem.className = "list-item";
    listItem.onclick = () => { removeItem(ingredient.trim().replace(/\s/g, "-")) };
    listItem.innerHTML = `
        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cancel.png"/>
        <span>${ingredient}</span>
    `;

    _$("list").appendChild(listItem);
}

const removeItem = (item) => {
    // Delete the element
    _$(item).remove();

    // Filter out the item from the list 
    ingredients = ingredients.filter(i => i !== item);
    //console.log(ingredients);
}


const randomize = () => {
    isRand = true;
    // Dummy list, rewrite with a db of ingredients later
    let sampleIngredients = [
        "dough",
        "flour",
        "tomato",
        "tomato sauce",
        "mozzarella",
        "cheese",
        "pepperoni",
        "sausage",
        "ham",
        "bacon",
        "canadian bacon",
        "chicken",
        "onion",
        "pepper",
        "green bell pepper",
        "red pepper",
        "jalapeno",
        "pineapple",
        "mushroom",
        "olive",
        "spinach",
        "garlic",
        "basil",
        "oregano",
        "parsley",
        "rosemary",
        "thyme",
        "chives",
        "cilantro",
        "bell pepper",
        "yellow pepper",
        "green pepper",
    ];

    // Randomize the list
    randIngredients = sampleIngredients.sort(() => Math.random() - 0.5);

    // Cut the list at a random point (no less than 5 items, no more than 15)
    let x = Math.floor(Math.random() * Math.max(5, 15))

    // slice the range 
    randIngredients = randIngredients.slice(0, x);
    return randIngredients;

}

const setTheme = () => {
    // trigger scroll for a second
    window.scrollBy(0, 2048);
    window.scrollBy(0, -2048);
    //console.log(theme);
    // Get the current theme
    let root = document.documentElement;

    // Check the current theme and begin changing the colors
    if (theme === "light") {
        _$("switcher-ico").src = "https://img.icons8.com/ios-glyphs/48/ffffff/moon-symbol.png"; // Change icon to Moon
        root.style.setProperty("--color-primary", "#373b4d");  
        root.style.setProperty("--color-secondary", "#bfc4d9"); 
        root.style.setProperty("--color-selected", "#4a4e62");
        root.style.setProperty("--color-active", "#5e6278");

        root.style.setProperty("--result-color", "linear-gradient(to bottom right,#373b4d,#272d49)");

        root.style.setProperty("--text-section", "#373b4d");
        root.style.setProperty("--text-paragraph", "#6d7184");

        root.style.setProperty("--theme-primary", "#71deff");
        root.style.setProperty("--btn-primary", "linear-gradient(to bottom right,#71deff,#00a0ff)");
        root.style.setProperty("--gradient-light", "linear-gradient(to bottom right,#e8ecff,#71deff,#3be3b2)");
        root.style.setProperty("--gradient-light-alt", "linear-gradient(to right,#e8ecff,#71deff,#3be3b2)");

        // Fix the color of the down button
        _$("next").src = _$("next").src.replace(/ffffff/g, "000000");

        theme = "dark";
    } else {
        _$("switcher-ico").src = "https://img.icons8.com/ios-glyphs/48/ffffff/sun--v1.png"; // Change icon to Sun
        root.style.setProperty("--color-primary", "#fff");
        root.style.setProperty("--color-secondary", "gray");
        root.style.setProperty("--color-selected", "#eee");
        root.style.setProperty("--color-active", "#dfdfdf");

        root.style.setProperty("--result-color", "linear-gradient(to bottom right,#fff,#ededed)");

        root.style.setProperty("--text-section", "#000");
        root.style.setProperty("--text-paragraph", "#dedede");

        root.style.setProperty("--theme-primary", "#ffa845");
        root.style.setProperty("--btn-primary", "linear-gradient(to bottom right,#ffa845,#ff8215)");

        root.style.setProperty("--gradient-light", "linear-gradient(to bottom right,#ffc36e,#ff5757,#9c37be,#3f3f3f)");
        root.style.setProperty("--gradient-light-alt", "linear-gradient(to right,#ffc36e,#ff5757,#9c37be)");

        // Fix the color of the down button
        //console.log("fixing color");
        //_$("next").src = "https://img.icons8.com/ios-glyphs/30/000000/expand-arrow--v1.png";

        theme = "light";
    }

    // Loop through all the navbar items and change the color of the inactive item 
    let navbarItems = _$("nav").children;

    for (let i = 0; i < navbarItems.length; i++) {
        // Replace any 000000 or ffffffs with the theme's inactive color
        if (theme === "light") {
            navbarItems[i].children[0].src = navbarItems[i].children[0].src.replace(/ffffff/, "000000");
        } else {
            navbarItems[i].children[0].src = navbarItems[i].children[0].src.replace(/000000/, "ffffff");
        }
    }
}


const setRecipe = (data) => {
  
    //currentRecipe = data;
    // PAINFUL !!!
    let res = data.split("\n"); // res array
    
    let genTitle = res.slice(0, res.indexOf(""))[0].trim(); // title
    let ingInstArr = res.slice(res.indexOf("") + 1); // ing and inst
    let genIngredients = ingInstArr.slice(0, ingInstArr.indexOf("")); // ing
    let genInstructions = ingInstArr.slice(ingInstArr.indexOf("") + 1); // inst
  
    currentRecipe = [genTitle, genIngredients, genInstructions];

    console.log(genTitle, genIngredients, genInstructions);

    // Show the result items
    let resElms = ["res-title", "res-container", "btn-result"];
    for (let i = 0; i < resElms.length; i++) {
        _$(resElms[i]).style.display = "flex";
    }

    // Set the title
    _$("r-title").innerText = genTitle;

    // Set the ingredients 
    let list = _$("r-ing-container");
    for (let i = 0; i < genIngredients.length; i++) {
        // create a span element with class .r-item
        let span = document.createElement("span");
        span.className = "r-item";
        span.innerText = genIngredients[i];

        list.appendChild(span);
    }

    // Set the instructions
    let instructions = _$("r-step-container");
    for (let i = 0; i < genInstructions.length; i++) {
        // create a span element with class .r-item
        let span = document.createElement("span");
        span.className = "r-item";
        span.innerText = genInstructions[i];

        instructions.appendChild(span);
    }
  
  // Hide the Retry button if we're working with an image (hotfix)
    if (isImage) {
      _$("retry").style.display = 'none';
    }
}

const goTo = (id) => {
    // If the function is run without any parameters,
    // get the current position of the page, and find
    // the next section (if at the bottom, go to the top)
    if (!id) {
        switch (position) {
            case "run":
                id = "about";
                break;
            case "about":
                id = "team";
                break;
            case "team":
                id = "run"; // return to the top
                break;
        }
    }

    if (id == "run") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({
          top: _$(id).offsetTop + 100,
          behavior: "smooth" // neat :D
      });
    }
}

function reveal_the_BUTTON(){
  _$("copy").style.display = "flex",
  _$("print").style.display = "flex",
  _$("save").style.display = "none";
}


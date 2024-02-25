// Wait for the DOM to fully load before executing any scripts
document.addEventListener("DOMContentLoaded", function () {
  setInitialHeading(); // Set the initial heading when the page loads
});

// Sets the initial heading on the web page
function setInitialHeading() {
  document.getElementById("heading").innerHTML =
    "<h2>Find Your Meals Here!</h2>";
}

// Event listener for the search input to filter meals as the user types
document.getElementById("searchInput").addEventListener("input", function () {
  searchMeals(this.value);
});

// Event listener for toggling the display between all meals and favorites
document.getElementById("fav").addEventListener("click", toggleFavoritesDisplay);

// Array to store fetched meals data for easy access
let mealsData = [];

// Searches for meals based on the user's query input
function searchMeals(query) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((response) => response.json())
    .then((data) => {
      mealsData = data.meals; // Store the fetched meals data
      displayMeals(mealsData); // Display the fetched meals
      document.getElementById("heading").innerHTML =
        "<h2>Find Your Meals Here!</h2>";
    })
    .catch((err) => console.error(err)); // Log errors to the console
}

// Displays meals on the web page
function displayMeals(meals) {
  const container = document.getElementById("meals-container");
  container.innerHTML = ""; // Clear any existing meals before displaying new ones
  container.style.display = "flex"; // Ensure the container is visible

  if (meals) {
    meals.forEach((meal) => {
      const mealElement = document.createElement("div");
      mealElement.classList.add("meal-item");
      mealElement.innerHTML = `
                <img src="${meal.strMealThumb}" alt="Meal Image">
                <p class="meal-title" data-id="${meal.idMeal}">${
        meal.strMeal
      }</p>
                <button class="fav-btn" data-id="${meal.idMeal}">
                    <i class="fa-solid fa-heart" style="color: ${
                      isFavorite(meal.idMeal) ? "red" : "white"
                    };"></i>
                </button>
            `;
      container.appendChild(mealElement);
    });
  } else {
    container.innerHTML = `<p>No meals found. Try another search!</p>`;
  }

  // Add event listeners for meal titles and favorite buttons
  document.querySelectorAll(".meal-title").forEach((item) => {
    item.addEventListener("click", function () {
      showMealDetails(this.getAttribute("data-id"));
    });
  });

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      toggleFavorite(this.getAttribute("data-id"), this);
    });
  });
}

// Displays detailed information for a selected meal
function showMealDetails(mealId) {
  const meal = mealsData.find((m) => m.idMeal === mealId);
  if (meal) {
    const detailsContainer = document.getElementById("meal-details");
    detailsContainer.innerHTML = `
            <h2>Meal Details Page</h2>
            <button id="backBtn">Go Back</button>
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strInstructions}</p>
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        `;
    // Show the meal details and hide the meal list
    detailsContainer.style.display = "flex";
    document.getElementById("meals-container").style.display = "none";
    document.getElementById("search-container").style.display = "none";
    document.getElementById("heading").innerHTML = "";

    // Event listener for the back button
    document.getElementById("backBtn").addEventListener("click", function () {
      // Return to the meal list view
      detailsContainer.style.display = "none";
      document.getElementById("meals-container").style.display = "flex";
      document.getElementById("search-container").style.display = "block";
      document.getElementById("heading").innerHTML =
        "<h2>Find Your Meals Here!</h2>";
    });
  }
}

// Toggles a meal's favorite status and updates the favorite button's appearance
function toggleFavorite(mealId, btnElement) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  mealId = mealId.toString(); // Ensure mealId is a string for consistent comparison
  const index = favorites.indexOf(mealId);
  if (index === -1) {
    favorites.push(mealId); // Add to favorites if not already a favorite
    btnElement.innerHTML = `<i class="fa-solid fa-heart" style="color: red;"></i>`;
  } else {
    favorites.splice(index, 1); // Remove from favorites if already a favorite
    btnElement.innerHTML = `<i class="fa-solid fa-heart" style="color: white;"></i>`;
  }
  localStorage.setItem("favorites", JSON.stringify(favorites)); // Update favorites in local storage
}

// Checks if a meal is a favorite
function isFavorite(mealId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.includes(mealId.toString()); // Ensure consistent comparison
}

// State to track whether favorites are being shown
let isFavoritesShown = false;

// Toggles the display between all meals and favorites
function toggleFavoritesDisplay() {
  isFavoritesShown = !isFavoritesShown;
  if (isFavoritesShown) {
    document.getElementById("heading").innerHTML = "<h2>Favorites Here!</h2>";
    displayFavorites(); // Show only favorites
  } else {
    document.getElementById("heading").innerHTML =
      "<h2>Find Your Meals Here!</h2>";
    displayMeals(mealsData); // Show all meals
  }
}

// Displays only favorite meals
function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const meals = mealsData.filter((meal) =>
    favorites.includes(meal.idMeal.toString())
  ); // Filter meals to show only favorites
  displayMeals(meals);
}

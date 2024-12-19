document.addEventListener("DOMContentLoaded", function () {
    const authButton = document.querySelector(".button-auth");
    const logoutButton = document.querySelector(".button-out");
    const modalAuth = document.querySelector(".modal-auth");
    const closeAuthButton = document.querySelector(".close-auth");
    const loginForm = document.getElementById("logInForm");
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("password");
    const userNameSpan = document.querySelector(".user-name");
    const cardsContainer = document.querySelector(".cards.cards-restaurants");

    const dbFolder = "db/";

    async function loadRestaurantData() {
        const fileNames = [
            "food-band.json",
            "ikigai.json",
            "partners.json",
            "pizza-burger.json",
            "pizza-plus.json",
            "puzata-hata.json",
            "tanuki.json",
        ];

        const restaurantData = [];

        for (const fileName of fileNames) {
            try {
                const response = await fetch(`${dbFolder}${fileName}`);
                const data = await response.json();
                restaurantData.push(...data);
            } catch (error) {
                console.error(`Ошибка загрузки файла ${fileName}:`, error);
            }
        }

        return restaurantData;
    }

    function generateRestaurantCards(data) {
        cardsContainer.innerHTML = ""; 
        data.forEach((restaurant) => {
            const cardHTML = `
                <a href="#" class="card card-restaurant">
                    <img src="${restaurant.image}" alt="${restaurant.name}" class="card-image" />
                    <div class="card-text">
                        <div class="card-heading">
                            <h3 class="card-title">${restaurant.name}</h3>
                            <span class="card-tag tag">${restaurant.time || "Час невідомий"}</span>
                        </div>
                        <div class="card-info">
                            <div class="rating">${restaurant.rating || "Рейтинг недоступний"}</div>
                            <div class="price">${restaurant.price || "Ціна недоступна"}</div>
                            <div class="category">${restaurant.category || "Категорія невідома"}</div>
                        </div>
                    </div>
                </a>
            `;
            cardsContainer.insertAdjacentHTML("beforeend", cardHTML);
        });
    }

    async function init() {
        const restaurantData = await loadRestaurantData();
        generateRestaurantCards(restaurantData);

       
        if (localStorage.getItem("login")) {
            displayLoggedIn(localStorage.getItem("login"));
        } else {
            displayLoggedOut();
        }
    }

    cardsContainer.addEventListener("click", function (event) {
        const card = event.target.closest(".card-restaurant");

        if (!card) return;

        if (!localStorage.getItem("login")) {
            modalAuth.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    });

    authButton.addEventListener("click", () => {
        modalAuth.style.display = "flex";
        document.body.style.overflow = "hidden";
        resetInputBorders();
    });

    closeAuthButton.addEventListener("click", () => {
        closeModal();
    });

    modalAuth.addEventListener("click", (event) => {
        if (event.target === modalAuth) {
            closeModal();
        }
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (!login || !password) {
            if (!login) loginInput.style.borderColor = "red";
            if (!password) passwordInput.style.borderColor = "red";
            alert("Будь ласка, заповніть усі поля.");
        } else {
            localStorage.setItem("login", login);
            displayLoggedIn(login);
            closeModal();
        }
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("login");
        displayLoggedOut();
    });

    function displayLoggedIn(login) {
        authButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        userNameSpan.textContent = login;
        userNameSpan.style.display = "inline";
        loginInput.style.borderColor = "";
        passwordInput.style.borderColor = "";
    }

    function displayLoggedOut() {
        authButton.style.display = "inline-block";
        logoutButton.style.display = "none";
        userNameSpan.textContent = "";
        userNameSpan.style.display = "none";
        loginInput.value = "";
        passwordInput.value = "";
    }

    function closeModal() {
        modalAuth.style.display = "none";
        document.body.style.overflow = "";
        resetInputBorders();
    }

    function resetInputBorders() {
        loginInput.style.borderColor = "";
        passwordInput.style.borderColor = "";
    }

    init();
});

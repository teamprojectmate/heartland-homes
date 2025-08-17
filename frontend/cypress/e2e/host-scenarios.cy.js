// cypress/e2e/host-scenarios.cy.js

import authService from "../../src/api/authService";

describe("Сценарії для орендодавців", () => {
  const loginHostUser = () => {
    cy.request("POST", "**/auth/login", {
      email: "host@test.com",
      password: "password",
    }).then((response) => {
      window.localStorage.setItem("user", JSON.stringify(response.body));
    });
    cy.visit("/");
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    loginHostUser();
  });

  // ==================== Тест реєстрації орендодавця ====================
  it("повинен дозволити новому користувачу зареєструватися, отримати роль орендодавця та додати помешкання", () => {
    const newFirstName = "New";
    const newLastName = "Host";
    const newEmail = `newhostuser_${Cypress._.random(0, 1e6)}@test.com`;
    const newPassword = "newpassword";
    const newRepeatPassword = "newpassword";

    cy.visit("/register");

    cy.intercept("POST", "**/auth/registration", {
      statusCode: 201,
      body: { message: "Користувача успішно зареєстровано" },
    }).as("registerHost");

    cy.get('input[placeholder="Ім\'я"]').type(newFirstName);
    cy.get('input[placeholder="Прізвище"]').type(newLastName);
    cy.get('input[placeholder="Електронна пошта"]').type(newEmail);
    cy.get('input[placeholder="Пароль"]').type(newPassword);
    cy.get('input[placeholder="Повторіть пароль"]').type(newRepeatPassword);
    cy.get('button[type="submit"]').click();

    cy.wait("@registerHost");

    cy.url().should("include", "/login");
    
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        user: { firstName: newFirstName, lastName: newLastName, email: newEmail, role: "MANAGER" },
        token: "mock-new-host-jwt-token",
      },
    }).as("loginNewHost");

    cy.get('input[placeholder="Електронна пошта"]').type(newEmail);
    cy.get('input[placeholder="Пароль"]').type(newPassword);
    cy.get('button[type="submit"]').click();

    cy.wait("@loginNewHost");

    cy.url().should("not.include", "/login");
    
    cy.get("a.nav-link").contains("Додати помешкання").should("be.visible").click();
    cy.url().should("include", "/accommodations/new");
    cy.get("h2").contains("Створити нове помешкання").should("be.visible");

    // ✅ Виправлення: Оновлюємо заповнення форми для відповідності новим полям
    cy.get('input[placeholder="Місцезнаходження (напр. Вулиця Незалежності, 10)"]').type("Вулиця Нова, 5");
    cy.get('input[placeholder="Місто"]').type("Київ");
    cy.get('input[placeholder="Розмір (напр. \'50 м²\')"]').type("70 м²");
    cy.get('textarea[placeholder="Зручності (перерахуйте через кому: Wi-Fi, Парковка,...) "]').type("Wi-Fi, Парковка");
    cy.get('input[placeholder="Ціна за добу"]').type("75");
    cy.get('input[placeholder="Доступна кількість"]').type("5");
    cy.get('input[placeholder="URL зображення"]').type("https://placehold.co/600x400");
    cy.get('select').select("APARTMENT");

    // ✅ Виправлення: Оновлюємо мок-дані для відповідності новій схемі
    cy.intercept("POST", "**/accommodations", {
      statusCode: 201,
      body: {
        id: 999,
        location: "Вулиця Нова, 5",
        city: "Київ",
        dailyRate: 75,
        type: "APARTMENT"
      },
    }).as("addAccommodation");

    cy.get('button[type="submit"]').click();

    cy.wait("@addAccommodation");
    
    cy.url().should("include", "/accommodations/my");
    cy.contains("Вулиця Нова, 5").should("be.visible");
  });

  // ==================== Тест додавання помешкання ====================
  it("повинен дозволити аутентифікованому користувачу додати нове помешкання", () => {
    // ✅ Виправлення: Оновлюємо мок-дані для відповідності новій схемі
    cy.intercept("POST", "**/accommodations", {
      statusCode: 201,
      body: {
        id: 998,
        location: "Вулиця Тестова, 123",
        city: "Львів",
        dailyRate: 55,
        type: "APARTMENT"
      },
    }).as("addAccommodation");

    cy.get("a.nav-link").contains("Додати помешкання").should("be.visible").click();
    cy.url().should("include", "/accommodations/new");
    
    // ✅ Виправлення: Оновлюємо заповнення форми для відповідності новим полям
    cy.get('input[placeholder="Місцезнаходження (напр. Вулиця Незалежності, 10)"]').type("Вулиця Тестова, 123");
    cy.get('input[placeholder="Місто"]').type("Львів");
    cy.get('input[placeholder="Розмір (напр. \'50 м²\')"]').type("70 м²");
    cy.get('textarea[placeholder="Зручності (перерахуйте через кому: Wi-Fi, Парковка,...) "]').type("Wi-Fi");
    cy.get('input[placeholder="Ціна за добу"]').type("55");
    cy.get('input[placeholder="Доступна кількість"]').type("3");
    cy.get('input[placeholder="URL зображення"]').type("https://placehold.co/600x400");
    cy.get('select').select("APARTMENT");

    cy.get('button[type="submit"]').click();

    cy.wait("@addAccommodation");

    cy.url().should("include", "/accommodations/my");
    cy.contains("Вулиця Тестова, 123").should("be.visible");
  });

  // ==================== Тест редагування помешкання ====================
  it("повинен дозволити орендодавцю редагувати власне помешкання", () => {
    const accommodationId = 101;

    // ✅ Виправлення: Оновлюємо мок-дані для відповідності новій схемі
    cy.intercept("GET", "**/ccommodations/my*", {
      statusCode: 200,
      body: {
        content: [{
          id: accommodationId,
          location: "Вулиця Тестова, 123",
          city: "Київ",
          dailyRate: 55,
          type: "APARTMENT",
          size: "70 m²",
          amenities: ["Wi-Fi", "Парковка"],
          images: "https://placehold.co/600x400"
        }],
        totalPages: 1,
        totalElements: 1
      },
    }).as("getMyAccommodations");

    // ✅ Виправлення: Оновлюємо мок-дані для відповідності новій схемі
    cy.intercept("PUT", `**/accommodations/${accommodationId}`, {
      statusCode: 200,
      body: {
        id: accommodationId,
        location: "Вулиця Тестова, 123",
        city: "Київ",
        dailyRate: 60,
        type: "APARTMENT"
      },
    }).as("updateAccommodation");

    cy.visit("/accommodations/my");
    cy.wait("@getMyAccommodations");

    cy.contains("Вулиця Тестова, 123")
      .parents(".card")
      .find("button")
      .contains("Редагувати")
      .click();

    cy.url().should("include", `/accommodations/edit/${accommodationId}`);
    
    // ✅ Виправлення: Оновлюємо селектори для відповідності новій формі
    cy.get('input[placeholder="Ціна за добу"]').clear().type("60");

    cy.get('button[type="submit"]').click();

    cy.wait("@updateAccommodation");

    cy.url().should("include", "/accommodations/my");
    cy.contains("Вулиця Тестова, 123").should("be.visible");
  });

  // ==================== Тест видалення помешкання ====================
  it("повинен дозволити орендодавцю видалити власне помешкання", () => {
    const accommodationId = 101;

    cy.intercept("GET", "**/accommodations/my*", {
      statusCode: 200,
      body: {
        content: [{
          id: accommodationId,
          location: "Вулиця Тестова, 123",
          dailyRate: 55,
          type: "APARTMENT",
          name: "Тестова квартира 1"
        }],
        totalPages: 1,
        totalElements: 1
      },
    }).as("getMyAccommodations");

    cy.intercept("DELETE", `**/accommodations/${accommodationId}`, {
      statusCode: 204,
    }).as("deleteAccommodation");

    cy.visit("/accommodations/my");
    cy.wait("@getMyAccommodations");

    cy.contains("Вулиця Тестова, 123")
      .parents(".card")
      .find("button")
      .contains("Видалити")
      .click();

    cy.wait("@deleteAccommodation");
    cy.contains("Вулиця Тестова, 123").should("not.exist");
  });
});

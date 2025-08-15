// cypress/e2e/host-scenarios.cy.js

// Імпортуємо authService для прямого входу, щоб прискорити тести
import authService from "../../src/api/authService";

describe("Сценарії для орендодавців", () => {
  // Допоміжна функція для входу в систему як орендодавець
  const loginHostUser = () => {
    cy.request("POST", "**/api/v1/auth/login", {
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
    const newEmail = `newhostuser_${Cypress._.random(0, 1e6)}@test.com`; // Генеруємо унікальний email
    const newPassword = "newpassword";
    const newRepeatPassword = "newpassword";

    cy.visit("/register");

    // ✅ Виправлення: Мокаємо ендпоінт `/auth/registration`
    cy.intercept("POST", "**/api/v1/auth/registration", {
      statusCode: 201,
      body: { message: "Користувача успішно зареєстровано" },
    }).as("registerHost");

    // Заповнюємо та відправляємо оновлену форму реєстрації
    // ✅ Виправлення: Змінюємо селектори та додаємо нові поля
    cy.get('input[placeholder="Ім\'я"]').type(newFirstName);
    cy.get('input[placeholder="Прізвище"]').type(newLastName);
    cy.get('input[placeholder="Електронна пошта"]').type(newEmail);
    cy.get('input[placeholder="Пароль"]').type(newPassword);
    cy.get('input[placeholder="Повторіть пароль"]').type(newRepeatPassword);

    cy.get('button[type="submit"]').click();

    cy.wait("@registerHost");

    // ✅ Після успішної реєстрації нас перенаправляє на сторінку входу
    cy.url().should("include", "/login");
    
    // Продовжуємо сценарій з новим користувачем, який вже зареєструвався
    // ✅ Вхід нового користувача
    cy.intercept("POST", "**/api/v1/auth/login", {
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
    
    // ✅ Тепер, коли ми увійшли, перевіряємо наявність кнопки "Додати помешкання"
    cy.get("a.nav-link").contains("Додати помешкання").should("be.visible").click();
    cy.url().should("include", "/accommodations/new"); // ✅ Оновлено URL
    cy.get("h2").contains("Додати нове помешкання").should("be.visible");

    // ✅ Заповнюємо та відправляємо форму для нового помешкання
    cy.get('input[placeholder="Назва помешкання"]').type("Квартира нового хоста");
    cy.get('textarea[placeholder="Опис помешкання"]').type("Квартира від новозареєстрованого хоста.");
    cy.get('input[placeholder="Адреса"]').type("Вулиця Нова, 5");
    cy.get('input[placeholder="Ціна за ніч"]').type("75");
    cy.get('input[placeholder="Розмір"]').type("70");
    cy.get('select').select("APARTMENT");

    cy.intercept("POST", "**/api/v1/accommodations", {
      statusCode: 201,
      body: {
        id: 999,
        location: "Вулиця Нова, 5",
        dailyRate: 75,
        type: "APARTMENT"
      },
    }).as("addAccommodation");

    cy.get('button[type="submit"]').click();

    cy.wait("@addAccommodation");
    
    // ✅ Перевіряємо, що після додавання нас перенаправляє на сторінку "Мої помешкання"
    cy.url().should("include", "/accommodations/my");
    cy.contains("Квартира нового хоста").should("be.visible");
  });

  // ==================== Тест додавання помешкання ====================
  it("повинен дозволити аутентифікованому користувачу додати нове помешкання", () => {
    cy.intercept("POST", "**/api/v1/accommodations", {
      statusCode: 201,
      body: {
        id: 998,
        location: "Вулиця Тестова, 123",
        dailyRate: 55,
        type: "APARTMENT"
      },
    }).as("addAccommodation");

    // ✅ Виправлення: Змінюємо селектор, щоб перейти на правильну сторінку
    cy.get("a.nav-link").contains("Додати помешкання").should("be.visible").click();
    cy.url().should("include", "/accommodations/new");

    cy.get('input[placeholder="Назва помешкання"]').type("Тестова квартира 2");
    cy.get('textarea[placeholder="Опис помешкання"]').type("Затишна квартира для тестування.");
    cy.get('input[placeholder="Адреса"]').type("Вулиця Тестова, 123");
    cy.get('input[placeholder="Ціна за ніч"]').type("55");
    cy.get('input[placeholder="Розмір"]').type("70");
    cy.get('select').select("APARTMENT");

    cy.get('button[type="submit"]').click();

    cy.wait("@addAccommodation");

    // ✅ Перевіряємо, що після додавання нас перенаправляє на "Мої помешкання"
    cy.url().should("include", "/accommodations/my");
    cy.contains("Тестова квартира 2").should("be.visible");
  });

  // ==================== Тест редагування помешкання ====================
  it("повинен дозволити орендодавцю редагувати власне помешкання", () => {
    const accommodationId = 101;

    cy.intercept("GET", "**/api/v1/accommodations/my*", {
      statusCode: 200,
      body: {
        content: [{
          id: accommodationId,
          location: "Вулиця Тестова, 123",
          dailyRate: 55,
          type: "APARTMENT",
          name: "Тестова квартира 1",
          description: "Тестовий опис",
          size: "70"
        }],
        totalPages: 1,
        totalElements: 1
      },
    }).as("getMyAccommodations");

    cy.intercept("PUT", `**/api/v1/accommodations/${accommodationId}`, {
      statusCode: 200,
      body: {
        id: accommodationId,
        location: "Вулиця Тестова, 123",
        dailyRate: 60,
        type: "APARTMENT",
        name: "Тестова квартира 1"
      },
    }).as("updateAccommodation");

    cy.visit("/accommodations/my");
    cy.wait("@getMyAccommodations");

    cy.contains("Тестова квартира 1")
      .parents(".card")
      .find("button")
      .contains("Редагувати")
      .click();

    cy.url().should("include", `/accommodations/edit/${accommodationId}`);
    cy.get('input[placeholder="Ціна за ніч"]').clear().type("60");

    cy.get('button[type="submit"]').click();

    cy.wait("@updateAccommodation");

    cy.url().should("include", "/accommodations/my");
    cy.contains("Тестова квартира 1").should("be.visible");
  });

  // ==================== Тест видалення помешкання ====================
  it("повинен дозволити орендодавцю видалити власне помешкання", () => {
    const accommodationId = 101;

    cy.intercept("GET", "**/api/v1/accommodations/my*", {
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

    cy.intercept("DELETE", `**/api/v1/accommodations/${accommodationId}`, {
      statusCode: 204,
    }).as("deleteAccommodation");

    cy.visit("/accommodations/my");
    cy.wait("@getMyAccommodations");

    cy.contains("Тестова квартира 1")
      .parents(".card")
      .find("button")
      .contains("Видалити")
      .click();

    cy.wait("@deleteAccommodation");
    cy.contains("Тестова квартира 1").should("not.exist");
  });
});

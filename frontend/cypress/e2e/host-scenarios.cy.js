// cypress/e2e/host-scenarios.cy.js

// Імпортуємо authService для прямого входу, щоб прискорити тести
// Це обходить UI, але корисно для підготовки стану перед тестами
import authService from "../../src/api/authService";

describe("Сценарії для орендодавців", () => {
  // Допоміжна функція для входу в систему як орендодавець
  const loginHostUser = () => {
    // Використовуємо реальний authService для входу
    // ✅ Примітка: Цей метод обходить UI. Якщо потрібно протестувати сам UI входу,
    // краще використовувати метод `cy.visit('/login')` та заповнювати форму.
    // Також, переконайся, що користувач "host@test.com" існує в тестовій базі.
    cy.request("POST", "**/api/v1/auth/login", {
      email: "host@test.com",
      password: "password",
    }).then((response) => {
      // Зберігаємо токен в локальне сховище, як це робить застосунок
      window.localStorage.setItem("user", JSON.stringify(response.body));
    });
    // Просто переходимо на головну сторінку, оскільки токен вже встановлено
    cy.visit("/");
  };

  beforeEach(() => {
    // Очищаємо локальне сховище перед кожним тестом, щоб не було конфліктів
    cy.clearLocalStorage();
    // Заходимо в систему перед кожним тестом
    loginHostUser();
  });

  // Новий тест: перевіряємо, що новий користувач може зареєструватися та додати помешкання
  it("повинен дозволити новому користувачу зареєструватися, увійти та додати помешкання", () => {
    const newUsername = "newhostuser";
    const newEmail = `newhostuser_${Cypress._.random(0, 1e6)}@test.com`; // Генеруємо унікальний email
    const newPassword = "newpassword";

    // Переходимо на сторінку реєстрації
    cy.visit("/register");

    // ✅ Примітка: використовуємо `cy.intercept` для мокування запитів
    cy.intercept("POST", "**/api/v1/auth/register", {
      statusCode: 201,
      body: { message: "Користувача успішно зареєстровано" },
    }).as("registerHost");

    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: { username: newUsername, email: newEmail, role: "MANAGER" },
        token: "mock-new-host-jwt-token",
      },
    }).as("loginNewHost");

    // Заповнюємо та відправляємо форму реєстрації
    cy.get('input[placeholder="Ім\'я користувача"]').type(newUsername);
    cy.get('input[placeholder="Електронна пошта"]').type(newEmail);
    cy.get('input[placeholder="Пароль"]').type(newPassword);
    cy.get('button[type="submit"]').click();

    cy.wait("@registerHost");
    cy.wait("@loginNewHost");

    // Перевіряємо, що нас перенаправило на головну сторінку або сторінку з помешканнями
    cy.url().should("not.include", "/register");
    cy.url().should("eq", "http://localhost:5173/");

    // ✅ Примітка: В ідеалі, тут має бути перевірка, що користувач отримав роль "MANAGER"
    // і бачить кнопку "Додати помешкання".
    cy.get("a.nav-link").contains("Додати помешкання").should("be.visible").click();

    // Заповнюємо форму для нового помешкання
    cy.get('input[placeholder="Назва помешкання"]').type("Квартира нового хоста");
    cy.get('textarea[placeholder="Опис помешкання"]').type("Квартира від новозареєстрованого хоста.");
    cy.get('input[placeholder="Адреса"]').type("Вулиця Нова, 5");
    cy.get('input[placeholder="Ціна за ніч"]').type("75");
    cy.get('input[placeholder="Розмір"]').type("70");
    cy.get('select').select("APARTMENT");

    // ✅ Мокаємо запит на додавання помешкання
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

    // Перевіряємо, що нове помешкання з'явилося у списку
    cy.url().should("include", "/accommodations/my");
    cy.contains("Квартира нового хоста");
  });

  it("повинен дозволити аутентифікованому користувачу додати нове помешкання", () => {
    // ✅ Примітка: використовуємо `cy.intercept` для мокування запитів
    cy.intercept("POST", "**/api/v1/accommodations", {
      statusCode: 201,
      body: {
        id: 998,
        location: "Вулиця Тестова, 123",
        dailyRate: 55,
        type: "APARTMENT"
      },
    }).as("addAccommodation");

    // Переходимо на сторінку додавання помешкання
    cy.get("a.nav-link").contains("Додати помешкання").should("be.visible").click();
    cy.url().should("include", "/accommodations/add");

    // Заповнюємо форму для нового помешкання
    cy.get('input[placeholder="Назва помешкання"]').type("Тестова квартира 2");
    cy.get('textarea[placeholder="Опис помешкання"]').type("Затишна квартира для тестування.");
    cy.get('input[placeholder="Адреса"]').type("Вулиця Тестова, 123");
    cy.get('input[placeholder="Ціна за ніч"]').type("55");
    cy.get('input[placeholder="Розмір"]').type("70");
    cy.get('select').select("APARTMENT");

    // Натискаємо кнопку "Додати помешкання"
    cy.get('button[type="submit"]').click();

    cy.wait("@addAccommodation");

    // Перевіряємо, що нас перенаправило на сторінку з усіма помешканнями
    // і що нове помешкання з'явилося у списку.
    // Припускаємо, що після додавання користувач переходить на /accommodations/my
    cy.url().should("include", "/accommodations/my");
    cy.contains("Тестова квартира 2");
  });

  it("повинен дозволити орендодавцю редагувати власне помешкання", () => {
    const accommodationId = 101; // Припустимо, що це існуючий ID помешкання

    // ✅ Мокаємо запити для переходу на сторінку
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

    // ✅ Мокаємо запит на редагування
    cy.intercept("PUT", `**/api/v1/accommodations/${accommodationId}`, {
      statusCode: 200,
      body: {
        id: accommodationId,
        location: "Вулиця Тестова, 123",
        dailyRate: 60, // Нова ціна
        type: "APARTMENT",
        name: "Тестова квартира 1"
      },
    }).as("updateAccommodation");

    // Переходимо на сторінку з власними помешканнями
    cy.visit("/accommodations/my");
    cy.wait("@getMyAccommodations");

    // Знаходимо помешкання і натискаємо кнопку "Редагувати"
    // ✅ Примітка: Використання `.parents('.card')` та `cy.contains("Редагувати")` є добрим підходом,
    // але для більшої надійності можна використовувати атрибути `data-cy`.
    cy.contains("Тестова квартира 1")
      .parents(".card")
      .find("button")
      .contains("Редагувати")
      .click();

    // Переходимо на сторінку редагування та змінюємо дані
    cy.url().should("include", `/accommodations/edit/${accommodationId}`);
    cy.get('input[placeholder="Ціна за ніч"]').clear().type("60");

    // Зберігаємо зміни
    cy.get('button[type="submit"]').click();

    cy.wait("@updateAccommodation");

    // Перевіряємо, що нас перенаправило назад і що зміни застосовані
    cy.url().should("include", "/accommodations/my");
    cy.contains("Тестова квартира 1");
    cy.contains("Ціна за ніч: 60 $"); // ✅ Виправлення: Змінив селектор для відповідності інтерфейсу
  });

  it("повинен дозволити орендодавцю видалити власне помешкання", () => {
    const accommodationId = 101; // Припустимо, що це існуючий ID помешкання

    // ✅ Мокаємо запити для переходу на сторінку
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

    // ✅ Мокаємо запит на видалення
    cy.intercept("DELETE", `**/api/v1/accommodations/${accommodationId}`, {
      statusCode: 204,
    }).as("deleteAccommodation");

    // Переходимо на сторінку з власними помешканнями
    cy.visit("/accommodations/my");
    cy.wait("@getMyAccommodations");

    // Знаходимо помешкання і натискаємо кнопку "Видалити"
    cy.contains("Тестова квартира 1")
      .parents(".card")
      .find("button")
      .contains("Видалити")
      .click();

    // Перевіряємо, що помешкання більше не відображається у списку
    cy.wait("@deleteAccommodation");
    cy.contains("Тестова квартира 1").should("not.exist");
  });
});

// cypress/e2e/login.cy.jsx

describe("Автентифікація користувача", () => {
  beforeEach(() => {
    // Переходимо на сторінку входу перед кожним тестом
    cy.visit("http://localhost:5173/login");

    // Перевіряємо, що форма входу доступна
    cy.get(".container.page").should("be.visible");
  });

  // Імітуємо успішний вхід, щоб перевірити логіку фронтенду
  it("повинен успішно увійти в систему з правильними обліковими даними", () => {
    // Імітуємо успішну відповідь від бекенду
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: {
          email: "testuser@example.com",
          username: "testuser",
          token: "mock-jwt-token-for-test",
          role: "USER"
        },
      },
    }).as("successfulLogin");

    cy.get('input[placeholder="Електронна пошта"]').type(
      "testuser@example.com",
    );
    cy.get('input[placeholder="Пароль"]').type("password123");

    cy.get('button[type="submit"]').click();

    // Чекаємо, доки запит на вхід буде перехоплено
    cy.wait("@successfulLogin");

    // Перевіряємо, що після успішного входу ми перейшли на головну сторінку,
    // оскільки твоя логіка в `Login.jsx` перенаправляє на '/'
    cy.url().should("eq", "http://localhost:5173/");

    // Додаткова перевірка: після входу мають з'явитися посилання для аутентифікованих користувачів
    cy.get("a.nav-link").contains("Профіль").should("be.visible");
    cy.get("a.nav-link").contains("Вийти").should("be.visible");
    cy.get("a.nav-link").contains("Увійти").should("not.exist");
    cy.get("a.nav-link").contains("Реєстрація").should("not.exist");
  });

  // Імітуємо помилку входу, щоб перевірити відображення повідомлення
  it("повинен показати повідомлення про помилку з неправильними обліковими даними", () => {
    // Імітуємо помилку аутентифікації від бекенду
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 401,
      body: {
        // У нашій імплементації повідомлення про помилку зазвичай знаходиться
        // безпосередньо в полі 'message'.
        message: "Неправильний логін або пароль",
      },
    }).as("failedLogin");

    cy.get('input[placeholder="Електронна пошта"]').type(
      "wronguser@example.com",
    );
    cy.get('input[placeholder="Пароль"]').type("wrongpassword");

    cy.get('button[type="submit"]').click();

    // Чекаємо, доки запит на вхід буде перехоплено
    cy.wait("@failedLogin");

    // Перевіряємо, що ми залишилися на сторінці входу
    cy.url().should("include", "/login");

    // Перевіряємо, що з'явилося повідомлення про помилку
    cy.contains("Неправильний логін або пароль").should("be.visible");
  });

  // Цей тест не залежить від бекенду і має працювати
  it("повинен переходити на сторінку реєстрації", () => {
    cy.contains("Потрібен акаунт?").click();
    cy.url().should("include", "/register");
  });
});

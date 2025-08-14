// cypress/e2e/e2e.cy.jsx

describe("Повні E2E сценарії для застосунку оренди помешкань", () => {
  // Використовуємо beforeEach для імітації запиту і очищення стану перед кожним тестом
  beforeEach(() => {
    // Мокуємо запит до помешкань, щоб запобігти таймауту на початковому завантаженні
    cy.intercept("GET", "**/api/v1/accommodations*", {
      statusCode: 200,
      body: {
        content: [
          {
            id: 1,
            location: "Київ",
            size: "30 m²",
            dailyRate: 100,
            picture: "https://placehold.co/600x400",
            type: "APARTMENT"
          },
          {
            id: 2,
            location: "Львів",
            size: "50 m²",
            dailyRate: 150,
            picture: "https://placehold.co/600x400",
            type: "APARTMENT"
          },
        ],
        totalPages: 1,
        totalElements: 2
      },
    }).as("getAccommodations");

    cy.visit("http://localhost:5173/");
    // Очищаємо локальне сховище та очікуємо, поки запит буде виконано.
    // Це забезпечує, що кожен тест починається з неавторизованого стану.
    cy.clearLocalStorage();
    cy.wait("@getAccommodations");
  });

  // ==================== Тестування реєстрації ====================
  it("повинен успішно зареєструвати нового користувача та автоматично увійти в систему", () => {
    // ✅ Виправлення: Змінюємо ендпоінт на `registration` на `register`
    cy.intercept("POST", "**/api/v1/auth/register", {
      statusCode: 201,
      body: { message: "Користувача успішно зареєстровано" },
    }).as("registerRequest");

    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    }).as("loginRequest");

    cy.get("a.nav-link").contains("Реєстрація").should("be.visible").click();
    cy.url().should("include", "/register");

    cy.get('input[placeholder="Ім\'я користувача"]').type("testuser");
    cy.get('input[placeholder="Електронна пошта"]').type("test@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.wait("@registerRequest");
    cy.wait("@loginRequest");

    cy.url().should("eq", "http://localhost:5173/");
    // Очікуємо, поки сторінка завантажиться, і перевіряємо, що з'явилося посилання "Профіль"
    cy.get("a.nav-link").contains("Профіль").should("be.visible");
    cy.get("a.nav-link").contains("Вийти").should("be.visible");
  });

  // ==================== Тестування входу та виходу ====================
  it("повинен успішно увійти та вийти з системи", () => {
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    }).as("loginRequest");

    cy.get("a.nav-link").contains("Увійти").should("be.visible").click();
    cy.url().should("include", "/login");

    cy.get('input[placeholder="Електронна пошта"]').type("test@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", "http://localhost:5173/");
    // Очікуємо, що після входу з'явиться посилання "Вийти"
    cy.get("a.nav-link").contains("Вийти").should("be.visible");

    cy.get("a.nav-link").contains("Вийти").click();

    cy.url().should("include", "/login");
    // Очікуємо, що після виходу з'являться посилання "Увійти" та "Реєстрація"
    cy.get("a.nav-link").contains("Увійти").should("be.visible");
    cy.get("a.nav-link").contains("Реєстрація").should("be.visible");
  });

  // ==================== Тестування бронювання помешкання ====================
  it("повинен дозволити аутентифікованому користувачу забронювати помешкання", () => {
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    });

    cy.intercept("GET", "**/api/v1/accommodations/1", {
      statusCode: 200,
      body: {
        id: 1,
        location: "Київ",
        description: "Тестовий опис",
        dailyRate: 100,
        size: "30 m²",
        type: "APARTMENT"
      },
    }).as("getAccommodationDetails");

    cy.intercept("POST", "**/api/v1/bookings", {
      statusCode: 201,
      body: { id: 101, message: "Бронювання успішне" },
    }).as("createBooking");

    cy.get("a.nav-link").contains("Увійти").should("be.visible").click();
    cy.url().should("include", "/login");
    cy.get('input[placeholder="Електронна пошта"]').type("test@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "http://localhost:5173/");
    cy.wait("@getAccommodations");

    cy.get(".card-body .btn").contains("Переглянути").first().should("be.visible").click();
    cy.url().should("include", "/accommodations/1");
    cy.wait("@getAccommodationDetails");

    cy.get('input[type="date"]').eq(0).type("2025-10-20");
    cy.get('input[type="date"]').eq(1).type("2025-10-25");
    cy.get("button").contains("Забронювати").click();

    cy.wait("@createBooking");
    // ✅ URL повинен вести на сторінку "Мої бронювання", а не "payment"
    cy.url().should("include", "/my-bookings");
  });

  // ==================== Тестування сторінки "Мої бронювання" ====================
  it("повинен відображати бронювання для аутентифікованого користувача", () => {
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    });

    cy.intercept("GET", "**/api/v1/bookings/my", {
      statusCode: 200,
      body: [
        {
          id: 101,
          accommodationName: "Затишна квартира",
          checkInDate: "2025-08-20",
          checkOutDate: "2025-08-25",
          totalAmount: 250,
          isPaid: false,
        },
        {
          id: 102,
          accommodationName: "Котедж в горах",
          checkInDate: "2025-09-10",
          checkOutDate: "2025-09-15",
          totalAmount: 400,
          isPaid: true,
        },
      ],
    }).as("getBookings");

    cy.get("a.nav-link").contains("Увійти").should("be.visible").click();
    cy.url().should("include", "/login");
    cy.get('input[placeholder="Електронна пошта"]').type("test@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "http://localhost:5173/");
    cy.wait("@getAccommodations");

    cy.get("a.nav-link")
      .contains("Мої бронювання")
      .should("be.visible")
      .click();
    cy.url().should("include", "/my-bookings");
    cy.wait("@getBookings");

    cy.contains("Затишна квартира").should("be.visible");
    cy.contains("Котедж в горах").should("be.visible");
  });

  // ==================== Тестування редагування профілю ====================
  it("повинен дозволити аутентифікованому користувачу редагувати профіль", () => {
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    });

    // ✅ Виправлення: Змінюємо ендпоінти на `users`
    cy.intercept("GET", "**/api/v1/users", {
      statusCode: 200,
      body: {
        username: "testuser",
        email: "test@example.com",
      },
    }).as("fetchProfile");

    // ✅ Виправлення: Змінюємо ендпоінти на `users`
    cy.intercept("PUT", "**/api/v1/users", {
      statusCode: 200,
      body: {
        username: "newusername",
        email: "newemail@example.com",
      },
    }).as("updateProfile");

    cy.get("a.nav-link").contains("Увійти").should("be.visible").click();
    cy.url().should("include", "/login");
    cy.get('input[placeholder="Електронна пошта"]').type("test@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "http://localhost:5173/");
    cy.wait("@getAccommodations");

    cy.get("a.nav-link").contains("Профіль").should("be.visible").click();
    cy.url().should("include", "/profile");
    cy.wait("@fetchProfile");

    cy.get("button")
      .contains("Редагувати профіль")
      .should("be.visible")
      .click();

    cy.get('input[placeholder="Ім\'я користувача"]')
      .clear()
      .type("newusername");
    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type("newemail@example.com");

    cy.get("button").contains("Зберегти зміни").click();
    cy.wait("@updateProfile");
    cy.contains("Профіль успішно оновлено!").should("be.visible");
  });

  // ==================== Тестування пошуку ====================
  it("повинен дозволяти користувачу шукати помешкання", () => {
    // Перехоплюємо запит пошуку більш гнучко
    cy.intercept("GET", "**/api/v1/accommodations?*", (req) => {
      if (req.query.location === "Київ") {
        req.reply({
          statusCode: 200,
          body: {
            content: [
              { id: 1, location: "Київ", dailyRate: 100, type: "APARTMENT" },
            ],
            totalPages: 1,
            totalElements: 1
          },
        });
      }
    }).as("searchAccommodations");

    cy.get('input[placeholder="Місто"]').should("be.visible").type("Київ");

    cy.wait("@searchAccommodations");
    cy.contains("Київ").should("be.visible");
  });

  // ==================== Тестування помилок ====================
  it("повинен показати помилку при невдалому вході", () => {
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 401,
      body: { message: "Неправильний логін або пароль" },
    }).as("failedLogin");

    cy.get("a.nav-link").contains("Увійти").should("be.visible").click();
    cy.url().should("include", "/login");

    cy.get('input[placeholder="Електронна пошта"]').type("wrong@example.com");
    cy.get('input[placeholder="Пароль"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@failedLogin");

    cy.url().should("include", "/login");
    cy.contains("Неправильний логін або пароль").should("be.visible");
  });

  // ==================== Тестування неаутентифікованого доступу ====================
  it("повинен перенаправити на сторінку входу при спробі забронювати без аутентифікації", () => {
    cy.intercept("GET", "**/api/v1/accommodations/1", {
      statusCode: 200,
      body: {
        id: 1,
        location: "Київ",
        description: "Тестовий опис",
        dailyRate: 100,
        size: "30 m²",
        type: "APARTMENT"
      },
    }).as("getAccommodationDetails");

    cy.visit("http://localhost:5173/accommodations/1");
    cy.wait("@getAccommodationDetails");

    cy.get('input[type="date"]').eq(0).type("2025-10-20");
    cy.get('input[type="date"]').eq(1).type("2025-10-25");
    cy.get("button").contains("Забронювати").click();

    cy.url().should("include", "/login");
    cy.contains("Увійти").should("be.visible");
  });

  // ==================== Тестування адмін-панелі ====================
  it("повинен дозволяти адміну доступ до адмін-панелі", () => {
    // Логін адміна
    cy.intercept("POST", "**/api/v1/auth/login", {
      statusCode: 200,
      body: {
        user: {
          username: "adminuser",
          email: "admin@example.com",
          // ✅ Виправлення: Змінюємо роль на `MANAGER`
          role: "MANAGER",
        },
        token: "mock-admin-jwt-token",
      },
    });

    cy.get("a.nav-link").contains("Увійти").should("be.visible").click();
    cy.url().should("include", "/login");
    cy.get('input[placeholder="Електронна пошта"]').type("admin@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.url().should("eq", "http://localhost:5173/");
    // Очікуємо, поки сторінка завантажиться, і перевіряємо, що з'явилося посилання на "Адмін-панель"
    cy.get("a.nav-link").contains("Адмін-панель").should("be.visible").click();
    cy.url().should("include", "/admin");
    cy.contains("Адмін-панель").should("be.visible");
  });
});

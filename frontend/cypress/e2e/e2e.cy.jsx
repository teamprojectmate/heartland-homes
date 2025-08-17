describe("Повні E2E сценарії для застосунку оренди помешкань", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/accommodations*", {
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
    cy.clearLocalStorage();
    cy.wait("@getAccommodations");
  });

  // ==================== Тестування реєстрації ====================
  it("повинен успішно зареєструвати нового користувача та перенаправити на вхід", () => {

    cy.intercept("POST", "**/auth/registration", {
      statusCode: 201,
      body: { message: "Користувача успішно зареєстровано" },
    }).as("registerRequest");

    cy.get("a.nav-link").contains("Реєстрація").should("be.visible").click();
    cy.url().should("include", "/register");

    cy.get('input[placeholder="Ім\'я"]').type("Test");
    cy.get('input[placeholder="Прізвище"]').type("User");
    cy.get('input[placeholder="Електронна пошта"]').type("test@example.com");
    cy.get('input[placeholder="Пароль"]').type("password123");
    cy.get('input[placeholder="Повторіть пароль"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.wait("@registerRequest");

    cy.url().should("include", "/login");
    cy.contains("Вже маєте акаунт?").should("be.visible");
  });

  // ==================== Тестування входу та виходу ====================
  it("повинен успішно увійти та вийти з системи", () => {
    cy.intercept("POST", "**/auth/login", {
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
    cy.get("a.nav-link").contains("Вийти").should("be.visible");

    cy.get("a.nav-link").contains("Вийти").click();

    cy.url().should("include", "/login");
    cy.get("a.nav-link").contains("Увійти").should("be.visible");
    cy.get("a.nav-link").contains("Реєстрація").should("be.visible");
  });

  // ==================== Тестування бронювання помешкання ====================
  it("повинен дозволити аутентифікованому користувачу забронювати помешкання", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    });

    cy.intercept("GET", "**/accommodations/1", {
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

    cy.intercept("POST", "**/bookings", {
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
    // ✅ Коректний URL після успішного бронювання
    cy.url().should("include", "/my-bookings");
  });

  // ==================== Тестування сторінки "Мої бронювання" ====================
  it("повинен відображати бронювання для аутентифікованого користувача", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    });

    cy.intercept("GET", "**/bookings/my", {
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

    cy.get("a.nav-link").contains("Мої бронювання").should("be.visible").click();
    cy.url().should("include", "/my-bookings");
    cy.wait("@getBookings");

    cy.contains("Затишна квартира").should("be.visible");
    cy.contains("Котедж в горах").should("be.visible");
  });

  // ==================== Тестування редагування профілю ====================
  it("повинен дозволити аутентифікованому користувачу редагувати профіль", () => {
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        user: { username: "testuser", email: "test@example.com", role: "USER" },
        token: "mock-jwt-token",
      },
    });

    cy.intercept("GET", "**/users/me", {
      statusCode: 200,
      body: {
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    }).as("fetchProfile");

    cy.intercept("PUT", "**/users/me", {
      statusCode: 200,
      body: {
        email: "newemail@example.com",
        firstName: "New",
        lastName: "User",
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

    cy.get('input[placeholder="Електронна пошта"]')
      .clear()
      .type("newemail@example.com");
    cy.get('input[placeholder="Ім\'я"]').clear().type("New");
    cy.get('input[placeholder="Прізвище"]').clear().type("User");

    cy.get("button").contains("Зберегти зміни").click();
    cy.wait("@updateProfile");
    cy.contains("Профіль успішно оновлено!").should("be.visible");
  });

  // ==================== Тестування пошуку ====================
  it("повинен дозволяти користувачу шукати помешкання", () => {
    cy.intercept("GET", "**/accommodations?*", (req) => {
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

    cy.get('input[placeholder="Місто (через кому)"]')
      .should("be.visible")
      .type("Київ");

    cy.wait("@searchAccommodations");
    cy.contains("Київ").should("be.visible");
  });

  // ==================== Тестування помилок ====================
  it("повинен показати помилку при невдалому вході", () => {
    cy.intercept("POST", "**/auth/login", {
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
    cy.intercept("GET", "**/accommodations/1", {
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
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        user: {
          email: "admin@example.com",
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

    cy.get("a.nav-link").contains("Адмін-панель").should("be.visible").click();
    cy.url().should("include", "/admin");
    cy.contains("Адмін-панель").should("be.visible");
  });
});

// cypress/e2e/e2e.cy.jsx

describe('Повні E2E сценарії для застосунку оренди помешкань', () => {

  // Використовуємо beforeEach для очищення стану та переходу на головну сторінку
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    // Очищаємо localStorage, щоб почати з чистого листа для кожного тесту
    cy.clearLocalStorage();
  });

  // ==================== Тестування реєстрації ====================
  it('повинен успішно зареєструвати нового користувача та автоматично увійти в систему', () => {
    // Імітуємо успішну реєстрацію
    cy.intercept('POST', '**/api/v1/auth/registration', {
      statusCode: 201,
      body: {
        message: 'Користувача успішно зареєстровано'
      },
    }).as('registerRequest');

    // Імітуємо успішний вхід після реєстрації
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 200,
      body: {
        user: { username: 'testuser', email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    }).as('loginRequest');

    // Натискаємо "Реєстрація" в навігації
    cy.get('a.nav-link').contains('Реєстрація').click();
    cy.url().should('include', '/register');

    // Заповнюємо форму реєстрації
    cy.get('input[placeholder="Ім\'я користувача"]').type('testuser');
    cy.get('input[placeholder="Електронна пошта"]').type('test@example.com');
    cy.get('input[placeholder="Пароль"]').type('password123');

    // Відправляємо форму
    cy.get('button[type="submit"]').click();

    // Перевіряємо, що запит на реєстрацію був відправлений
    cy.wait('@registerRequest');
    cy.wait('@loginRequest');

    // Перевіряємо, що ми були перенаправлені на головну сторінку після успішної реєстрації
    cy.url().should('eq', 'http://localhost:5173/');

    // Перевіряємо, що UI оновився для аутентифікованого користувача
    cy.get('a.nav-link').contains('Профіль').should('be.visible');
    cy.get('button').contains('Вихід').should('be.visible');
  });

  // ==================== Тестування входу та виходу ====================
  it('повинен успішно увійти та вийти з системи', () => {
    // Імітуємо успішний вхід
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 200,
      body: {
        user: { username: 'testuser', email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    }).as('loginRequest');

    // Переходимо на сторінку входу
    cy.get('a.nav-link').contains('Вхід').click();
    cy.url().should('include', '/login');

    // Заповнюємо форму входу
    cy.get('input[placeholder="Електронна пошта"]').type('test@example.com');
    cy.get('input[placeholder="Пароль"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Перевіряємо, що ми були перенаправлені на головну сторінку
    cy.url().should('eq', 'http://localhost:5173/');
    cy.get('button').contains('Вихід').should('be.visible');

    // Виходимо з системи
    cy.get('button').contains('Вихід').click();

    // Перевіряємо, що ми були перенаправлені на сторінку входу і UI оновився
    cy.url().should('include', '/login');
    cy.get('a.nav-link').contains('Вхід').should('be.visible');
    cy.get('a.nav-link').contains('Реєстрація').should('be.visible');
  });

  // ==================== Тестування бронювання помешкання ====================
  it('повинен дозволити аутентифікованому користувачу забронювати помешкання', () => {
    // Логін перед тестуванням бронювання
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 200,
      body: {
        user: { username: 'testuser', email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    });

    // Мокуємо дані помешкань
    cy.intercept('GET', '**/api/v1/accommodations', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Квартира 1', description: 'Тестовий опис' },
      ],
    }).as('getAccommodations');

    // Мокуємо деталі одного помешкання
    cy.intercept('GET', '**/api/v1/accommodations/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Квартира 1',
        description: 'Тестовий опис',
        pricePerNight: 100,
        address: 'Тестова адреса',
        rating: 4.5,
      },
    }).as('getAccommodationDetails');

    // Мокуємо успішний запит на бронювання
    cy.intercept('POST', '**/api/v1/bookings', {
      statusCode: 201,
      body: { id: 101, message: 'Бронювання успішне' },
    }).as('createBooking');

    // Спочатку входимо в систему
    cy.visit('http://localhost:5173/login');
    cy.get('input[placeholder="Електронна пошта"]').type('test@example.com');
    cy.get('input[placeholder="Пароль"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Переходимо на сторінку помешкань
    cy.get('a.nav-link').contains('Помешкання').click();
    cy.wait('@getAccommodations');

    // Переходимо на сторінку деталей першого помешкання
    cy.get('.card-body .btn').contains('Детальніше').click();
    cy.url().should('include', '/accommodations/1');
    cy.wait('@getAccommodationDetails');

    // Заповнюємо форму бронювання
    cy.get('input[type="date"]').eq(0).type('2025-10-20');
    cy.get('input[type="date"]').eq(1).type('2025-10-25');
    cy.get('button').contains('Забронювати').click();

    // Перевіряємо, що запит на бронювання був відправлений
    cy.wait('@createBooking');

    // Після бронювання ми повинні бути перенаправлені на сторінку оплати
    cy.url().should('include', '/payment/101');
  });

  // ==================== Тестування сторінки "Мої бронювання" ====================
  it('повинен відображати бронювання для аутентифікованого користувача', () => {
    // Логін перед перевіркою бронювань
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 200,
      body: {
        user: { username: 'testuser', email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    });

    // Мокуємо запит на отримання бронювань користувача
    cy.intercept('GET', '**/api/v1/bookings/my', {
      statusCode: 200,
      body: [
        {
          id: 101,
          accommodationName: 'Затишна квартира',
          checkInDate: '2025-08-20',
          checkOutDate: '2025-08-25',
          totalAmount: 250,
          isPaid: false,
        },
        {
          id: 102,
          accommodationName: 'Котедж в горах',
          checkInDate: '2025-09-10',
          checkOutDate: '2025-09-15',
          totalAmount: 400,
          isPaid: true,
        },
      ],
    }).as('getBookings');

    // Спочатку входимо в систему
    cy.visit('http://localhost:5173/login');
    cy.get('input[placeholder="Електронна пошта"]').type('test@example.com');
    cy.get('input[placeholder="Пароль"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Переходимо на сторінку "Мої бронювання"
    cy.get('a.nav-link').contains('Мої бронювання').click();
    cy.url().should('include', '/bookings/my');
    cy.wait('@getBookings');

    // Перевіряємо, що бронювання відображаються
    cy.contains('Затишна квартира').should('be.visible');
    cy.contains('Котедж в горах').should('be.visible');
    cy.contains('Оплатити').should('be.visible');
    cy.contains('Оплачено').should('be.visible');
  });

  // ==================== НОВІ ТЕСТИ ====================

  it('повинен дозволити аутентифікованому користувачу редагувати профіль', () => {
    // Імітуємо успішний вхід
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 200,
      body: {
        user: { username: 'testuser', email: 'test@example.com' },
        token: 'mock-jwt-token',
      },
    });

    // Імітуємо отримання даних профілю
    cy.intercept('GET', '**/api/v1/users/me', {
      statusCode: 200,
      body: {
        username: 'testuser',
        email: 'test@example.com',
        firstName: '',
        lastName: '',
      },
    }).as('fetchProfile');

    // Імітуємо успішне оновлення профілю
    cy.intercept('PUT', '**/api/v1/users/me', {
      statusCode: 200,
      body: {
        username: 'newusername',
        email: 'newemail@example.com',
      },
    }).as('updateProfile');

    // Входимо в систему
    cy.visit('http://localhost:5173/login');
    cy.get('input[placeholder="Електронна пошта"]').type('test@example.com');
    cy.get('input[placeholder="Пароль"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Переходимо на сторінку профілю
    cy.get('a.nav-link').contains('Профіль').click();
    cy.url().should('include', '/profile');
    cy.wait('@fetchProfile');

    // Натискаємо "Редагувати профіль"
    cy.get('button').contains('Редагувати профіль').click();

    // Змінюємо дані в полях
    cy.get('input[placeholder="Ім\'я користувача"]').clear().type('newusername');
    cy.get('input[placeholder="Електронна пошта"]').clear().type('newemail@example.com');

    // Зберігаємо зміни
    cy.get('button').contains('Зберегти зміни').click();
    cy.wait('@updateProfile');

    // Перевіряємо, що з'явилося повідомлення про успіх
    cy.contains('Профіль успішно оновлено!').should('be.visible');
    
    // Перевіряємо, що профіль більше не в режимі редагування
    cy.get('button').contains('Редагувати профіль').should('be.visible');
  });

  it('повинен показати помилку при невдалому вході', () => {
    // Імітуємо невдалий вхід
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 401,
      body: {
        message: 'Неправильний логін або пароль'
      },
    }).as('failedLogin');

    // Переходимо на сторінку входу
    cy.get('a.nav-link').contains('Вхід').click();
    cy.url().should('include', '/login');

    // Заповнюємо форму некоректними даними
    cy.get('input[placeholder="Електронна пошта"]').type('wrong@example.com');
    cy.get('input[placeholder="Пароль"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Чекаємо на запит з помилкою
    cy.wait('@failedLogin');

    // Перевіряємо, що ми залишилися на сторінці входу і відображається повідомлення про помилку
    cy.url().should('include', '/login');
    cy.contains('Неправильний логін або пароль').should('be.visible');
  });

  it('повинен перенаправити на сторінку входу при спробі забронювати без аутентифікації', () => {
    // Очищаємо localStorage, щоб гарантувати, що токен відсутній
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173/'); // Переходимо на головну сторінку для скидання стану

    // Мокуємо дані помешкань
    cy.intercept('GET', '**/api/v1/accommodations/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Квартира 1',
        description: 'Тестовий опис',
        pricePerNight: 100,
        address: 'Тестова адреса',
        rating: 4.5,
      },
    }).as('getAccommodationDetails');

    // Переходимо на сторінку деталей помешкання без аутентифікації
    cy.visit('http://localhost:5173/accommodations/1');
    cy.wait('@getAccommodationDetails');

    // Заповнюємо форму бронювання, щоб пройти валідацію
    cy.get('input[type="date"]').eq(0).type('2025-10-20');
    cy.get('input[type="date"]').eq(1).type('2025-10-25');

    // Натискаємо кнопку бронювання
    cy.get('button').contains('Забронювати').click();

    // Оновлена перевірка: тепер явно чекаємо, поки URL зміниться на сторінку входу
    cy.url().should('include', '/login');
    cy.get('h1').contains('Вхід').should('be.visible');
  });
});

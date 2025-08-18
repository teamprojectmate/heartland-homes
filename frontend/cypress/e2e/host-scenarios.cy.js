// host-scenarios.cy.js
import authService from '../../src/api/authService';

describe('Сценарії для орендодавців', () => {
  // Допоміжна функція для входу в систему як орендодавець
  const loginHostUser = () => {
    // Використовуємо реальний authService для входу
    authService.login('host@test.com', 'password').then((response) => {
      // Зберігаємо токен в локальне сховище, як це робить застосунок
      localStorage.setItem('user', JSON.stringify(response));
    });
    // Просто переходимо на головну сторінку, оскільки токен вже встановлено
    cy.visit('/');
  };

  beforeEach(() => {
    // Очищаємо локальне сховище перед кожним тестом, щоб не було конфліктів
    localStorage.clear();
    // Заходимо в систему перед кожним тестом
    loginHostUser();
  });

  // Новий тест: перевіряємо, що новий користувач може зареєструватися та додати помешкання
  it('повинен дозволити новому користувачу зареєструватися, увійти та додати помешкання', () => {
    const newUsername = 'newhostuser';
    const newEmail = `newhostuser_${Cypress._.random(0, 1e6)}@test.com`; // Генеруємо унікальний email
    const newPassword = 'newpassword';
    
    // Переходимо на сторінку реєстрації
    cy.visit('/register');
    
    // Заповнюємо та відправляємо форму реєстрації
    cy.get('input[placeholder="Ім\'я користувача"]').type(newUsername);
    cy.get('input[placeholder="Електронна пошта"]').type(newEmail);
    cy.get('input[placeholder="Пароль"]').type(newPassword);
    cy.get('button[type="submit"]').click();
    
    // Перевіряємо, що нас перенаправило на головну сторінку або сторінку з помешканнями
    cy.url().should('not.include', '/register');
    
    // Переходимо на сторінку додавання помешкання
    cy.visit('/accommodations/add');

    // Заповнюємо форму для нового помешкання
    cy.get('input[placeholder="Назва помешкання"]').type('Квартира нового хоста');
    cy.get('textarea[placeholder="Опис помешкання"]').type('Квартира від новозареєстрованого хоста.');
    cy.get('input[placeholder="Адреса"]').type('Вулиця Нова, 5');
    cy.get('input[placeholder="Ціна за ніч"]').type('75');
    cy.get('button[type="submit"]').click();
    
    // Перевіряємо, що нове помешкання з'явилося у списку
    cy.url().should('include', '/accommodations/my');
    cy.contains('Квартира нового хоста');
  });

  it('повинен дозволити аутентифікованому користувачу додати нове помешкання', () => {
    // Переходимо на сторінку додавання помешкання
    cy.visit('/accommodations/add');

    // Заповнюємо форму для нового помешкання
    cy.get('input[placeholder="Назва помешкання"]').type('Тестова квартира 2');
    cy.get('textarea[placeholder="Опис помешкання"]').type('Затишна квартира для тестування.');
    cy.get('input[placeholder="Адреса"]').type('Вулиця Тестова, 123');
    cy.get('input[placeholder="Ціна за ніч"]').type('55');

    // Натискаємо кнопку "Додати помешкання"
    cy.get('button[type="submit"]').click();

    // Перевіряємо, що нас перенаправило на сторінку з усіма помешканнями
    // і що нове помешкання з'явилося у списку.
    // Припускаємо, що після додавання користувач переходить на /accommodations/my
    cy.url().should('include', '/accommodations/my');
    cy.contains('Тестова квартира 2');
  });

  it('повинен дозволити орендодавцю редагувати власне помешкання', () => {
    // Переходимо на сторінку з власними помешканнями
    cy.visit('/accommodations/my');

    // Знаходимо помешкання і натискаємо кнопку "Редагувати"
    // Припускаємо, що кожне помешкання має кнопку "Редагувати"
    cy.contains('Тестова квартира 1').parents('.card').find('button').contains('Редагувати').click();

    // Переходимо на сторінку редагування та змінюємо дані
    cy.url().should('include', '/accommodations/edit/');
    cy.get('input[placeholder="Ціна за ніч"]').clear().type('60');

    // Зберігаємо зміни
    cy.get('button[type="submit"]').click();

    // Перевіряємо, що нас перенаправило назад і що зміни застосовані
    cy.url().should('include', '/accommodations/my');
    cy.contains('Тестова квартира 1');
    cy.contains('Ціна: 60 $');
  });

  it('повинен дозволити орендодавцю видалити власне помешкання', () => {
    // Переходимо на сторінку з власними помешканнями
    cy.visit('/accommodations/my');

    // Знаходимо помешкання і натискаємо кнопку "Видалити"
    // Припускаємо, що кожне помешкання має кнопку "Видалити"
    cy.contains('Тестова квартира 1').parents('.card').find('button').contains('Видалити').click();

    // Перевіряємо, що помешкання більше не відображається у списку
    cy.contains('Тестова квартира 1').should('not.exist');
  });
});

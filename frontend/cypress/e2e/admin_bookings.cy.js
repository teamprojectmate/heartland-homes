// cypress/e2e/admin_bookings.cy.js
describe('Admin – Бронювання', () => {
  beforeEach(() => {
    cy.viewport(1280, 800); // 💻 примусово десктопний варіант
    cy.loginAsAdminSession();
    cy.visit('/');
    cy.goTo('/admin/bookings');
  });

  it('бачить список бронювань', () => {
    cy.contains('Управління бронюваннями');
    cy.get('table tbody tr, .booking-card').should('have.length.at.least', 1);
  });

  it('може підтвердити бронювання', () => {
    cy.get('table tbody tr, .booking-card').then(($items) => {
      const pending = [...$items].find(el => el.innerText.includes('Очікує підтвердження'));
      if (pending) {
        cy.wrap(pending).within(() => {
          cy.get('select').select('CONFIRMED');
        });
        cy.contains('Підтверджено');
      } else {
        cy.log('✅ Немає бронювань для підтвердження');
      }
    });
  });

  it('може видалити бронювання', () => {
  cy.goTo('/admin/bookings');

  // чекаємо бронювання
  cy.get('table tbody tr, .booking-card').then(($items) => {
    if ($items.length > 0) {
      cy.wrap($items[0]).within(() => {
        // пробуємо знайти кнопку "Видалити"
        cy.get('button').contains('Видалити').click({ force: true });
      });

      // після видалення елементів має бути менше
      cy.get('table tbody tr, .booking-card')
        .should('have.length.lessThan', $items.length);
    } else {
      cy.log('✅ Немає бронювань для видалення');
    }
  });
  });
});
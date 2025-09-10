// cypress/support/commands.js
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ✅ ДОДАНО: Нова команда для входу через сесію
// 🔹 User login
Cypress.Commands.add('loginAsUserSession', () => {
  cy.session('user', () => {
    cy.request('POST', 'http://localhost:8080/auth/login', {
      email: 'john.doe@booking.com',
      password: 'password123'
    }).then((resp) => {
      const token = resp.body.token;
      const authData = { token };

      // Обовʼязково заходимо на сторінку, щоб мати доступ до localStorage
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('auth', JSON.stringify(authData));
      });
    });
  });
});

// 🔹 Admin login (role MANAGER)
Cypress.Commands.add('loginAsAdminSession', () => {
  cy.session('admin', () => {
    cy.request('POST', 'http://localhost:8080/auth/login', {
      email: 'admin@booking.com',
      password: 'password123'
    }).then((resp) => {
      const token = resp.body.token;
      const authData = { token };

      // ✅ кладемо токен
      window.localStorage.setItem('auth', JSON.stringify(authData));

      // ✅ одразу тягнемо профіль
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/users/me',
        headers: { Authorization: `Bearer ${token}` }
      }).then((profileResp) => {
        // кладемо userProfile як у браузері
        window.localStorage.setItem('userProfile', JSON.stringify(profileResp.body));
      });
    });
  });
});

// 🔹 SPA navigation
Cypress.Commands.add('goTo', (path) => {
  cy.visit('/');
  cy.window().then((win) => {
    win.history.pushState({}, '', path);
  });
  cy.reload();
});
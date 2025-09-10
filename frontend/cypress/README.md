# Cypress E2E Tests

Цей проєкт містить end-to-end (E2E) тести для фронтенду на **Cypress**.

---

## 🚀 Запуск тестів

1. Запусти бекенд (API) на `http://localhost:8080`.
2. Запусти фронтенд (React/Vite) на `http://localhost:5173`.
3. В іншій консолі виконай:

```bash
# Відкрити Cypress GUI
npx cypress open

# або запустити всі тести у headless режимі
npx cypress run
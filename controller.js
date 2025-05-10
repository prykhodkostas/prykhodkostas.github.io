import { model } from './model.js';
import { view } from './view.js';

export const controller = {
  init() {
    const page = document.body.dataset.page;
    if (page === 'registration') controller.handleRegistration();
    if (page === 'login') controller.handleLogin();
    if (page === 'profile') controller.displayProfile();
    if (page === 'index') controller.handlePhonebook();
  },

  handleRegistration() {
    const form = document.getElementById("registration-form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const gender = document.getElementById("gender").value;
      const birthdate = document.getElementById("birthdate").value;
      const password = document.getElementById("password").value.trim();
      if (!name || !email || !birthdate || password.length < 4) return alert("Усі поля обов'язкові. Пароль — мінімум 4 символи.");
      model.saveUser({ name, email, gender, birthdate, password });
      alert("Реєстрація успішна!");
      window.location.href = 'login.html';
    });
  },

  handleLogin() {
    const form = document.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = form.querySelector("input[type=email]").value;
      const password = form.querySelector("input[type=password]").value;
      const user = model.authenticateUser(email, password);
      if (user) {
        model.setCurrentUser(user);
        window.location.href = 'profile.html';
      } else {
        alert("Невірні дані для входу");
      }
    });
  },

  displayProfile() {
    const user = model.getCurrentUser();
    if (!user) return;
    view.displayProfile(user);

    // Слухачі на кнопки модальних дій
    document.getElementById("changePasswordBtn")?.addEventListener("click", () => {
      const input = document.getElementById("new-password");
      input.value = '';
      new bootstrap.Modal(document.getElementById("changePasswordModal")).show();
    });

    document.getElementById("save-password")?.addEventListener("click", () => {
      const newPass = document.getElementById("new-password").value.trim();
      if (newPass.length >= 4) {
        model.updatePassword(user.email, newPass);
        alert("Пароль змінено");
        bootstrap.Modal.getInstance(document.getElementById("changePasswordModal")).hide();
      } else {
        alert("Пароль має містити щонайменше 4 символи");
      }
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      new bootstrap.Modal(document.getElementById("logoutConfirmModal")).show();
    });

    document.getElementById("confirmLogout")?.addEventListener("click", () => {
      model.logout();
      window.location.href = 'index.html';
    });
  },

  handlePhonebook() {
    this.renderContacts();

    document.querySelector(".btn-success")?.addEventListener("click", () => {
      view.setModalInputValues("addContactModal");
      view.openModal("addContactModal");
    });

    document.getElementById("add-contact-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const { lastname, phone } = view.getModalInputValues("addContactModal");
      if (!model.validateLastname(lastname) || !model.validatePhone(phone)) {
        return alert("Некоректні дані");
      }
      const added = model.addContact({ lastname, phone });
      if (!added) return alert("Такий контакт вже існує");
      view.closeModal("addContactModal");
      this.renderContacts();
    });

    document.getElementById("edit-contact-form")?.addEventListener("submit", e => {
      e.preventDefault();
      const index = e.target.dataset.index;
      const lastname = document.getElementById("edit-modal-lastname").value.trim();
      const phone = document.getElementById("edit-modal-phone").value.trim();
      if (!model.validateLastname(lastname) || !model.validatePhone(phone)) {
        return alert("Невірні дані для оновлення");
      }
      model.updateContact(index, { lastname, phone });
      view.closeModal("editContactModal");
      this.renderContacts();
    });

    document.querySelector(".btn-primary")?.addEventListener("click", () => {
      const grouped = model.groupContactsByFirstLetter();
      view.renderGroupedContacts(grouped);
    });

    document.querySelector("tbody")?.addEventListener("click", e => {
      const btn = e.target;
      const index = btn.dataset.index;
      if (btn.dataset.action === 'edit') {
        const contacts = model.getContacts();
        view.showEditModal(index, contacts[index]);
      } else if (btn.dataset.action === 'delete') {
        if (confirm("Ви впевнені?")) {
          model.deleteContact(index);
          this.renderContacts();
        }
      }
    });
  },

  renderContacts() {
    const contacts = model.getContacts();
    view.renderContacts(contacts);
  }
};
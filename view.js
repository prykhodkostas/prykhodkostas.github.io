export const view = {
  displayProfile(user) {
    const cells = document.querySelectorAll("td");
    if (!cells.length) return;
    cells[0].innerText = user.name;
    cells[1].innerText = user.email;
    cells[2].innerText = user.gender;
    cells[3].innerText = user.birthdate;
  },

  renderContacts(contacts) {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = '';
    contacts.forEach((c, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${c.lastname}</td>
          <td>${c.phone}</td>
          <td>
            <button class="btn btn-warning" data-index="${i}" data-action="edit">Редагувати</button>
            <button class="btn btn-danger" data-index="${i}" data-action="delete">Видалити</button>
          </td>
        </tr>`;
    });
  },

  renderGroupedContacts(grouped) {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = '';
    grouped.forEach(([letter, contacts]) => {
      tbody.innerHTML += `<tr><th colspan="3">${letter}</th></tr>`;
      contacts.forEach((c, i) => {
        tbody.innerHTML += `
          <tr>
            <td>${c.lastname}</td>
            <td>${c.phone}</td>
            <td>
              <button class="btn btn-warning" data-index="${i}" data-action="edit">Редагувати</button>
              <button class="btn btn-danger" data-index="${i}" data-action="delete">Видалити</button>
            </td>
          </tr>`;
      });
    });
  },

  openModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
  },

  closeModal(modalId) {
    const modalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  },

  getModalInputValues(modalId) {
    const modal = document.getElementById(modalId);
    return {
      lastname: modal.querySelector("#modal-lastname")?.value.trim(),
      phone: modal.querySelector("#modal-phone")?.value.trim()
    };
  },

  setModalInputValues(modalId, lastname = '', phone = '') {
    const modal = document.getElementById(modalId);
    modal.querySelector("#modal-lastname").value = lastname;
    modal.querySelector("#modal-phone").value = phone;
  },

  showEditModal(index, contact) {
    document.getElementById("edit-contact-form").dataset.index = index;
    document.getElementById("edit-modal-lastname").value = contact.lastname;
    document.getElementById("edit-modal-phone").value = contact.phone;
    this.openModal("editContactModal");
  }
};
export const model = {
  usersKey: 'users',
  currentUserKey: 'currentUser',
  contactsKey: 'contacts',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.usersKey)) || [];
  },

  saveUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  },

  authenticateUser(email, password) {
    return this.getUsers().find(u => u.email === email && u.password === password);
  },

  setCurrentUser(user) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.currentUserKey));
  },

  logout() {
    localStorage.removeItem(this.currentUserKey);
  },

  updatePassword(email, newPassword) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      user.password = newPassword;
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  },

  getContacts() {
    return JSON.parse(localStorage.getItem(this.contactsKey)) || [];
  },

  saveContacts(contacts) {
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  },

  addContact(contact) {
    const contacts = this.getContacts();
    const exists = contacts.some(c => c.lastname === contact.lastname && c.phone === contact.phone);
    if (!exists) {
      contacts.push(contact);
      this.saveContacts(contacts);
      return true;
    }
    return false;
  },

  deleteContact(index) {
    const contacts = this.getContacts();
    contacts.splice(index, 1);
    this.saveContacts(contacts);
  },

  updateContact(index, newContact) {
    const contacts = this.getContacts();
    contacts[index] = newContact;
    this.saveContacts(contacts);
  },

  groupContactsByFirstLetter() {
    const contacts = this.getContacts();
    const grouped = {};
    contacts.forEach(contact => {
      const letter = contact.lastname[0].toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(contact);
    });
    for (let key in grouped) {
      grouped[key].sort((a, b) => a.lastname.localeCompare(b.lastname));
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  },

  validatePhone(phone) {
    return /^\+380\d{9}$/.test(phone);
  },

  validateLastname(name) {
  return name.trim().length > 0 && /^[A-Za-zА-Яа-яҐґЄєІіЇї'’ -]+$/u.test(name);
}
};
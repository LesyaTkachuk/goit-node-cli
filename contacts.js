import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data.toString());
  } catch (e) {
    console.log("\x1B[31m Error listing contacts");
    return [];
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return !!contact ? contact : null;
  } catch (e) {
    console.log("\x1B[31m Error getting a contact: ");
    return null;
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return null;
    }

    const contacts = await listContacts();
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    return contact;
  } catch (e) {
    console.log("\x1B[31m Error removing a contact");
    return null;
  }
}

export async function addContact(name, email, phone) {
  try {
    const id = uuidv4().slice(0, 22);
    const newContact = {
      id,
      name,
      email,
      phone,
    };

    const contacts = await listContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return getContactById(id);
  } catch (e) {
    console.log("\x1B[31m  Error adding a contact");
    return null;
  }
}

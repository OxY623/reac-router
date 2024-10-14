import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

// Тип Contact с дополнительным полем createdAt
interface Contact {
    id?: string;
    first: string;
    last: string;
    avatar?: string;
    twitter?: string;
    notes?: string;
    favorite?: boolean;
    createdAt?: string;
}

type Contacts = Contact[];

// Получение контактов с фильтрацией по запросу
export async function getContacts(query?: string): Promise<Contacts> {
    await fakeNetwork(`getContacts:${query}`);
    let contacts: Contacts | null = await localforage.getItem("contacts");
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

// Создание нового контакта
export async function createContact(newContact: Contact): Promise<Contact> {
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contacts = await getContacts();
    const contact: Contact = { ...newContact, id };
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

// Получение одного контакта по ID
export async function getContact(id: string): Promise<Contact | null> {
    await fakeNetwork(`contact:${id}`);
    let contacts: Contacts | null = await localforage.getItem("contacts");
    if (!contacts) return null;
    let contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
}

// Обновление контакта
export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    await fakeNetwork();
    let contacts: Contacts | null = await localforage.getItem("contacts");
    if (!contacts) throw new Error("No contacts found");
    let contact = contacts.find(contact => contact.id === id);
    if (!contact) throw new Error(`No contact found for id: ${id}`);
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

// Удаление контакта
export async function deleteContact(id: string): Promise<boolean> {
    let contacts: Contacts | null = await localforage.getItem("contacts");
    if (!contacts) return false;
    let index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

// Сохранение данных в localforage
async function set(contacts: Contacts): Promise<void> {
    return localforage.setItem("contacts", contacts);
}

// Фейковая задержка сети
let fakeCache: Record<string, boolean> = {};

async function fakeNetwork(key?: string): Promise<void> {
    if (!key) fakeCache = {};

    if (fakeCache[key]) return;

    fakeCache[key] = true;
    return new Promise((res) => setTimeout(res, Math.random() * 800));
}

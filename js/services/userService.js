import { getAllUsers, saveUser } from "./dataStore.js";

export const getUsers = () => getAllUsers();
export const createUser = userData => saveUser(userData);

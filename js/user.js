import { getUsers, createUser } from "./services/userService.js";

const userForm = document.getElementById("userForm");

userForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const users = await getUsers();
        const email = document.getElementById("email").value;

        if (users.find(u => u.email === email)) {
            alert("email already exists");
            return;
        }

        const user = await createUser({
            name: document.getElementById("name").value,
            email,
            phone: document.getElementById("ph").value
        });

        alert("User created successfully!\n\nUser ID: " + user.id);
        userForm.reset();
    } catch (error) {
        console.error(error);
        alert("Could not create user.");
    }
});

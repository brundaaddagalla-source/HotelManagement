import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";

const userForm = document.getElementById("userForm");

userForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const response = await axios.get(
        "http://localhost:3000/users"
    );

    const users = response.data;

    const user = {
        id: users.length + 1,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const e= users.find(i => i.email===user.email)
    if (e){
        alert ("email already exists");
    }else{
    await axios.post(
            "http://localhost:3000/users",
            user
        );

        alert(
            "User created successfully!\n\n" +
            "User ID: " + user.id
        );
    }

    

    userForm.reset();
});
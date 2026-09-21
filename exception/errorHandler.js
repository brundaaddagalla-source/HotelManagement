export function handleError(error, messageElement) {
    console.error(error);
    if (messageElement) {
        messageElement.textContent =
            error.message || "Something went wrong.";
    }
}
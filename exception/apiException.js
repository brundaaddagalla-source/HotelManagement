export class ApiException extends Error {
    constructor(message) {
        super(message);
        this.name = "ApiException";
    }
}
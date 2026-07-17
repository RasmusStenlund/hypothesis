export function page() {
    return `
    <div id = "sign-up">
        <h1>Create account</h1>
        <p id = "sign-up-description">
            Already have an account?
            <a href = "#/account/signin">Sign in</a>
        </p>
        <form id = "sign-up-form">
            <label for = "display_name">Display name</label>
            <input type = "text" name = "display_name" required>

            <label for = "username">Username</label>
            <input type = "text" name = "username" autocomplete = "username" required>

            <label for = "email">Email</label>
            <input type = "email" name = "email" autocomplete = "email" required>

            <label for = "password">Password</label>
            <input type = "password" name = "password" autocomplete = "new-password" required>

            <label for = "confirm-password">Confirm password</label>
            <input type = "password" name = "confirm_password" autocomplete = "new-password" required>

            <button type = "submit">Sign up</button>
        </form>
    </div>
    `
}

export function setup() {

}
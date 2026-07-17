export function page() {
    return `
    <div id = "sign-in">
        <h1>Welcome to Hypothesis!</h1>
        <p id = "sign-in-description">
            Don't have an account?
            <a href = "#/account/signup">Sign up</a>
        </p>
        <form id = "sign-in-form">
            <label for = "username">Username</label>
            <input type = "text" name = "username" autocomplete = "username" required>
            <label for = "password">Password</label>
            <input type = "password" name = "password" autocomplete = "current-password" required>

            <button type = "submit">Sign in</button>
        </form>
    </div>
    `
}

export function setup() {

}
function checkPassword() {
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Set the correct password here
    const correctPassword = '$BLOG_PASSWORD';

    if (password === correctPassword) {
        window.location.href = './blog.html';  // Redirect to protected content
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
    }
}

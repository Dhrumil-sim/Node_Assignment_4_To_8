const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      // Clear previous errors
      clearPreviousErrors();

      if (data.errorCode || data.message) {
        const topLevelError = document.createElement("div");
        topLevelError.textContent = `${data.errorCode}: ${data.message}`;
        topLevelError.style.color = "red";
        topLevelError.classList.add("error-message");

        // Append the error to the top of the form
        loginForm.insertAdjacentElement("beforebegin", topLevelError);
      }
      throw new Error(data.message || "Something went wrong");
    } else {
      const role = data.data.user.role;
      if (role === "artist") {
        window.location.href = `/artist/${data.data.user.username}`;
      }
      if (role == "user");
      {
        window.location.href = `/artist/${data.data.user.username}`;
      }
    }
  } catch (error) {
    // Optionally, handle global errors here if needed
  }
});

// Helper function to clear previous error messages
function clearPreviousErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());
}

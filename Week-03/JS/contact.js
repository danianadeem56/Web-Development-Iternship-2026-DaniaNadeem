const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Check empty fields
  if (name === "" || email === "" || message === "") {
    alert("Please fill all fields!");
    return;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // Message validation
  if (message.length < 10) {
    alert("Message must be at least 10 characters long!");
    return;
  }

  // Success Message 
  alert("Form submitted successfully!");

  form.reset();
});

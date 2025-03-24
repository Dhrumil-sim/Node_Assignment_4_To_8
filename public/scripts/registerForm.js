const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    
    try {
        const response = await fetch('/api/user/register', {
            method: 'POST',
            body: formData,
        });

        console.log(formData);
        
        const data = await response.json();
        
        if (!response.ok) {
            // Clear previous errors
            clearPreviousErrors();
            
            // Handle and display each error
            if (data.errors && Array.isArray(data.errors)) {
                data.errors.forEach(error => {
                    const errorField = document.getElementById(error.field); // Get the field by ID
                    if (errorField) {
                        const errorDiv = document.createElement('div');
                        errorDiv.textContent = error.message;
                        errorDiv.style.color = 'red';
                        errorDiv.classList.add('error-message'); // Add class for easy removal
                        
                        // Append the error message below the relevant field
                        errorField.insertAdjacentElement('afterend', errorDiv);
                    }
                });
            }
            throw new Error(data.message || 'Something went wrong');
        }
        else 
        {
             
        }
        
        // Success logic
        alert('User registered successfully');

        window.location.href = '/login';
    } catch (error) {
        // Optionally, handle global errors here if needed
    }
});

// Helper function to clear previous error messages
function clearPreviousErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

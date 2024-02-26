    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let container = document.getElementById('container')

    toggle = () => {
        container.classList.toggle('sign-in')
        container.classList.toggle('sign-up')
    }

    setTimeout(() => {
        container.classList.add('sign-in')
    }, 200)



    function handleSubmit(e){
        e.preventDefault();

        var name=document.getElementById("username").value;
        var email=document.getElementById("email").value;
        var password=document.getElementById("password").value;
        var confirm_password=document.getElementById("confirm_password").value;


        document.getElementById("username_error").innerHTML="";
        document.getElementById("email_error").innerHTML="";
        document.getElementById("password_error").innerHTML="";
        document.getElementById("confirm_password_error").innerHTML="";

        if (!name || !email || !password || !confirm_password) {
            alert("Please fill out all required fields.");
            return; // Exit the function if validation fails
        }

        if(password !== confirm_password)
        {
            document.getElementById("confirm_password_error").innerHTML=`<p style="color: red;">Error: Password and Confirm Password not matches.</p>`;
            return;
        }

        const isValidUser=validateUsername(name);
        const isValidEmail=validateEmail(email);
        const isValidPassword=validatePassword(password);


        if(isValidUser.valid && isValidEmail.valid && isValidPassword.valid)
        {
            const user = {name, email, password};
            const signUp = async () =>{
                const response = await fetch("http://localhost:8080/users/signUp",{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        name:user.name,
                        email:user.email,
                        password:user.password
                    })
                })
                const responseData= await response.json();
                if(responseData[0] === "false")
                {
                    document.getElementById("email_error").innerHTML=`<p style="color: red;">Error: ${responseData[1]}</p>`
                    return;
                }
                else
                {
                    //Reset the form input-fields
                    document.getElementById('username').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';
                    
                    toggle(); // Only toggle if the input is valid
                }
            }
            signUp();
        }
        else if(!isValidUser.valid)
        {
            if(isValidUser.message) {
                document.getElementById("username_error").innerHTML=`<p style="color: red;">Error: ${isValidUser.message}</p>`

            } else {
                alert("Error: Username validation failed.");
            }
            return;
        }
        else if(!isValidEmail.valid)
        {
            if(isValidEmail.message) {
                document.getElementById("email_error").innerHTML=`<p style="color: red;">Error: ${isValidEmail.message}</p>`
            } else {
                alert("Error: Email validation failed.");
            }
            return;
        }
        else {
            if(isValidPassword.message) {
                document.getElementById("password_error").innerHTML=`<p style="color: red;">Error: ${isValidPassword.message}</p>`
            } else {
                alert("Error: Password validation failed.");
            }
            return;
        }
    }



    function bookingHandle(e){
        e.preventDefault();

        var email=document.getElementById("signin_mail").value;
        var password=document.getElementById("signin_password").value;

        document.getElementById("login_email").innerHTML="";
        document.getElementById("login_password").innerHTML="";

        if (!email || !password) {
            alert("Please fill out all required fields.");
            return; // Exit the function if validation fails
        }
        
        const isValidEmail= validateEmail(email);

        if (isValidEmail.valid) {
            const signedUser = { email, password };
        
            async function sendData() {
                try {
                    const url = new URL("http://localhost:8080/users/booking");
                    const params = new URLSearchParams();
                    params.append("email", signedUser.email);
                    params.append("password", signedUser.password);
        
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: params.toString()
                    });
        
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
        
                    const responseData = await response.json();
                    if(responseData[0] === "false")
                    {
                        document.getElementById("login_password").innerHTML=`<p style="color: red;">Error: ${responseData[1]}</p>`;
                        return;
                    }
                    else{
                            // Store the response data in localStorage
                            sessionStorage.setItem('bookingResponse', JSON.stringify(responseData[2]));  
                            document.getElementById("loader").style.display = "block"; 
                            document.getElementById("signin_mail").innerHTML="";
                            document.getElementById("signin_password").innerHTML="";
                            // return responseData;
                            const dashboardUrl = "../pizzaMenu/pizzaMenu.html"; // URL for Booking Confirm page
                            window.location.replace(dashboardUrl);
                        }
                    
            
                    // confirmCall();
                } catch (error) {
                    alert("Error during fetch:", error);
                    throw error;
                }
            }
            sendData();
        }
        
        else if(!isValidEmail.valid)
        {
            if(isValidEmail.message) {
                document.getElementById("login_email").innerHTML=`<p style="color: red;">Error: ${isValidEmail.message}</p>`;
            } else {
                alert("Error: Email validation failed.");
            }
            return;
        }
    }

    function validateUsername(username) {
        // Length Validation
        if (username.length < 3 || username.length > 20) {
            return { valid: false, message: "Length of username must be between 3-50 characters" }; // Username length is not within the allowed range
        }

        // Character Set Validation
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return { valid: false, message: "Username can only contain lowercase, uppercase characters and (0-9, -, _)" }; // Username contains invalid characters
        }

        // Forbidden Words
        const forbiddenWords = ["admin", "root", "superuser"]; // Example forbidden words
        if (forbiddenWords.some(word => username.toLowerCase().includes(word))) {
            return { valid: false, message: "Username cannot be admin, root or superuser" }; // Username contains forbidden words
        }

        // If all validations pass, return true
        return { valid: true, message: "Username is valid" };
    }

    function validateEmail(email) {
        // Regular expression for validating email addresses
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Test the email against the regular expression
        if (!emailRegex.test(email)) {
            return { valid: false, message: "Please enter a valid email address." };
        }

        // Check the length of the email address
        if (email.length > 50) {
            return { valid: false, message: "Email address is too long.50 characters allowed" };
        }

        // Check for disallowed special characters
        const disallowedChars = /[!#$%^&*()+={}\[\]:;<>,?/|~]/;
        if (disallowedChars.test(email)) {
            return { valid: false, message: "Email address contains disallowed special characters." };
        }

        // Check for a valid top-level domain (TLD)
        const tldRegex = /\.(co|com|net|org|edu|gov)$/i; // Customize as needed
        if (!tldRegex.test(email)) {
            return { valid: false, message: "Please enter a valid top-level domain (TLD)." };
        }

        // If all validations pass, return true
        return { valid: true, message: "Email is valid." };
    }

    function validatePassword(password) {
        // Minimum length validation
        if (password.length < 8) {
            return { valid: false, message: "Password must be at least 8 characters long." };
        }

        // Maximum length validation (optional)
        if (password.length > 50) {
            return { valid: false, message: "Password cannot exceed 50 characters." };
        }

        // Character set validation
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!(hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar)) {
            return { valid: false, message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character." };
        }

        // If all validations pass, return true
        return { valid: true, message: "Password is valid." };
    }

    function togglePasswordVisibility(elementId) {
        var passwordInput = document.getElementById(elementId);
    
        // Toggle the password field visibility
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    
        // Toggle the eye icon
        var toggleIcon = document.getElementById("toggleIcon_" + elementId);
        toggleIcon.classList.toggle("fa-eye-slash");
        toggleIcon.classList.toggle("fa-eye");
    }
    
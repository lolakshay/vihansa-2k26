/**
 * Vihansa 2026 - Centralized Form Handler
 * Handles Google Sheet submissions for Cultural, Workshop, and Hackathon forms.
 */

// Function to initialize any form
function setupForm(config) {
    const {
        formId = 'registrationForm',
        scriptURL,
        messageId = 'form-message',
        submitBtnId = 'submit-btn',
        whatsappContainerId = 'whatsapp-link-container',
        fileInputId = 'upi_proof',
        hiddenFileInputId = 'upi_proof_base64',
        redirectUrl = null
    } = config;

    const form = document.forms[formId] || document.getElementById(formId);
    if (!form) return;

    const messageDiv = document.getElementById(messageId);
    const submitBtn = document.getElementById(submitBtnId);
    const whatsappContainer = document.getElementById(whatsappContainerId);

    // --- File Upload Handling (if file input exists) ---
    const fileInput = document.getElementById(fileInputId);
    const hiddenInput = document.getElementById(hiddenFileInputId);

    if (fileInput && hiddenInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                // Check Max Size (e.g., 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert("File size exceeds 2MB. Please upload a smaller image.");
                    this.value = ""; // Reset
                    hiddenInput.value = "";
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    hiddenInput.value = e.target.result;
                };
                reader.onerror = function (error) {
                    console.error("Error reading file:", error);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Form Submission ---
    form.addEventListener('submit', e => {
        e.preventDefault();

        // 1. Validate File (Only if the input exists and is visible/required)
        // Adjust logic if file input is optional for some forms
        if (fileInput && fileInput.hasAttribute('required') && !hiddenInput.value) {
            console.warn("File input validation failed: required but empty.");
            alert("Please wait for the payment proof to finish processing or re-upload it.");
            return;
        }

        console.log("Validation passed. Preparing fetch...");

        // 2. UI Loading State
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        if (messageDiv) {
            messageDiv.innerText = "Transmitting Data...";
            messageDiv.style.color = "#00f0ff";
        }

        const formData = new FormData(form);
        const params = new URLSearchParams();

        // Convert FormData to URLSearchParams for reliable Google Apps Script handling
        for (const [key, value] of formData.entries()) {
            params.append(key, value);
        }

        console.log("Calling fetch to URL:", scriptURL);

        fetch(scriptURL, {
            method: 'POST',
            body: params, // proper x-www-form-urlencoded
            mode: 'no-cors'
        })
            .then(() => {
                // Since mode is no-cors, we can't check response.ok. 
                // We assume success if the network request completed.
                console.log("Fetch request sent.");

                if (messageDiv) {
                    messageDiv.innerText = "REGISTRATION SUCCESSFUL // ACCESS GRANTED";
                    messageDiv.style.color = "#0aff0a";
                }
                form.reset();

                if (hiddenInput) hiddenInput.value = "";

                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }

                // Show WhatsApp Link
                if (whatsappContainer) {
                    whatsappContainer.style.display = 'block';
                }

                if (typeof fireConfetti === 'function') fireConfetti();

                if (redirectUrl) {
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                if (messageDiv) {
                    messageDiv.innerText = "ERROR // TRANSMISSION FAILED";
                    messageDiv.style.color = "#ff003c";
                }
                alert("Submission failed. Please check your internet connection and try again.");
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            });
    });
}

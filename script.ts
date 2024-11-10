// Get form container elements
const resumeForm = document.getElementById('resume-form') as HTMLFormElement;

// Event listener for form submission
resumeForm.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Get form data
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const contact = (document.getElementById('contact') as HTMLInputElement).value;
    const location = (document.getElementById('location') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const facebook = (document.getElementById('facebook') as HTMLInputElement).value;
    const twitter = (document.getElementById('twitter') as HTMLInputElement).value;
    const education = (document.getElementById('education') as HTMLInputElement).value.split(',').map(edu => edu.trim());
    const skills = (document.getElementById('skills') as HTMLInputElement).value.split(',').map(skill => skill.trim());
    const workExperience = (document.getElementById('work-experience') as HTMLInputElement).value;
    const profilePictureInput = document.getElementById('profile-picture') as HTMLInputElement;
    const profilePictureFile = profilePictureInput.files ? profilePictureInput.files[0] : null;

    if (!profilePictureFile) {
        alert("Please select a profile picture.");
        return;
    }

    // Profile picture handling with FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target?.result as string;

        // Generate resume HTML
        const resumeHTML = `
            <div class="resume-container" id="resume-container">
                <div id="inner-div">
                    <section class="Personal-info">
                        <div class="Information-box">
                            <h1 class="editable-text"> ${name}</h1>
                            <h2>Personal Information</h2>  
                            <p><i class="fa-solid fa-phone"></i> 
                            <span class="editable-text"> +92${contact}</span></p>
                            <p><i class="fa-solid fa-location-dot"></i> 
                            <a href="#" class="editable-text"> ${location}</a></p>
                            <p><i class="fa-regular fa-envelope"></i>
                            <a href="mailto:${email}"> ${email}</a></p>
                            <p><i class="fa-brands fa-facebook"></i> 
                            <a href="${facebook}"> ${facebook}</a></p>
                            <p><i class="fa-brands fa-twitter"></i></i> 
                            <a href="${twitter}"> ${twitter}</a></p>
                        </div>
                        <div id="Picture">
                            <img src="${imageUrl}" alt="Profile Picture" class="profile-picture">
                        </div>
                    </section>
                    <section class="education">
                        <h2>Education</h2>
                        <ul>${education.map(edu => `<li class="editable-text">${edu}</li>`).join('')}</ul>
                    </section> 
                    <section class="skills" id="skills-section">
                        <h2>Skills</h2>
                        <ul>${skills.map(skill => `<li class="editable-text">${skill}</li>`).join('')}</ul>
                    </section>
                    <section class="work-experience">
                        <h2>Work Experience</h2>
                        <p class="editable-text">${workExperience}</p>
                    </section>
                    <button id="download-pdf">Download as PDF</button>
                    <button id="share-link">Get Shareable Link</button>
                </div>
            </div>
        `;

        // Display generated resume
        const resumeContainer = document.createElement("div") as HTMLDivElement;
        resumeContainer.setAttribute("class", "resume-container");
        document.body.prepend(resumeContainer);
        resumeContainer.innerHTML = resumeHTML;

        // Hide form after generating resume
        const formContainer = document.querySelector(".form-container") as HTMLFormElement;
        formContainer.innerHTML = "";
        formContainer.style.visibility = "hidden";

        // Add editable functionality for text fields
        addEditListeners();

        // Add PDF download functionality
        const downloadButton = document.getElementById('download-pdf') as HTMLButtonElement;
        downloadButton.addEventListener('click', downloadResumeAsPDF);

        // Add shareable link functionality
        const shareButton = document.getElementById('share-link') as HTMLButtonElement;
        shareButton.addEventListener('click', () => generateShareableLink(name));
    };

    // Read file as Data URL to display in image tag
    reader.readAsDataURL(profilePictureFile);
});

// Function to add edit functionality to all editable sections
function addEditListeners() {
    const editableTexts = document.querySelectorAll('.editable-text');
    editableTexts.forEach(element => {
        element.addEventListener('click', () => makeEditable(element as HTMLElement));
    });
}

// Function to make a section editable and save changes
function makeEditable(element: HTMLElement) {
    const originalContent = element.textContent || '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalContent;
    input.classList.add('editable');

    // Replace the text content with the input
    element.replaceWith(input);
    input.focus();

    // Add a save button to save the changes
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save changes';
    saveButton.classList.add('save-button');
    input.insertAdjacentElement('afterend', saveButton);

    // Save changes on button click or pressing Enter
    const saveChanges = () => {
        element.textContent = input.value;
        input.replaceWith(element);
        saveButton.remove();
    };
    saveButton.addEventListener('click', saveChanges);
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') saveChanges();
    });
}

// Function to generate shareable link
function generateShareableLink(name: string) {
    const uniqueURL = `${window.location.origin}/resume/${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(uniqueURL)
        .then(() => alert(`Shareable link copied to clipboard: ${uniqueURL}`))
        .catch(err => alert(`Failed to copy link: ${err}`));
}

// Function to download resume as PDF
function downloadResumeAsPDF() {
    import('html2pdf.js').then((html2pdf) => {
        const resumeElement = document.getElementById('resume-container') as HTMLElement;
        html2pdf()
            .set({
                margin: 1,
                filename: 'resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            })
            .from(resumeElement)
            .save();
    }).catch(err => console.error("Failed to download PDF:", err));
}

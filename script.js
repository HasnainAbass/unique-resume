// Get form container elements
var resumeForm = document.getElementById('resume-form');
// Event listener for form submission
resumeForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting traditionally
    // Get form data
    var name = document.getElementById('name').value;
    var contact = document.getElementById('contact').value;
    var location = document.getElementById('location').value;
    var email = document.getElementById('email').value;
    var facebook = document.getElementById('facebook').value;
    var twitter = document.getElementById('twitter').value;
    var education = document.getElementById('education').value.split(',').map(function (edu) { return edu.trim(); });
    var skills = document.getElementById('skills').value.split(',').map(function (skill) { return skill.trim(); });
    var workExperience = document.getElementById('work-experience').value;
    var profilePictureInput = document.getElementById('profile-picture');
    var profilePictureFile = profilePictureInput.files ? profilePictureInput.files[0] : null;
    if (!profilePictureFile) {
        alert("Please select a profile picture.");
        return;
    }
    // Profile picture handling with FileReader
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        var imageUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        // Generate resume HTML
        var resumeHTML = "\n            <div class=\"resume-container\" id=\"resume-container\">\n                <div id=\"inner-div\">\n                    <section class=\"Personal-info\">\n                        <div class=\"Information-box\">\n                            <h1 class=\"editable-text\"> ".concat(name, "</h1>\n                            <h2>Personal Information</h2>  \n                            <p><i class=\"fa-solid fa-phone\"></i> \n                            <span class=\"editable-text\"> +92").concat(contact, "</span></p>\n                            <p><i class=\"fa-solid fa-location-dot\"></i> \n                            <a href=\"#\" class=\"editable-text\"> ").concat(location, "</a></p>\n                            <p><i class=\"fa-regular fa-envelope\"></i>\n                            <a href=\"mailto:").concat(email, "\"> ").concat(email, "</a></p>\n                            <p><i class=\"fa-brands fa-facebook\"></i> \n                            <a href=\"").concat(facebook, "\"> ").concat(facebook, "</a></p>\n                            <p><i class=\"fa-brands fa-twitter\"></i></i> \n                            <a href=\"").concat(twitter, "\"> ").concat(twitter, "</a></p>\n                        </div>\n                        <div id=\"Picture\">\n                            <img src=\"").concat(imageUrl, "\" alt=\"Profile Picture\" class=\"profile-picture\">\n                        </div>\n                    </section>\n                    <section class=\"education\">\n                        <h2>Education</h2>\n                        <ul>").concat(education.map(function (edu) { return "<li class=\"editable-text\">".concat(edu, "</li>"); }).join(''), "</ul>\n                    </section> \n                    <section class=\"skills\" id=\"skills-section\">\n                        <h2>Skills</h2>\n                        <ul>").concat(skills.map(function (skill) { return "<li class=\"editable-text\">".concat(skill, "</li>"); }).join(''), "</ul>\n                    </section>\n                    <section class=\"work-experience\">\n                        <h2>Work Experience</h2>\n                        <p class=\"editable-text\">").concat(workExperience, "</p>\n                    </section>\n                    <button id=\"download-pdf\">Download as PDF</button>\n                    <button id=\"share-link\">Get Shareable Link</button>\n                </div>\n            </div>\n        ");
        // Display generated resume
        var resumeContainer = document.createElement("div");
        resumeContainer.setAttribute("class", "resume-container");
        document.body.prepend(resumeContainer);
        resumeContainer.innerHTML = resumeHTML;
        // Hide form after generating resume
        var formContainer = document.querySelector(".form-container");
        formContainer.innerHTML = "";
        formContainer.style.visibility = "hidden";
        // Add editable functionality for text fields
        addEditListeners();
        // Add PDF download functionality
        var downloadButton = document.getElementById('download-pdf');
        downloadButton.addEventListener('click', downloadResumeAsPDF);
        // Add shareable link functionality
        var shareButton = document.getElementById('share-link');
        shareButton.addEventListener('click', function () { return generateShareableLink(name); });
    };
    // Read file as Data URL to display in image tag
    reader.readAsDataURL(profilePictureFile);
});
// Function to add edit functionality to all editable sections
function addEditListeners() {
    var editableTexts = document.querySelectorAll('.editable-text');
    editableTexts.forEach(function (element) {
        element.addEventListener('click', function () { return makeEditable(element); });
    });
}
// Function to make a section editable and save changes
function makeEditable(element) {
    var originalContent = element.textContent || '';
    var input = document.createElement('input');
    input.type = 'text';
    input.value = originalContent;
    input.classList.add('editable');
    // Replace the text content with the input
    element.replaceWith(input);
    input.focus();
    // Add a save button to save the changes
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save changes';
    saveButton.classList.add('save-button');
    input.insertAdjacentElement('afterend', saveButton);
    // Save changes on button click or pressing Enter
    var saveChanges = function () {
        element.textContent = input.value;
        input.replaceWith(element);
        saveButton.remove();
    };
    saveButton.addEventListener('click', saveChanges);
    input.addEventListener('keypress', function (event) {
        if (event.key === 'Enter')
            saveChanges();
    });
}
// Function to generate shareable link
function generateShareableLink(name) {
    var uniqueURL = "".concat(window.location.origin, "/resume/").concat(encodeURIComponent(name));
    navigator.clipboard.writeText(uniqueURL)
        .then(function () { return alert("Shareable link copied to clipboard: ".concat(uniqueURL)); })
        .catch(function (err) { return alert("Failed to copy link: ".concat(err)); });
}
// Function to download resume as PDF
function downloadResumeAsPDF() {
    Promise.resolve().then(function () { return require('html2pdf.js'); }).then(function (html2pdf) {
        var resumeElement = document.getElementById('resume-container');
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
    }).catch(function (err) { return console.error("Failed to download PDF:", err); });
}

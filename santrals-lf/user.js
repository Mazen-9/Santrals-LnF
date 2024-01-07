async function displayItems() {
  
    try {
        const response =  await fetch(`/user.html`);
  
        if (response.ok) {
            const items = await response.json();
  
        items.forEach(item => {
           
            const formattedDate = new Date(item.date_lost).toLocaleDateString('en-CA');
  
            const itemId = item.itemID || 'Not Available';
            const itemName = item.item_name || 'Not Available';
            const itemDescription = item.item_description || 'Not Available';
            const category = item.category || 'Not Available';
            const dateLost = formattedDate || 'Not Available';
            const lastLocation = item.last_loc || 'Not Available';
            
                var currentDate = new Date();
              
                var newItem = document.createElement("li");
                newItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
                newItem.innerHTML = `
        <div class="d-flex align-items-start">
            <div>
                <h5 class="mb-1">Item Name: ${itemName}, Date Added: ${currentDate.toLocaleDateString()}</h5>
                <p class="mb-1" style="font-weight: normal;">Category: ${category}</p>
            </div>
        </div>
        <div class="text-end">
            <button class="btn btn-primary mt-2 view-details-btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#viewDetailsModal" 
                    data-item-name="${itemName}" 
                    data-category="${category}" 
                    data-item-id="${itemId}"
                    data-date-lost="${dateLost}" 
                    data-item-description="${itemDescription}"
                    data-last-location="${lastLocation}"
                    data-image-url="${item.image_url}"> 
                View Details
            </button>
   
      
        </div>
        
    `;
            
                newItem.dateLost = new Date(dateLost);
                newItem.dateFound = currentDate;
                newItem.dateTimeAdded = currentDate;
                requestList.appendChild(newItem);
            
        });
  
            
        } else {
            console.error('Error fetching item details:', response.statusText);
            
        }
    } catch (error) {
        console.error('Error fetching item details:', error.message);
    }
  }  

document.addEventListener("DOMContentLoaded", function () {
    displayItems();
    var addRequestModal = new bootstrap.Modal(document.getElementById('addRequestModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    var viewDetailsModal = new bootstrap.Modal(document.getElementById('viewDetailsModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    // Open the chat modal when the chat icon is clicked
    document.getElementById('openChatModal').addEventListener('click', function () {
        // Assuming you're using Bootstrap for modals
        var chatModal = new bootstrap.Modal(document.getElementById('chatModal'), {
            backdrop: 'static',
            keyboard: false,
        });
        chatModal.show();
    });

    var requestList = document.getElementById('requestList');
    var sortByDateLost = document.getElementById('sortByDateLost');
    var sortByDateFound = document.getElementById('sortByDateFound');

    var imageUrl;
    var originalItemList = Array.from(requestList.children);
    var currentItemList = Array.from(requestList.children);

    function renderRequestList(items) {
        requestList.innerHTML = "";
        items.forEach(item => {
            requestList.appendChild(item.cloneNode(true));
        });
    }

    document.getElementById('addRequestBtn').addEventListener('click', function () {
        addRequestModal.show();
    });

    sortByDateLost.addEventListener('click', function () {
        sortItems('dateLost');
    });

    sortByDateFound.addEventListener('click', function () {
        sortItems('dateTimeAdded');
    });

    document.getElementById('itemName').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'category');
    });

    document.getElementById('category').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'lastLocation');
    });

    document.getElementById('lastLocation').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'dateLost');
    });

    document.getElementById('dateLost').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'itemDescription');
    });

    requestList.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-details-btn')) {
            const itemId = event.target.dataset.itemId;
            const itemName = event.target.dataset.itemName;
            const category = event.target.dataset.category;
            const dateLost = event.target.dataset.dateLost;
            const itemDescription = event.target.dataset.itemDescription;
            const lastLocation = event.target.dataset.lastLocation;
            const imageUrl = event.target.dataset.imageUrl;
    
            var imageTag = imageUrl ? `<img src="${imageUrl}" alt="Item Image" class="img-fluid">` : '<p>No image available</p>';
  
            document.getElementById('viewDetailsItemId').textContent = `Item ID: ${itemId}`;
            document.getElementById('detailsImageContainer').innerHTML = imageTag;
            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;
            viewDetailsModal.show();
    
            originalItemList = Array.from(requestList.children);
        }
    });

    document.getElementById('searchBtn').addEventListener('click', function () {
        performSearch();
    });

    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    var sortedItemList = [];

    function performSearch() {
        var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

        if (!searchTerm) {
            renderRequestList(originalItemList);
            sortedItemList = [];
        } else {
            var filteredItems = originalItemList.filter(item =>
                item.textContent.toLowerCase().includes(searchTerm)
            );
            renderRequestList(filteredItems);
            sortedItemList = filteredItems.slice();
        }

       
        console.log('searched');
    }

    function handleEnterKeyPress(event, nextInputId) {
        if (event.key === 'Enter') {
            event.preventDefault();
            triggerEnterKeyPress(nextInputId);
        }
    }

    function triggerEnterKeyPress(nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }

    function sortItems(sortCriterion) {
        var items = sortedItemList.length ? sortedItemList.slice() : originalItemList.slice(); // Use sorted items or original items
    
        items.sort(function (a, b) {
            var dateA = a[sortCriterion];
            var dateB = b[sortCriterion];
    
            return dateB - dateA;
        });
    
        renderRequestList(items); // Render the sorted items
        sortedItemList = items.slice(); // Update the sorted items after sorting
    }

    // Retrieve user information from local storage
    const storedEmail = localStorage.getItem('userEmail');
    const storedFirstName = localStorage.getItem('userFirstName');
    const storedLastName = localStorage.getItem('userLastName');
    const storedPhoneNumber = localStorage.getItem('userPhoneNumber');
    const storedpass = localStorage.getItem('userPassword');

    // Set retrieved user information in the settings modal fields
    document.getElementById('settingsEmail').value = storedEmail || '';
    document.getElementById('settingsFirstName').value = storedFirstName || '';
    document.getElementById('settingsLastName').value = storedLastName || '';
    document.getElementById('settingsPhoneNumber').value = storedPhoneNumber || '';
    document.getElementById('settingsPassword').value = storedpass || '';

    const settingsForm = document.getElementById('settingsForm');
    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve values from the settings form
        const newEmail = document.getElementById('settingsEmail').value.trim();
        const newPhoneNumber = document.getElementById('settingsPhoneNumber').value.trim();
        const newPassword = document.getElementById('settingsPassword').value.trim();
        const confirmPassword = document.getElementById('settingsConfirmPassword').value.trim();
        let finalPassword = localStorage.getItem('userPassword');

        if (newEmail.length < 10 || newEmail.length > 320) {
            alert('Email should be between 10 and 320 characters');
            return;
        }

        // Validate phone numbers
        if (newPhoneNumber.length !== 10) {
            alert('Phone number should be 10 characters');
            return;
        }

        // Check if the passwords match and are within the specified length range
        if ((newPassword !== confirmPassword && newPassword !== '') ||
            (newPassword.length > 0 && (newPassword.length < 8 || newPassword.length > 300))) {
            alert('Passwords should be equal and between 8 and 300 characters');
            return;
        }
        if (newPassword !== '' && confirmPassword !== '') {
            finalPassword = newPassword;
        }

        // Ask for confirmation
        const isConfirmed = confirm('Are you sure you want to save the changes?');

        if (isConfirmed) {
            // If the user confirms, proceed to save the updated information
            localStorage.setItem('userEmail', newEmail);
            localStorage.setItem('userPhoneNumber', newPhoneNumber);
            localStorage.setItem('userPassword', finalPassword);

            // Optionally, show a success message or perform other actions after saving changes

            // Close the settings modal
            const modalElement = document.getElementById('settingsModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } else {
            // If the user cancels, do not save the changes, revert email to the stored value
            document.getElementById('settingsEmail').value = storedEmail || '';
            document.getElementById('settingsPhoneNumber').value = storedPhoneNumber || '';
            document.getElementById('settingsPassword').value = storedpass || '';
            alert('Changes not saved');
            const modalElement = document.getElementById('settingsModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        }
    });

    document.getElementById('settingsModal').addEventListener('hidden.bs.modal', function () {
        const newPasswordField = document.getElementById('settingsPassword');
        const confirmPasswordField = document.getElementById('settingsConfirmPassword');

        newPasswordField.value = '';
        confirmPasswordField.value = '';
    });

    document.getElementById('settingsModal').addEventListener('hide.bs.modal', function () {
        document.getElementById('settingsEmail').value = storedEmail || '';
        document.getElementById('settingsFirstName').value = storedFirstName || '';
        document.getElementById('settingsLastName').value = storedLastName || '';
        document.getElementById('settingsPhoneNumber').value = storedPhoneNumber || '';
        const newPasswordField = document.getElementById('settingsPassword');
        const confirmPasswordField = document.getElementById('settingsConfirmPassword');

        newPasswordField.value = '';
        confirmPasswordField.value = '';
    });

    // Display retrieved first name and last name in the modal
    document.getElementById('userFirstName').textContent = storedFirstName || 'First Name';
    document.getElementById('userLastName').textContent = storedLastName || 'Last Name';
});
/*
var darkmode = document.getElementById("darkModeBtn");
if (darkmode) {
    darkmode.onclick = function () {
        document.body.classList.toggle("dark-theme");
    };
}
*/

//added shi

const darkModeCookie = document.cookie.split('; ').find(row => row.startsWith('darkMode='));
if (darkModeCookie) {
    const isDarkMode = darkModeCookie.split('=')[1] === 'true';
    document.body.classList.toggle("dark-theme", isDarkMode);
}

var darkmode = document.getElementById("darkModeBtn");
    if (darkmode) {
        darkmode.onclick = function() {
            document.body.classList.toggle("dark-theme");
            setDarkModePreference(document.body.classList.contains("dark-theme"));
        };
    }

function setDarkModePreference(isDarkMode) {
    document.cookie = `darkMode=${isDarkMode}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

function logout(){
    var form = $('<form action="/logout" method="POST"></form>');
    $('body').append(form);
    form.submit().remove()
  }

  // inserting the session information into the modal
  $(document).ready(function() {
    // Make an AJAX request to fetch user information
    $.ajax({
      url: '/profile',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        // Update the content of the modal with the fetched user information
        $('#userFirstName').text(data.userFirstName);
        $('#userID').text(data.userID);
      },
      error: function(error) {
        console.error('Error fetching user information:', error);
      }
    });
  });
// Sample data for initial testing
let staffList = [];
document.addEventListener("DOMContentLoaded", function () {

// Initialize the "Add Request" modal
const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));

// Function to render the staff list
async function fetchData() {
    try {
        const response = await fetch(`/staff.html`);
        if (response.ok) {
            staffList = await response.json();
            renderStaffList(); // Call the rendering function after fetching data
        } else {
            console.error('Error fetching item details:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching item details:', error.message);
    }
}
// Function to render the staff list
async function renderStaffList() {
    const staffContainer = document.getElementById("requestsContainer");
    const requestList = document.getElementById("requestList");

    requestList.innerHTML = "";

    staffList.forEach(item => {
           
        const formattedDate = new Date(item.date_lost).toLocaleDateString('en-CA');

        const userID = item.user_id || '';
        const itemId = item.itemID || '';
        const itemName = item.item_name || '';
        const itemDescription = item.item_description || '';
        const category = item.category || '';
        const dateLost = formattedDate || '';
        const lastLocation = item.last_loc || '';
        const imagePath = item.image_path || '';
        const dateAdded = item.date_added || '';

    // Render each staff item
    
        const listItem = document.createElement("li");
        listItem.className = "list-group-item custom-list-item";

        // Format the date as "MM/DD/YYYY"
        const formattedDateAdded = new Date(dateAdded).toLocaleDateString('en-US');

        // Update the listItem.innerHTML in renderStaffList
        listItem.innerHTML = `
    <div class="custom-list-item-content">
        <h5 class="mb-1">Item Name: ${itemName}, Date Added: ${formattedDateAdded}</h5>
        <p class="mb-1">Category: ${category}</p>
    </div>
    <div class="custom-list-item-buttons">
        <button class="btn btn-primary btn-sm me-2 listbtn" data-action="viewDetails"  data-id="${itemId}">View Details</button>
        <button class="btn btn-primary btn-sm me-2 listbtn" data-action="editItem"  data-id="${itemId}">Edit</button>
        <button class="btn btn-info btn-dark btn-sm listbtn" data-action="textStudent"  data-id="${itemId}">Text Student</button>
        <button class="btn btn-secondary btn-sm listbtn" data-action="status"  data-id="${itemId}">Status</button>
    </div>
`;
       requestList.appendChild(listItem);
       staffContainer.appendChild(requestList);
});
}
fetchData();

function addStaffItem(itemName, category, lastLocation, dateLost, itemDescription, image) {
    const currentDate = new Date(); // Get the current date and time
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format it as YYYY-MM-DD

    const newItem = {
        itemID: staffList.length + 1,
        item_name: itemName,
        category: category, // Use the category from the dropdown
        last_loc: lastLocation,
        date_lost: dateLost,
        item_description: itemDescription,
        image_path: image,
        dateAdded: formattedDate,
    };
    addingDB(itemName, category, lastLocation, dateLost, itemDescription, image);
    staffList.push(newItem);

    fetchData();
    // Render the updated staff list
    renderStaffList();
    

    // Hide the modal by setting its display property to 'none'
    const addRequestModalElement = document.getElementById("addRequestModal");
    addRequestModalElement.style.display = 'none';

    // Remove the modal backdrop if it exists
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    }
}

async function addingDB(itemName, category, lastLocation, dateLost, itemDescription, image) {
    try {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];

        const newItem = {
            itemID: staffList.length + 1,
            item_name: itemName,
            category: category, // Use the category from the dropdown
            last_loc: lastLocation,
            date_lost: dateLost,
            item_description: itemDescription,
            image_path: image,
            date_added: formattedDate,
        };

        const response = await fetch('/itemreport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            console.error('Error adding staff item:', response.statusText);
            throw new Error('Failed to add staff item');
        }

    } catch (error) {
        console.error('Error adding staff item:', error.message);
    }
}


function viewDetails(itemId) {
    const selectedItem = staffList.find((item) => item.itemID === itemId);

    if (!selectedItem) {
        // Handle the case where the item is not found
        console.error(`Item with ID ${itemId} not found.`);
        return;
    }

     const x = new Date(selectedItem.date_lost).toLocaleDateString('en-CA');
     var imageTag = selectedItem.image_path ? `<img src="${selectedItem.image_path}" alt="Item Image" class="img-fluid">` : '<p>No image available</p>';

    // Update the modal content with details
    document.getElementById("viewDetailsUserID").innerText = `User ID: ${selectedItem.user_id}`;
    document.getElementById("viewDetailsItemID").innerText = `Item ID: ${selectedItem.itemID}`;
    document.getElementById("viewDetailsDateLost").innerText =` Date Lost: ${x}`;
    document.getElementById("viewDetailsItemDescription").innerText =`Description: ${selectedItem.item_description}`;
    document.getElementById("viewDetailsLastLocation").innerText = `Last Location: ${selectedItem.last_loc}`;
    document.getElementById('detailsImageContainer').innerHTML = imageTag;
    
    // Display the image, if available
    // const imageView = document.getElementById("imageView");
    // if (selectedItem.image) {
    //     imageView.innerHTML = `<img src="${selectedItem.image}" alt="Item Image" class="img-fluid">`;
    // } else {
    //     imageView.innerHTML = "No image available";
    // }

    // Show the details modal
    const viewDetailsModal = new bootstrap.Modal(document.getElementById("viewDetailsModal"));
    viewDetailsModal.show();
}


function editItem(itemId) {
    // change this if errors arise
    document.getElementById("editItemImage").value = '';
    const selectedItem = staffList.find((item) => item.itemID === itemId);

    // Update the modal inputs with existing details
    document.getElementById("editItemName").value = selectedItem.item_name;
    document.getElementById("editItemCategory").value = selectedItem.category;
    document.getElementById("editLastLocation").value = selectedItem.last_loc;
    document.getElementById("editItemDateLost").value = new Date(selectedItem.date_lost).toLocaleDateString('en-CA');
    document.getElementById("editItemDescription").value = selectedItem.item_description;

    // Initialize the edit modal
    const editItemModal = new bootstrap.Modal(document.getElementById("editItemModal"));

    // Show the edit modal
    editItemModal.show();

    // Save changes on button click
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener('click', () => saveChanges(itemId, editItemModal));

    // Show confirmation modal on "Delete Item" button click
    const deleteItemBtn = document.getElementById("deleteItemBtn");
    deleteItemBtn.addEventListener('click', () => confirmDelete(itemId, editItemModal));
}


function saveChanges(itemId, modalInstance) {
    const selectedItemIndex = staffList.findIndex((item) => item.itemID === itemId);
    if (selectedItemIndex === -1) {
        console.error(`Item with ID ${itemId} not found.`);
        return;
    }

    // Update item details with edited values
    staffList[selectedItemIndex].item_name = document.getElementById("editItemName").value;
    staffList[selectedItemIndex].category = document.getElementById("editItemCategory").value;
    staffList[selectedItemIndex].last_loc = document.getElementById("editLastLocation").value;
    staffList[selectedItemIndex].date_lost = document.getElementById("editItemDateLost").value;
    staffList[selectedItemIndex].item_description = document.getElementById("editItemDescription").value;

    // Prepare the updated item data
    const updatedItem = {
        itemID: itemId,
        item_name: staffList[selectedItemIndex].item_name,
        category: staffList[selectedItemIndex].category,
        last_loc: staffList[selectedItemIndex].last_loc,
        date_lost: staffList[selectedItemIndex].date_lost,
        item_description: staffList[selectedItemIndex].item_description
    };

    fetch('/editItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            // Close the modal after saving changes
            modalInstance.hide();

            // Remove the modal backdrop
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) {
                modalBackdrop.parentNode.removeChild(modalBackdrop);
            }

            // Render the updated staff list
            renderStaffList();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
       
}


// Function to confirm delete before actually deleting
function confirmDelete(itemId, editItemModal) {
    const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationDeleteItemModal"));

    // Show the confirmation modal
    confirmationModal.show();

    // Handle delete confirmation
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    confirmDeleteBtn.onclick = function () {
        // Call the deleteItem function
        deleteItem(itemId, editItemModal);
   //    window.location.reload();
        fetchData();
        confirmationModal.hide();
        removeModalBackdrop();
    };
  //  renderStaffList();
}

// Function to delete a staff item
async function deleteItem(itemId, editItemModal) {
    try {
        // Send a request to the server to delete the item
        const response = await fetch('/deleteItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemID: itemId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Item deleted successfully:', data);

        // Find the index of the item in staffList
        const itemIndex = staffList.findIndex((item) => item.itemID === itemId);

        // Remove the item from the staff list
        staffList.splice(itemIndex, 1);
        fetchData();
        // Render the updated staff list
        renderStaffList();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors or show an alert to the user
    }
}

// Function to remove the modal backdrop
function removeModalBackdrop() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
        backdrop.parentNode.removeChild(backdrop);
    });

    // Ensure the body doesn't have the modal-open class, which may be causing the overlay
    document.body.classList.remove('modal-open');
}

// Function to sort staff list by date added in descending order
function sortByDateAdded() {
    staffList.sort((a, b) => b.itemID - a.itemID);
    renderStaffList();
}

// Function to sort staff list by date lost in descending order
function sortByDateLost() {
    staffList.sort((a, b) => new Date(new Date(a.date_lost).toLocaleDateString('en-CA')) - new Date(new Date(b.date_lost).toLocaleDateString('en-CA')));
    renderStaffList();
}

renderStaffList();

// Event listener for "Add Request" button click
document.getElementById('addRequestBtn').addEventListener('click', function () {
    document.getElementById('itemName').value = '';
    document.getElementById('category').value = '';
    document.getElementById('lastLocation').value = '';
    document.getElementById('dateLost').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('image').value = '';

    // Show the "Add Request" modal
    const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));

    // Ensure the modal is not already shown before showing it again
    if (!addRequestModal._isShown) {
        addRequestModal.show();
    }

    // Add event listeners for handling "Enter" key navigation
    document.getElementById('itemName').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('category').focus();
        }
    });

    document.getElementById('category').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('lastLocation').focus();
        }
    });

    document.getElementById('lastLocation').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('dateLost').focus();
        }
    });

    document.getElementById('dateLost').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('itemDescription').focus();
        }
    });
});


document.getElementById('submitRequestBtn').addEventListener('click', function () {
    // Retrieve input values
    var itemName = document.getElementById('itemName').value.trim();
    var category = document.getElementById('category').value.trim();
    var lastLocation = document.getElementById('lastLocation').value.trim();
    var dateLost = document.getElementById('dateLost').value.trim();
    var itemDescription = document.getElementById('itemDescription').value.trim();
    var imageInput = document.getElementById('image');

    // Check if required fields are filled
    if (itemName && category && lastLocation && dateLost && itemDescription) {
        var image = '';
        if (imageInput.files.length > 0) {
            var selectedImage = imageInput.files[0];
            image = URL.createObjectURL(selectedImage);
        }

        console.log('this is the image', image);

        addStaffItem(itemName, category, lastLocation, dateLost, itemDescription, image);

        // Close the "Add Request" modal after adding a new staff item
        const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));
        addRequestModal.hide();
        renderStaffList();
        // Remove the modal backdrop manually
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }
    } else {
        alert('Please fill in all required fields.');
    }
});

renderStaffList();
// Update the event listener in requestsContainer to handle the "Status" button and modal
let selectedStatus = null;
let selectedStatusOption = null;
let locationFound = null;
let dateReturned = null;

// Update the event listener in requestsContainer to handle the "Status" button and modal
document.getElementById('requestsContainer').addEventListener('click', function (event) {
    const target = event.target;

    const action = target.getAttribute('data-action');
    const itemId = target.getAttribute('data-id');

    if (action && itemId) {
        if (action === 'viewDetails') {
            viewDetails(parseInt(itemId, 10));
        } else if (action === 'editItem') {
            editItem(parseInt(itemId, 10));
        } else if (action === 'textStudent') {
            const staffChatModal = new bootstrap.Modal(document.getElementById("staffChatModal"));
            staffChatModal.show();
        } else if (action === 'status') {
            // Show the status modal
            const statusModal = new bootstrap.Modal(document.getElementById("statusModal"));
            statusModal.show();

            // Handle status selection
            const statusButtons = document.querySelectorAll('#statusModal button[data-status]');
            statusButtons.forEach(button => {
                button.addEventListener('click', function () {
                    selectedStatus = this.getAttribute('data-status');
                    console.log(`Status selected for item ID ${itemId}: ${selectedStatus}`);

                    // Toggle active class for Lost and Found buttons
                    if (selectedStatus === 'Found') {
                        document.querySelector('.lost-btn').classList.remove('active');
                        document.querySelector('.found-btn').classList.add('active');
                    } else {
                        document.querySelector('.found-btn').classList.remove('active');
                        document.querySelector('.lost-btn').classList.add('active');
                    }

                    // Handle dynamic content based on status
                    const foundOptions = document.getElementById('foundOptions');
                    const returnedOptions = document.getElementById('returnedOptions');

                    if (selectedStatus === 'Found') {
                        foundOptions.style.display = 'block';
                        returnedOptions.style.display = 'none'; // Hide "Returned" options initially
                    } else {
                        foundOptions.style.display = 'none';
                        returnedOptions.style.display = 'none';
                    }
                });
            });

            // Handle "Returned" and "Not Returned" options
            const statusOptionButtons = document.querySelectorAll('#statusModal button[data-status-option]');
            statusOptionButtons.forEach(optionButton => {
                optionButton.addEventListener('click', function () {
                    selectedStatusOption = this.getAttribute('data-status-option');
                    console.log(`Status Option selected for item ID ${itemId}: ${selectedStatusOption}`);

                    // Toggle active class for Returned and Not Returned buttons
                    if (selectedStatusOption === 'Returned') {
                        document.querySelector('.not-returned-btn').classList.remove('active');
                        document.querySelector('.returned-btn').classList.add('active');
                    } else {
                        document.querySelector('.returned-btn').classList.remove('active');
                        document.querySelector('.not-returned-btn').classList.add('active');
                    }

                    // Handle dynamic content based on status option
                    const returnedOptions = document.getElementById('returnedOptions');
                    if (selectedStatusOption === 'Returned') {
                        returnedOptions.style.display = 'block';
                    } else {
                        returnedOptions.style.display = 'none';
                    }
                });
            });

            // Handle the "Confirm" button click
            const confirmStatusBtn = document.getElementById('confirmStatusBtn');
            confirmStatusBtn.addEventListener('click', function () {
                // Get additional options for "Found" status
                locationFound = document.getElementById('editLastLocation').value;
                dateReturned = document.getElementById('dateReturned').value;

                // Check if both date found and location found are required
                const requiresDateFoundAndLocation = selectedStatus === 'Found';

                if (requiresDateFoundAndLocation && (!locationFound)) {
                    // Display an alert if both date found and location found are required but not filled
                    alert('Please fill in both Date Found and Location Found.');
                } else {
                    // Continue with processing or updating your data structure

                    // Display a confirmation (you can customize this part based on your needs)
                    //alert(`Status: ${selectedStatus}`);
                    const mappedStatusOption = selectedStatusOption === 'Not Returned' ? 'notReturned' : selectedStatusOption;

                    // Send data to server
                    const requestData = {
                        itemID: itemId,
                        item_status: selectedStatus,
                        return_status: mappedStatusOption,
                        found_loc: locationFound,
                        date_found: dateReturned,
                        date_returned: dateReturned,
                    };

                    // Make an HTTP POST request to updateStatus endpoint
                    fetch('/updateStatus', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Handle success response from the server
                            console.log('Status updated successfully:', data);
                        })
                        .catch(error => {
                            // Handle error during the fetch
                            console.error('Error updating status:', error);
                        })
                        .finally(() => {
                            // Close the modal
                            statusModal.hide();
                            fetchData();
                            renderStaffList();
                        });
                        
                }
              
            });
        }
    }
});
document.getElementById('sortByDateAddedBtn').addEventListener('click', function () {
    sortByDateAdded();
});

document.getElementById('sortByDateLostBtn').addEventListener('click', function () {
    sortByDateLost();
});

document.getElementById('searchBtn').addEventListener('click', function () {
    performSearch();
});

document.getElementById('searchInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Function to perform search
function performSearch() {
    searchItems(document.getElementById('searchInput').value.trim().toLowerCase());
}

// Function to search for items
function searchItems(searchTerm) {
    if (!searchTerm) {
        renderStaffList();
        return;
    }

    const filteredItems = staffList.filter(item =>
        item.category.toLowerCase().includes(searchTerm) ||
        item.item_name.toLowerCase().includes(searchTerm)
    );

    renderFilteredItems(filteredItems);
}

function renderFilteredItems(filteredItems) {
    const staffContainer = document.getElementById("requestsContainer");
    const staffListElement = document.getElementById("requestList");

    // Clear previous list
    staffListElement.innerHTML = "";

    // Render each staff item
    filteredItems.forEach((staffItem) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item custom-list-item";

        // Format the date as "MM/DD/YYYY"
        const formattedDateAdded = new Date(listItem.dateAdded).toLocaleDateString('en-US');


        // Update the listItem.innerHTML in renderStaffList
        listItem.innerHTML = `
    <div class="custom-list-item-content">
        <h5 class="mb-1">Item Name: ${staffItem.item_name}, Date Added: ${formattedDateAdded}</h5>
        <p class="mb-1">Category: ${staffItem.category}</p>
    </div>
    <div class="custom-list-item-buttons">
        <button class="btn btn-primary btn-sm me-2 listbtn" data-action="viewDetails" data-id="${staffItem.itemID}">View Details</button>
        <button class="btn btn-warning btn-sm me-2 listbtn" data-action="editItem" data-id="${staffItem.itemID}">Edit</button>
        <button class="btn btn-info btn-dark btn-sm listbtn" data-action="textStudent" data-id="${staffItem.itemID}">Text Student</button>
        <button class="btn btn-secondary btn-sm listbtn" data-action="status" data-id="${staffItem.itemID}">Status</button>
    </div>
`;
        staffListElement.appendChild(listItem);
    });

    staffContainer.appendChild(staffListElement);
}

});

//Dark Mode
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
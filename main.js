
// Get form elements (only if they exist)
let title = document.getElementById("title")
let price = document.getElementById('price')
let taxes  = document.getElementById('taxes')
let ads = document.getElementById('ads')
let discount = document.getElementById('discount')
let count = document.getElementById('count')
let total = document.getElementById('total')
let create = document.getElementById ('submit')
let category = document.getElementById("category")


function getTotal() {
    if(price && total && price.value !=""){ 
        total.style.display = "block";
        // Use originalQuantity if available, otherwise use count.value
        let quantity = originalQuantity > 0 ? originalQuantity : (+count.value || 1);
        let result = ((+price.value + +taxes.value + +ads.value) - +discount.value) * quantity;
        total.innerHTML = result;
        total.style.backgroundColor = "rgba(5, 219, 8, 1)";
    }
    else if(total){
        total.style.display = "none";
        total.innerHTML = "";
        total.style.backgroundColor = "#4774ef";
    }
}

// Store original quantity for proper calculations
let originalQuantity = 0;

// Count functionality - multiply quantity by number of products
function calculateCount() {
    if(count && count.value !== "") {
        let quantity = parseInt(count.value);
        if (!isNaN(quantity) && quantity > 0) {
            let numberOfProducts = dataPro.length;
            if (numberOfProducts > 0) {
                // Store the original quantity for total calculation
                originalQuantity = quantity;
                let totalQuantity = quantity * numberOfProducts;
                count.value = totalQuantity;
                
                // Show visual feedback
                count.style.backgroundColor = "rgba(5, 219, 8, 0.3)";
                setTimeout(() => {
                    count.style.backgroundColor = "";
                }, 500);
                
                // Also update the total calculation
                getTotal();
            }
        }
    } else {
        originalQuantity = 0;
    }
}
 

let dataPro;


if(localStorage.product != null){
  dataPro = JSON.parse(localStorage.product);
}else{
  dataPro = [];
}


// Validation function to check if all required fields are filled
function validateProduct() {
  const errors = [];
  
  // Check required fields
  if (!title || !title.value.trim()) {
    errors.push("Product title is required");
  } else if (title.value.trim().length < 2) {
    errors.push("Product title must be at least 2 characters long");
  }
  
  if (!price || !price.value.trim() || isNaN(price.value) || parseFloat(price.value) <= 0) {
    errors.push("Valid price is required (must be greater than 0)");
  } else if (parseFloat(price.value) > 999999) {
    errors.push("Price cannot exceed $999,999");
  }
  
  if (!category || !category.value.trim()) {
    errors.push("Product category is required");
  } else if (category.value.trim().length < 2) {
    errors.push("Product category must be at least 2 characters long");
  }
  
  // Check optional numeric fields (if provided, they should be valid numbers)
  if (taxes && taxes.value.trim() && (isNaN(taxes.value) || parseFloat(taxes.value) < 0)) {
    errors.push("Taxes must be a valid number (0 or greater)");
  } else if (taxes && taxes.value.trim() && parseFloat(taxes.value) > 999999) {
    errors.push("Taxes cannot exceed $999,999");
  }
  
  if (ads && ads.value.trim() && (isNaN(ads.value) || parseFloat(ads.value) < 0)) {
    errors.push("Ads must be a valid number (0 or greater)");
  } else if (ads && ads.value.trim() && parseFloat(ads.value) > 999999) {
    errors.push("Ads cannot exceed $999,999");
  }
  
  if (discount && discount.value.trim() && (isNaN(discount.value) || parseFloat(discount.value) < 0)) {
    errors.push("Discount must be a valid number (0 or greater)");
  } else if (discount && discount.value.trim() && parseFloat(discount.value) > 999999) {
    errors.push("Discount cannot exceed $999,999");
  }
  
  if (count && count.value.trim() && (isNaN(count.value) || parseFloat(count.value) <= 0)) {
    errors.push("Count must be a valid number (greater than 0)");
  } else if (count && count.value.trim() && parseFloat(count.value) > 999999) {
    errors.push("Count cannot exceed 999,999");
  }
  
  return errors;
}

// Function to show validation errors
function showValidationErrors(errors) {
  // Remove any existing error messages
  const existingError = document.getElementById('validation-errors');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message container
  const errorContainer = document.createElement('div');
  errorContainer.id = 'validation-errors';
  errorContainer.style.cssText = `
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    padding: 15px 20px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
    border-left: 4px solid #fff;
    animation: slideInDown 0.3s ease;
  `;
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Create error list
  const errorList = document.createElement('ul');
  errorList.style.cssText = `
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
  `;
  
  errors.forEach(error => {
    const errorItem = document.createElement('li');
    errorItem.textContent = error;
    errorItem.style.cssText = `
      margin: 5px 0;
      font-weight: 500;
    `;
    errorList.appendChild(errorItem);
  });
  
  errorContainer.appendChild(errorList);
  
  // Insert error message before the form
  const formContainer = document.querySelector('.inputs');
  if (formContainer) {
    formContainer.parentNode.insertBefore(errorContainer, formContainer);
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (errorContainer.parentNode) {
      errorContainer.style.animation = 'slideInDown 0.3s ease reverse';
      setTimeout(() => {
        if (errorContainer.parentNode) {
          errorContainer.remove();
          document.head.removeChild(style);
        }
      }, 300);
    }
  }, 5000);
}

// Function to highlight invalid fields
function highlightInvalidFields() {
  const fields = [
    { element: title, required: true },
    { element: price, required: true, numeric: true },
    { element: category, required: true },
    { element: taxes, required: false, numeric: true },
    { element: ads, required: false, numeric: true },
    { element: discount, required: false, numeric: true },
    { element: count, required: false, numeric: true }
  ];
  
  fields.forEach(field => {
    if (field.element) {
      const isValid = field.element.value.trim() !== '' && 
                     (!field.numeric || !isNaN(field.element.value)) &&
                     (!field.required || field.element.value.trim() !== '');
      
      if (!isValid && field.element.value.trim() !== '') {
        field.element.style.borderColor = '#dc3545';
        field.element.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
      } else if (field.required && field.element.value.trim() === '') {
        field.element.style.borderColor = '#dc3545';
        field.element.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
      } else {
        field.element.style.borderColor = '';
        field.element.style.boxShadow = '';
      }
    }
  });
}

// Function to clear field highlighting
function clearFieldHighlighting() {
  const fields = [title, price, category, taxes, ads, discount, count];
  fields.forEach(field => {
    if (field) {
      field.style.borderColor = '';
      field.style.boxShadow = '';
    }
  });
}

// Only set up form event listeners if the create button exists
if(create) {
  create.onclick = function(){
    // Clear any previous validation errors and highlighting
    const existingError = document.getElementById('validation-errors');
    if (existingError) {
      existingError.remove();
    }
    clearFieldHighlighting();
    
    // Validate the form
    const validationErrors = validateProduct();
    
    if (validationErrors.length > 0) {
      showValidationErrors(validationErrors);
      highlightInvalidFields();
      return; // Stop execution if validation fails
    }
    
    // If validation passes, create the product
    let newPro = {
      title: title.value.trim(),
      price: price.value,
      taxes: taxes.value || 0,
      ads: ads.value || 0,
      discount: discount.value || 0,
      total: total.innerHTML,
      count: count.value || 1,
      category: category.value.trim(),
    }
    
    cleardata()
    dataPro.push(newPro)
    localStorage.setItem("product", JSON.stringify(dataPro))
    showa();
    
    // Show success message
    showSuccessMessage('Product created successfully!');
  }
  
}



//clear
function cleardata(){
  if(title) title.value="";
  if(price) price.value="";
  if(taxes) taxes.value="";
  if(ads) ads.value="";
  if(discount) discount.value ="";
  if(count) count.value = "";
  if(total) total.innerHTML = "";
  if(category) category.value = "";
}


//read
function showa(){
  let tbody = document.getElementById("tbody");
  if(!tbody) {
    console.log('Table body not found');
    return; // Exit if table doesn't exist
  }
  
  console.log('Displaying', dataPro.length, 'products');
  let table = "";
  for( let i = 0; i < dataPro.length ; i++){
    table += `  
      <tr>
        <td>${i+1}</td>
        <td>${dataPro [i].title}</td>
        <td>$${dataPro[i].price}</td>
        <td>$${dataPro[i].taxes}</td>
        <td>$${dataPro[i].ads}</td>
        <td>$${dataPro[i].discount}</td>
        <td>$${dataPro[i].total}</td>
        <td>${dataPro[i].count || 0}</td>
        <td>${dataPro [i].category}</td>
        <td><button class="update-btn" onclick="updateProduct(${i})">Update</button></td>
        <td><button class="delete-btn" onclick="deleteProduct(${i})">Delete</button></td>
      </tr>`
  }
  tbody.innerHTML=table;
  console.log('Table updated with', dataPro.length, 'rows');



let BtnDelete = document.getElementById(`dAll`);
  if( dataPro.length >0 ){
 BtnDelete.innerHTML = `<button  onclick="deleteAll()" class="DBtn">Delete ALL</button>`
} else{
   BtnDelete.innerHTML = ``;
}

}


function deleteAll(){
  localStorage.clear()
   dataPro.splice(0)
    showa()
}

//delete function
function deleteProduct(index){
  if(confirm('Are you sure you want to delete this product?')){
    dataPro.splice(index, 1);
    localStorage.setItem("product", JSON.stringify(dataPro));
    showa();
  }
}

// Global variable to store the index of the product being updated
let currentUpdateIndex = -1;

// Update function - shows modal with current product data
function updateProduct(index){
  currentUpdateIndex = index;
  const product = dataPro[index];
  
  // Populate the modal with current product data
  document.getElementById('updateTitle').value = product.title || '';
  document.getElementById('updatePrice').value = product.price || '';
  document.getElementById('updateTaxes').value = product.taxes || '';
  document.getElementById('updateAds').value = product.ads || '';
  document.getElementById('updateDiscount').value = product.discount || '';
  document.getElementById('updateCount').value = product.count || '';
  document.getElementById('updateCategory').value = product.category || '';
  
  // Calculate and display total
  updateModalTotal();
  
  // Show the modal
  document.getElementById('updateModal').style.display = 'block';
}

// Calculate total in the update modal
function updateModalTotal() {
  const price = parseFloat(document.getElementById('updatePrice').value) || 0;
  const taxes = parseFloat(document.getElementById('updateTaxes').value) || 0;
  const ads = parseFloat(document.getElementById('updateAds').value) || 0;
  const discount = parseFloat(document.getElementById('updateDiscount').value) || 0;
  const count = parseFloat(document.getElementById('updateCount').value) || 1;
  
  const result = ((price + taxes + ads) - discount) * count;
  document.getElementById('updateTotal').textContent = '$' + result.toFixed(2);
}

// Close the update modal
function closeUpdateModal() {
  document.getElementById('updateModal').style.display = 'none';
  currentUpdateIndex = -1;
}

// Validation function for update modal
function validateUpdateProduct() {
  const errors = [];
  
  // Get update form elements
  const updateTitle = document.getElementById('updateTitle');
  const updatePrice = document.getElementById('updatePrice');
  const updateCategory = document.getElementById('updateCategory');
  const updateTaxes = document.getElementById('updateTaxes');
  const updateAds = document.getElementById('updateAds');
  const updateDiscount = document.getElementById('updateDiscount');
  const updateCount = document.getElementById('updateCount');
  
  // Check required fields
  if (!updateTitle || !updateTitle.value.trim()) {
    errors.push("Product title is required");
  } else if (updateTitle.value.trim().length < 2) {
    errors.push("Product title must be at least 2 characters long");
  }
  
  if (!updatePrice || !updatePrice.value.trim() || isNaN(updatePrice.value) || parseFloat(updatePrice.value) <= 0) {
    errors.push("Valid price is required (must be greater than 0)");
  } else if (parseFloat(updatePrice.value) > 999999) {
    errors.push("Price cannot exceed $999,999");
  }
  
  if (!updateCategory || !updateCategory.value.trim()) {
    errors.push("Product category is required");
  } else if (updateCategory.value.trim().length < 2) {
    errors.push("Product category must be at least 2 characters long");
  }
  
  // Check optional numeric fields (if provided, they should be valid numbers)
  if (updateTaxes && updateTaxes.value.trim() && (isNaN(updateTaxes.value) || parseFloat(updateTaxes.value) < 0)) {
    errors.push("Taxes must be a valid number (0 or greater)");
  } else if (updateTaxes && updateTaxes.value.trim() && parseFloat(updateTaxes.value) > 999999) {
    errors.push("Taxes cannot exceed $999,999");
  }
  
  if (updateAds && updateAds.value.trim() && (isNaN(updateAds.value) || parseFloat(updateAds.value) < 0)) {
    errors.push("Ads must be a valid number (0 or greater)");
  } else if (updateAds && updateAds.value.trim() && parseFloat(updateAds.value) > 999999) {
    errors.push("Ads cannot exceed $999,999");
  }
  
  if (updateDiscount && updateDiscount.value.trim() && (isNaN(updateDiscount.value) || parseFloat(updateDiscount.value) < 0)) {
    errors.push("Discount must be a valid number (0 or greater)");
  } else if (updateDiscount && updateDiscount.value.trim() && parseFloat(updateDiscount.value) > 999999) {
    errors.push("Discount cannot exceed $999,999");
  }
  
  if (updateCount && updateCount.value.trim() && (isNaN(updateCount.value) || parseFloat(updateCount.value) <= 0)) {
    errors.push("Count must be a valid number (greater than 0)");
  } else if (updateCount && updateCount.value.trim() && parseFloat(updateCount.value) > 999999) {
    errors.push("Count cannot exceed 999,999");
  }
  
  return errors;
}

// Function to show validation errors in update modal
function showUpdateValidationErrors(errors) {
  // Remove any existing error messages in modal
  const existingError = document.getElementById('update-validation-errors');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message container
  const errorContainer = document.createElement('div');
  errorContainer.id = 'update-validation-errors';
  errorContainer.style.cssText = `
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    padding: 15px 20px;
    margin: 10px 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
    border-left: 4px solid #fff;
    animation: slideInDown 0.3s ease;
  `;
  
  // Create error list
  const errorList = document.createElement('ul');
  errorList.style.cssText = `
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
  `;
  
  errors.forEach(error => {
    const errorItem = document.createElement('li');
    errorItem.textContent = error;
    errorItem.style.cssText = `
      margin: 5px 0;
      font-weight: 500;
    `;
    errorList.appendChild(errorItem);
  });
  
  errorContainer.appendChild(errorList);
  
  // Insert error message in modal body
  const modalBody = document.querySelector('.modal-body');
  if (modalBody) {
    modalBody.insertBefore(errorContainer, modalBody.firstChild);
  }
}

// Function to highlight invalid fields in update modal
function highlightUpdateInvalidFields() {
  const fields = [
    { element: document.getElementById('updateTitle'), required: true },
    { element: document.getElementById('updatePrice'), required: true, numeric: true },
    { element: document.getElementById('updateCategory'), required: true },
    { element: document.getElementById('updateTaxes'), required: false, numeric: true },
    { element: document.getElementById('updateAds'), required: false, numeric: true },
    { element: document.getElementById('updateDiscount'), required: false, numeric: true },
    { element: document.getElementById('updateCount'), required: false, numeric: true }
  ];
  
  fields.forEach(field => {
    if (field.element) {
      const isValid = field.element.value.trim() !== '' && 
                     (!field.numeric || !isNaN(field.element.value)) &&
                     (!field.required || field.element.value.trim() !== '');
      
      if (!isValid && field.element.value.trim() !== '') {
        field.element.style.borderColor = '#dc3545';
        field.element.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
      } else if (field.required && field.element.value.trim() === '') {
        field.element.style.borderColor = '#dc3545';
        field.element.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
      } else {
        field.element.style.borderColor = '';
        field.element.style.boxShadow = '';
      }
    }
  });
}

// Function to clear update field highlighting
function clearUpdateFieldHighlighting() {
  const fields = [
    'updateTitle', 'updatePrice', 'updateCategory', 
    'updateTaxes', 'updateAds', 'updateDiscount', 'updateCount'
  ];
  
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.style.borderColor = '';
      field.style.boxShadow = '';
    }
  });
}

// Save the updated product data
function saveUpdate() {
  if (currentUpdateIndex === -1) return;
  
  // Clear any previous validation errors and highlighting
  const existingError = document.getElementById('update-validation-errors');
  if (existingError) {
    existingError.remove();
  }
  clearUpdateFieldHighlighting();
  
  // Validate the update form
  const validationErrors = validateUpdateProduct();
  
  if (validationErrors.length > 0) {
    showUpdateValidationErrors(validationErrors);
    highlightUpdateInvalidFields();
    return; // Stop execution if validation fails
  }
  
  // Get the save button and add loading state
  const saveBtn = document.querySelector('.btn-save');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'SAVING...';
  saveBtn.style.opacity = '0.7';
  saveBtn.disabled = true;
  
  // Get updated values
  const updatedProduct = {
    title: document.getElementById('updateTitle').value.trim(),
    price: document.getElementById('updatePrice').value,
    taxes: document.getElementById('updateTaxes').value || 0,
    ads: document.getElementById('updateAds').value || 0,
    discount: document.getElementById('updateDiscount').value || 0,
    count: document.getElementById('updateCount').value || 1,
    category: document.getElementById('updateCategory').value.trim(),
    total: document.getElementById('updateTotal').textContent.replace('$', '')
  };
  
  // Simulate a brief delay for better UX
  setTimeout(() => {
    // Update the product in the array
    dataPro[currentUpdateIndex] = updatedProduct;
    
    // Save to localStorage
    localStorage.setItem("product", JSON.stringify(dataPro));
    
    // Refresh the table
    showa();
    
    // Close the modal
    closeUpdateModal();
    
    // Show success message with better styling
    showSuccessMessage('Product updated successfully!');
    
    // Reset button state
    saveBtn.textContent = originalText;
    saveBtn.style.opacity = '1';
    saveBtn.disabled = false;
  }, 800);
}

// Show success message with better styling
function showSuccessMessage(message) {
  // Create success notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
    z-index: 3000;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    animation: slideInRight 0.5s ease;
  `;
  notification.textContent = message;
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
      document.head.removeChild(style);
    }, 500);
  }, 3000);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('updateModal');
  if (event.target === modal) {
    closeUpdateModal();
  }
}

// Search functionality
function searchByTitle() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm === '') {
    showa(); // Show all products if search is empty
    return;
  }
  
  const filteredData = dataPro.filter(product => 
    product.title.toLowerCase().includes(searchTerm)
  );
  
  displaySearchResults(filteredData);
}

function searchByCategory() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm === '') {
    showa(); // Show all products if search is empty
    return;
  }
  
  const filteredData = dataPro.filter(product => 
    product.category.toLowerCase().includes(searchTerm)
  );
  
  displaySearchResults(filteredData);
}

function displaySearchResults(results) {
  let tbody = document.getElementById("tbody");
  if(!tbody) {
    console.log('Table body not found');
    return;
  }
  
  console.log('Displaying', results.length, 'search results');
  let table = "";
  for( let i = 0; i < results.length ; i++){
    // Find the original index in dataPro array
    const originalIndex = dataPro.findIndex(p => p === results[i]);
    
    table += `  
      <tr>
        <td>${originalIndex + 1}</td>
        <td>${results[i].title}</td>
        <td>$${results[i].price}</td>
        <td>$${results[i].taxes}</td>
        <td>$${results[i].ads}</td>
        <td>$${results[i].discount}</td>
        <td>$${results[i].total}</td>
        <td>${results[i].count || 0}</td>
        <td>${results[i].category}</td>
        <td><button class="update-btn" onclick="updateProduct(${originalIndex})">Update</button></td>
        <td><button class="delete-btn" onclick="deleteProduct(${originalIndex})">Delete</button></td>
      </tr>`
  }
  tbody.innerHTML=table;
  console.log('Search results updated with', results.length, 'rows');
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded, dataPro length:', dataPro.length);
  showa();
  
  // Add search event listeners if search buttons exist
  const searchTitleBtn = document.getElementById('search-title');
  const searchCategoryBtn = document.getElementById('search-category');
  
  if (searchTitleBtn) {
    searchTitleBtn.addEventListener('click', searchByTitle);
  }
  
  if (searchCategoryBtn) {
    searchCategoryBtn.addEventListener('click', searchByCategory);
  }
  
  // Add real-time search as user types
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      if (this.value.trim() === '') {
        showa(); // Show all products when search is cleared
      }
    });
  }
  
  // Add event listeners to clear validation errors when user starts typing
  const formFields = [title, price, category, taxes, ads, discount, count];
  formFields.forEach(field => {
    if (field) {
      field.addEventListener('input', function() {
        // Clear validation errors when user starts typing
        const existingError = document.getElementById('validation-errors');
        if (existingError) {
          existingError.remove();
        }
        clearFieldHighlighting();
      });
    }
  });
  
  // Add event listeners for update modal fields
  const updateFields = [
    'updateTitle', 'updatePrice', 'updateCategory', 
    'updateTaxes', 'updateAds', 'updateDiscount', 'updateCount'
  ];
  updateFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', function() {
        // Clear validation errors when user starts typing
        const existingError = document.getElementById('update-validation-errors');
        if (existingError) {
          existingError.remove();
        }
        clearUpdateFieldHighlighting();
      });
    }
  });
});


//btnScroll
let btn = document.querySelector(".button");

window.onscroll = function () {
  if (scrollY >= 100)
  {
    btn.style.display = "block";
  } 
  else {
    btn.style.display = "none";
  }
}
btn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}



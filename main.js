
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

if(title.value !=""){
    
if(create) {
  create.onclick = function(){
   let newPro = {
     title:title.value,
     price:price.value,
     taxes:taxes.value,
     ads:ads.value,
     discount:discount.value,
     total:total.innerHTML,
     count:count.value,
     category:category.value,
    }
}
// Only set up form event listeners if the create button exists
    cleardata()
    dataPro.push(newPro)

    localStorage.setItem("product", JSON.stringify(dataPro))
    showa();
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

// Save the updated product data
function saveUpdate() {
  if (currentUpdateIndex === -1) return;
  
  // Get the save button and add loading state
  const saveBtn = document.querySelector('.btn-save');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'SAVING...';
  saveBtn.style.opacity = '0.7';
  saveBtn.disabled = true;
  
  // Get updated values
  const updatedProduct = {
    title: document.getElementById('updateTitle').value,
    price: document.getElementById('updatePrice').value,
    taxes: document.getElementById('updateTaxes').value,
    ads: document.getElementById('updateAds').value,
    discount: document.getElementById('updateDiscount').value,
    count: document.getElementById('updateCount').value,
    category: document.getElementById('updateCategory').value,
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




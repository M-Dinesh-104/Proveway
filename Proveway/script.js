let selectedItems = [];
let currentTotal = 0;
function toggleSelection(element) {
    const radio = element.querySelector('.radio-input');
    const itemId = element.dataset.item;
    const itemPrice = parseFloat(element.dataset.price);
    
    if (element.classList.contains('selected')) {
        return;
    }
    
    document.querySelectorAll('.cart-item').forEach(item => {
        item.classList.remove('selected');
        const itemRadio = item.querySelector('.radio-input');
        itemRadio.checked = false;
    });
    selectedItems = [];
    
    radio.checked = true;
    element.classList.add('selected');
    selectedItems.push({
        id: itemId,
        price: itemPrice,
        element: element
    });
    
    updateTotal();
}

function updateTotal() {
    currentTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
    document.querySelector('.total').textContent = `Total: $${currentTotal.toFixed(2)} USD`;
    
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (selectedItems.length > 0) {
        addToCartBtn.classList.add('active');
    } else {
        addToCartBtn.classList.remove('active');
    }
}

function addToCart() {
    if (selectedItems.length === 0) {
        showNotification('Please select at least one item!', 'warning');
        return;
    }
    
    const button = document.querySelector('.add-to-cart-btn');
    const originalText = button.textContent;
    button.textContent = 'Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        showNotification(`${selectedItems.length} item(s) added to cart for $${currentTotal.toFixed(2)}!`, 'success');
        
        console.log('Selected items:', selectedItems);
        console.log('Total:', currentTotal);
    }, 1000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const bgColor = type === 'success' ? ' #ff6b82' : type === 'warning' ? '#ff6b82' : '#ff6b82';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function collapseAllSelections() {
    document.querySelectorAll('.cart-item').forEach(item => {
        item.classList.remove('selected');
        const radio = item.querySelector('.radio-input');
        radio.checked = false;
    });
    selectedItems = [];
    updateTotal();
}

document.addEventListener('click', function(event) {
    const isInsideCartCard = event.target.closest('.cart-card');
    
    if (!isInsideCartCard) {
        collapseAllSelections();
        return;
    }
    
    const clickedCartItem = event.target.closest('.cart-item');
    
    if (!clickedCartItem) {
        collapseAllSelections();
        return;
    }
    
    const currentlySelected = document.querySelector('.cart-item.selected');
    if (currentlySelected && clickedCartItem !== currentlySelected) {
        return;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('BOGO Checkbox Cart initialized');
    updateTotal();
});

window.getSelectedItems = function() {
    return selectedItems;
};

window.getCurrentTotal = function() {
    return currentTotal;
};
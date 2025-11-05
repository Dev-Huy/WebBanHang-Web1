document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    // Xử lý chọn phương thức thanh toán
    const paymentMethods = document.querySelectorAll('.payment-method');
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    }

    // Xử lý nút áp dụng mã giảm giá
    const promoBtn = document.querySelector('.promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener('click', function() {
            const promoInput = document.querySelector('.promo-input');
            if (!promoInput || promoInput.value.trim() === '') {
                alert('Vui lòng nhập mã giảm giá');
                return;
            }
            
            // Kiểm tra mã giảm giá
            const discount = applyPromoCode(promoInput.value.trim());
            if (discount > 0) {
                alert(`Áp dụng thành công! Giảm ${discount}%`);
                updateTotalPrice(discount);
            } else {
                alert('Mã giảm giá không hợp lệ');
            }
        });
    }

    // Xử lý nút hoàn tất đơn hàng
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Kiểm tra phương thức thanh toán đã chọn
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (!selectedPayment) {
                alert('Vui lòng chọn phương thức thanh toán');
                return;
            }

            // Hiển thị hiệu ứng loading
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = 'ĐANG XỬ LÝ...';
            checkoutBtn.disabled = true;
            
            // Giả lập xử lý thanh toán
            setTimeout(function() {
                alert('Đơn hàng của bạn đã được đặt thành công! Cảm ơn bạn đã mua sắm tại BookBuy.');
                checkoutBtn.innerHTML = originalText;
                checkoutBtn.disabled = false;
                
                // Có thể thêm chuyển hướng về trang cảm ơn
                // window.location.href = '/thank-you.html';
            }, 2000);
        });
    }
}

// Hàm kiểm tra mã giảm giá
function applyPromoCode(code) {
    const promoCodes = {
        'SALE10': 10,
        'SALE20': 20,
        'WELCOME': 15,
        'BOOKBUY': 5
    };
    
    return promoCodes[code.toUpperCase()] || 0;
}

// Hàm cập nhật tổng tiền (ví dụ)
function updateTotalPrice(discountPercent) {
    // Lấy tổng tiền hiện tại
    const totalElement = document.querySelector('.summary-total span:last-child');
    if (!totalElement) return;
    
    const currentTotal = parseInt(totalElement.textContent.replace(/[^\d]/g, ''));
    const discountAmount = Math.round(currentTotal * discountPercent / 100);
    const newTotal = currentTotal - discountAmount;
    
    // Cập nhật tổng tiền mới
    totalElement.textContent = newTotal.toLocaleString('vi-VN') + ' ₫';
    
    // Cập nhật dòng giảm giá
    const discountRow = document.querySelector('.summary-row:nth-child(3) span:last-child');
    if (discountRow) {
        discountRow.textContent = `-${discountAmount.toLocaleString('vi-VN')} ₫`;
        discountRow.style.color = '#28a745';
    }
}
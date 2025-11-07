// checkout.js

// Khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckoutPage();
});

function initializeCheckoutPage() {
    // Khởi tạo các sự kiện và chức năng
    initializePaymentMethods();
    initializePromoCode();
    initializeCheckoutButton();
    initializeFormValidation();
    
    console.log('Trang thanh toán BookBuy đã sẵn sàng');
}

// Xử lý chọn phương thức thanh toán
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Bỏ chọn tất cả các phương thức khác
            paymentMethods.forEach(m => {
                m.classList.remove('selected');
                const radio = m.querySelector('input[type="radio"]');
                radio.checked = false;
            });
            
            // Chọn phương thức hiện tại
            this.classList.add('selected');
            const currentRadio = this.querySelector('input[type="radio"]');
            currentRadio.checked = true;
            
            // Hiển thị thông tin bổ sung nếu cần
            showPaymentMethodInfo(this);
        });
    });
}

// Hiển thị thông tin bổ sung cho phương thức thanh toán
function showPaymentMethodInfo(methodElement) {
    const paymentName = methodElement.querySelector('.payment-name').textContent;
    console.log(`Phương thức thanh toán đã chọn: ${paymentName}`);
    
    // Ẩn tất cả các thông tin bổ sung trước
    hideAllPaymentDetails();
    
    // Hiển thị thông tin chi tiết tùy theo phương thức
    if (paymentName.includes('Chuyển khoản ngân hàng')) {
        showBankTransferDetails();
    } else if (paymentName.includes('Ví điện tử MoMo')) {
        showMoMoDetails();
    } else if (paymentName.includes('Thẻ tín dụng')) {
        showCardDetails();
    }
}

// Ẩn tất cả các phần thông tin thanh toán chi tiết
function hideAllPaymentDetails() {
    const existingDetails = document.querySelector('.payment-details');
    if (existingDetails) {
        existingDetails.remove();
    }
}

// Hiển thị thông tin chuyển khoản ngân hàng
function showBankTransferDetails() {
    const paymentBox = document.querySelector('.checkout-box:has(.payment-methods)');
    
    const bankDetails = document.createElement('div');
    bankDetails.className = 'payment-details';
    bankDetails.innerHTML = `
        <div class="bank-info" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2c5aa0;">
            <h4 style="margin-bottom: 10px; color: #2c5aa0;">Thông tin chuyển khoản</h4>
            <div style="font-size: 14px;">
                <p><strong>Ngân hàng:</strong> Techcombank</p>
                <p><strong>Số tài khoản:</strong> 1903 6666 8888</p>
                <p><strong>Chủ tài khoản:</strong> CÔNG TY CP BOOKBUY</p>
                <p><strong>Nội dung chuyển khoản:</strong> Mã đơn hàng của bạn</p>
                <p style="color: #666; font-style: italic;">Vui lòng chuyển khoản trong vòng 24 giờ để đảm bảo đơn hàng được xử lý.</p>
            </div>
        </div>
    `;
    
    paymentBox.appendChild(bankDetails);
}

// Hiển thị thông tin ví MoMo
function showMoMoDetails() {
    const paymentBox = document.querySelector('.checkout-box:has(.payment-methods)');
    
    const momoDetails = document.createElement('div');
    momoDetails.className = 'payment-details';
    momoDetails.innerHTML = `
        <div class="momo-info" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #ae2070;">
            <h4 style="margin-bottom: 10px; color: #ae2070;">Thanh toán bằng MoMo</h4>
            <div style="font-size: 14px;">
                <p>Khi nhấn "HOÀN TẤT ĐƠN HÀNG", ứng dụng MoMo sẽ tự động mở.</p>
                <p>Vui lòng xác nhận thanh toán trong ứng dụng MoMo của bạn.</p>
                <p style="color: #666; font-style: italic;">Hỗ trợ: 1900 123 456 (Miễn phí)</p>
            </div>
        </div>
    `;
    
    paymentBox.appendChild(momoDetails);
}

// Hiển thị thông tin thẻ tín dụng/ghi nợ
function showCardDetails() {
    const paymentBox = document.querySelector('.checkout-box:has(.payment-methods)');
    
    const cardDetails = document.createElement('div');
    cardDetails.className = 'payment-details';
    cardDetails.innerHTML = `
        <div class="card-info" style="margin-top: 20px;">
            <h4 style="margin-bottom: 15px; color: #2c5aa0;">Thông tin thẻ</h4>
            <div class="form-group">
                <label class="form-label">Số thẻ</label>
                <input type="text" class="form-control card-input" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label class="form-label">Ngày hết hạn (MM/YY)</label>
                    <input type="text" class="form-control card-input" placeholder="12/25" maxlength="5">
                </div>
                <div class="form-group">
                    <label class="form-label">CVV</label>
                    <input type="text" class="form-control card-input" placeholder="123" maxlength="3">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Tên chủ thẻ</label>
                <input type="text" class="form-control card-input" placeholder="NGUYEN VAN A">
            </div>
            <div style="display: flex; align-items: center; margin-top: 10px;">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDQ4IDk2YzAgMTcuNy0xNC4zIDMyLTMyIDMySDk2Yy0xNy43IDAtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMyaDMyMGMxNy43IDAgMzIgMTQuMyAzMiAzMnpNNDE2IDQxNmMwIDE3LjctMTQuMyAzMi0zMiAzMkg5NmMtMTcuNyAwLTMyLTE0LjMtMzItMzJzMTQuMy0zMiAzMi0zMmgzMjBjMTcuNyAwIDMyIDE0LjMgMzIgMzJ6TTMyIDI1NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmgzMjBjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjMgMzItMzIgMzJINjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyeiIvPjwvc3ZnPg==" style="width: 40px; height: 25px; background: #1a1f71; padding: 5px; border-radius: 3px; margin-right: 10px;">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDQ4IDk2YzAgMTcuNy0xNC4zIDMyLTMyIDMySDk2Yy0xNy43IDAtMzItMTQuMy0zMi0zMnMxNC4zLTMyIDMyLTMyaDMyMGMxNy43IDAgMzIgMTQuMyAzMiAzMnpNNDE2IDQxNmMwIDE3LjctMTQuMyAzMi0zMiAzMkg5NmMtMTcuNyAwLTMyLTE0LjMtMzItMzJzMTQuMy0zMiAzMi0zMmgzMjBjMTcuNyAwIDMyIDE0LjMgMzIgMzJ6TTMyIDI1NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmgzMjBjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjMgMzItMzIgMzJINjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyeiIvPjwvc3ZnPg==" style="width: 40px; height: 25px; background: #cc0000; padding: 5px; border-radius: 3px; margin-right: 10px;">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDQ4IDk2YzAgMTcuNy0xNC4zIDMyLTMyIDMySDk2Yy0xNy3zMTQuMy0zMiAzMi0zMmgzMjBjMTcuNyAwIDMyIDE0LjMgMzIgMzJ6TTQxNiA0MTZjMCAxNy43LTE0LjMgMzItMzIgMzJINjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzJoMzIwYzE3LjcgMCAzMiAxNC4zIDMyIDMyek0zMiAyNTZjMC0xNy43IDE0LjMtMzIgMzItMzJoMzIwYzE3LjcgMCAzMiAxNC4zIDMyIDMycy0xNC4zIDMyLTMyIDMySDY0Yy0xNy3zLTMyLTE0LjMtMzItMzJ6Ii8+PC9zdmc+" style="width: 40px; height: 25px; background: #f7981d; padding: 5px; border-radius: 3px;">
            </div>
        </div>
    `;
    
    paymentBox.appendChild(cardDetails);
    
    // Thêm sự kiện format cho input thẻ
    const cardInputs = document.querySelectorAll('.card-input');
    cardInputs.forEach(input => {
        if (input.placeholder.includes('Số thẻ')) {
            input.addEventListener('input', formatCardNumber);
        } else if (input.placeholder.includes('MM/YY')) {
            input.addEventListener('input', formatExpiryDate);
        } else if (input.placeholder.includes('CVV')) {
            input.addEventListener('input', formatCVV);
        }
    });
}

// Định dạng số thẻ (thêm khoảng trắng sau mỗi 4 số)
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
}

// Định dạng ngày hết hạn (MM/YY)
function formatExpiryDate(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value.length >= 2) {
        e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        e.target.value = value;
    }
}

// Định dạng CVV (chỉ cho phép 3 số)
function formatCVV(e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
}

// Xử lý mã giảm giá
function initializePromoCode() {
    const promoBtn = document.querySelector('.promo-btn');
    const promoInput = document.querySelector('.promo-input');
    
    promoBtn.addEventListener('click', applyPromoCode);
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });
}

function applyPromoCode() {
    const promoInput = document.querySelector('.promo-input');
    const promoCode = promoInput.value.trim();
    
    if (!promoCode) {
        showMessage('Vui lòng nhập mã giảm giá', 'error');
        return;
    }
    
    // Hiệu ứng loading
    const promoBtn = document.querySelector('.promo-btn');
    const originalText = promoBtn.textContent;
    promoBtn.textContent = 'Đang xử lý...';
    promoBtn.disabled = true;
    
    // Giả lập kiểm tra mã giảm giá (trong thực tế sẽ gọi API)
    setTimeout(() => {
        const validPromoCodes = {
            'SALE10': 10,
            'SALE20': 20,
            'BOOKLOVER': 15,
            'WELCOME': 5
        };
        
        if (validPromoCodes[promoCode.toUpperCase()]) {
            const discount = validPromoCodes[promoCode.toUpperCase()];
            updateOrderSummary(discount, promoCode.toUpperCase());
            showMessage(`Áp dụng thành công mã ${promoCode.toUpperCase()}! Giảm ${discount}%`, 'success');
            promoInput.value = '';
        } else {
            showMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn', 'error');
        }
        
        promoBtn.textContent = originalText;
        promoBtn.disabled = false;
    }, 1500);
}

// Cập nhật tổng đơn hàng khi áp dụng mã giảm giá
function updateOrderSummary(discountPercent, promoCode) {
    const summaryRows = document.querySelectorAll('.summary-row');
    const tempTotal = 284000; // Tạm tính
    const shippingFee = 15000; // Phí vận chuyển
    
    // Tính toán giảm giá
    const discountAmount = Math.round(tempTotal * discountPercent / 100);
    const finalTotal = tempTotal + shippingFee - discountAmount;
    
    // Cập nhật dòng giảm giá
    if (document.querySelector('.discount-row')) {
        document.querySelector('.discount-row').remove();
    }
    
    const discountRow = document.createElement('div');
    discountRow.className = 'summary-row discount-row';
    discountRow.innerHTML = `
        <span>Giảm giá (${promoCode}):</span>
        <span style="color: #28a745;">-${formatCurrency(discountAmount)}</span>
    `;
    
    // Chèn trước dòng tổng cộng
    summaryRows[summaryRows.length - 1].parentNode.insertBefore(discountRow, summaryRows[summaryRows.length - 1]);
    
    // Cập nhật tổng cộng
    document.querySelector('.summary-total span:last-child').textContent = formatCurrency(finalTotal);
    
    // Lưu thông tin giảm giá để sử dụng sau
    window.currentDiscount = {
        code: promoCode,
        percent: discountPercent,
        amount: discountAmount
    };
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Xử lý nút hoàn tất đơn hàng
function initializeCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    checkoutBtn.addEventListener('click', processCheckout);
}

function processCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Kiểm tra phương thức thanh toán
    const selectedPayment = document.querySelector('.payment-method.selected');
    if (!selectedPayment) {
        showMessage('Vui lòng chọn phương thức thanh toán', 'error');
        return;
    }
    
    // Hiệu ứng loading
    checkoutBtn.textContent = 'ĐANG XỬ LÝ...';
    checkoutBtn.disabled = true;
    
    // Giả lập xử lý thanh toán
    setTimeout(() => {
        showSuccessModal();
        checkoutBtn.textContent = 'HOÀN TẤT ĐƠN HÀNG';
        checkoutBtn.disabled = false;
    }, 2000);
}

// Hiển thị modal thành công
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%;">
            <div style="font-size: 48px; color: #28a745; margin-bottom: 15px;">✓</div>
            <h2 style="color: #28a745; margin-bottom: 15px;">Đặt Hàng Thành Công!</h2>
            <p style="margin-bottom: 20px; line-height: 1.5;">Cảm ơn bạn đã mua hàng tại BookBuy. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
            <p style="margin-bottom: 20px; font-weight: bold;">Mã đơn hàng: #BB${Date.now().toString().slice(-6)}</p>
            <button id="continueShopping" style="background: #2c5aa0; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                Tiếp Tục Mua Sắm
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Sự kiện đóng modal
    document.getElementById('continueShopping').addEventListener('click', function() {
        window.location.href = 'index.html'; // Chuyển về trang chủ
    });
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Hiển thị thông báo
function showMessage(message, type) {
    // Xóa thông báo cũ nếu có
    const oldMessage = document.querySelector('.message-toast');
    if (oldMessage) {
        oldMessage.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `message-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        toast.style.background = '#28a745';
    } else if (type === 'error') {
        toast.style.background = '#dc3545';
    } else {
        toast.style.background = '#17a2b8';
    }
    
    document.body.appendChild(toast);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

// Khởi tạo validation cho form
function initializeFormValidation() {
    const noteTextarea = document.querySelector('textarea');
    
    noteTextarea.addEventListener('input', function() {
        if (this.value.length > 200) {
            this.value = this.value.substring(0, 200);
            showMessage('Ghi chú không được vượt quá 200 ký tự', 'error');
        }
    });
}

// Thêm CSS animation cho thông báo
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .card-input:focus {
        border-color: #2c5aa0;
        box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.2);
    }
`;
document.head.appendChild(style);
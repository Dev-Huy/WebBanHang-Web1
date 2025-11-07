// checkout.js - Xử lý tương tác trên trang thanh toán BookBuy
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý chọn phương thức thanh toán
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Bỏ chọn tất cả phương thức thanh toán
            paymentMethods.forEach(m => {
                m.classList.remove('selected');
                m.querySelector('input').checked = false;
            });
            
            // Chọn phương thức thanh toán được click
            this.classList.add('selected');
            this.querySelector('input').checked = true;
        });
    });

    // Xử lý nút áp dụng mã giảm giá
    const promoBtn = document.querySelector('.promo-btn');
    promoBtn.addEventListener('click', function() {
        const promoInput = document.querySelector('.promo-input');
        const promoCode = promoInput.value.trim();
        
        if (promoCode) {
            // Hiển thị thông báo
            showNotification(`Đã áp dụng mã giảm giá: ${promoCode}`, 'success');
            
            // Ở đây có thể thêm logic xử lý mã giảm giá thực tế
            // Ví dụ: gọi API để kiểm tra mã giảm giá
            applyPromoCode(promoCode);
        } else {
            showNotification('Vui lòng nhập mã giảm giá', 'error');
        }
    });

    // Xử lý nhấn Enter trong ô mã giảm giá
    const promoInput = document.querySelector('.promo-input');
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            promoBtn.click();
        }
    });

    // Xử lý nút hoàn tất đơn hàng
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        const selectedPayment = document.querySelector('.payment-method.selected');
        
        if (selectedPayment) {
            const paymentName = selectedPayment.querySelector('.payment-name').textContent;
            
            // Hiển thị xác nhận đơn hàng
            showOrderConfirmation(paymentName);
        } else {
            showNotification('Vui lòng chọn phương thức thanh toán', 'error');
        }
    });

    // Hàm áp dụng mã giảm giá
    function applyPromoCode(code) {
        // Giả lập việc kiểm tra mã giảm giá
        const validCodes = {
            'SALE10': 10,
            'SALE20': 20,
            'BOOKBUY': 15
        };
        
        if (validCodes[code]) {
            const discount = validCodes[code];
            const currentTotal = 279000; // Tổng tiền hiện tại
            const newTotal = currentTotal - (currentTotal * discount / 100);
            
            // Cập nhật giao diện với giảm giá mới
            updateOrderSummary(discount, newTotal);
            showNotification(`Áp dụng thành công mã giảm giá! Giảm ${discount}%`, 'success');
        } else {
            showNotification('Mã giảm giá không hợp lệ hoặc đã hết hạn', 'error');
        }
    }

    // Hàm cập nhật tổng đơn hàng sau khi áp dụng mã giảm giá
    function updateOrderSummary(discount, newTotal) {
        // Tìm phần tử giảm giá
        const discountElement = document.querySelector('.summary-row:nth-child(3) span:last-child');
        const totalElement = document.querySelector('.summary-total span:last-child');
        
        // Cập nhật giá trị giảm giá
        discountElement.textContent = `-${discount}%`;
        discountElement.style.color = '#28a745';
        
        // Cập nhật tổng tiền mới
        totalElement.textContent = `${formatCurrency(newTotal)} ₫`;
    }

    // Hàm hiển thị thông báo
    function showNotification(message, type) {
        // Tạo phần tử thông báo
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Thêm CSS cho thông báo
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        // Màu sắc theo loại thông báo
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        } else {
            notification.style.backgroundColor = '#2c5aa0';
        }
        
        // Thêm vào body
        document.body.appendChild(notification);
        
        // Tự động xóa sau 3 giây
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Hàm hiển thị xác nhận đơn hàng
    function showOrderConfirmation(paymentMethod) {
        // Tạo overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        // Tạo hộp xác nhận
        const confirmationBox = document.createElement('div');
        confirmationBox.style.cssText = `
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        
        // Nội dung xác nhận
        confirmationBox.innerHTML = `
            <h2 style="color: #2c5aa0; margin-bottom: 15px;">Xác Nhận Đơn Hàng</h2>
            <p style="margin-bottom: 20px;">Bạn có chắc chắn muốn hoàn tất đơn hàng với phương thức thanh toán <strong>${paymentMethod}</strong>?</p>
            <p style="margin-bottom: 25px; font-size: 14px; color: #666;">Sau khi xác nhận, đơn hàng sẽ được xử lý và giao đến địa chỉ của bạn.</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="confirmOrder" style="padding: 10px 20px; background-color: #2c5aa0; color: white; border: none; border-radius: 4px; cursor: pointer;">Xác Nhận</button>
                <button id="cancelOrder" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Hủy</button>
            </div>
        `;
        
        // Thêm vào DOM
        overlay.appendChild(confirmationBox);
        document.body.appendChild(overlay);
        
        // Xử lý nút xác nhận
        document.getElementById('confirmOrder').addEventListener('click', function() {
            // Ở đây có thể thêm logic gửi đơn hàng đến server
            processOrder();
            
            // Đóng hộp xác nhận
            document.body.removeChild(overlay);
            
            // Chuyển đến trang hoàn tất (giả lập)
            setTimeout(() => {
                showOrderSuccess();
            }, 500);
        });
        
        // Xử lý nút hủy
        document.getElementById('cancelOrder').addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        // Đóng khi click ra ngoài
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // Hàm xử lý đơn hàng (giả lập)
    function processOrder() {
        // Ở đây sẽ là logic gửi đơn hàng đến server
        // Ví dụ: gọi API để tạo đơn hàng
        console.log('Đang xử lý đơn hàng...');
        
        // Giả lập thời gian xử lý
        showNotification('Đang xử lý đơn hàng...', 'info');
    }

    // Hàm hiển thị trang thành công (giả lập)
    function showOrderSuccess() {
        // Tạo overlay thành công
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        `;
        
        // Tạo hộp thông báo thành công
        const successBox = document.createElement('div');
        successBox.style.cssText = `
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        // Nội dung thông báo thành công
        successBox.innerHTML = `
            <div style="font-size: 48px; color: #28a745; margin-bottom: 20px;">✓</div>
            <h2 style="color: #28a745; margin-bottom: 15px;">Đặt Hàng Thành Công!</h2>
            <p style="margin-bottom: 20px;">Cảm ơn bạn đã đặt hàng tại BookBuy. Đơn hàng của bạn đã được xác nhận và sẽ được giao trong thời gian sớm nhất.</p>
            <p style="margin-bottom: 25px; font-size: 14px; color: #666;">Mã đơn hàng: <strong>#BB${Math.floor(100000 + Math.random() * 900000)}</strong></p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="backToHome" style="padding: 10px 20px; background-color: #2c5aa0; color: white; border: none; border-radius: 4px; cursor: pointer;">Về Trang Chủ</button>
                <button id="viewOrder" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Xem Đơn Hàng</button>
            </div>
        `;
        
        // Thêm vào DOM
        successOverlay.appendChild(successBox);
        document.body.appendChild(successOverlay);
        
        // Xử lý nút về trang chủ
        document.getElementById('backToHome').addEventListener('click', function() {
            // Chuyển hướng về trang chủ (giả lập)
            window.location.href = 'index.html';
        });
        
        // Xử lý nút xem đơn hàng
        document.getElementById('viewOrder').addEventListener('click', function() {
            // Chuyển hướng đến trang chi tiết đơn hàng (giả lập)
            window.location.href = 'order-details.html';
        });
    }

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Thêm CSS cho các phần tử động
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            animation: slideIn 0.3s ease;
        }
        
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
    `;
    document.head.appendChild(style);
});
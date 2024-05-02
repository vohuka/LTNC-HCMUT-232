// Giả sử bạn có 2 nút là 'Trang chủ' và 'Thông tin'
document.querySelector('.format_button:nth-child(1)').addEventListener('click', function() {
    // Ẩn tất cả các trang
    document.querySelectorAll('.main_bar').forEach(page => {
        page.style.opacity = '0';
        page.style.display = 'none';
        page.classList.remove('active'); // Bỏ class 'active' nếu có
    });
    // Hiển thị trang chủ
    const generalPage = document.querySelector('.main_bar.general');
    generalPage.classList.add('active'); // Thêm class 'active'
    generalPage.style.display = 'grid'; // Sử dụng 'grid' thay vì 'block' vì CSS của bạn đã định nghĩa như vậy
    setTimeout(() => generalPage.style.opacity = '1', 10); // Thêm một delay nhỏ để transition có thể hoạt động
});

document.querySelector('.format_button:nth-child(2)').addEventListener('click', function() {
    // Ẩn tất cả các trang
    document.querySelectorAll('.main_bar').forEach(page => {
        page.style.opacity = '0';
        page.style.display = 'none';
        page.classList.remove('active'); // Bỏ class 'active' nếu có
    });
    // Hiển thị trang thông tin
    const infoPage = document.querySelector('.main_bar.info');
    infoPage.classList.add('active'); // Thêm class 'active'
    infoPage.style.display = 'block'; // Sử dụng 'grid' thay vì 'block'
    setTimeout(() => infoPage.style.opacity = '1', 10); // Thêm một delay nhỏ để transition có thể hoạt động
});

document.querySelector('.format_button:nth-child(4)').addEventListener('click', function(event) {
    event.preventDefault(); 
    window.open('Student_subject.html', '_blank');
    window.open('Register_subject.html', '_blank');
});


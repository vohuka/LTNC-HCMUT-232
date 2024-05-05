const wrapper2 = document.querySelector('.wrapper2');
const role = document.querySelector('.role');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const Login_popup =document.querySelector('.btnLogin-popup');
const icon_close = document.querySelector('.icon-close');
registerLink.addEventListener('click', ()=>{
    wrapper2.classList.add('active');
});
loginLink.addEventListener('click', ()=>{
    wrapper2.classList.remove('active');
});
//active này mục địch làm cho login và register di chuyển qua lại
Login_popup.addEventListener('click', ()=>{
    role.classList.add('active');
    wrapper2.classList.remove('active-popup');
});
icon_close.addEventListener('click', ()=>{
    wrapper2.classList.remove('active-popup');
});
// nút tắt với mở phần login
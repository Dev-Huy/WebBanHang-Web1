// Access slider images inside .slides
let slideImages = document.querySelectorAll('.slides img'); 
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');
let dots = document.querySelectorAll('.dot');

let counter = 0;
let autoInterval;

// Hàm hiển thị slide đúng
function showSlide(newIndex, direction){
    if(newIndex === counter) return;

    // Xác định animation
    let outAnim = direction === 'next' ? 'next1 0.5s ease-in forwards' : 'prev1 0.5s ease-in forwards';
    let inAnim = direction === 'next' ? 'next2 0.5s ease-in forwards' : 'prev2 0.5s ease-in forwards';

    slideImages[counter].style.animation = outAnim;
    slideImages[newIndex].style.animation = inAnim;

    counter = newIndex;
    updateIndicators();
}

// Nút next
next.addEventListener('click', () => {
    let newIndex = (counter + 1) % slideImages.length;
    showSlide(newIndex, 'next');
});

// Nút prev
prev.addEventListener('click', () => {
    let newIndex = (counter - 1 + slideImages.length) % slideImages.length;
    showSlide(newIndex, 'prev');
});

// Auto slide
function startAutoSlide(){
    autoInterval = setInterval(() => {
        let newIndex = (counter + 1) % slideImages.length;
        showSlide(newIndex, 'next');
    }, 3000);
}
startAutoSlide();

// Stop auto slide khi hover
const container = document.querySelector('.slidecontainer');
container.addEventListener('mouseover', () => clearInterval(autoInterval));
container.addEventListener('mouseout', startAutoSlide);

// Dots update
function updateIndicators(){
    dots.forEach(dot => dot.classList.remove('active'));
    dots[counter].classList.add('active');
}

// Click vào dot
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        let direction = index > counter ? 'next' : 'prev';
        showSlide(index, direction);
    });
});

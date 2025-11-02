
function createImageViewer() {

    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImage">
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.className === 'close') {
            modal.style.display = 'none';
        }
    });


    function addImageClickHandlers() {
        const images = document.querySelectorAll('table img');
        images.forEach(img => {
            if (!img.dataset.hasViewer) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', function () {
                    const modal = document.getElementById('imageModal');
                    const modalImg = document.getElementById('modalImage');
                    modal.style.display = 'flex';
                    modalImg.src = this.src;
                });
                img.dataset.hasViewer = 'true';
            }
        });
    }


    const observer = new MutationObserver(addImageClickHandlers);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addImageClickHandlers();
}

document.addEventListener('DOMContentLoaded', createImageViewer);
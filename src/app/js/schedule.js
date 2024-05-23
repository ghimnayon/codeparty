export function toggleSchedule(dayId) {
    const schedule = document.getElementById(dayId);
    schedule.classList.toggle('hidden');
}

export function openImage(imageId) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = `path/to/${imageId}.jpg`; // Replace with actual image paths
    imageModal.classList.remove('hidden');
}

export function closeImage() {
    const imageModal = document.getElementById('imageModal');
    imageModal.classList.add('hidden');
}
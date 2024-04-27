// Get the modal
var modal = document.getElementById("imageModal");

// Get the image and insert it inside the modal
var modalImg = document.getElementById("modalImg");

// Get all images with the class "card-img-top"
var images = document.querySelectorAll(".card-img-top");

// Get the close button for the modal
var closeButton = document.querySelector(".close");

// Loop through each image and add a click event listener
images.forEach(function(image) {
  image.addEventListener("click", function() {
    modal.style.display = "block";
    modalImg.src = this.src;
  });
});

// Close the modal when the close button is clicked
closeButton.addEventListener("click", function() {
  modal.style.display = "none";
});

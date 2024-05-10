console.log("JavaScript file loaded");
console.log("you sure?");

document.addEventListener("DOMContentLoaded", function() {
  // Get the modal
  var modal = document.getElementById("imageModal");

  // Get the image and insert it inside the modal
  var modalImg = document.getElementById("modalImg");

  // Get all images with the class "card-img-top"
  var images = document.querySelectorAll(".card-img");

  // Loop through each image and add a click event listener
  images.forEach(function(image) {
    console.log("Event listener added to image:", image);
    image.addEventListener("click", function() {
      console.log("Image clicked:", this);
      console.log("start")
      // Set the clicked image source as modal content
      modalImg.src = this.src.replace(/\/c_scale,w_500\/f_auto\/q_auto/, "");

      // Determine aspect ratio
      var aspectRatio = this.naturalWidth / this.naturalHeight;

      // Set modal dimensions based on aspect ratio
      if (aspectRatio > 1) {
        // Landscape photo
        modalImg.style.width = "auto";
        modalImg.style.height = "80vh"; // Adjust as needed
      } else {
        // Portrait photo
        modalImg.style.width = "30vw"; // Adjust as needed
        modalImg.style.height = "auto";
      }

      // Display the modal
      modal.style.display = "block";
    });
  });


  // Get the close button for the modal after modal is displayed
  var closeButton = document.querySelector(".close");

  // Close the modal when the close button is clicked
  closeButton.addEventListener("click", function() {
    modal.style.display = "none";
  });

});
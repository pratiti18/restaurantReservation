  document.addEventListener("DOMContentLoaded", function() {
      const ratings = document.querySelectorAll(".rating");
    
      ratings.forEach(function(rating) {
        rating.addEventListener("click", function() {
          // Remove active class from all ratings
          ratings.forEach(function(rating) {
            rating.classList.remove("active");
          });
    
          // Add active class to the clicked rating
          rating.classList.add("active");
        });
      });
    });


    function goBack(e){
      e.preventDefault();
      const homeUrl="../home/index.html";
      document.getElementById("loader").style.display = "block";
      if(sessionStorage.getItem("bookingResponse"))
      {
          sessionStorage.removeItem('bookingResponse');
      }

          setTimeout(() => {
              window.location.replace(homeUrl);
          }, 1000);
  }
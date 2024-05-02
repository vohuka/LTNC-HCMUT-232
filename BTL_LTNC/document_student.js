document.querySelector('.header-document .left button').addEventListener('click', function() {
  var content = document.querySelector('.table-document');
  if (content.style.maxHeight !== "0px"){
    content.style.maxHeight = "0px";
  } else {
    content.style.maxHeight = "100vh"; // or any large value
  } 
});

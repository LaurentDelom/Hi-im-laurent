
//////////////// RESIZE MANAGER for VH on mobile ////////////

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.visualViewport.height * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

/*
const chatForm = document.querySelector('input[type="text"]'); 

chatForm.addEventListener("focus",(event) => {
    document.querySelector(".chatbox-user").style.top="40vh";
    document.getElementById("conversation-thread").style.height = "38vh";
    updateScroll();
});

chatForm.addEventListener("blur",(event) => {
    document.querySelector(".chatbox-user").style.top="90vh";
    document.getElementById("conversation-thread").style.height = "88vh";
    updateScroll();
});
*/

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
        vh = window.visualViewport.height * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }
/*
window.addEventListener('resize', () => {
    // We execute the same script as before
    
  });
  */


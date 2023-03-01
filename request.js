//import { displayTopicTree } from "./topictree.js";


import {Gradient} from "./color-gradient.js";
import {topics} from "./topics-sheet.js";
import {errorResponses} from "./topics-sheet.js";
// Récupérer les données de topics
/*
(async () => {
        const result = await fetch('/api')
    })()
program):1 SyntaxError: Unexpected identifier 'fetch'. Expected ';' after variable declaration.promiseReactionJob @ (program):1
*/



//Extraire la liste des keys
const listKeys = topics.map(topic => topic.key);

// Récupérer les données de messages d'erreurs



let validTopicRequests =0; // Suivre le compte de topics valides demandés
let visitedTopics=[]; //Suivre la liste des topics visités
let arrayMessageUser =[]; //Historique de toutes les requêtes envoyées par l'utilisateur
let numberInvalidRequests = 0; // Suivre le compte des requêtes invalides

//console.log(listKeys);
let orientationPortrait = false;

//Contrôler une fois au lancement quelle est l'orientation de la page
if(screen.availHeight > screen.availWidth){
    orientationPortrait = true;
}

if (iOS()){
    orientationPortrait = true;
}

function iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

// Préparer le tableau en fonction de mobile ou PC >> masquer tree-holder & image-holder

if(orientationPortrait){
   document.querySelector(".tree-holder").classList.replace('tree-holder','tree-holder-mobile');
   document.querySelector(".image-holder").classList.replace('image-holder','image-holder-mobile');
   document.querySelector(".conversation-holder").classList.add('conversation-holder-mobile');
   document.querySelector("[name=writebox-user]").style.width = "65%";
   document.querySelector("[name=writebox-whatsapp]").style.width = "65%";

}

//Constantes du temps 

const reactionTime=200; // Temps de réaction avant de commencer à écrire
let dateNextScroll = Date.now(); // Initialisation du calcul pour effectuer un scroll après affichage d'image
let nextScrollToDo = true; // idem

//Création des constantes de couleurs
const colorGradient1 = "#21b433"; //"#21b433"
const colorGradient2 = "#20bdb8"; //"#00a293"


///////////////////// GESTION DES COULEURS ///////////////

// Les couleurs sont gérées depuis javascript. On crée un array de gradient qui irriguera les couleurs des éléments de l'arborescence plutôt que standard black.

// Création d'un gradient de couleur
const gradientArray = new Gradient()
  .setColorGradient(colorGradient1, colorGradient2)
  .setMidpoint(topics.length)
  .getColors();




/*setColorGradient()		Initializes {Gradient} with two or more hex color values. Should always be defined.
setMidpoint(n)		Defines number of midpoints. Defaults to 10.
getColors()		Returns an array of hex color values .
getColor(n)		Returns single hex color value corresponding to the provided index.
*/









//Fonction qui crée la bulle de chat avec le contenu envoyé par l'user
function chatBulleUser  (message, color){
    // Récupérer la date, heure et minute
    const date = new Date();
    const hours = (date.getHours()<10?'0':'') + date.getHours();
    const minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();


    //créer un pragraphe et le remplir du contenu en attribut
    
    const textBulleUser = document.createElement("div");
    textBulleUser.classList.add("message-user");
    textBulleUser.innerText = message;

    const hoursBulle = document.createElement("div");
    hoursBulle.classList.add("hours-bulle");
    hoursBulle.innerText = + hours + ":" + minutes;   
        
    // Créer la bulle qui englobe le message et l'heure
    const bulleUser = document.createElement("div");
    bulleUser.classList.add("bulle-user");
    bulleUser.style.backgroundColor = color;

    const chatEntry = document.createElement("div");
    chatEntry.classList.add("chat-entry-user");
    bulleUser.appendChild(textBulleUser);    
    bulleUser.appendChild(hoursBulle);    
    chatEntry.appendChild(bulleUser);

    //rentrer la bulle dans le dom
    document.getElementById('conversation-thread').appendChild(chatEntry);
}


// Fonction qui crée la bulle de chat avec la réponse du serveur
function chatBulleServer (message,color,waitingTime){
    // Récupérer la date, heure et minute
    const date = new Date();
    const hours = (date.getHours()<10?'0':'') + date.getHours();
    const minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();

    
    


    //créer un pragraphe et le remplir du contenu en attribut
    
    const hoursBulle = document.createElement("div");
    hoursBulle.classList.add("hours-bulle");
    hoursBulle.innerText = + hours + ":" + minutes; 


    const textBulleUser = document.createElement("div");
    textBulleUser.classList.add("message-user-green");
    textBulleUser.innerText = "is typing...  ";
    setTimeout( () => {
        textBulleUser.innerText = message;
        textBulleUser.classList.remove("message-user-green");
        //bullServer.appendChild(hoursBulle);    TOGGLE THIS LINE with line 147 if I don't want the time to appear when "is typing"
    
    },waitingTime
    );
     
        
    // Créer la bulle qui englobe le message et l'heure
    const bullServer = document.createElement("div");
    bullServer.classList.add("bulle-user");
    bullServer.style.backgroundColor = color;

    const chatEntry = document.createElement("div");
    chatEntry.classList.add("chat-entry-server");
    bullServer.appendChild(textBulleUser);    
    bullServer.appendChild(hoursBulle);    
    chatEntry.appendChild(bullServer);

    //rentrer la bulle dans le dom
    document.getElementById('conversation-thread').appendChild(chatEntry);
}


function infoBulle (message) {
    const infoBox = document.createElement("div");
    infoBox.classList.add("info-box");
    const infoMessage = document.createElement("p");
    infoMessage.classList.add("info-bulle");
    infoMessage.innerHTML = message;

    
    infoBox.appendChild(infoMessage);
    document.getElementById('conversation-thread').appendChild(infoBox);
}



// EventListener du SUBMIT:
//Récupère le contenu .value de l'input text 
//Créer la bulle de chat
//Lancer l'anlayse de la chaine de caractère

const chatBox = document.querySelector(".chatbox-user");
let colorBulle = gradientArray[0];

infoBulle("Today");
chatBulleServer("Hi! I'm Laurent!",colorBulle,0);
chatBulleServer(":-)", colorBulle,0);

chatBox.addEventListener("submit", function(event){
    event.preventDefault();
    
    let chatContent = event.target.querySelector("[name=writebox-user]").value;



    //console.log(chatContent);
    if (!(chatContent == '')){
    document.querySelector("[name=writebox-user]").value="";
    document.getElementById('image-display').innerHTML='';
    document.getElementById("image-holder-hider").classList.remove("image-holder-hider-enlarged");
    document.getElementById("image-holder-hider").classList.add("image-holder-hider-normal");
    
    //Appel de la fonction former une bulle de chat avec chatContent
    chatBulleUser(chatContent,colorBulle);
    updateScroll();

    // Update de l'arrayMessageUser
    arrayMessageUser.push(chatContent);
    
    
    
    //Appel de l'analyse du message et renvoi des topics demandés
    let wordArrayUser = messageIntoArray(chatContent);
    let selectedTopics = keyComparison(listKeys,wordArrayUser);
    let waitForImages = reactionTime*0.8;
    let waitForArborescence = 0;
    //console.log(selectedTopics);
    //Appelle la fonction qui retrouve la couleur du message
    
    if (arrayMessageUser.length == 1){
        setTimeout( () => {
            displayContent("intro",colorBulle);
            updateScroll();
        },reactionTime*1.5
        );

    }


    else if(selectedTopics.length>0){

        colorBulle = gradientArray[topicIndex(selectedTopics[0])];
        const objectTopic = topics.filter(a => a.key==selectedTopics[0]);

        const waitingWriteArray = objectTopic[0].waiting;

        
        
            for(let i=0;i<waitingWriteArray.length;i++){
                waitForImages += waitingWriteArray[i] + reactionTime*0.5;
            }
            

        //Appel fonction display contenu du topic[0]
        

        setTimeout( () => {
            displayContent(selectedTopics[0],colorBulle);
            updateScroll();
        },reactionTime
        );
        
        setTimeout( () => {
            displayImages(selectedTopics[0],colorBulle);
            updateScroll();
        },waitForImages
        );

        setTimeout( () => {
            checkWhatsApp ();
            updateScroll();
        },waitForImages + 2000
        );
        
        // Incrémentation des valeurs externes
        
        validTopicRequests+=1; //Incrémenter le compte de topics valides
        visitedTopics.push(selectedTopics[0]); //ajouter le topic à la liste des topics visités
        waitForArborescence = waitForImages; // Attribuer le même délai à l'arrivée de l'arborescence
        dateNextScroll = Date.now() + waitForImages + 1200;
        nextScrollToDo = true;
       
       updateScroll();
        

    } else {
        waitForArborescence=0; // En cas de requête non valide > disparition immédiate de l'arborescence
        // Appel fonction je n'ai pas compris votre requête
        setTimeout( () => {
            displayError(numberInvalidRequests,colorBulle);
            updateScroll();
            dateNextScroll = Date.now() + reactionTime + 1800;
            nextScrollToDo = true;
        },reactionTime
        );
        


    }   

    //Mise à jour de l'arborescence
    if (!orientationPortrait){

        setTimeout( () => {
            displayTopicTree(selectedTopics[0]);
        },waitForArborescence
        );

        
    }


    }

    console.log(`Valid Topic Requests : ${validTopicRequests}`);
    
    
     
    
    

    //Activation de l'accès au chat Whatsapp à partir de 5 requêtes valides
    //if(validTopicRequests>4){
        //Fonction pour dévérouiller l'accès au chat Whatsapp
    //}
    updateScroll();
    

})




// Fonction qui sépare les mots contenus dans l'input text
function messageIntoArray (message){
    message=message.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '').toLowerCase();
    let wordArray = message.split(" ");
   // console.log(wordArray);
    return wordArray;
}

// Fonction qui compare chacun des mots à la listKeys et renvoie le ou les mots contenu dans la liste
function keyComparison (keyList,wordArray){
    let foundKeyList = [];

    // Renvoie une foundKeyList classée par ordre d'apparition dans le message de l'utilisateur
    for (let i=0; i<wordArray.length; i++){
        let testWord = wordArray[i];
        for (let j=0; j<keyList.length; j++){
            if (keyList[j]==testWord){
                foundKeyList.push(testWord);
            }
        }
    
    }
    
    
    return foundKeyList;
}

// Fonction qui renvoie l'index i correspondant au topic dans l'array topics[i] 
function topicIndex (topic){
    let indexSelected;
    for (let i=0; i< topics.length; i++){
        if(topic == topics[i].key){
            indexSelected = i;
        break
        }
    }
    return indexSelected;
}





// Fonction qui prend en argument une topic-key et renvoie les textes associés 
function displayContent(topicKey,color){
    const desiredTopic = topics.filter(a => a.key==topicKey);
    const textsArray = desiredTopic[0].texts;
    const waitingTimeArray = desiredTopic[0].waiting;
    let waitingTime = waitingTimeArray[0];
    
    chatBulleServer(textsArray[0],color,waitingTime);

    waitingTime = waitingTime + reactionTime*0.5;
    
    for(let i=1;i<textsArray.length;i++){
        
        
        setTimeout(() => {
            chatBulleServer(textsArray[i],color,waitingTimeArray[i]);
            updateScroll();
        },waitingTime);

        waitingTime = waitingTime + waitingTimeArray[i] + reactionTime*0.5;
        
    }
    
}

// Fonction qui prend en argument le compte d'erreurs et renvoie le text adapté

function displayError(errorNumber,color){
    const desiredTopic = errorResponses[errorNumber];
    const textsArray = desiredTopic.texts;
    const waitingTimeArray = desiredTopic.waiting;
    let waitingTime = 0;
    chatBulleServer(textsArray[0],color,waitingTimeArray[0]);
    updateScroll();

    numberInvalidRequests = (numberInvalidRequests + 1) % errorResponses.length;
    
    for(let i=1;i<textsArray.length;i++){
        waitingTime = waitingTime + waitingTimeArray[i];
        
        setTimeout(() => {
            chatBulleServer(textsArray[i],color,waitingTimeArray[i]);
            updateScroll();
        },waitingTime);
        
    }
    updateScroll();
}



// Fonction qui prend en argument une topic-key et renvoie les images associées dans le image-display

function displayImages(topicKey,color){
    const desiredTopic = topics.filter(a => a.key==topicKey);
     const imagesArray = desiredTopic[0].images;
    //console.log(imagesArray);


   



    for(let i=0; i<imagesArray.length;i++){
        let imageBox = document.createElement("img");
        imageBox.src=imagesArray[i];

        let imageBulle = document.createElement("div");
        imageBulle.classList.add("image-bulle");
        imageBulle.style.backgroundColor = color;

         // Récupérer la date, heure et minute
    const date = new Date();
    const hours = (date.getHours()<10?'0':'') + date.getHours();
    const minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();   
    const hoursBulle = document.createElement("div");
    hoursBulle.classList.add("hours-bulle");
    hoursBulle.innerText = + hours + ":" + minutes; 

        imageBulle.appendChild(imageBox);
        imageBulle.appendChild(hoursBulle);

        //Selon l'orientation, les images apparaissent soit dans le conversation-thread, soit dans le image-display
        if(orientationPortrait){
           
        document.getElementById('conversation-thread').appendChild(imageBulle);

        
        // Ajout d'un event listener qui agrandit les images sur click, et masque le reste; et retour à état normal en sur click
        imageBox.addEventListener("click", function () {
            imageBox.classList.add("enlarged-image");
            document.getElementById("chatbox-form").classList.add("chatbox-user-enlarged");
            document.getElementById("conversation-hider").classList.remove("conversation-hider-normal");
            document.getElementById("conversation-hider").classList.add("conversation-hider-enlarged");

            document.getElementById("image-closer-conversation").addEventListener("click", function(){
                let allEnlargedImage = document.querySelectorAll(".enlarged-image");
                
                 for (let i=0; i<allEnlargedImage.length;i++){allEnlargedImage[i].classList.remove("enlarged-image");}
 
                 document.getElementById("conversation-hider").classList.remove("conversation-hider-enlarged");
                 document.getElementById("conversation-hider").classList.add("conversation-hider-normal");
                 document.getElementById("chatbox-form").classList.remove("chatbox-user-enlarged");
                 updateScroll();
 
             });




            updateScroll();
            });

            
        } else {
        document.getElementById('image-display').appendChild(imageBulle);


        //Ajout d'un event listener qui agrandit les images sur click et masque le reste du div; et retour à l'état normal sur click
        imageBox.addEventListener("click", function () {
            imageBox.classList.add("enlarged-image");
            document.getElementById("image-holder-hider").classList.add("image-holder-hider-enlarged");
            document.getElementById("image-holder-hider").classList.remove("image-holder-hider-normal");
            


            document.getElementById("image-closer").addEventListener("click", function(){
               let allEnlargedImage = document.querySelectorAll(".enlarged-image");
               
                for (let i=0; i<allEnlargedImage.length;i++){allEnlargedImage[i].classList.remove("enlarged-image");}

                document.getElementById("image-holder-hider").classList.remove("image-holder-hider-enlarged");
                document.getElementById("image-holder-hider").classList.add("image-holder-hider-normal");

            });
            
        })  
    }
    updateScroll();

}
}



function clickToReduce(){
    let allEnlargedImage = document.querySelectorAll(".enlarged-image");
               
    for (let i=0; i<allEnlargedImage.length;i++){allEnlargedImage[i].classList.remove("enlarged-image");}

    document.getElementById("image-holder-hider").classList.remove("image-holder-hider-enlarged");
    document.getElementById("image-holder-hider").classList.add("image-holder-hider-normal");

    imageBox.addEventListener("click", clickToEnlarge(imageBox));
    }









// En mode portrait, il y a un problème pour avoir le dernier bout de scroll, je place donc un observateur de la date. 
//On pourrait décider de l'activer aussi avec l'orientation paysage s'il y avait un problème avec des div plus longs
setInterval(getDateNow,500);


// This functions gets the last bit of scroll by checking the date and seeing if it needs to be done after completion of all waiting Time

function getDateNow(){
    let now = Date.now();
         if(nextScrollToDo && now > dateNextScroll) {
        updateScroll();
        nextScrollToDo = false;
         }
}


//////////////////GESTION DE L'ARBORESCENCE//////////////////////

// Créer deux listes, une avec les topics de catégorie "non-transverse" et une autre avec les topics de catégorie "transverse"
let listWorks = topics.filter(function(a){
   return !a.transverse;});
listWorks=listWorks.map(a => a.key);

let listTransverseSubjects = topics.filter(function(a){
    return a.transverse;} );
 listTransverseSubjects=listTransverseSubjects.map(a => a.key);

 
 if (!orientationPortrait){
    displayTopicTree();
    }


function displayTopicTree(centralTopic){
// Selon qu'il s'agisse d'un "transverse" ou d'un "non-transverse", on append les topicKeys dans l'un ou l'autre des div prévus
    //Boucle listWorks

    document.getElementById('works-tree').innerHTML='';
    document.getElementById('transverse-tree').innerHTML='';


    for(let i=0;i<listWorks.length;i++){
        let topicBox = document.createElement("p");
        topicBox.innerText=listWorks[i];
        document.getElementById('works-tree').appendChild(topicBox);
        topicBox.style.color=gradientArray[i];
        topicBox.style.fontWeight="600";
        topicBox.style.opacity="0.5";
        addCorrectClass(topicBox,listWorks[i],centralTopic);
        
    }

    for(let i=0;i<listTransverseSubjects.length;i++){
        let topicBox = document.createElement("p");
        topicBox.innerText=listTransverseSubjects[i];
        document.getElementById('transverse-tree').appendChild(topicBox);
        topicBox.style.color=gradientArray[i+listWorks.length];
        topicBox.style.fontStyle="italic";
        topicBox.style.fontWeight="600";
        topicBox.style.opacity="0.5";
        addCorrectClass(topicBox,listTransverseSubjects[i],centralTopic);
    }

}



// Fonction qui ajoute la bonne classe à la box de type "p" topicBox selon le topic 
function addCorrectClass(topicBox,topic,centralTopic){


    if (isTopicAlreadyVisited(topic)){
        //topicBox.style.textDecoration = "underline";
        topicBox.style.opacity = "1";
    } else if (!isTopicRelated(topic,centralTopic)){
        topicBox.style.color = "whitesmoke";
    } 
    
    if (isTopicMatchingCentralTopic(topic,centralTopic)){
        topicBox.style.textDecoration = "underline";
    }
}

function isTopicAlreadyVisited(topic){
    const matchVisit = visitedTopics.filter(a => a == topic);
    if(matchVisit.length >0){
        return true;
    }
    else {
        return false;
    }
}

function isTopicRelated(topic,centralTopic){
    if(centralTopic === undefined){
        return false;
    } else {
        const desiredTopic = topics.filter(a => a.key==centralTopic);
        const relatedThemes = desiredTopic[0].related;
        const matchRelatedThemes = relatedThemes.filter(a => a == topic);
        if(matchRelatedThemes.length >0){
            return true;
        }
        else {
            return false;
        }
    }
}

function isTopicMatchingCentralTopic(topic,centralTopic){
    if(centralTopic === undefined){
        return false;
    } else {
        if (topic == centralTopic){
            return true;
        }
        else {
            return false;
        }
    }
}


///////////////////////// CHECK WHATSAPP //////////////////////////////////


function checkWhatsApp (){
    switch (validTopicRequests){
        case 1:
            infoBulle(`Ask ${3 - validTopicRequests} more questions </br> and unlock direct message on WhatsApp`);
            addWhatsAppButton("(Locked) Message on WhatsApp");
        break;
        case 2:
            
        break;
        case 3:
            infoBulle(`Well done! By asking ${validTopicRequests} questions </br> you unlocked direct messaging on WhatsApp`);
            openWhatsAppButton("Message on WhatsApp");
        break;
        

    }
}


function addWhatsAppButton(message){
    //empty the button if it exists

    //create the button and find a place to append it? (maybe the form?)
    let waInput = document.getElementById("input-whatsapp");
    waInput.placeholder = message;
    waInput.disabled = true;

    

    document.getElementById("whatsapp-send-button").disabled =true;
    document.getElementById("whatsapp-chat").style.display= "flex";
    document.getElementById("whatsapp-chat").style.opacity= "0.7";
    //waButton.addEventListener("click", function(){
      //  window.open("https://www.google.com", "_blank");
    //})
    //<input type="button" onclick="location.href='https://google.com';" value="Go to Google" />
    
}

function openWhatsAppButton(message){
    let waInput = document.getElementById("input-whatsapp");
    waInput.placeholder = message;
    waInput.disabled = false;
    document.getElementById("whatsapp-send-button").disabled =false;

//add event listener to the form
const whatsappChat = document.getElementById("whatsapp-chat");
    whatsappChat.style.opacity="1";
    whatsappChat.addEventListener("submit", function(event){
        event.preventDefault();
    
        let chatContent = event.target.querySelector("[name=writebox-whatsapp]").value;
        
        if (!(chatContent == '')){
            document.querySelector("[name=writebox-whatsapp]").value="";
            window.open(`https://wa.me/33673144374?text=${chatContent}`,`_blank`);
        }
        
    });



}

//text=${chatContent}
//text=I'm%20interested%20in%20your%20car%20for%20sale

////////////////////////////////////////////////////////////////////


// Fonction to scroll to bottom of the section after pressing send or sending up a response
const scrollToBottom = (id) => {
    const element = document.getElementById(id);
  element.scrollTop = element.scrollHeight;
}

function updateScroll(){
    scrollToBottom('conversation-thread');
    //console.log("Scroll updated");
}





/////////////// RESIZE MANAGER for VH on mobile ////////////

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
/////// TESTING IF IT'S CHROME OR iOS

const ua = navigator.userAgent;
let keyboardUpdatePermission = true;




if(iOS()){
    keyboardUpdatePermission = false; 
   document.getElementById("chatbox-form").classList.replace("chatbox-user","chatbox-user-ios");
   document.getElementById("whatsapp-chat").classList.replace("whatsapp-chatbox","whatsapp-chatbox-ios");
}



if (window.visualViewport && keyboardUpdatePermission) {
    window.visualViewport.addEventListener("resize", () => {
        vh = window.visualViewport.height * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
       // document.querySelector('input [type="text"]').style.background = "black";
        dateNextScroll = Date.now() + 150; 
        nextScrollToDo = true;
    });
  }


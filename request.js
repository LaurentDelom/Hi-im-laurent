//import { displayTopicTree } from "./topictree.js";

// Récupérer les données de topics
const reponse = await fetch('topics.json');
export const topics =  await reponse.json();

// Suivre le compte de topics valides demandés
let validTopicRequests =0;

//Suivre la liste des topics visités
export let visitedTopics=[];

//Extraire la liste des keys
const listKeys = topics.map(topic => topic.key);

//console.log(listKeys);
export let orientationPortrait = false;

//Contrôler une fois au lancement quelle est l'orientation de la page
if(screen.availHeight > screen.availWidth){
    orientationPortrait = true;
}



//Fonction qui crée la bulle de chat avec le contenu envoyé par l'user
function chatBulleUser  (message){
    //créer un pragraphe et le remplid du contenu en attribut
    const bulleUser = document.createElement("p");
    bulleUser.innerText = message;
    
    //rentrer la bulle dans le dom
    document.getElementById('conversation-thread').appendChild(bulleUser);
}




// EventListener du SUBMIT:
//Récupère le contenu .value de l'input text 
//Créer la bulle de chat
//Lancer l'anlayse de la chaine de caractère

const chatBox = document.querySelector(".chatbox-user");

chatBox.addEventListener("submit", function(event){
    event.preventDefault();
    document.getElementById('image-display').innerHTML='';
    let chatContent = event.target.querySelector("[name=writebox-user]").value;
    //console.log(chatContent);
    document.querySelector("[name=writebox-user]").value="";

    //Appel de la fonction former une bulle de chat avec chatContent
    chatBulleUser(chatContent);

    
    //Appel de l'analyse du message et renvoi des topics demandés
    let wordArrayUser = messageIntoArray(chatContent);
    let selectedTopics = keyComparison(listKeys,wordArrayUser);
    //console.log(selectedTopics);

    if(selectedTopics.length>0){
        //Appel fonction display contenu du topic[0]
        displayContent(selectedTopics[0]);
        displayImages(selectedTopics[0]);
        //Incrémenter le compte de topics valides
        validTopicRequests+=1;
        //ajouter le topic à la liste des topics visités
        visitedTopics.push(selectedTopics[0]);
       
        
        

    } else {
        //console.log(selectedTopics[0]);
        // Appel fonction je n'ai pas compris votre requête
        //chatBulleUser("I didn't quite get your request");
    }

    console.log(`Valid Topic Requests : ${validTopicRequests}`);

    //Mise à jour de l'arborescence
     if (!orientationPortrait){
        displayTopicTree(selectedTopics[0]);
    }
     
    
    

    //Activation de l'accès au chat Whatsapp à partir de 5 requêtes valides
    //if(validTopicRequests>4){
        //Fonction pour dévérouiller l'accès au chat Whatsapp
    //}


})



// Fonction qui sépare les mots contenus dans l'input text
function messageIntoArray (message){
    message=message.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
    let wordArray = message.split(" ");
   // console.log(wordArray);
    return wordArray;
}

// Fonction qui compare chacun des mots à la listKeys et renvoie le ou les mots contenu dans la liste
export function keyComparison (keyList,wordArray){
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

// Fonction qui prend en argument une topic-key et renvoie les textes associés 
function displayContent(topicKey){
    const desiredTopic = topics.filter(a => a.key==topicKey);
    const textsArray = desiredTopic[0].texts;
    //console.log(textsArray);
    
    for(let i=0;i<textsArray.length;i++){
        let textBox = document.createElement("p");
        textBox.innerText=textsArray[i];
        document.getElementById('conversation-thread').appendChild(textBox);
    }
    
}

// Fonction qui prend en argument une topic-key et renvoie les images associées dans le image-display

function displayImages(topicKey){
    const desiredTopic = topics.filter(a => a.key==topicKey);
     const imagesArray = desiredTopic[0].images;
    //console.log(imagesArray);

    for(let i=0; i<imagesArray.length;i++){
        let imageBox = document.createElement("img");
        imageBox.src=imagesArray[i];
//Selon l'orientation, les images apparaissent soit dans le conversation-thread, soit dans le image-display
        if(orientationPortrait){
        document.getElementById('conversation-thread').appendChild(imageBox);
        } else {
        document.getElementById('image-display').appendChild(imageBox);
        }
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
        addCorrectClass(topicBox,listWorks[i],centralTopic);
        
    }

    for(let i=0;i<listTransverseSubjects.length;i++){
        let topicBox = document.createElement("p");
        topicBox.innerText=listTransverseSubjects[i];
        document.getElementById('transverse-tree').appendChild(topicBox);
        addCorrectClass(topicBox,listTransverseSubjects[i],centralTopic);
    }

}



// Fonction qui ajoute la bonne classe à la box de type "p" topicBox selon le topic 
function addCorrectClass(topicBox,topic,centralTopic){


    if (isTopicAlreadyVisited(topic)){
        topicBox.classList.add('visited-topic');
    } else if (!isTopicRelated(topic,centralTopic)){
        topicBox.classList.add('invisible-topic');
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



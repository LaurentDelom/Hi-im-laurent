
// Récupérer les données de topics
const reponse = await fetch('topics.json');
const topics =  await reponse.json();

// Suivre le compte de topics valides demandés
let validTopicRequests =0;


//Extraire la liste des keys
const listKeys = topics.map(topic => topic.key);

console.log(listKeys);


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
        //Incrémenter le compte de topics valides
        validTopicRequests+=1;
    } else {
        // Appel fonction je n'ai pas compris votre requête
        //chatBulleUser("I didn't quite get your request");
    }

    console.log(`Valid Topic Requests : ${validTopicRequests}`);

    //Activation de l'accès au chat Whatsapp à partir de 5 requêtes valides
    //if(validTopicRequests>4){
        //Fonction pour dévérouiller l'accès au chat Whatsapp
    //}


})



// Fonction qui sépare les mots contenus dans l'input text
function messageIntoArray (message){
    message=message.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
    let wordArray = message.split(" ");

   
    console.log(wordArray);
    return wordArray;
}

// Fonction qui compare chacun des mots à la listKeys et renvoie le ou les mots contenu dans la liste
function keyComparison (keyList,wordArray){
    let foundKeyList = [];

    for (let i=0; i<keyList.length; i++){
        let testKey = keyList[i];
        for (let j=0; j<wordArray.length; j++){
            if (wordArray[j]==testKey){
                foundKeyList.push(testKey);
            }
        }
    
    }
    
    return foundKeyList;
}


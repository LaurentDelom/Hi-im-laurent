
// Récupérer les données de topics
const reponse = await fetch('topics.json');
const topics =  await reponse.json();

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




// Fonction qui récupère le contenu .value de l'input text quand le formulaire est submit

const chatBox = document.querySelector(".chatbox-user");

chatBox.addEventListener("submit", function(event){
    event.preventDefault();
    let chatContent = event.target.querySelector("[name=writebox-user]").value;
    console.log(chatContent);
    document.querySelector("[name=writebox-user]").value="";

    //Appel de la fonction former une bulle de chat avec chatContent
    chatBulleUser(chatContent);

})


// FONCTION A CREER POUR former une bulle de chat

// Fonction qui sépare les mots contenus dans l'input text

// Fonction qui compare chacun des mots à la listKeys


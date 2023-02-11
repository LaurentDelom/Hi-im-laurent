// Récupérer les données de topics
//const reponse = await fetch('topics.json');
//const topics =  await reponse.json();

import {topics, orientationPortrait, keyComparison, visitedTopics} from "./request.js";


// Créer deux listes, une avec les topics de catégorie "non-transverse" et une autre avec les topics de catégorie "transverse"
let listWorks = topics.filter(function(a){
   return !a.transverse;});
listWorks=listWorks.map(a => a.key);

let listTransverseSubjects = topics.filter(function(a){
    return a.transverse;} );
 listTransverseSubjects=listTransverseSubjects.map(a => a.key);



function displayTopicTree(){
// Selon qu'il s'agisse d'un "transverse" ou d'un "non-transverse", on append les topicKeys dans l'un ou l'autre des div prévus
    //Boucle listWorks

    document.getElementById('works-tree').innerHTML='';
    document.getElementById('transverse-tree').innerHTML='';


    for(let i=0;i<listWorks.length;i++){
        let topicBox = document.createElement("p");
        topicBox.innerText=listWorks[i];
        document.getElementById('works-tree').appendChild(topicBox);
        addCorrectClass(topicBox,listWorks[i]);
        
    }

    for(let i=0;i<listTransverseSubjects.length;i++){
        let topicBox = document.createElement("p");
        topicBox.innerText=listTransverseSubjects[i];
        document.getElementById('transverse-tree').appendChild(topicBox);
    }

}

if (!orientationPortrait){
displayTopicTree();
}

// Fonction qui ajoute la bonne classe à la box de type "p" topicBox selon le topic 
function addCorrectClass(topicBox,topic){
    if (isTopicAlreadyVisited(topic)){
        topicBox.classList.add('red');
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



// Fonction à créer : isRelatedTopic
export const topics = [ 
    {   
        "key":"intro",
        "images":[],
        "texts":["So nice to see you here!","Let me show you how it works:","Just enter one of the following keywords: work, nature, technique, about myself, internet...","There you are! Ready to go!","Where would you like to start?"],
        "related":[],
        "waiting":[200,200,400,300,300], //[3200,4200,4000,3000,3000],
        "transverse":false
    },

    {   
        "key":"work",
        "images":["./images/work1.jpg"],
        "texts":["Le travail c'est très important","Il faut beaucoup travailler"],
        "related":["technique"],
        "waiting":[4000,3000],
        "transverse":false
    },
    {
        "key":"technique",
        "images":["./images/technique1.jpg","./images/technique2.jpg","./images/technique3.jpg"],
        "texts":["La technique c'est bien","J'aime bien la technique","Je chorégrpahie la technique"],
        "related":["work"],
        "waiting":[1000,1000,1000],
        "transverse":true
    },
    {
        "key":"nature",
        "images":["./images/nature1.jpg","./images/nature2.jpg"],
        "texts":["La nature c'est très joli","Je parle de la nature dans mes oeuvres"],
        "related":["work","technique"],
        "waiting":[1000,1000],
        "transverse":true
    },
    {   
        "key":"internet",
        "images":["./images/internet1.jpg"],
        "texts":["Internet ça nous relie tous","Moi je l'utilise tous les jours"],
        "related":["technique"],
        "waiting":[1000,1000],
        "transverse":true
    },
    {   
        "key":"myself",
        "images":["./images/signonthewall-balanced.gif"],
        "texts":["I am an engineer","But more importantly, I am an artist!","Reach me out on Whatsapp via https://wa.me/0033673144374"],
        "related":[],
        "waiting":[1000,1000,1000],
        "transverse":true
    }
    



];



export const errorResponses = [ 
    {   
        "texts":["I am sorry, I didn't quite get that one..."],
        "waiting":[1500]
    },

    {   
        "texts":["I am sorry again, I didn't get that one either..."],
        "waiting":[1500]
    },
    
    {
        "texts":["Oupsie, come again..."],
        "waiting":[1500]
    }
];
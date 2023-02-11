

const reponse = await fetch('topics.json');
const topics =  await reponse.json();

const listKeys = topics.map(topic => topic.key);

console.log(listKeys);
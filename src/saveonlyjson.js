var firstStory = 1;
var lastStory = 2;

var timer = ms => new Promise(res => setTimeout(res, ms));

async function load (storyNumber, lastStory, validfetch) { //loops into an async function for this to work
	var lastUrl = "I love MSPFA";
	var validfetch = 1;
	while (storyNumber <= lastStory)
	{
	fetch("https://mspfa.com/", {
	  "headers": {
		"accept": "application/json",
		"accept-language": "pt-BR,pt;q=0.9",
		"content-type": "application/x-www-form-urlencoded",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin"
	  },
	  "referrer": "https://mspfa.com/?s="+storyNumber+"&p=1",
	  "referrerPolicy": "strict-origin-when-cross-origin",
	  "body": "do=story&s="+storyNumber,
	  "method": "POST",
	  "mode": "cors",
	  "credentials": "include"
	})
	  .then(function(res) {validfetch = (res.status == 200 || res.status == 404 || res.status == 500); if (!validfetch){console.log(res.status+" at story "+storyNumber+", retrying");} return (res.json())})
	  .then(data => jsonObj = data);

	await timer(2000); //please dont change this
	storyNumber+=validfetch;
	}
	console.log("Done.");
}
load(firstStory, lastStory);
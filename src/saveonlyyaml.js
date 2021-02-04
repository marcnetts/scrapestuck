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

	if (jsonObj && validfetch) //no 404s
	{
		for (var pageNum in jsonObj.p){
			if (jsonObj.p[pageNum].b.indexOf(".swf") != -1)
			{
				var rawContent= jsonObj.p[pageNum].b.split(".swf");
				rawContent.pop();
				for (var splitContent in rawContent){
					var urlSFW=rawContent[splitContent].substring(rawContent[splitContent].lastIndexOf("http"),rawContent[splitContent].lastIndexOf(""))+".swf";
					if (lastUrl != urlSFW && urlSFW.indexOf(".homestuck.com") == -1 && urlSFW.indexOf(".mspaintadventures.com") == -1)
					{
						lastUrl = urlSFW;
						var pageDate = new Date(jsonObj.p[pageNum].d);
						var parsedSeries = jsonObj.n.replace(/[\"']/g, function(match) {return '\\'+match;});
						var realpageNum=(jsonObj.p[pageNum].n+"").split(","); //cheating but rarely doesnt point to the next page
						realpageNum[0]--;
						var pageName=jsonObj.p[pageNum].c;
						if (pageName.search("=>") != -1 || pageName.search("->") != -1)
						{
							pageName+=" ("+parsedSeries+" p "+realpageNum[0]+")"; //example "[S] ==> (Hackbent p 55)"
						}

						//yaml store begins here
						//most interactables are English animations
						//if there is no sequel/prequel manually remove series
						var YAMLdata = "Title: \""+pageName+"\"\nAlternate Titles: null\nLibrary: theatre\nSeries: "+parsedSeries+"\nDeveloper: "+jsonObj.a+"\nPublisher: null\nPlay Mode: Single Player\nRelease Date: "+pageDate.getFullYear()+"-"+('0'+(pageDate.getMonth()+1)).slice(-2)+"-"+('0'+(pageDate.getDate()+1)).slice(-2)+"\nVersion: null\nLanguages: en\nExtreme: No\nTags: Webcomic; Homestuck; Action; Comedy; Other; Seizure Warning\nTag Categories: default; default; default; default; default; default\nSource: https://mspfa.com/?s="+jsonObj.i+"&p="+realpageNum[0]+"\nPlatform: Flash\nStatus: Playable\nApplication Path: FPSoftware\\Flash\\flashplayer_32_sa.exe\nLaunch Command: "+urlSFW.replace("https","http")+'\nGame Notes: \'"'+parsedSeries+'" page '+realpageNum[0]+'.\'\nOriginal Description: null\nCuration Notes: null\nAdditional Applications: {}\n';

						var blob = new Blob([YAMLdata], {type: 'text/yaml'}),
							e    = document.createEvent('MouseEvents'),
							a    = document.createElement('a')

						a.download = jsonObj.i+'-'+realpageNum[0]+'-F.yaml'
						a.href = window.URL.createObjectURL(blob)
						a.dataset.downloadurl =  ['text', a.download, a.href].join(':')
						e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
						a.dispatchEvent(e)
						await timer(50); //prevents browser not saving all yaml
					}
				}
			}
		
			if (jsonObj.p[pageNum].b.indexOf("<iframe ") != -1)
			{
				var rawContent= jsonObj.p[pageNum].b.split("<iframe ");
				rawContent = rawContent[1].split("src=\"");
				var urlSFW=rawContent[1].substring(0,rawContent[1].indexOf('"'));
				if (lastUrl != urlSFW && urlSFW.indexOf(".swf") == -1 && urlSFW.indexOf("youtube.com") == -1 && urlSFW.indexOf("vimeo.com") == -1 && urlSFW.indexOf("soundcloud.com") == -1)
				{
					lastUrl = urlSFW;
					var pageDate = new Date(jsonObj.p[pageNum].d);
					var parsedSeries = jsonObj.n.replace(/[\"']/g, function(match) {return '\\'+match;});
					var realpageNum=(jsonObj.p[pageNum].n+"").split(",");
					realpageNum[0]--;
					var pageName = jsonObj.p[pageNum].c;
					if (pageName.search("=>") != -1 || pageName.search("->") != -1)
					{
						pageName+=" ("+parsedSeries+" p "+realpageNum[0]+")"; //example "[S] ==> (Hackbent p 55)"
					}

					//yaml store begins here
					var YAMLdata = "Title: \""+pageName+"\"\nAlternate Titles: null\nLibrary: theatre\nSeries: "+parsedSeries+"\nDeveloper: "+jsonObj.a+"\nPublisher: null\nPlay Mode: Single Player\nRelease Date: "+pageDate.getFullYear()+"-"+('0'+(pageDate.getMonth()+1)).slice(-2)+"-"+('0'+(pageDate.getDate()+1)).slice(-2)+"\nVersion: null\nLanguages: en\nExtreme: No\nTags: Webcomic; Homestuck; Action; Comedy; Other; Seizure Warning\nTag Categories: default; default; default; default; default; default\nSource: https://mspfa.com/?s="+jsonObj.i+"&p="+realpageNum[0]+"\nPlatform: HTML5\nStatus: Playable\nApplication Path: FPSoftware\\Basilisk-Portable\\Basilisk-Portable.exe\nLaunch Command: "+urlSFW.replace("https","http")+'\nGame Notes: \'"'+parsedSeries+'" page '+realpageNum[0]+'.\'\nOriginal Description: null\nCuration Notes: null\nAdditional Applications: {}\n';

					var blob = new Blob([YAMLdata], {type: 'text/yaml'}),
						e    = document.createEvent('MouseEvents'),
						a    = document.createElement('a')

					a.download = jsonObj.i+'-'+realpageNum[0]+'-H.yaml'
					a.href = window.URL.createObjectURL(blob)
					a.dataset.downloadurl =  ['text', a.download, a.href].join(':')
					e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
					a.dispatchEvent(e)
					await timer(50);
				}
			}
		}
	}
	storyNumber+=validfetch;
	}
	console.log("Done.");
}
load(firstStory, lastStory);
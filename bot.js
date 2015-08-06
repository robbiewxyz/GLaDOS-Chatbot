//Version
var Version = '1.3.9';
console.log("I'm running v." + Version);
/**
 * Admin ID's
 */
var admin = ['2934528', '3448149', '5081412', '5056380'];
//Death (doesn't die when it starts)
var death = 0;
/**
 * Determine if an array contains a certain value
 */
function arrayContains(array, value) {
    return array.indexOf(value) > -1;
}
function randomArrayElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function InvalidMessageLength(message) {
    this.message = message;
    this.name = "InvalidMessageLength";
}
function sendMessage(messageString) {
    if (messageString.length - 1 <= 400) {
        document.getElementById("input").value = messageString;
        document.getElementById("sayit-button").click();
    } else {
        throw new InvalidMessageLength("Length of message exceeded 400 characters.");
    }
}
function getLastPostedMessage() {
    try {
        var messageElements = document.getElementById("chat");
        return messageElements.lastElementChild.children[1].lastElementChild.children[1].innerHTML;
    } catch (error) {
        return "";
    }
}
function isAdmin() {
    var pos = admin.indexOf(getPersonID());
    if (pos == -1) {
        return 0;
    } else {
        return 1;
    }
}
function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function indexes(source, find) {
    var result = [];
    for (i = 0; i < source.length; ++i) {
        if (source.substring(i, i + find.length) == find) {
            result.push(i);
        }
    }
    return result;
}
/** Get html content (Uses JQuery) MAKE SURE YOU HAVE CROSS ORIGIN POLICY OFF!!!!!!!! */
function getWebsite(url) {
    //This is currently used because the host of GLaDOS has a dumb web safe thing, uses httpS:// gets around (That's was it's dumb) it so that's why this works
    var url = "https://glados.byethost8.com/bot/website.php?site=" + url;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    return xhr.responseText;
}
/** Get the message id so you can follow up on the response */
function getMessageID() {
    var messageElements = document.getElementById("chat");
    var innerelement = messageElements.lastElementChild.children[1].innerHTML;
    var posone = innerelement.indexOf("message-") + 8;
    var cutone = innerelement.substring(posone);
    var postwo = cutone.indexOf('"');
    var messageid = cutone.substring(0, postwo); //This will be the start text [messageid]: so that the message can return to the user
    return messageid;
}
/** Get the person ID (Stackexchange user ID)*/
function getPersonID() {
    var messageElements = document.getElementById("chat");
    var innerelement = messageElements.lastElementChild.innerHTML;
    var posone = innerelement.indexOf("user-") + 5;
    var cutone = innerelement.substring(posone);
    var postwo = cutone.indexOf('"');
    var personid = cutone.substring(0, postwo);
    return personid;
}
/* 
 * Extracts command and parameter (first space with a word behind it is a command all word(s) after space is/are parameter(s))
 */
function ExtractCommand(word) {
    var pos = word.indexOf(" ") + 1;
    var newWord = word.substring(0, pos);
    if (newWord === "") {
        newWord = word;
    } else {
        var length = newWord.length - 1;
        newWord = newWord.substr(0, length);
    }
    return newWord;
}

function ExtractParameter(word) {
    var pos = word.indexOf(" ") + 1;
    if (pos === 0) {
        return 0;
    } else {
        return word.substring(pos);
    }
}
/**
 * Gets user input and sends messages
 * back to that user.
 */
function main() {
    //If the bot is dead:/ check to see if an Admin has decided to wake me up
    if (death === 1) {
        if (getLastPostedMessage() === "/start" && isAdmin()) {
            death = 0;
        }
    } else {
        var lastMessagetest = getLastPostedMessage();
        //Checking to see if the lastmessage contains "/" (or else it would respond to ever message sent in the chatroom including it's own messages)
        if ((lastMessagetest.substr(0, 1) == "/") && (lastMessagetest !== '') && (lastMessagetest.substr(0, 2) !== "//")) {
            //Get's last message and filters just letters(changes to lowercase), numbers, and spaces
            var lastMessage = lastMessagetest.toLowerCase().replace(/[^a-z\d\s]+/gi, "");
            //get person and message id
            var PersonID = getPersonID();
            var MessageID = getMessageID();
            //Split up command and parameters
            var command = ExtractCommand(lastMessage);
            var parameter = ExtractParameter(lastMessage);
            //Let's run through the commands and see what returns
            var ActualMessage = SuperCommand(command, parameter);
            //Finally!!! (Sending a message)
            sendMessage(':' + MessageID + ' ' + ActualMessage);
        }
    }
    window.setTimeout(main, 1000);
}
main();
/*
 *
 *
 *
 *
 *
 *
 *
 * 
 */
/** Actuall commands here */
function SuperCommand(command, parameter) {
    switch (command) {
        case "pir":
            if (parameter) {
                /*
                //This does not work yet because of the webproxy:/
                var pirURL = "http://isithackday.com/arrpi.php?text="+(parameter);
                var pirContent = getWebsite(pirURL);
                console.log(pirURL);
                return pirContent;
                */
               return "Fix me!";
            } else {
                return "I don't have anything to say!";
            }
            break;
        case "choose":
            if (parameter) {
                var choices = parameter.split(" or ");
                if (choices.length > 1) {
                    var answer = Math.floor(Math.random() * choices.length);
                    return "I choose: " + choices[answer];
                } else {
                    return "Please give at least two options.";
                }
            } else {
                return "I don't have any options!";
            }
            break;
        case "about":
            return "Language: Javascript\nChief Developers: Tom\nServer Host: Blender Warrior\nContributors: DizzyCode ";
        case "joke":
            /*
            var content = getWebsite("http://api.icndb.com/jokes/random");
            var json = JSON.parse(content);
            return "Joke: " + json.value.joke;
            */
           return "Currently, some of the jokes are produce are very explicit";
        case "gif":
            /*
                        if (parameter === 0) {
                            return "This command requires a parameter";
                        } else {
                            var query = encodeURI(parameter);
                            var url = "http://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=dc6zaTOxFJmzC";
                            var gifContent = getWebsite(url);
                            var gifJson =  JSON.parse(gifContent);
                            if (gifJson.data === "") {
                                return "I could not find a gif with that query";
                            } else {
                                return gifJson.data[0].images.fixed_height.url;
                            }
                        }
            */
            return "Currently under repair (Waiting on an api key from giphy)";
            //break;
        case "version":
            return "I'm running v." + Version;
        case "pull":
            if (isAdmin()) {
                $.getScript('https://raw.githubusercontent.com/onlineth/GLaDOS-Chatbot/master/bot.js');
                return "Pulled Latest";
            } else {
                return "Sorry, you do not have the priv. to do that";
            }
            break;
        case "info":
            var infoTitle = document.getElementById('roomname').innerHTML;
            var infoDescription = document.getElementById('roomdesc').innerHTML;
            var infoMessage = "Room: " + infoTitle + " \n Room Description: " + infoDescription;
            return infoMessage;
        case "image":
            /*
                        if (parameter === 0) {
                            return "This command requires a parameter";
                        } else {
                            var imageQuery = encodeURI(parameter);
                            var imageUrl = 'http://www.google.com/search?tbm=isch&safe=strict&q=' + imageQuery;
                            var imageContent = getWebsite(imageUrl);
                            var imageIndexpos = indexes(imageContent, 'http://www.google.com/imgres?imgurl=');
                            var imagePos = imageIndexpos[Math.floor(Math.random() * imageIndexpos.length)] + 36;
                            var imageContent1 = content.substring(imagePos);
                            var imagePos2 = imageContent1.indexOf('&amp;');
                            var imageContent2 = content1.substring(0, imagePos2);
                            return (imageContent2);
                        }
            */
            return "Currently under repair";
        case "id":
            return "Your ID is: " + getPersonID() + " \n My ID is always: 5178593";//Assuming use of the GLaDOS account
        case "say":
            if (parameter) {
                return parameter;
            } else {
                return "This command requires a parameter";
            }
            break;
        case "start":
            return "I'm up and running";
        case "help":
            /**
             * For help
             */
            switch (parameter) {
                case "choose":
                    return "/choose + options separated by or \n Enter two or more options separated by \"or\" and it will return a random option";
                case "about":
                    return "/about \n Returns information about @GLaDOS";
                case "joke":
                    return "/joke \n Returns a random joke powered by icndb.com";
                case "gif":
                    return "/gif + Search Query \n Uses giphy.com's api to load a gif";
                case "image":
                    return "/image + Search Query \n Searches on Google Images for an image (Copyright may be required)";
                case "id":
                    return "/id \n returns your SO user ID and my SO ID";
                case "say":
                    return "/say + Phrase \n I repeat what you said";
                case "info":
                    return "/info \n Provides information about the Chatroom";
                default:
                    var Helpmessage = "My commands are,\n - /choose \n - /about \n - /joke \n - /info \n - /image (search term) \n - /id \n - /say (what to say) \n - /gif (search term) \n You can also say /help [command name] for more information about a certain command";
                    if (isAdmin()) {
                        Helpmessage = Helpmessage + "\n You have admin priv, you can start and stop me with /start and /die";
                    }
                    return Helpmessage;
            }
            break;
        case "die":
            if (isAdmin()) {
                death = 1;
                return "I'm down";
            } else {
                return "I refuse too";
            }
            break;
        default:
            return "Command: " + command + " is not a valid command, try /help for help";
    }
}

    ///**   (F O U N D R Y - S T R E A M - M O D)    ///**
   ///***             (0 . 0 . 1 d)                 ///***

import { fsMod } from "./scripts/fromTwitch.js";
import {getSetting, registerSettings} from "./scripts/settings.js";

/*  Need to set myChannel and filter name from configuration. getSetting(twitchChannel) will return value for 
    myChannel. getSetting(twitchUN) will return value for filterName. However, they cannot be called prior
    as below with var = myChannel = getSetting(twitchChannel) etc as they haven't been loaded yet. When 
    I attempt to load them in a hook (init, ready or otherwise) I don't seem to be doing it correctly.
*/
var myChannel =  "tabletopsandanvils";
var filterName = "foundrystudiobot"; 
  
// Set the alias to filter out of echoed messages on Foundry side
var mychatAlias = "StreamChat"; // <- Keep Static

///**      (C A N V A S   L A Y E R)         ///**

Hooks.once("canvasInit", () => {
    // Add fsmLayer to canvas
    const layerct = canvas.stage.children.length;
    let tbLayer = new fsmLayer();
  
    tbLayer.setButtons();
    tbLayer.newHookTest();
    canvas.fsMod = canvas.stage.addChildAt(tbLayer, layerct);
    canvas.fsMod.draw();
  
    let theLayers = Canvas.layers;
    theLayers.fsMod = fsmLayer;
  
    Object.defineProperty(Canvas, "layers", {
      get: function () {
        return theLayers;
      },
    });
  });

///**        (M O D - S E T T I N G S)           ///**
 
 Hooks.on("init", function () {
    registerSettings();
 });
 
///**      (C O N N E C T I O N S - T M I)       ///**
 
 Hooks.on("ready", function () {
    SetupTwitchClient();
});
 
 //Gather Foundry Chat and send to Twitch - sometimes slice is 24, other times 23 works. Timestamp issues.
 Hooks.on("createChatMessage", async (message) => {
   if (message.export().includes(mychatAlias)) return
   if (game.settings.get("fsMod", "fsbotEcho")) {
    let tempM = message.export();
    let res = tempM.slice(23);
     fsMod.client.say(myChannel, res) };
 console.log(message);
 });
 
 export function SetupTwitchClient() {
   // Set up twitch chat reader 
   fsMod.client = new tmi.Client({
     connection: {
       cluster: "aws",
       secure: true,
       reconnect: true,
     },
     identity: {
       username: game.settings
       .get("fsMod", "twitchUN"),
       password: game.settings
       .get("fsMod", "twitchAuth")
     },
     channels: game.settings
       .get("fsMod", "twitchChannel")
       .split(",")
       .map((c) => c.trim()),
   });
 fsMod.client.connect().catch(console.error);
 fsMod.client.on('connected', (address, port) => {
   fsMod.client.say (myChannel, 'Connected.'); // <- fsModChannelNames
   });
   console.log('worked');

   ///**     (F R O M - T W I T C H - M S G S)      ///**
  
 // If GM Moderation Mode is on:
   fsMod.client.on("message", (channel, tags, message, self) => {
     if (tags["display-name"].includes(filterName)) return 
     if (
       game.user.isGM &&
       game.settings.get("fsMod", "fsModAllChatMessages")
     ) {
       WhisperGM(
         `<b>${tags["display-name"]}</b>: ${message}`
       );
     }
   });
 // Without GM Mode  
   fsMod.client.on("message", (channel, tags, message, self) => {
    if (tags["display-name"].includes(filterName)) return
     if (
        game.settings.get("fsMod", "fsModGlobal")
       ) {
         MessageAll(
           `<b>${tags["display-name"]}</b>: ${message}`
         );
       }; 
     });
   }

///**       (B U T T O N S ( L E F T ))          ///**
 
 function twitchKick() { 
    let d = new Dialog({
      title: 'Viewer Timeout',
      content: `
        <form class="flexcol">
          <div class="form-group">
            <label for="timeoutViewer">Enter view to Timeout: </label>
            <input type="text" name="kickInput" placeholder=" name+seconds / default 10 minutes ">
          </div>    
        </form>
      `,
      buttons: {
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        },
        yes: {
          icon: '<i class="fas fa-comment-slash"></i>',
          label: 'TIMEOUT',
          callback: (html) => {
            let input = html.find('[name="kickInput"]').val();
            console.log(input);
            fsMod.client.say(myChannel, '/timeout ' + input)
          }
        },
      },
      default: 'yes',
      close: () => {
        console.log('Another one bites the dust!');
      }
    }).render(true)
  }
  
  function twitchBan() { 
    let e = new Dialog({
      title: 'Ban Viewer from Channel',
      content: `
        <form class="flexcol">
          <div class="form-group">
            <label for="KickViewer">Enter viewer name to ban: </label>
            <input type="text" name="banInput" placeholder=" enter name, click BAN to confirm ">
          </div>    
        </form>
      `,
      buttons: {
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        },
        yes: {
          icon: '<i class="fas fa-hand-middle-finger"></i>',
          label: 'BAN',
          callback: (html) => {
            let input = html.find('[name="banInput"]').val();
            console.log(input);
            fsMod.client.say(myChannel, '/ban ' + input)
          }
        },
      },
      default: 'no',
      close: () => {
        console.log('Another one bites the dust!');
      }
    }).render(true)
  }
  
  function twitchRaid() { 
    let d = new Dialog({
      title: 'Raid Twitch Channel',
      content: `
        <form class="flexcol">
          <div class="form-group">
            <label for="RaidChannel">Raid Channel: </label>
            <input type="text" name="raidInput" placeholder=" enter channel to raid ">
          </div>    
        </form>
      `,
      buttons: {
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        },
        yes: {
          icon: '<i class="fas fa-khanda"></i>',
          label: 'RAID',
          callback: (html) => {
            let input = html.find('[name="raidInput"]').val();
            console.log(input);
            fsMod.client.say(myChannel, '/raid ' + input)
          }
        },
      },
      default: 'yes',
      close: () => {
        console.log('Off to adventure!');
      }
    }).render(true)
  }
  //Buttons on the left
  Hooks.on("getSceneControlButtons", (controls) => {
    if (game.user.data.role == 4) {
      controls.push();
    }
  });
  
  export default class fsmLayer extends CanvasLayer {
    constructor() {
      super();
      this.layername = "fsMod";
  
      console.log("Foundry Stream Module| Drawing Layer | Loaded into Drawing Layer");
    }
  
    setButtons() {
      this.newButtons = {
        name: "fsMod",
        icon: "fab fa-twitch",
        layer: "fsmLayer",
        title: "FSM Controls",
        tools: [
          {
            icon: "fas fa-eraser",
            name: "ClearTwitch",
            title: "Clear Twitch Chat",
          onClick: () => fsMod.client.say(myChannel,'/clear'), 
          },
          {
            icon: "fas fa-comment-slash",
            name: "KickUser",
            title: "Timeout Twitch User",
          onClick: () => twitchKick() 
          },
          {
            icon: "fas fa-hand-middle-finger",
            name: "BanUser",
            title: "Ban Twitch User",
          onClick: () => twitchBan()
          },
          {
            icon: "fas fa-khanda",
            name: "RaidChannel",
            title: "Raid Channel",
          onClick: () => twitchRaid()
          },
        ],
      };
    }
  
    newHookTest() {
      Hooks.on("getSceneControlButtons", (controls) => {
        console.log("Foundry Stream Module | Testing User role = " + game.user.data.role);
        if (game.user.data.role == 4) {
          controls.push(this.newButtons);
        }
      });
    }}
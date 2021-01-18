//import {getSetting} from './scripts/settings.js';

export const fsMod = {
  client: null,
  options: {},
};

//window.getUN = (content) => {
//  getSetting(twitchUN);
//}

//let streamerID = `${tags["display-name"]}`;

window.WhisperGM = (content) => {
  ChatMessage.create({
    content: content,
    whisper: [game.users.find((u) => u.isGM)],
    speaker: ChatMessage.getSpeaker({ alias: "Stream Chat" }),
  });
};

window.MessageAll = (content) => {
  ChatMessage.create({
    content: content,
    whisper: [game.users.players],
    speaker: ChatMessage.getSpeaker({alias: "StreamChat"}),
  });
}

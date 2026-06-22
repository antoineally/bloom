const emojiData = {
  /* ================= COMBAT ================= */
  "👊": { 
    label: "Punch", 
    category: "combat", 
    query: "real punch hit fighting people", 
    messages: ["{user} punches {target} 👊"] 
  },
  "🦶": { 
    label: "Kick", 
    category: "combat", 
    query: "real kick fight action", 
    messages: ["{user} kicks {target} 🦶"] 
  },
  "💥": { 
    label: "Knockback", 
    category: "combat", 
    query: "impact hit knockback explosion real", 
    messages: ["💥 {target} is blasted away by {user}"] 
  },
  "⚔️": { 
    label: "Duel", 
    category: "combat", 
    query: "sword fight duel realistic", 
    messages: ["{user} duels {target} ⚔️"] 
  },
  "🪓": { 
    label: "Axe Attack", 
    category: "combat", 
    query: "axe attack swing real", 
    messages: ["{user} attacks {target} with an axe 🪓"] 
  },
  "🔫": { 
    label: "Shoot", 
    category: "combat", 
    query: "gunshot shooting action cinematic", 
    messages: ["{user} shoots at {target} 🔫"] 
  },

  /* ================= POWERS ================= */
  "🔥": { 
    label: "Fire", 
    category: "powers", 
    query: "fire blast effect real cinematic", 
    messages: ["{user} burns {target} 🔥"] 
  },
  "⚡": { 
    label: "Lightning", 
    category: "powers", 
    query: "lightning strike electricity real", 
    messages: ["{user} electrocutes {target} ⚡"] 
  },
  "❄️": { 
    label: "Ice", 
    category: "powers", 
    query: "ice freeze attack cinematic", 
    messages: ["{user} freezes {target} ❄️"] 
  },
  "🌪️": { 
    label: "Tornado", 
    category: "powers", 
    query: "tornado wind storm real", 
    messages: ["{user} summons a tornado on {target} 🌪️"] 
  },
  "🌊": { 
    label: "Water", 
    category: "powers", 
    query: "water splash wave cinematic", 
    messages: ["{user} splashes {target} 🌊"] 
  },
  "✨": { 
    label: "Magic", 
    category: "powers", 
    query: "magic sparkles glow cinematic", 
    messages: ["{user} enchants {target} ✨"] 
  },
  "🪄": { 
    label: "Magic Spell", 
    category: "powers", 
    query: "wizard casting spell realistic effect", 
    messages: ["{user} casts a spell on {target} 🪄"] 
  },

  /* ================= REACTIONS ================= */
  "😂": { 
    label: "Laugh", 
    category: "reactions", 
    query: "real life laughing hard reaction", 
    messages: ["{user} laughs at {target} 😂"] 
  },
  "😭": { 
    label: "Cry", 
    category: "reactions", 
    query: "real crying emotional reaction", 
    messages: ["{user} cries because of {target} 😭"] 
  },
  "😱": { 
    label: "Shocked", 
    category: "reactions", 
    query: "shocked surprised real reaction", 
    messages: ["{user} is shocked by {target} 😱"] 
  },
  "😡": { 
    label: "Angry", 
    category: "reactions", 
    query: "angry mad real reaction face", 
    messages: ["{user} is angry at {target} 😡"] 
  },
  "🙄": { 
    label: "Ignore", 
    category: "reactions", 
    query: "eye roll annoyed real reaction", 
    messages: ["{user} ignores {target} 🙄"] 
  },
  "😴": { 
    label: "Sleep", 
    category: "reactions", 
    query: "bored sleeping real reaction", 
    messages: ["{user} puts {target} to sleep 😴"] 
  },
  "🤡": { 
    label: "Clown", 
    category: "reactions", 
    query: "clown mocking real reaction", 
    messages: ["{user} calls {target} a clown 🤡"] 
  },

  /* ================= AFFECTION ================= */
  "🤗": { 
    label: "Hug", 
    category: "affection", 
    query: "real hug couple affectionate", 
    messages: ["{user} hugs {target} 🤗"] 
  },
  "😘": { 
    label: "Kiss", 
    category: "affection", 
    query: "blowing kiss real couple", 
    messages: ["{user} kisses {target} 😘"] 
  },
  "❤️": { 
    label: "Love", 
    category: "affection", 
    query: "romantic love couple real", 
    messages: ["{user} loves {target} ❤️"] 
  },
  "🌹": { 
    label: "Rose", 
    category: "affection", 
    query: "giving rose romantic real", 
    messages: ["{user} gives a rose to {target} 🌹"] 
  },

  /* ================= SUGGESTIVE ================= */
  "😏": { 
    label: "Flirt", 
    category: "suggestive", 
    query: "flirty smirk real person", 
    messages: ["{user} flirts with {target} 😏"] 
  },
  "😉": { 
    label: "Wink", 
    category: "suggestive", 
    query: "wink flirty real reaction", 
    messages: ["{user} winks at {target} 😉"] 
  },
  "🫦": { 
    label: "Seduce", 
    category: "suggestive", 
    query: "seductive bite lip real", 
    messages: ["{user} teases {target} 🫦"] 
  },
  "🥵": { 
    label: "Hot", 
    category: "suggestive", 
    query: "hot blushing real reaction", 
    messages: ["{user} makes {target} blush 🥵"] 
  },
  "😳": { 
    label: "Embarrassed", 
    category: "suggestive", 
    query: "embarrassed blushing real face", 
    messages: ["{user} embarrasses {target} 😳"] 
  },
  "👀": { 
    label: "Stare", 
    category: "suggestive", 
    query: "intense stare flirty real", 
    messages: ["{user} stares at {target} 👀"] 
  },
  "🍆": { 
    label: "Tease", 
    category: "suggestive", 
    query: "eggplant suggestive real", 
    messages: ["{user} teases {target} 🍆"] 
  },
  "💦": { 
    label: "Wet", 
    category: "suggestive", 
    query: "sweat suggestive real reaction", 
    messages: ["{user} gets {target} all wet 💦"] 
  },

  /* ================= TROLL ================= */
  "🍅": { 
    label: "Tomato", 
    category: "troll", 
    query: "throwing tomato prank real", 
    messages: ["{user} throws a tomato at {target} 🍅"] 
  },
  "🥚": { 
    label: "Egg", 
    category: "troll", 
    query: "throwing egg prank real", 
    messages: ["{user} throws an egg at {target} 🥚"] 
  },
  "🪨": { 
    label: "Rock", 
    category: "troll", 
    query: "throwing rock prank", 
    messages: ["{user} throws a rock at {target} 🪨"] 
  },
  "🧻": { 
    label: "Toilet Paper", 
    category: "troll", 
    query: "toilet paper prank real", 
    messages: ["{user} wraps {target} in toilet paper 🧻"] 
  },
  "🍌": { 
    label: "Banana Slip", 
    category: "troll", 
    query: "banana peel slip prank real", 
    messages: ["{user} makes {target} slip on a banana 🍌"] 
  },
  "🐟": { 
    label: "Fish Slap", 
    category: "troll", 
    query: "fish slap real prank", 
    messages: ["{user} slaps {target} with a fish 🐟"] 
  },
  "👞": { 
    label: "Shoe Throw", 
    category: "troll", 
    query: "throwing shoe prank real", 
    messages: ["{user} throws a shoe at {target} 👞"] 
  },
  "🐸": { 
    label: "Troll", 
    category: "troll", 
    query: "troll face meme reaction", 
    messages: ["{user} trolls {target} 🐸"] 
  },

  /* ================= SOCIAL ================= */
  "👋": { 
    label: "Greet", 
    category: "social", 
    query: "waving hello real person", 
    messages: ["{user} greets {target} 👋"] 
  },
  "👏": { 
    label: "Applause", 
    category: "social", 
    query: "clapping applause real people", 
    messages: ["{user} applauds {target} 👏"] 
  },
  "🙏": { 
    label: "Thank You", 
    category: "social", 
    query: "thank you gesture real", 
    messages: ["{user} thanks {target} 🙏"] 
  },
  "🤝": { 
    label: "Handshake", 
    category: "social", 
    query: "handshake real people", 
    messages: ["{user} shakes hands with {target} 🤝"] 
  },
  "💪": { 
    label: "Encourage", 
    category: "social", 
    query: "encouragement strong real", 
    messages: ["{user} encourages {target} 💪"] 
  },
  "🍀": { 
    label: "Good Luck", 
    category: "social", 
    query: "good luck real", 
    messages: ["{user} wishes {target} good luck 🍀"] 
  },
  "🍻": { 
    label: "Cheers", 
    category: "social", 
    query: "cheers toast drink real people", 
    messages: ["{user} cheers with {target} 🍻"] 
  },
  "🏆": { 
    label: "Congratulate", 
    category: "social", 
    query: "congratulations trophy real", 
    messages: ["{user} congratulates {target} 🏆"] 
  },
  "🎂": { 
    label: "Birthday", 
    category: "social", 
    query: "birthday celebration real", 
    messages: ["{user} celebrates {target}'s birthday 🎂"] 
  },
  "🎉": { 
    label: "Party", 
    category: "social", 
    query: "party celebration real people", 
    messages: ["{user} parties with {target} 🎉"] 
  }
};

module.exports = emojiData;

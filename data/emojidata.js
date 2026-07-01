const emojiData = {

 /* ================= SOCIAL ================= */
  "👋": { 
    label: "Greet", 
    category: "social", 
    query: "hello", 
    messages: ["{user} greets {target} 👋"] 
  },
  "👏": { 
    label: "Applause", 
    category: "social", 
    query: "applause", 
    messages: ["{user} applauds {target} 👏"] 
  },
  "🙏": { 
    label: "Thank You", 
    category: "social", 
    query: "thanking", 
    messages: ["{user} thanks {target} 🙏"] 
  },
  "🤝": { 
    label: "Handshake", 
    category: "social", 
    query: "handshake", 
    messages: ["{user} shakes hands with {target} 🤝"] 
  },
  "💪": { 
    label: "Encourage", 
    category: "social", 
    query: "encouragement", 
    messages: ["{user} encourages {target} 💪"] 
  },
  "🍀": { 
    label: "Good Luck", 
    category: "social", 
    query: "good luck", 
    messages: ["{user} wishes {target} good luck 🍀"] 
  },
  "🍻": { 
    label: "Cheers", 
    category: "social", 
    query: "cheers toast", 
    messages: ["{user} cheers with {target} 🍻"] 
  },
  "🏆": { 
    label: "Congratulate", 
    category: "social", 
    query: "congratulations", 
    messages: ["{user} congratulates {target} 🏆"] 
  },
  "🎂": { 
    label: "Birthday", 
    category: "social", 
    query: "birthday celebration", 
    messages: ["{user} celebrates {target}'s birthday 🎂"] 
  },

  "☀️": { 
    label: "Good morning", 
    category: "social", 
    query: "Good morning", 
    messages: ["{user} wishes good morning to {target} ☀️"] 
  },

  "🌙": { 
    label: "Good night", 
    category: "social", 
    query: "Good night", 
    messages: ["{user} wishes good night to {target} 🌙"] 
  },
   /* ================= REACTIONS ================= */
  "😂": { 
    label: "Laugh", 
    category: "reactions", 
    query: "laughing hard", 
    messages: ["{user} laughs at {target} 😂"] 
  },
  "😭": { 
    label: "Cry", 
    category: "reactions", 
    query: "crying emotional", 
    messages: ["{user} cries because of {target} 😭"] 
  },
  "😱": { 
    label: "Shocked", 
    category: "reactions", 
    query: "shocked", 
    messages: ["{user} is shocked by {target} 😱"] 
  },
  "😡": { 
    label: "Angry", 
    category: "reactions", 
    query: "angry mad", 
    messages: ["{user} is angry at {target} 😡"] 
  },
  "🙄": { 
    label: "Ignore", 
    category: "reactions", 
    query: "eye roll", 
    messages: ["{user} ignores {target} 🙄"] 
  },
  "😴": { 
    label: "Sleep", 
    category: "reactions", 
    query: "bored sleeping", 
    messages: ["{user} puts {target} to sleep 😴"] 
  },
  "🤡": { 
    label: "Clown", 
    category: "reactions", 
    query: "clown", 
    messages: ["{user} calls {target} a clown 🤡"] 
  },

  /* ================= AFFECTION ================= */
  "🤗": { 
    label: "Hug", 
    category: "affection", 
    query: "hug", 
    messages: ["{user} hugs {target} 🤗"] 
  },
  "😘": { 
    label: "Kiss", 
    category: "affection", 
    query: "kiss", 
    messages: ["{user} kisses {target} 😘"] 
  },
  "❤️": { 
    label: "Love", 
    category: "affection", 
    query: "romantic love", 
    messages: ["{user} loves {target} ❤️"] 
  },
  "🌹": { 
    label: "Rose", 
    category: "affection", 
    query: "giving rose", 
    messages: ["{user} gives a rose to {target} 🌹"] 
  },

  /* ================= SUGGESTIVE ================= */
  "😏": { 
    label: "Flirt", 
    category: "suggestive", 
    query: "flirty seductive", 
    messages: ["{user} flirts with {target} 😏"] 
  },
  "😉": { 
    label: "Wink", 
    category: "suggestive", 
    query: "wink flirty", 
    messages: ["{user} winks at {target} 😉"] 
  },
  "🫦": { 
    label: "Seduce", 
    category: "suggestive", 
    query: "seductive bite lip", 
    messages: ["{user} teases {target} 🫦"] 
  },
  "🥵": { 
    label: "Hot", 
    category: "suggestive", 
    query: "hot blushing", 
    messages: ["{user} makes {target} blush 🥵"] 
  },
  "😳": { 
    label: "Embarrassed", 
    category: "suggestive", 
    query: "embarrassed", 
    messages: ["{user} embarrasses {target} 😳"] 
  },
  "👀": { 
    label: "Stare", 
    category: "suggestive", 
    query: "stare flirty", 
    messages: ["{user} stares at {target} 👀"] 
  },
  "🍆": { 
    label: "Tease", 
    category: "suggestive", 
    query: "eggplant suggestive", 
    messages: ["{user} teases {target} 🍆"] 
  },
  "💦": { 
    label: "Wet", 
    category: "suggestive", 
    query: "wet", 
    messages: ["{user} gets {target} all wet 💦"] 
  },

  /* ================= TROLL ================= */
  "🍅": { 
    label: "Tomato", 
    category: "troll", 
    query: "throw tomato", 
    messages: ["{user} throws a tomato at {target} 🍅"] 
  },
  "🥚": { 
    label: "Egg", 
    category: "troll", 
    query: "throw egg", 
    messages: ["{user} throws an egg at {target} 🥚"] 
  },
  "🪨": { 
    label: "Rock", 
    category: "troll", 
    query: "throw rock", 
    messages: ["{user} throws a rock at {target} 🪨"] 
  },
  "🧻": { 
    label: "Toilet Paper", 
    category: "troll", 
    query: "toilet paper prank", 
    messages: ["{user} wraps {target} in toilet paper 🧻"] 
  },
  "🍌": { 
    label: "Banana Slip", 
    category: "troll", 
    query: "slip", 
    messages: ["{user} makes {target} slip on a banana 🍌"] 
  },
 
  "👞": { 
    label: "Shoe Throw", 
    category: "troll", 
    query: "throwing shoe", 
    messages: ["{user} throws a shoe at {target} 👞"] 
  },
  
 /* ================= COMBAT ================= */
  "👊": { 
    label: "Punch", 
    category: "combat", 
    query: "real punch hit fighting", 
    messages: ["{user} punches {target} 👊"] 
  },
  "🦶": { 
    label: "Kick", 
    category: "combat", 
    query: "real kick fight action", 
    messages: ["{user} kicks {target} 🦶"] 
  },
  "⚔️": { 
    label: "Duel", 
    category: "combat", 
    query: "sword fight duel realistic", 
    messages: ["{user} duels {target} ⚔️"] 
  },
  
  "🔫": { 
    label: "Shoot", 
    category: "combat", 
    query: "gun shooting", 
    messages: ["{user} shoots at {target} 🔫"] 
  },

  /* ================= POWERS ================= */
  "🔥": { 
    label: "Fire", 
    category: "powers", 
    query: "fire", 
    messages: ["{user} burns {target} 🔥"] 
  },
  "⚡": { 
    label: "Lightning", 
    category: "powers", 
    query: "electrocution", 
    messages: ["{user} electrocutes {target} ⚡"] 
  },
  "❄️": { 
    label: "Ice", 
    category: "powers", 
    query: "ice freeze", 
    messages: ["{user} freezes {target} ❄️"] 
  },
  "🌪️": { 
    label: "Tornado", 
    category: "powers", 
    query: "tornado", 
    messages: ["{user} summons a tornado on {target} 🌪️"] 
  },
  "🌊": { 
    label: "Water", 
    category: "powers", 
    query: "water splash", 
    messages: ["{user} splashes {target} 🌊"] 
  },
  "🪄": { 
    label: "Magic Spell", 
    category: "powers", 
    query: "magic spell", 
    messages: ["{user} casts a spell on {target} 🪄"] 
  }
};

  module.exports = emojiData;

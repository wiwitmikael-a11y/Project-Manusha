// This file contains the modular SVG assets for chibi sprites.

export const PALETTE = {
  skin: ["#f5d6b3", "#c79e7d", "#8d6e5a", "#a1b56c"],
  hair: ["#222222", "#6b4e2e", "#c78c2e", "#e8c45e", "#4a90e2"],
  outfit: ["#4a4a4a", "#6a8e6a", "#8c3a3a", "#2f4f6f", "#9c9c9c"],
  weapon: ["#555555", "#222222", "#b5b5b5", "#7a3a3a"],
};

export const SVG_ASSETS: Record<string, Record<string, string>> = {
  base: {
    male: `<g transform="translate(0, 5)"><path d="M45 90 V 50 H 55 V 90 Z M 40 55 L 45 50 V 35 H 55 V 50 L 60 55 V 90 H 40 Z" fill="${PALETTE.skin[0]}" stroke="#333" stroke-width="2" />
           <circle cx="50" cy="25" r="15" fill="${PALETTE.skin[0]}" stroke="#333" stroke-width="2"/></g>`,
    female: `<g transform="translate(0, 5)"><path d="M45 90 V 60 Q 50 50 55 60 V 90 Z M 40 65 L 45 60 V 40 H 55 V 60 L 60 65 V 90 H 40 Z" fill="${PALETTE.skin[1]}" stroke="#333" stroke-width="2" />
             <circle cx="50" cy="25" r="15" fill="${PALETTE.skin[1]}" stroke="#333" stroke-width="2"/></g>`,
    mutant: `<g transform="translate(0, 5)"><path d="M40 90 C 30 70 70 70 60 90 Z M 45 60 L 55 60 L 65 80 H 35 Z" fill="${PALETTE.skin[3]}" stroke="#333" stroke-width="2" />
             <circle cx="50" cy="40" r="15" fill="${PALETTE.skin[3]}" stroke="#333" stroke-width="2"/><circle cx="42" cy="38" r="3" fill="red"/><circle cx="58" cy="38" r="3" fill="red"/></g>`,
  },
  hair: {
    hair1: `<g transform="translate(0, 5)"><path d="M35 10 Q 50 0 65 10 V 25 H 35 Z" fill="${PALETTE.hair[0]}"/></g>`,
    hair2: `<g transform="translate(0, 5)"><path d="M35 10 C 30 25 70 25 65 10 V 20 H 35 Z" fill="${PALETTE.hair[1]}"/></g>`,
    hair3: `<g transform="translate(0, 5)"><path d="M35 10 Q 50 5 65 10 L 60 30 H 40 Z" fill="${PALETTE.hair[2]}"/></g>`,
    hair4: `<g transform="translate(0, 5)"><path d="M30 15 Q 50 10 70 15 L 65 30 H 35 Z" fill="${PALETTE.hair[3]}"/></g>`,
    hair5: `<g transform="translate(0, 5)"><path d="M50,5 a 25,20 0 0,0 0,30 a 25,20 0 0,0 0,-30" fill="${PALETTE.hair[4]}"/></g>`,
  },
  outfit: {
    jacket: `<g transform="translate(0, 5)"><rect x="40" y="40" width="20" height="30" fill="${PALETTE.outfit[0]}"/></g>`,
    hoodie: `<g transform="translate(0, 5)"><rect x="40" y="40" width="20" height="35" fill="${PALETTE.outfit[1]}"/><path d="M40 30 Q 50 20 60 30" fill="${PALETTE.outfit[1]}"/></g>`,
    armor: `<g transform="translate(0, 5)"><rect x="38" y="38" width="24" height="25" fill="${PALETTE.outfit[2]}" stroke="#555" stroke-width="1"/></g>`,
    scavenger: `<g transform="translate(0, 5)"><path d="M40 40 L 60 40 L 55 65 L 45 65 Z" fill="${PALETTE.outfit[3]}"/></g>`,
    worker: `<g transform="translate(0, 5)"><rect x="42" y="40" width="16" height="30" fill="${PALETTE.outfit[4]}"/><rect x="38" y="40" width="24" height="5" fill="${PALETTE.outfit[4]}"/></g>`,
    mutant_skin: `<g transform="translate(0, 5)"><path d="M50 50 L 40 60 L 50 70 L 60 60 Z" fill="#6a8e6a" opacity="0.5"/></g>`,
  },
  weapon: {
    none: ``,
    knife: `<g transform="translate(60 55) rotate(45)"><rect x="-2" y="-10" width="4" height="20" fill="${PALETTE.weapon[0]}"/><polygon points="0,-10 2,-12 -2,-12" fill="${PALETTE.weapon[2]}"/></g>`,
    bat: `<g transform="translate(65 50) rotate(30)"><rect x="-3" y="-20" width="6" height="40" rx="3" fill="${PALETTE.weapon[1]}"/></g>`,
    pistol: `<g transform="translate(60 60)"><rect x="0" y="-5" width="15" height="5" fill="${PALETTE.weapon[0]}"/><rect x="2" y="0" width="5" height="10" fill="${PALETTE.weapon[1]}"/></g>`,
    rifle: `<g transform="translate(60 60) rotate(-15)"><rect x="0" y="-3" width="35" height="6" fill="${PALETTE.weapon[0]}"/><rect x="5" y="3" width="8" height="8" fill="${PALETTE.weapon[1]}"/></g>`,
  }
};

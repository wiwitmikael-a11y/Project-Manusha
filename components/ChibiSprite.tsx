import React from 'react';
import { SVG_ASSETS } from './chibi/assets';

interface ChibiSpriteProps {
  base: string;
  hair?: string;
  outfit?: string;
  weapon?: string;
  className?: string;
}

const ChibiSprite: React.FC<ChibiSpriteProps> = ({ base, hair, outfit, weapon, className }) => {
  const baseSvg = SVG_ASSETS.base[base] || '';
  const hairSvg = hair ? (SVG_ASSETS.hair[hair] || '') : '';
  const outfitSvg = outfit ? (SVG_ASSETS.outfit[outfit] || '') : '';
  const weaponSvg = weapon ? (SVG_ASSETS.weapon[weapon] || '') : '';

  // Layering order: base -> outfit -> hair -> weapon
  const svgContent = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <g>
        ${baseSvg}
        ${outfitSvg}
        ${hairSvg}
        ${weaponSvg}
      </g>
    </svg>
  `;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default ChibiSprite;

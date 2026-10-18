import type { Cocktail } from './data';

/** Draw without replacement, excluding the currently displayed recipe on refill. */
export function drawCocktail(ids: string[], current: string | undefined, remaining: string[], random = Math.random) {
 const pool = [...new Set(ids)];
 if (!pool.length) return { id: undefined, remaining: [] as string[] };
 if (pool.length === 1) return { id: pool[0], remaining: [] as string[] };
 let deck = remaining.filter(id => pool.includes(id) && id !== current);
 if (!deck.length) {
  deck = pool.filter(id => id !== current);
  for (let i = deck.length - 1; i > 0; i--) {
   const j = Math.floor(Math.max(0, Math.min(.999999999, random())) * (i + 1));
   [deck[i], deck[j]] = [deck[j], deck[i]];
  }
 }
 return { id: deck[0], remaining: deck.slice(1) };
}

export const glassShapes = {
 coupe: { top: 292, bottom: 382, full: 309, left: 165, right: 355, rim: 95,
  path: 'M165 292 Q175 376 260 382 Q345 376 355 292 Z' },
 rocks: { top: 280, bottom: 425, full: 300, left: 187, right: 333, rim: 73,
  path: 'M187 280 L198 414 Q260 436 322 414 L333 280 Z' },
 highball: { top: 242, bottom: 426, full: 262, left: 210, right: 310, rim: 50,
  path: 'M210 242 L218 417 Q260 434 302 417 L310 242 Z' },
};
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max,value));
export const flowForTilt = (tilt: number) => clamp((tilt-.32)/.68);

/** Three scroll chapters: lift the bottle, pour, then return upright. */
export function scrollPourState(fraction: number, reduced = false) {
 const scroll = clamp(fraction);
 if (reduced) return {progress:scroll>=.12?100:0,tilt:0};
 const progress=clamp((scroll-.12)/.76)*100;
 const tilt=scroll<.12?scroll/.12:scroll>.88?(1-scroll)/.12:1;
 return {progress,tilt:clamp(tilt)};
}
export function pourGeometry(glass: Cocktail['glass'], progress: number, tilt = 1) {
 const shape = glassShapes[glass];
 const amount = clamp(tilt);
 const approach = clamp(amount/.32);
 // An upright bottle parks beside the glass, then moves its opening directly
 // above the bowl before any liquid is allowed to flow.
 const spout = {x:420-160*approach,y:52+106*approach};
 const angle=90-92*approach-18*flowForTilt(amount);
 const liquidY=shape.bottom-(shape.bottom-shape.full)*clamp(progress,0,100)/100;
 return {shape,spout,angle,liquidY,stream:`M${spout.x} ${spout.y} C${spout.x} ${spout.y+40} ${spout.x} ${liquidY-30} ${spout.x} ${liquidY}`};
}

/** Decorative citrus is drawn only when the actual instructions mention it. */
export function recipeGarnish(drink: Cocktail) {
 const garnish = drink.english.steps.filter(step => /garnish|twist|peel|mint/i.test(step)).join(' ');
 if (/olive/i.test(garnish)) return 'olive';
 if (/mint/i.test(garnish)) return 'mint';
 if (/orange/i.test(garnish)) return 'orange';
 if (/lime/i.test(garnish)) return 'lime';
 if (/lemon/i.test(garnish)) return 'lemon';
 return 'none';
}

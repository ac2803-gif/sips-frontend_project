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
export function pourGeometry(glass: Cocktail['glass'], progress: number, aim = { x: 0, y: 0 }, playing = false) {
 const shape = glassShapes[glass];
 const x = Math.max(-1, Math.min(1, aim.x));
 const y = Math.max(-1, Math.min(1, aim.y));
 // The bottle rotates around its opening. The stream uses this same point,
 // so tracking, glass changes and viewport scaling never detach the stream.
 const spout = { x: 260 + x * 18, y: 158 + y * 7 };
 const angle = -20 + (playing ? 8 : 0) + x * 2;
 const liquidY = shape.bottom - (shape.bottom - shape.full) * Math.max(0, Math.min(100, progress)) / 100;
 return { shape, spout, angle, liquidY, stream: `M${spout.x} ${spout.y} C${spout.x} ${spout.y + 40} ${spout.x} ${liquidY - 30} ${spout.x} ${liquidY}` };
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

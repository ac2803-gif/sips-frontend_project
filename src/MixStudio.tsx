import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ArrowUpRight, Check, ChevronRight, Pause, Play, RotateCcw, Shuffle, Wine } from 'lucide-react';
import { cocktails, missingIngredients, type Cocktail } from './data';
import { translate, useI18n } from './i18n';
import { drawCocktail, pourGeometry, recipeGarnish } from './mix-utils';
import './mix-studio.css';

function useMedia(query: string) {
 const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
 useEffect(() => {
  const media = window.matchMedia(query);
  const change = () => setMatches(media.matches);
  change();
  media.addEventListener('change', change);
  return () => media.removeEventListener('change', change);
 }, [query]);
 return matches;
}

function PourCanvas({ drink, autoPlay }: { drink: Cocktail; autoPlay: boolean }) {
 const { t } = useI18n();
 const reduced = useMedia('(prefers-reduced-motion: reduce)');
 const finePointer = useMedia('(hover: hover) and (pointer: fine)');
 const [playing, setPlaying] = useState(autoPlay && !reduced);
 const [progress, setProgress] = useState(autoPlay && reduced ? 100 : 0);
 const [aim, setAim] = useState({ x: 0, y: 0 });
 const progressRef = useRef(progress);
 const stageRef = useRef<SVGSVGElement>(null);
 const trackingFrame = useRef(0);
 const nextAim = useRef(aim);
 const uid = useId().replace(/:/g, '');
 const { shape, spout, angle, liquidY, stream } = pourGeometry(drink.glass, progress, reduced ? { x: 0, y: 0 } : aim, playing);
 const garnish = recipeGarnish(drink);
 const bottleLabel = translate(drink.base, 'en').toUpperCase();
 const citrus = garnish === 'orange' ? '#d58a33' : garnish === 'lime' ? '#8f9b46' : '#c3ae49';
 const complete = progress >= 100;

 useEffect(() => { progressRef.current = progress; }, [progress]);
 useEffect(() => {
  if (!playing || reduced) return;
  let frame = 0;
  const started = performance.now();
  const initial = progressRef.current;
  const tick = (now: number) => {
   const value = Math.min(100, initial + (now - started) / 48);
   progressRef.current = value;
   setProgress(value);
   if (value < 100) frame = requestAnimationFrame(tick);
   else setPlaying(false);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
 }, [playing, reduced]);
 useEffect(() => {
  if (reduced) { setPlaying(false); setAim({ x: 0, y: 0 }); }
 }, [reduced]);
 useEffect(() => {
  const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
  document.addEventListener('visibilitychange', pauseWhenHidden);
  return () => {
   document.removeEventListener('visibilitychange', pauseWhenHidden);
   cancelAnimationFrame(trackingFrame.current);
  };
 }, []);

 const toggle = () => {
  if (reduced) { setProgress(complete ? 0 : 100); return; }
  if (complete) { progressRef.current = 0; setProgress(0); setPlaying(true); }
  else setPlaying(value => !value);
 };
 const reset = () => { setPlaying(false); progressRef.current = 0; setProgress(0); setAim({ x: 0, y: 0 }); };
 const track = (event: PointerEvent<HTMLButtonElement>) => {
  if (event.pointerType !== 'mouse' || reduced) return;
  const svg = stageRef.current;
  const matrix = svg?.getScreenCTM();
  if (!svg || !matrix) return;
  const point = svg.createSVGPoint();
  point.x = event.clientX; point.y = event.clientY;
  const local = point.matrixTransform(matrix.inverse());
  nextAim.current = { x: Math.max(-1, Math.min(1, (local.x - 280) / 230)), y: Math.max(-1, Math.min(1, (local.y - 230) / 190)) };
  cancelAnimationFrame(trackingFrame.current);
  trackingFrame.current = requestAnimationFrame(() => setAim(nextAim.current));
 };
 const action = reduced ? (complete ? '清空酒杯' : '查看成杯效果') : complete ? '再倒一次' : playing ? '暂停倒酒' : '开始倒酒';
 return <div className="mix-canvas-wrap">
  <button className="mix-stage" type="button" onClick={toggle} onPointerMove={track}
   onPointerLeave={event => { if (event.pointerType === 'mouse') { cancelAnimationFrame(trackingFrame.current); setAim({ x: 0, y: 0 }); } }}
   aria-label={t(action)} aria-pressed={playing} data-glass={drink.glass} data-cocktail={drink.id}>
   <span className="mix-orbit mix-orbit-one" /><span className="mix-orbit mix-orbit-two" />
   <span className="mix-art-label">A LITTLE MIX. A LITTLE MAGIC.</span>
   <svg className="mix-art" ref={stageRef} viewBox="0 0 560 480" aria-hidden="true">
    <defs>
     <linearGradient id={`${uid}-bottle`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#52715b"/><stop offset=".52" stopColor="#264d39"/><stop offset="1" stopColor="#183f2d"/></linearGradient>
     <linearGradient id={`${uid}-liquid`} x1="0" y1="0" x2=".5" y2="1"><stop stopColor={drink.color} stopOpacity=".65"/><stop offset="1" stopColor={drink.color}/></linearGradient>
     <clipPath id={`${uid}-glass`}><path d={shape.path}/></clipPath>
     <filter id={`${uid}-shadow`}><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="260" cy="458" rx="88" ry="8" fill="#596044" opacity=".12" filter={`url(#${uid}-shadow)`}/>
    <g className="mix-bottle" transform={`translate(${spout.x} ${spout.y}) rotate(${angle})`} data-spout-x={spout.x} data-spout-y={spout.y}>
     <path d="M0 -9 H45 Q55 -9 64 -23 L82 -49 Q89 -59 101 -59 H221 Q236 -59 236 -44 V44 Q236 59 221 59 H101 Q89 59 82 49 L64 23 Q55 9 45 9 H0Z" fill={`url(#${uid}-bottle)`}/>
     <path d="M48 -2 Q67 -3 83 -38 M111 -48H214" fill="none" stroke="#a8bb8b" strokeWidth="4" opacity=".25"/>
     <rect x="3" y="-12" width="14" height="24" rx="2" fill="#d9d0a7"/>
     <ellipse className="mix-bottle-opening" cx="0" cy="0" rx="3" ry="9" fill="#28452f" stroke="#d9d0a7" strokeWidth="2"/>
     <rect x="104" y="-48" width="111" height="96" rx="2" fill="#eae6d0"/>
     <rect x="111" y="-41" width="97" height="82" fill="none" stroke="#a2a77c"/>
     <text x="159" y="-19" textAnchor="middle" fill="#35503d" fontFamily="Georgia" fontSize="11" letterSpacing="4">SIPS</text>
     <path d="M143 -8 H175" stroke="#acb28d"/>
     <text x="159" y="12" textAnchor="middle" fill="#35503d" fontFamily="Georgia" fontSize={bottleLabel.length>10?9:bottleLabel.length>6?12:18} letterSpacing="1.5">{bottleLabel}</text>
     <text x="159" y="30" textAnchor="middle" fill="#68775b" fontSize="4.4" letterSpacing=".8">THE COCKTAIL COLLECTION</text>
    </g>
    <path d={shape.path} fill="#fff" fillOpacity=".17" stroke="#b3b39c" strokeWidth="1.8"/>
    {playing && !reduced && <path className="mix-stream" d={stream} fill="none" stroke={drink.color} strokeWidth="4" strokeLinecap="round" opacity=".8" data-end-y={liquidY}/>}
    <g clipPath={`url(#${uid}-glass)`}>
     {progress > 0 && <><rect className="mix-liquid" x={shape.left - 3} y={liquidY} width={shape.right - shape.left + 6} height={shape.bottom - liquidY + 10} fill={`url(#${uid}-liquid)`}/><ellipse cx="260" cy={liquidY} rx={shape.rim} ry="4" fill={drink.color} opacity=".55"/>
      {playing && !reduced && <ellipse className="mix-ripple" cx={spout.x} cy={liquidY} rx="10" ry="3" fill="none" stroke="#fffae6" strokeWidth="1" opacity=".6"/>}</>}
     {drink.glass !== 'coupe' && [0,1,2].map(n => <rect key={n} x={drink.glass==='rocks'?216+n*17:236+(n%2)*10} y={drink.glass==='rocks'?330+(n%2)*25:285+n*35} width="36" height="38" rx="5" fill="#fff" fillOpacity=".22" stroke="#fff" strokeOpacity=".45" transform={`rotate(${n*13-14} 260 350)`}/>)}
     <path d={`M${shape.left+12} ${shape.top+15} L${shape.left+18} ${shape.bottom-17}`} stroke="#fff" strokeWidth="3" opacity=".45"/>
    </g>
    <path d={shape.path} fill="none" stroke="#b3b39c" strokeWidth="1.8"/>
    <ellipse cx="260" cy={shape.top} rx={shape.rim} ry="8" fill="none" stroke="#b3b39c" strokeWidth="1.8"/>
    {drink.glass==='coupe' && <path d="M260 382V444 M212 454 Q260 438 308 454Z" fill="none" stroke="#b3b39c" strokeWidth="2"/>}
    {['orange','lime','lemon'].includes(garnish) && <g transform={`translate(${shape.right-17} ${shape.top-1})`}><path d="M-20 2 Q3 -35 22 -5 Q32 13 4 20" fill="none" stroke={citrus} strokeWidth="8"/><path d="M-20 0 Q3 -35 22 -6" fill="none" stroke="#e4d6a0" strokeWidth="2"/></g>}
    {garnish==='mint' && <g transform={`translate(${shape.right-13} ${shape.top})`}><path d="M0 4Q-32-19-19-33Q4-24 0 4 M0 4Q3-36 22-30Q27-9 0 4" fill="#607b49"/></g>}
    {garnish==='olive' && <g transform={`translate(${shape.right-27} ${shape.top})`}><path d="M-9 21L19-38" stroke="#b19361" strokeWidth="2"/><ellipse cx="2" cy="-3" rx="10" ry="13" fill="#88904b"/><circle cx="3" cy="-6" r="3" fill="#a55b35"/></g>}
   </svg>
   <span className="mix-stage-hint">{t(reduced ? '点击查看成杯效果' : finePointer ? '点击倒酒，移动鼠标控制酒瓶' : '轻点酒杯开始，再点暂停')}</span>
  </button>
  <div className="mix-playback">
   <button className="mix-play" type="button" onClick={toggle} aria-label={t(action)}>
    {playing ? <Pause size={15}/> : complete ? <Check size={15}/> : <Play size={15}/>}<span>{t(action)}</span>
   </button>
   <progress className="mix-progress" value={progress} max={100} aria-label={t('倒酒演示进度')}/>
   <span className="mix-percent" aria-hidden="true">{Math.round(progress)}%</span>
   <button className="mix-reset" type="button" onClick={reset} aria-label={t('清空酒杯')} disabled={progress===0 && !playing}><RotateCcw size={16}/></button>
  </div>
 </div>;
}

export function MixStudio({ cabinet, onOpen, onManageBar }: { cabinet: string[]; onOpen: (drink: Cocktail) => void; onManageBar: () => void }) {
 const { language, t } = useI18n();
 const [scope, setScope] = useState<'all'|'bar'>('all');
 const [currentId, setCurrentId] = useState(cocktails[0].id);
 const [drawCount, setDrawCount] = useState(0);
 const [autoPlay, setAutoPlay] = useState(false);
 const bag = useRef({ key:'', remaining: [] as string[] });
 const ready = useMemo(() => cocktails.filter(c => missingIngredients(c,cabinet).length===0), [cabinet]);
 const pool = scope==='all' ? cocktails : ready;
 const drink = pool.find(c => c.id===currentId) ?? pool[0];
 const poolKey = pool.map(c => c.id).join('|');
 const randomize = () => {
  const next = drawCocktail(pool.map(c => c.id), drink?.id, bag.current.key===poolKey ? bag.current.remaining : []);
  if (!next.id) return;
  bag.current = { key: poolKey, remaining: next.remaining };
  setCurrentId(next.id); setAutoPlay(true); setDrawCount(n=>n+1);
 };
 const changeScope = (next: 'all'|'bar') => { setScope(next); setAutoPlay(false); };
 return <section className="mix-studio" aria-label={t('随机调酒工作台')}>
  <div className="mix-scope" role="group" aria-label={t('随机范围')}>
   <button type="button" className={scope==='all'?'selected':''} aria-pressed={scope==='all'} onClick={()=>changeScope('all')}>{t('全部酒款')}<span>{cocktails.length}</span></button>
   <button type="button" className={scope==='bar'?'selected':''} aria-pressed={scope==='bar'} onClick={()=>changeScope('bar')}>{t('酒柜能调')}<span>{ready.length}</span></button>
  </div>
  {drink ? <PourCanvas key={`${scope}-${drink.id}-${drawCount}`} drink={drink} autoPlay={autoPlay}/> : <div className="mix-empty"><Wine size={42} strokeWidth={1}/><h3>{t('酒柜还没有能调的酒')}</h3><p>{t('添加材料后，就能从可调配方中随机抽选。')}</p><button type="button" onClick={onManageBar}>{t('去整理酒柜')}<ArrowUpRight size={16}/></button></div>}
  <div className="mix-result" aria-live="polite" aria-atomic="true">
   <div className="mix-result-copy"><span className="mix-result-label">{t('这一杯灵感')}</span><h3>{drink ? drink.name : t('等待你的第一杯')}</h3><p>{drink ? `${language==='zh'?`${drink.zh} · `:''}${t(drink.base)} · ${t(drink.flavor)}` : t('也可以切换到全部酒款')}</p></div>
   <button className="mix-recipe-link" type="button" onClick={()=>drink&&onOpen(drink)} disabled={!drink} aria-label={drink ? (language==='zh'?`查看${drink.zh}配方`:`View ${drink.name} recipe`) : t('查看配方')}>{t('查看配方')}<ChevronRight size={16}/></button>
  </div>
  <button className="mix-random" type="button" onClick={randomize} disabled={!pool.length}><Shuffle size={17}/>{t('随机来一杯')}<ArrowUpRight size={16}/></button>
  <p className="mix-footnote">{t('从真实配方中随机抽选，演示颜色与简化杯型随酒款变化。')}</p>
 </section>;
}

import { lazy, Suspense, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { BookOpen, RotateCw, X } from 'lucide-react';
import type { Cocktail } from './data';
import { useI18n } from './i18n';
import './recipe-extras.css';

const RecipeStory=lazy(()=>import('./RecipeStory'));

export function RecipeFlipCard({ drink, art, flipped, onFlip, onBack }: {
 drink:Cocktail; art:ReactNode; flipped:boolean; onFlip:()=>void; onBack:()=>void;
}) {
 const { language,t }=useI18n();
 const id=useId();
 const front=useRef<HTMLButtonElement>(null);
 const back=useRef<HTMLButtonElement>(null);
 const previous=useRef(flipped);
 const [revealed,setRevealed]=useState(false);
 useEffect(()=>{
  if(previous.current===flipped)return;
  previous.current=flipped;
  (flipped?back:front).current?.focus({preventScroll:true});
 },[flipped]);
 return <div className={`recipe-visual recipe-flip-card art-${drink.id} ${flipped?'is-flipped':''}`} data-side={flipped?'back':'front'}>
  <div className="recipe-flip-inner">
   <div className="recipe-flip-face recipe-flip-front" aria-hidden={flipped} inert={flipped}>
    <button type="button" ref={front} className="recipe-flip-trigger" aria-expanded={flipped} aria-controls={id}
     aria-label={`${language==='zh'?drink.zh:drink.name} · ${t('翻看这杯酒的故事')}`}
     onClick={()=>{setRevealed(true);onFlip();}}>
     <span className="eyebrow">THE RECIPE / {t(drink.base)}</span>
     {art}
     <span className="recipe-script">A sip to remember.</span>
     <span className="story-flip-hint"><RotateCw size={15} aria-hidden="true"/>{t('点击酒卡，翻看故事')}</span>
    </button>
   </div>
   <div id={id} className="recipe-flip-face recipe-flip-back" aria-hidden={!flipped} inert={!flipped}
    onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onBack();}}}>
    <div className="recipe-flip-back-top"><span className="eyebrow"><BookOpen size={13} aria-hidden="true"/> BEHIND THE SIP</span>
     <button type="button" ref={back} className="story-back-button" aria-label={t('关闭故事，返回酒卡')} onClick={onBack}><X size={15} aria-hidden="true"/>{t('返回酒卡')}</button>
    </div>
    <h3 className="recipe-flip-name">{drink.name}</h3>
    <div className="recipe-flip-story-scroll" tabIndex={flipped?0:-1}>
     {(flipped||revealed)&&<Suspense fallback={<p className="story-loading" role="status">{t('故事加载中…')}</p>}><RecipeStory drinkId={drink.id}/></Suspense>}
    </div>
   </div>
  </div>
 </div>;
}

import { useEffect, useId, useRef, useState } from 'react';
import { missingIngredients, type Cocktail } from './data';
import { useI18n } from './i18n';
import './recipe-extras.css';

export function MissingIngredients({ drink, cabinet }: { drink:Cocktail; cabinet:string[] }) {
 const { language, t } = useI18n();
 const missing=missingIngredients(drink,cabinet);
 const [hovered,setHovered]=useState(false);
 const [pinned,setPinned]=useState(false);
 const open=hovered||pinned;
 const close=()=>{setHovered(false);setPinned(false);};
 const root=useRef<HTMLDivElement>(null);
 const id=useId();
 useEffect(()=>{
  if(!open)return;
  const dismiss=(event:PointerEvent)=>{
   if(!root.current?.contains(event.target as Node)){setHovered(false);setPinned(false);}
  };
  document.addEventListener('pointerdown',dismiss);
  return()=>document.removeEventListener('pointerdown',dismiss);
 },[open]);
 if(!missing.length)return <span className="match-badge ready">{t('✓ 现在能调')}</span>;
 const label=language==='zh'?`还差 ${missing.length} 种材料`:`${missing.length} missing`;
 return <div className="missing-materials" ref={root}
  onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered(true);}}
  onPointerLeave={event=>{if(event.pointerType==='mouse')setHovered(false);}}
  onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))close();}}
  onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close();}}}>
  <button type="button" className="match-badge" aria-expanded={open} aria-controls={id}
   aria-label={`${drink.name} · ${label}`} onClick={()=>setPinned(value=>!value)}>{label}</button>
  <ul id={id} className="missing-materials-list" tabIndex={0} aria-label={t('还需要准备')} hidden={!open}>
   {missing.map(item=><li key={item.name}>{t(item.name)}</li>)}
  </ul>
 </div>;
}

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { flowForTilt, scrollPourState } from './mix-utils';

/** Scroll scrubbing on desktop; intent-aware horizontal dragging on touch layouts. */
export function usePourController(desktop: boolean, reduced: boolean, stage: RefObject<HTMLDivElement | null>) {
 const [progress, setProgress] = useState(0);
 const [tilt, setTilt] = useState(0);
 const [dragging, setDragging] = useState(false);
 const progressRef = useRef(0);
 const rateRef = useRef(0);
 const gesture = useRef<{id:number;x:number;y:number;active:boolean}|null>(null);
 const rate = flowForTilt(tilt);
 const running = !desktop && rate > 0 && progress < 100;
 rateRef.current = rate;

 useEffect(() => {
  if (!desktop) return;
  let frame = 0;
  const update = () => {
   frame = 0;
   const hero = stage.current?.closest('.hero');
   if (!hero) return;
   const top = hero.getBoundingClientRect().top + window.scrollY;
   const range = Math.max(240, hero.getBoundingClientRect().height - window.innerHeight + 160);
   const fraction = (window.scrollY - (top - 60)) / range;
   const next = scrollPourState(fraction, reduced);
   progressRef.current = next.progress;
   setProgress(next.progress); setTilt(next.tilt);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  const hero = stage.current?.closest('.hero');
  if (hero) observer.observe(hero);
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  update();
  return () => {
   cancelAnimationFrame(frame); observer.disconnect();
   window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule);
  };
 }, [desktop,reduced,stage]);

 useEffect(() => {
  if (!running) return;
  if (reduced) { progressRef.current = 100; setProgress(100); return; }
  let frame=0;
  let last=performance.now();
  const tick=(now:number)=>{
   const delta=Math.min(50,now-last); last=now;
   const next=Math.min(100,progressRef.current+delta*.042*rateRef.current);
   progressRef.current=next;setProgress(next);
   if(next<100) frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(frame);
 },[running,reduced]);

 useEffect(()=>{
  const stop=()=>{
   if(!desktop&&document.hidden){gesture.current=null;setTilt(0);setDragging(false);}
  };
  document.addEventListener('visibilitychange',stop);
  return()=>document.removeEventListener('visibilitychange',stop);
 },[desktop]);

 const begin=(event:PointerEvent<SVGGElement>)=>{
  if(desktop||event.button!==0||!event.isPrimary)return;
  gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,active:false};
 };
 const move=(event:PointerEvent<HTMLDivElement>)=>{
  const current=gesture.current;
  if(desktop||!current||event.pointerId!==current.id)return;
  const dx=event.clientX-current.x;const dy=event.clientY-current.y;
  if(!current.active){
   // Yield to the browser before capturing a predominantly vertical gesture.
   if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)*1.2){gesture.current=null;return;}
   if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.3)return;
   current.active=true;setDragging(true);
   event.currentTarget.setPointerCapture(event.pointerId);
  }
  if(event.cancelable)event.preventDefault();
  const travel=Math.max(72,(stage.current?.clientWidth??320)*.3);
  setTilt(Math.min(1,Math.abs(dx)/travel));
 };
 const release=(event?:PointerEvent<HTMLDivElement>)=>{
  if(desktop)return;
  if(event&&gesture.current&&event.pointerId!==gesture.current.id)return;
  gesture.current=null;setTilt(0);setDragging(false);
 };
 const keyDown=(event:KeyboardEvent<SVGGElement>)=>{
  if(desktop)return;
  if([' ','Enter','ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
   event.preventDefault();setDragging(true);
   if(event.key==='Home')setTilt(0);
   else if([' ','Enter','End'].includes(event.key))setTilt(1);
   else setTilt(value=>Math.min(1,value+.16));
  }
 };
 const keyUp=(event:KeyboardEvent<SVGGElement>)=>{
  if([' ','Enter','ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
   event.preventDefault();gesture.current=null;setTilt(0);setDragging(false);
  }
 };
 return {progress,tilt,dragging,playing:rate>0&&progress<100&&(!desktop||progress>0),begin,move,release,keyDown,keyUp};
}

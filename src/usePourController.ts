import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { flowForTilt, rightDragTilt } from './mix-utils';

/** Automatic desktop reveal; rightward, intent-aware phone dragging. */
export function usePourController(desktop: boolean, reduced: boolean, stage: RefObject<HTMLDivElement | null>) {
 const [progress, setProgress] = useState(0);
 const [tilt, setTilt] = useState(0);
 const [dragging, setDragging] = useState(false);
 const [visible,setVisible]=useState(!document.hidden);
 const progressRef = useRef(0);
 const rateRef = useRef(0);
 const gesture = useRef<{id:number;x:number;y:number;active:boolean}|null>(null);
 const rate = flowForTilt(tilt);
 const running = !desktop && rate > 0 && progress < 100;
 rateRef.current = rate;

 useEffect(() => {
  if(!desktop||!visible)return;
  if(reduced){progressRef.current=100;setProgress(100);return;}
  let frame=0;let timer=0;
  const initial=progressRef.current;
  const start=()=>{
   const started=performance.now();
   const tick=(now:number)=>{
    const value=Math.min(100,initial+(now-started)/19);
    progressRef.current=value;setProgress(value);
    if(value<100)frame=requestAnimationFrame(tick);
   };
   frame=requestAnimationFrame(tick);
  };
  if(initial===0)timer=window.setTimeout(start,300);else if(initial<100)start();
  return()=>{cancelAnimationFrame(frame);window.clearTimeout(timer);};
 },[desktop,reduced,visible]);

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
   setVisible(!document.hidden);
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
   if(dx<8||dx<Math.abs(dy)*1.3)return;
   current.active=true;setDragging(true);
   event.currentTarget.setPointerCapture(event.pointerId);
  }
  if(event.cancelable)event.preventDefault();
  const rect=stage.current?.getBoundingClientRect();
  const room=rect?rect.right-current.x-8:Infinity;
  setTilt(rightDragTilt(dx,rect?.width??320,room));
 };
 const release=(event?:PointerEvent<HTMLDivElement>)=>{
  if(desktop)return;
  if(event&&gesture.current&&event.pointerId!==gesture.current.id)return;
  gesture.current=null;setTilt(0);setDragging(false);
 };
 const keyDown=(event:KeyboardEvent<SVGGElement>)=>{
  if(desktop)return;
  if([' ','Enter','ArrowRight','Home','End'].includes(event.key)){
   event.preventDefault();setDragging(true);
   if(event.key==='Home')setTilt(0);
   else if([' ','Enter','End'].includes(event.key))setTilt(1);
   else setTilt(value=>Math.min(1,value+.16));
  }
 };
 const keyUp=(event:KeyboardEvent<SVGGElement>)=>{
  if([' ','Enter','ArrowRight','Home','End'].includes(event.key)){
   event.preventDefault();gesture.current=null;setTilt(0);setDragging(false);
  }
 };
 return {progress,tilt,dragging,playing:desktop?visible&&progress>0&&progress<100:rate>0&&progress<100,begin,move,release,keyDown,keyUp};
}

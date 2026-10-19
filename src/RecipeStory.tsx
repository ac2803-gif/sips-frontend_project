import { ArrowUpRight, BookOpen } from 'lucide-react';
import { cocktailStories } from './cocktail-stories';
import { useI18n } from './i18n';
import './recipe-extras.css';

export default function RecipeStory({ drinkId }: { drinkId:string }) {
 const { language,t }=useI18n();
 const story=cocktailStories[drinkId];
 if(!story)return null;
 return <section className="recipe-story" aria-labelledby={`story-${drinkId}`}>
  <div className="recipe-story-heading">
   <h4 id={`story-${drinkId}`}><BookOpen size={15} aria-hidden="true"/>{t('这杯酒的故事')}</h4>
   <span className="story-kind">{t(story.kind==='disputed'?'起源有争议':story.kind==='context'?'名字与风格':'历史与来历')}</span>
  </div>
  <p>{story[language]}</p>
  <div className="story-reading"><span>{t('延伸阅读')}</span>{story.reading.map(reference=><a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer">{t(reference.label)}<ArrowUpRight size={11} aria-hidden="true"/></a>)}</div>
 </section>;
}

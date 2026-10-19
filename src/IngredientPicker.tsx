import { useState } from 'react';
import { Check, Plus, Search, Wine, X } from 'lucide-react';
import { ingredients } from './data';
import { commonIngredients, ingredientCategories, ingredientCategory, normalizeIngredientQuery, type IngredientCategory } from './ingredient-groups';
import { translate, useI18n } from './i18n';
import './ingredient-picker.css';

export function IngredientPicker({ selected, onToggle, onClear }: {
 selected: string[]; onToggle: (name:string) => void; onClear: () => void;
}) {
 const { language, t } = useI18n();
 const [query, setQuery] = useState('');
 const [category, setCategory] = useState<IngredientCategory>('常用材料');
 const [expanded, setExpanded] = useState(false);
 const search = normalizeIngredientQuery(query);
 const matches = search
  ? ingredients.filter(name=>normalizeIngredientQuery(`${name} ${translate(name,'en')}`).includes(search))
  : category==='常用材料' ? commonIngredients
  : ingredients.filter(name=>category==='全部材料'||ingredientCategory(name)===category);
 const knownSelected = selected.filter(name=>ingredients.includes(name));
 const shownSelected = expanded ? knownSelected : knownSelected.slice(0,8);
 return <div className="ingredient-picker">
  <div className="cabinet-heading"><h3><Wine size={18}/>{t('我的材料')}<span>{selected.length} {t('已选')}</span></h3>
   <button type="button" className="text-button" onClick={onClear} disabled={!selected.length}>{t('清空')}</button>
  </div>
  {knownSelected.length>0 ? <div className="selected-ingredients" role="group" aria-label={t('已选材料')}>
   <span className="selected-ingredients-label">{t('已选材料')}</span>
   {shownSelected.map(name=><button type="button" key={name} onClick={()=>onToggle(name)} aria-label={`${t('移除材料')} ${t(name)}`}>{t(name)}<X size={12}/></button>)}
   {knownSelected.length>8&&<button type="button" className="selected-expand" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?t('收起'):`+${knownSelected.length-8} ${t('更多')}`}</button>}
  </div> : <p className="ingredient-intro">{t('从常用材料开始，或搜索你手边的那一瓶。')}</p>}
  <div className="ingredient-search-row">
   <label className="ingredient-search"><Search size={17}/><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={t('搜索全部材料，支持中英文…')} aria-label={t('搜索酒柜材料')}/>
    {query&&<button type="button" onClick={()=>setQuery('')} aria-label={t('清除材料搜索')}><X size={15}/></button>}
   </label>
   <span className="ingredient-result-count" role="status">{language==='zh'?`${matches.length} 种${search?'匹配材料':'材料'}`:`${matches.length} ${search?'matches':'ingredients'}`}</span>
  </div>
  <div className="ingredient-categories" role="group" aria-label={t('材料分类')}>
   {ingredientCategories.map(item=><button type="button" key={item} className={!search&&category===item?'active':''} aria-pressed={!search&&category===item} onClick={()=>{setQuery('');setCategory(item);}}>{t(item)}</button>)}
  </div>
  <div className="ingredient-options" role="group" aria-label={t(search?'材料搜索结果':category)}>
   {matches.map(name=><button type="button" key={name} className={selected.includes(name)?'ingredient selected':'ingredient'} aria-pressed={selected.includes(name)} onClick={()=>onToggle(name)}>{selected.includes(name)?<Check size={14}/>:<Plus size={14}/>} {t(name)}</button>)}
   {matches.length===0&&<div className="ingredient-empty"><Search size={22}/><p>{t('未找到材料')}</p><span>{t('试试英文名，或使用更短的关键词。')}</span></div>}
  </div>
 </div>;
}

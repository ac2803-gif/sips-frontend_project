import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'zh' | 'en';
export const translations: Record<string, string> = {
 '微醺手册':'The cocktail handbook','SIPS 首页':'SIPS home','主导航':'Main navigation',
 '探索配方':'Discover','我的酒柜':'My bar','收藏夹':'Favorites','今晚喝什么':'Find your next sip','切换导航':'Toggle navigation',
 '好的一杯，':'A great drink,','从':'starts with ','好奇心':'curiosity','开始':'',
 '不必是调酒师，也能调出自己的拿手好酒。':'You don’t need to be a bartender to make a great drink.',
 '打开你的酒柜，发现下一杯的灵感。':'Open your bar. Discover your next favorite.',
 '看看我的酒柜能调什么':'What can I make?','经典配方 · 清晰步骤 · 你的调酒第一站':'Classic recipes · Simple steps · Your first sip starts here',
 '慢一点，享受调制的过程。':'Slow down. Enjoy the making.','一点好奇心，':'A little curiosity,','加一点点微醺。':'a little good spirit.',
 '正在倾倒 · 点击暂停':'Pouring · Click to pause','移动鼠标，调一杯好心情':'Move your cursor, pour a little joy','再来一杯 ↺':'Another round ↺',
 '你的酒柜，无限可能':'Your bar. Endless possibilities.','留给下一次的灵感':'Save a little inspiration.','下一杯，想喝点什么？':'What’s your next sip?',
 '勾选手头的材料，看看今晚能调什么。':'Select what you have. Find out what you can make.',
 '喜欢的味道，值得再调一杯。':'A favorite flavor deserves another round.',
 '从一杯经典开始，找到属于你的味道。':'Start with a classic. Find your kind of drink.',
 '我的材料':'My ingredients','已选':'selected','清空':'Clear','只看现在能调的配方':'Only show drinks I can make',
 '按基酒筛选':'Filter by spirit','全部':'All','全部配方':'All recipes','寻找一杯酒…':'Find a cocktail…','搜索配方或材料':'Search recipes or ingredients','筛选':'Filters','风味偏好':'Flavor',
 '金酒':'Gin','朗姆酒':'Rum','龙舌兰':'Tequila','威士忌':'Whiskey','清新酸甜':'Bright & citrusy','清爽气泡':'Fresh & fizzy','苦甜浓郁':'Bold & bittersweet','简单':'Easy','分钟':'min','编辑之选':'Editor’s pick',
 '金巴利':'Campari','甜味美思':'Sweet vermouth','橙子':'Orange','橙味利口酒':'Orange liqueur','青柠汁':'Lime juice','盐':'Salt','白朗姆酒':'White rum','糖浆':'Simple syrup','苏打水':'Soda water','薄荷':'Mint','波本威士忌':'Bourbon','柠檬汁':'Lemon juice','汤力水':'Tonic water','青柠':'Lime','片':'slice / leaf','撮':'pinch',
 '还没有收藏的配方':'Your favorites start here.','暂时没有匹配的配方':'No matching cocktails yet.',
 '点击配方右上角的爱心，把喜欢的味道留下。':'Tap the heart on a recipe to save it for later.',
 '试试其他关键词，或调整材料和筛选条件。':'Try another search or adjust your ingredients and filters.',
 '浏览全部配方':'Explore all recipes','好酒不必复杂，好奇就有可能。':'Good drinks start with a little curiosity.',
 '从整理酒柜开始':'Start with your bar','为每一个想亲手调一杯的你。':'For everyone who wants to mix their own.',
 '享受风味，适量饮酒 · 仅限成年人':'Savor responsibly · Adults only',
 '鸡尾酒配方与调制教学':'Cocktail recipe and mixing guide','关闭配方':'Close recipe','收藏':'Save ','取消收藏':'Unsave ','收藏配方':'Save recipe','已收藏':'Saved',
 '准备材料':'Ingredients','减少份数':'Fewer servings','增加份数':'More servings','调制步骤':'Method',
 '开始分步教学':'Start guided mixing','查看全部步骤':'Show all steps','上一步':'Previous','完成，Cheers!':'Done, cheers!','下一步':'Next',
};
export function translate(text: string, language: Language) {return language === 'zh' ? text : translations[text] ?? text;}
const I18nContext = createContext({language:'zh' as Language,setLanguage:(_language:Language)=>{},t:(text:string)=>text});
export function LanguageProvider({children}:{children:ReactNode}) {
 const [language,setLanguage] = useState<Language>(()=>{try{return localStorage.getItem('sips-language')==='en'?'en':'zh';}catch{return 'zh';}});
 useEffect(()=>{document.documentElement.lang=language==='zh'?'zh-CN':'en';document.title=language==='zh'?'SIPS — 微醺手册':'SIPS — The cocktail handbook';const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute('content',language==='zh'?'SIPS 微醺手册：从你的酒柜出发，发现鸡尾酒配方，跟着步骤调出今晚的第一杯。':'SIPS: discover cocktails from your own bar, explore classic recipes, and mix along step by step.');try{localStorage.setItem('sips-language',language);}catch{/* Keep the switch usable when storage is unavailable. */}},[language]);
 return <I18nContext.Provider value={{language,setLanguage,t:(text)=>translate(text,language)}}>{children}</I18nContext.Provider>;
}
export const useI18n=()=>useContext(I18nContext);
export const recipeEnglish:Record<string,{description:string;tool:string;steps:string[]}>= {
 negroni:{description:'Botanical gin, bittersweet Campari and sweet vermouth find their balance in equal parts. A classic for evenings worth taking slowly.',tool:'Rocks glass · Mixing glass · Bar spoon',steps:['Fill a mixing glass with plenty of ice. Add the gin, Campari and sweet vermouth.','Stir gently with a bar spoon for about 20 seconds, until thoroughly chilled.','Strain into a rocks glass over a large ice cube. Express an orange peel over the drink and use it as a garnish.']},
 margarita:{description:'Bright lime, clean tequila and a little salt on the rim. A classic that brings a hint of sunset and sea breeze to your glass.',tool:'Coupe glass · Cocktail shaker · Strainer',steps:['Rub lime around the rim of a glass, then turn half the rim in salt.','Add tequila, orange liqueur and lime juice to a shaker. Fill with ice.','Shake hard for 12–15 seconds. Strain into the chilled glass and garnish with lime.']},
 mojito:{description:'Mint and lime open up between the bubbles. A cool summer afternoon, no travel required.',tool:'Highball glass · Bar spoon · Muddler',steps:['Add mint and syrup to a highball glass. Press gently to release the aroma without shredding the leaves.','Add white rum and lime juice. Fill with crushed ice and stir gently.','Top with soda water and gently lift with a bar spoon to mix. Garnish with mint and lime.']},
 'whiskey-sour':{description:'Rich bourbon meets fresh lemon. Sweetness and acidity soften its woody notes. This version skips the egg white and keeps all the charm.',tool:'Rocks glass · Cocktail shaker · Strainer',steps:['Pour bourbon, lemon juice and simple syrup into a cocktail shaker.','Add plenty of ice and shake hard for about 15 seconds.','Strain into a rocks glass over fresh ice. Garnish with lemon peel if you like.']},
 daiquiri:{description:'Three ingredients, one beautifully crisp classic. A simple way to get to know a good rum.',tool:'Coupe glass · Cocktail shaker · Strainer',steps:['Chill your glass and add all ingredients to a shaker.','Add ice and shake hard for 12–15 seconds.','Double-strain into the chilled glass and serve immediately.']},
 'gin-tonic':{description:'Juniper meets the gentle bitterness of tonic. An effortless pairing that keeps a simple drink interesting.',tool:'Highball glass · Bar spoon',steps:['Fill a highball glass with ice to chill it thoroughly.','Add gin, then slowly pour chilled tonic water down the inside of the glass.','Stir once gently and garnish with lime. Keep those bubbles alive.']}
};

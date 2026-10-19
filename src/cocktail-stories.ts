import storyData from './cocktail-stories.json';

export type CocktailStory = {
 kind:'history'|'disputed'|'context';
 zh:string;
 en:string;
 reading:{label:string;url:string}[];
};
export const cocktailStories=storyData as Record<string,CocktailStory>;

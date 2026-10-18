export type Ingredient = { name: string; amount: number; unit: string };
export type Cocktail = { id: string; name: string; zh: string; base: string; flavor: string; difficulty: string; minutes: number; color: string; glass: 'coupe' | 'rocks' | 'highball'; description: string; ingredients: Ingredient[]; steps: string[]; tool: string };
const i = (name: string, amount: number, unit = 'ml'): Ingredient => ({ name, amount, unit });
export const cocktails: Cocktail[] = [
{id:'negroni',name:'Negroni',zh:'尼格罗尼',base:'金酒',flavor:'苦甜浓郁',difficulty:'简单',minutes:3,color:'#b84025',glass:'rocks',description:'金酒的草本、金巴利的微苦与甜味美思，在等份之间找到刚刚好的平衡。属于慢慢喝的夜晚。',ingredients:[i('金酒',30),i('金巴利',30),i('甜味美思',30),i('橙子',1,'片')],steps:['在搅拌杯中放入足量冰块，倒入金酒、金巴利和甜味美思。','用吧匙轻柔搅拌约 20 秒，直到酒液充分冰镇。','将酒液滤入放有大冰块的古典杯，用橙皮轻挤释放香气并装饰。'],tool:'古典杯 · 搅拌杯 · 吧匙'},
{id:'margarita',name:'Margarita',zh:'玛格丽特',base:'龙舌兰',flavor:'清新酸甜',difficulty:'简单',minutes:5,color:'#c9d28c',glass:'coupe',description:'明亮的青柠、干净的龙舌兰，还有杯沿的一抹盐。把日落和海风装进一杯经典。',ingredients:[i('龙舌兰',50),i('橙味利口酒',20),i('青柠汁',25),i('盐',1,'撮')],steps:['用青柠擦湿杯沿，在盐碟上轻转，做出半圈盐边。','将龙舌兰、橙味利口酒和青柠汁倒入摇酒壶，加满冰块。','用力摇和 12–15 秒，滤入预先冰镇的杯中，以青柠片装饰。'],tool:'碟形香槟杯 · 摇酒壶 · 滤冰器'},
{id:'mojito',name:'Mojito',zh:'莫吉托',base:'朗姆酒',flavor:'清爽气泡',difficulty:'简单',minutes:5,color:'#c4d394',glass:'highball',description:'薄荷与青柠在气泡间舒展。无需远行，也能享受一个清凉的夏日午后。',ingredients:[i('白朗姆酒',50),i('青柠汁',25),i('糖浆',15),i('苏打水',90),i('薄荷',8,'片')],steps:['将薄荷与糖浆放入高球杯，轻压薄荷释放香气，不要捣碎。','加入白朗姆酒和青柠汁，再加满碎冰，轻轻搅匀。','补入苏打水，用吧匙轻提混合，以薄荷枝和青柠装饰。'],tool:'高球杯 · 吧匙 · 捣棒'},
{id:'whiskey-sour',name:'Whiskey Sour',zh:'威士忌酸',base:'威士忌',flavor:'清新酸甜',difficulty:'简单',minutes:5,color:'#d59536',glass:'rocks',description:'醇厚威士忌遇上鲜柠檬，酸与甜让木质香气更柔和。这一版不加蛋清，也很迷人。',ingredients:[i('波本威士忌',60),i('柠檬汁',25),i('糖浆',20)],steps:['将波本威士忌、柠檬汁和糖浆倒入摇酒壶。','加入足量冰块，用力摇和约 15 秒。','滤入放有新冰块的古典杯，按喜好以柠檬皮装饰。'],tool:'古典杯 · 摇酒壶 · 滤冰器'},
{id:'daiquiri',name:'Daiquiri',zh:'戴基里',base:'朗姆酒',flavor:'清新酸甜',difficulty:'简单',minutes:3,color:'#e5d7a5',glass:'coupe',description:'只用三种材料，便能调出一杯干净利落的经典。好朗姆酒，值得这样被认识。',ingredients:[i('白朗姆酒',60),i('青柠汁',25),i('糖浆',15)],steps:['预先冰镇酒杯，将所有材料倒入摇酒壶。','加入冰块，用力摇和 12–15 秒。','双重过滤到冰镇酒杯中，立即享用。'],tool:'碟形香槟杯 · 摇酒壶 · 滤冰器'},
{id:'gin-tonic',name:'Gin & Tonic',zh:'金汤力',base:'金酒',flavor:'清爽气泡',difficulty:'简单',minutes:2,color:'#d4dfbd',glass:'highball',description:'金酒的杜松香与汤力水的清苦，是最轻松的默契。一杯简单，却从不无聊。',ingredients:[i('金酒',45),i('汤力水',120),i('青柠',1,'片')],steps:['用冰块填满高球杯，让杯壁充分冷却。','倒入金酒，沿杯壁缓缓注入冰镇汤力水。','轻轻搅动一次，以青柠片装饰，保留气泡。'],tool:'高球杯 · 吧匙'}
];
export const ingredients = [...new Set(cocktails.flatMap(c => c.ingredients.map(i => i.name)))];
export const missingIngredients = (c: Cocktail, cabinet: string[]) => c.ingredients.filter(i => !cabinet.includes(i.name));
export function recommendIngredient(cabinet: string[]) {
 return ingredients.filter(i => !cabinet.includes(i)).map(name => ({name, count: cocktails.filter(c => missingIngredients(c,cabinet).length === 1 && missingIngredients(c,cabinet)[0].name === name).length})).sort((a,b) => b.count-a.count).find(i => i.count > 0);
}

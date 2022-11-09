import itemArr from "../bundles/itemArr.js";

// Maximum item count: 20
const buyableItems = itemArr.filter(i => i.shopable);

export default buyableItems;

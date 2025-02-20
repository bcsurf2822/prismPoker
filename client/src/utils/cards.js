const cardImages = import.meta.glob('../assets/decks/default/*.png', { eager: true });


const cardsMap = {};
for (const path in cardImages) {

  const fileName = path.split('/').pop();

  const code = fileName.replace('.png', '');

  cardsMap[code] = cardImages[path].default;
}

export default cardsMap;
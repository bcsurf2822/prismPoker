import blueCardBack from '../../assets/cardBack/blueCard.png';

export default function CardBack() {
  return (
    <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-400 bg-gray-100">
      <img 
        src={blueCardBack} 
        alt="Card Back" 
        className="w-full h-full object-contain opacity-80"
      />
    </div>
  );
}

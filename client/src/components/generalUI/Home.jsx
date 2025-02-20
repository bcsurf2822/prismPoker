import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import aceOfDiamonds from "../../assets/decks/default/AD.png"
import aceOfSpades from "../../assets/decks/default/AS.png"
import cardBack from "../../assets/cardBack/blueCard.png"

export default function Home() {
  const { user, loading, rehydrated } = useSelector((state) => state.auth);
  let navigate = useNavigate();

  useEffect(() => {
    if (rehydrated && !user) {
      navigate("/");
    }
  }, [rehydrated, user, navigate]);

  if (loading || !rehydrated) return <p>Loading...</p>;

  if (!user) return null;
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-50 p-4 border-l-2 border-t-2 border-gray-300 drop-shadow-2xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold mb-8 text-neutral-800"
      >
        Welcome back, {user.username}!
      </motion.h1>


      <div className="flex gap-4">
     
        <div className="w-24 h-36 relative" style={{ perspective: "1000px" }}>
          <AnimatePresence>
            <motion.div
              key="cardBack-AD"
              initial={{ opacity: 1, rotateY: 0 }}
              animate={{ opacity: 0, rotateY: 90 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.5 }}
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={cardBack}
                alt="Card Back"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.75, delay: 1.25 }}
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={aceOfDiamonds}
              alt="Ace of Diamonds"
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        </div>


        <div className="w-24 h-36 relative" style={{ perspective: "1000px" }}>
          <AnimatePresence>
            <motion.div
              key="cardBack-AS"
              initial={{ opacity: 1, rotateY: 0 }}
              animate={{ opacity: 0, rotateY: 90 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.5 }}
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={cardBack}
                alt="Card Back"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.75, delay: 1.25 }}
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={aceOfSpades}
              alt="Ace of Spades"
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
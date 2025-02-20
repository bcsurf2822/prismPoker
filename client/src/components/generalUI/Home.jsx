import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import aceOfDiamonds from "../../assets/decks/default/AD.png"
import aceOfSpades from "../../assets/decks/default/AS.png"

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
    <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-50 p-4">
    {/* Welcome Message */}
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-2xl font-bold mb-8 text-neutral-800"
    >
      Welcome back, {user.username}!
    </motion.h1>

    {/* Card Flip Animation */}
    <div className="flex gap-4">
      {/* Ace of Hearts */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="w-24 h-36 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-neutral-200"
      >
        <img
          src={aceOfDiamonds} // Replace with your Ace of Hearts image path
          alt="Ace of Hearts"
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>

      {/* Ace of Diamonds */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="w-24 h-36 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-neutral-200"
      >
        <img
          src={aceOfSpades}// Replace with your Ace of Diamonds image path
          alt="Ace of Spades"
          className="w-full h-full object-cover rounded-lg"
        />
      </motion.div>
    </div>
  </div>
  );
}

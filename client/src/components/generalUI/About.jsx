

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          About PKR Poker
        </h1>
        <p className="text-lg mb-6">
          PKR Poker is a dynamic online poker application that brings the
          excitement of Texas Hold'em to your fingertips. Enjoy real-time
          gameplay, interactive chat, and smooth animations, all while
          experiencing the thrill of competitive poker.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Features</h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li className="text-lg">
            Join or create games with friends and players worldwide.
          </li>
          <li className="text-lg">
            Real-time game updates powered by WebSockets.
          </li>
          <li className="text-lg">
            Smooth animations and interactive UI using Motion.
          </li>
          <li className="text-lg">
            Accurate betting, state management, and in-game chat.
          </li>
          <li className="text-lg">
            A realistic Texas Hold'em experience with detailed game mechanics.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3">
          Cool Facts about Texas Hold'em
        </h2>
        <p className="text-lg mb-4">
          Texas Hold'em is not only the most popular variant of poker, but it
          also has a rich history and many interesting aspects:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li className="text-lg">
            Originated in Texas in the early 20th century and gained popularity
            in Las Vegas in the 1960s.
          </li>
          <li className="text-lg">
            It is the main event in the World Series of Poker (WSOP), drawing
            millions of players worldwide.
          </li>
          <li className="text-lg">
            Combines skill, strategy, and luck to create a captivating game of
            chance.
          </li>
          <li className="text-lg">
            Has evolved into a global phenomenon with tournaments, cash games,
            and online platforms.
          </li>
        </ul>
      </div>
    </div>
  );
}
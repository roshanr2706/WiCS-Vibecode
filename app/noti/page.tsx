'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const notifications = [
  { text: "You failed the midterm. Your final exam is now worth 670%.", level: 5 },
  { text: "Instructor updated your grade: 49.9% (curve applied).", level: 3 },
  { text: "Final exam posted. Duration: 7 minutes. Questions: 84.", level: 4 },
  { text: "Group project update: All members have left the group.", level: 4 },
  { text: "Assignment deadline moved: Now due 2 hours ago.", level: 5 },
  { text: "Your participation grade has been recalculated: -3%.", level: 2 },
  { text: "New quiz available: Attempts allowed — 0.", level: 5 },
  { text: "Canvas detected academic dishonesty: You blinked suspiciously.", level: 1 },
  { text: "Reminder: Your lab starts in 4 minutes. Campus is 37 minutes away.", level: 4 },
  { text: "New module released: 18 videos, 26 hours total runtime.", level: 3 },
  { text: "Submission failed: Canvas has decided to take a short break.", level: 2 },
  { text: "Due to high class average, difficulty has been increased.", level: 3 },
  { text: "Your prof posted announcement: ‘lol good luck.’", level: 4 },
  { text: "Your assignment received 0%. Marker comment: ‘?’", level: 5 },
  { text: "Peer feedback: ‘This could be better.’", level: 1 },
];

function generateNotification() {
  return notifications[Math.floor(Math.random() * notifications.length)];
}

// Generate a random timestamp within the last 24 hours
function generateRandomTime() {
  const now = new Date();
  const past = new Date(now.getTime() - Math.floor(Math.random() * 24 * 60 * 60 * 1000));
  return past.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function SufferPage() {
  const [items, setItems] = useState<{ id: number; text: string; datetime: string }[]>([]);
  const [heart, setHeart] = useState(20);
  const gradientControls = useAnimation();

  // Continuous “breathing” pulse
  useEffect(() => {
    gradientControls.start({
      opacity: [0.2, 0.4, 0.2],
      transition: { duration: 0.7, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }
    });
  }, [gradientControls]);

  const handleSuffer = () => {
    const notif = generateNotification();
    const newItem = { 
      id: Date.now(), 
      text: notif.text,
      datetime: generateRandomTime() // Random time
    };

    setItems(prev => [newItem, ...prev]);

    setHeart(Math.min(100, 20 + 15)); // constant heartbeat increase
    setTimeout(() => setHeart(20), 1500);

    // Quick spike of the gradient
    gradientControls.start({
      opacity: [0.8, 0.6, 0.8, 0.2],
      transition: { duration: 2.0, ease: 'easeOut' }
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-6 overflow-hidden bg-gray-100">
      {/* Heartbeat radial gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={gradientControls}
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0) 70%, rgba(255,0,0,1) 100%)'
        }}
      />

      {/* Page content */}
      <div className="relative z-10 w-full max-w-2xl p-6 rounded-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-red-600 drop-shadow-lg">
          Canvas Trauma Simulator
        </h1>

        {/* Heart Rate Bar */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-1 drop-shadow-sm">Heart Rate Simulation</p>
          <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              animate={{ width: `${heart}%` }}
              transition={{ type: 'spring', stiffness: 10, damping: 80 }}
            />
          </div>
        </div>

        <button
          onClick={handleSuffer}
          className="w-full bg-red-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-red-700 transition"
        >
          Suffer
        </button>

        <div className="mt-6 space-y-3">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white p-4 rounded shadow flex flex-col hover:shadow-md transition"
              >
                <span className="text-red-600 font-semibold text-sm mb-1">{item.datetime}</span>
                <p className="text-red-600 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

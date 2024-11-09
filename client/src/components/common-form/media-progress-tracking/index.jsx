import { motion } from 'framer-motion'; // Add this import for framer-motion animations
import React, { useEffect, useState } from 'react';

const MediaProgressBar = ({ isMediaUploading, progress }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4 relative overflow-hidden">
      <motion.div
        className="bg-blue-900 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.5, ease: 'easeInOut' },
        }}
      />
      {progress >= 100 && isMediaUploading && (
        <motion.div
          className="absolute    top-0 left-0 right-0 bottom-0 bg-red-600 opacity-50"
          animate={{
            x: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
};

export default MediaProgressBar;

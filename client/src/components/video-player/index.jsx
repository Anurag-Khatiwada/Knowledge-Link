import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Slider } from "@/components/ui/slider";
import { Button } from '../ui/button';
import { Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = ({ width = '100%', height = '100%', url, onProgressUpdate, progressData }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false); 
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef(null);

  const handlePlayAndPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (progress) => {
    if (!seeking) {
      setPlayed(progress.played);
    }
  };
  const handleDuration = (duration) => {
    setPlayed(duration); // Update video duration
  };

  const handleRewind = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime - 10);
  };

  const handleForward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 10);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    if(played===1){
      onProgressUpdate({
        ...progressData,
        progressValue: played
      })
    }
  }, [played]);

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
        ${isFullScreen ? 'w-screen h-screen' : ''}`}
      style={{ width, height }}
    >
      
          <ReactPlayer
            ref={playerRef}
            className='absolute top-0 left-0'
            width={'100%'}
            height={'100%'}
            url={url}
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            controls
          />
          {/* <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4">
            <Slider
              value={[played * 100]} // Wrap in array to satisfy Slider prop requirements
              max={100}
              step={0.1}
              onValueChange={(value) => setPlayed(value[0] / 100)}
              onValueCommit={() => playerRef.current.seekTo(played)}
              className='w-full mb-4'
            />
            <div className='flex items-center justify-between'>
              <Button variant="ghost" size='icon' onClick={handlePlayAndPause}>
                {playing ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
              </Button>
              <Button variant="ghost" size='icon' onClick={handleRewind}>
                <RotateCcw className='h-6 w-6' />
              </Button>
              <Button variant="ghost" size='icon' onClick={handleForward}>
                <RotateCw className='h-6 w-6' />
              </Button>
              <Button variant="ghost" size='icon' onClick={handleToggleMute}>
                {muted ? <VolumeX className='h-6 w-6' /> : <Volume2 className='h-6 w-6' />}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-white">Video URL is not available.</div>
      )} */}
    </div>
  );
};

export default VideoPlayer;

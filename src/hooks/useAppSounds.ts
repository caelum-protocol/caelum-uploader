import useSound from 'use-sound';
import { useSoundEnabled } from '@/context/SoundContext';

/**
 * Central hook for app-wide sounds. Additional sounds for uploads,
 * mint success, shard views, etc. can be added here.
 */
export const useAppSounds = () => {
  const { soundOn } = useSoundEnabled();
  const [playThemeSwitch] = useSound('/sounds/theme-switch.mp3', {
    volume: 0.5,
    preload: true,
    soundEnabled: soundOn,
  });

  return { playThemeSwitch };
};
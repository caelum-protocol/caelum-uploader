import useSound from 'use-sound';

/**
 * Central hook for app-wide sounds. Additional sounds for uploads,
 * mint success, shard views, etc. can be added here.
 */
export const useAppSounds = () => {
  const [playThemeSwitch] = useSound('/sounds/theme-switch.mp3', {
    volume: 0.5,
    preload: true,
  });

  return { playThemeSwitch };
};
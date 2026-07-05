import {Composition} from 'remotion';
import {TyumenIntro} from './TyumenIntro';

export const FPS = 30;
export const INTRO_DURATION_SECONDS = 12;

export const RemotionRoot = () => {
  return (
    <Composition
      id="TyumenIntro"
      component={TyumenIntro}
      durationInFrames={FPS * INTRO_DURATION_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {introShots} from './data/introShots';

const seconds = (value: number, fps: number) => Math.round(value * fps);

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ShotLayer: React.FC<{
  index: number;
  total: number;
}> = ({index, total}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const shot = introShots[index];
  const sceneDuration = durationInFrames / total;
  const start = Math.round(index * sceneDuration);
  const end = Math.round((index + 1) * sceneDuration);
  const fade = seconds(0.55, fps);
  const motionStart = start - fade;
  const motionEnd = end + fade;
  const globalPush = interpolate(frame, [0, durationInFrames], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const scenePush = interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  const opacity = interpolate(
    frame,
    [start - fade, start + fade, end - fade, end + fade],
    [0, 1, 1, 0],
    clamp,
  );

  const scale = interpolate(
    frame,
    [motionStart, motionEnd],
    [shot.fromScale, shot.toScale],
    {
      ...clamp,
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  const x = interpolate(frame, [motionStart, motionEnd], [shot.fromX, shot.toX], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const y = interpolate(frame, [motionStart, motionEnd], [shot.fromY, shot.toY], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill style={{opacity, backgroundColor: '#070b12'}}>
      <Img
        src={staticFile(shot.file)}
        alt={shot.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          scale: scale + globalPush * 0.1 + scenePush * 0.025,
          translate: `${x * 2.1}px ${y * 1.7}px`,
          rotate: `${interpolate(scenePush, [0, 1], [-0.2, 0.2])}deg`,
          filter: `saturate(${1.08 + globalPush * 0.08}) contrast(${1.05 + globalPush * 0.04}) brightness(${0.92 + globalPush * 0.12})`,
        }}
      />
    </AbsoluteFill>
  );
};

const MovingCloudLayer: React.FC<{
  depth: number;
  opacity: number;
  blur: number;
  speed: number;
  top: number;
  scale: number;
}> = ({depth, opacity, blur, speed, top, scale}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const introFade = interpolate(frame, [0, durationInFrames * 0.42, durationInFrames * 0.78], [1, 0.72, 0.15], clamp);
  const x = interpolate(frame, [0, durationInFrames], [-260 * speed, 290 * speed], clamp);
  const y = interpolate(frame, [0, durationInFrames], [top, top + 95 * speed], clamp);
  const cloudScale = interpolate(frame, [0, durationInFrames], [scale, scale + 0.22 + depth * 0.08], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity: opacity * introFade,
        mixBlendMode: 'screen',
        filter: `blur(${blur}px)`,
        scale: cloudScale,
        translate: `${x}px ${y}px`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-28% -22%',
          background:
            'radial-gradient(ellipse at 14% 35%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0) 48%), radial-gradient(ellipse at 45% 52%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.22) 24%, rgba(255,255,255,0) 54%), radial-gradient(ellipse at 78% 42%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.26) 26%, rgba(255,255,255,0) 56%), radial-gradient(ellipse at 57% 82%, rgba(215,232,255,0.48) 0%, rgba(215,232,255,0.18) 24%, rgba(215,232,255,0) 52%)',
        }}
      />
    </AbsoluteFill>
  );
};

const MovingClouds: React.FC = () => {
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <MovingCloudLayer depth={0} opacity={0.42} blur={28} speed={0.55} top={-80} scale={1.2} />
      <MovingCloudLayer depth={1} opacity={0.34} blur={18} speed={0.86} top={60} scale={1.38} />
      <MovingCloudLayer depth={2} opacity={0.23} blur={9} speed={1.28} top={170} scale={1.72} />
    </AbsoluteFill>
  );
};

const TransitionFlares: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const sceneDuration = durationInFrames / introShots.length;
  const pulseWidth = seconds(0.58, fps);
  const pulses = introShots.slice(1).map((_, index) => {
    const cut = Math.round((index + 1) * sceneDuration);
    return interpolate(frame, [cut - pulseWidth, cut, cut + pulseWidth], [0, 1, 0], clamp);
  });
  const amount = Math.max(...pulses, 0);
  const finalPush = interpolate(frame, [durationInFrames - seconds(2.1, fps), durationInFrames - seconds(0.35, fps)], [0, 1], clamp);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          opacity: amount * 0.34 + finalPush * 0.24,
          mixBlendMode: 'screen',
          background:
            'linear-gradient(103deg, rgba(255,255,255,0) 0%, rgba(146,197,253,0.1) 34%, rgba(255,255,255,0.7) 49%, rgba(255,206,128,0.28) 60%, rgba(255,255,255,0) 100%)',
          scale: 1.45,
          translate: `${interpolate(frame, [0, durationInFrames], [-480, 420], clamp)}px 0`,
          rotate: '-9deg',
          filter: 'blur(16px)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: amount * 0.18,
          background:
            'radial-gradient(circle at 52% 48%, rgba(255,255,255,0.62) 0%, rgba(129,190,255,0.26) 14%, rgba(255,255,255,0) 38%)',
          mixBlendMode: 'screen',
          scale: interpolate(amount, [0, 1], [0.72, 1.2], clamp),
          filter: 'blur(12px)',
        }}
      />
    </AbsoluteFill>
  );
};

const SpeedMist: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = interpolate(frame, [0, durationInFrames * 0.22, durationInFrames * 0.7], [0.16, 0.22, 0.06], clamp);
  const drift = interpolate(frame, [0, durationInFrames], [-80, 140], clamp);

  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'screen',
        background:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(225,240,255,0.16) 30%, rgba(255,255,255,0) 62%), repeating-linear-gradient(108deg, rgba(255,255,255,0.18) 0 2px, rgba(255,255,255,0) 2px 58px)',
        translate: `${drift}px 0`,
        filter: 'blur(10px)',
      }}
    />
  );
};

const FilmTexture: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame % 7) * 17;
  const y = (frame % 5) * 23;

  return (
    <AbsoluteFill
      style={{
        opacity: 0.075,
        mixBlendMode: 'overlay',
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.75) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.75) 0 1px, transparent 1px)',
        backgroundSize: '46px 46px, 58px 58px',
        backgroundPosition: `${x}px ${y}px, ${-x}px ${-y}px`,
      }}
    />
  );
};

const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const vignetteOpacity = interpolate(frame, [0, durationInFrames], [0.42, 0.2], clamp);
  const glowOpacity = interpolate(
    frame,
    [0, durationInFrames * 0.55, durationInFrames],
    [0.12, 0.28, 0.5],
    clamp,
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255,255,255,0) 0%, rgba(7,11,18,0) 48%, rgba(7,11,18,0.72) 100%)',
          opacity: vignetteOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(115deg, rgba(93,168,255,0) 0%, rgba(93,168,255,0.18) 42%, rgba(255,207,129,0.2) 100%)',
          mixBlendMode: 'screen',
          opacity: glowOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 72% 12%, rgba(255,238,196,0.34) 0%, rgba(255,214,150,0.18) 15%, rgba(255,214,150,0) 36%)',
          mixBlendMode: 'screen',
          opacity: interpolate(frame, [0, durationInFrames], [0.18, 0.36], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

const InterfaceReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const start = durationInFrames - seconds(2.4, fps);
  const progress = interpolate(frame, [start, durationInFrames - seconds(0.35, fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(progress, [0, 0.28, 1], [0, 0.12, 1], clamp);
  const panelScale = interpolate(progress, [0, 1], [0.86, 1], clamp);
  const panelY = interpolate(progress, [0, 1], [70, 0], clamp);
  const blur = interpolate(progress, [0, 1], [18, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <div
        style={{
          width: 1180,
          height: 640,
          borderRadius: 28,
          overflow: 'hidden',
          background: 'rgba(248,250,252,0.9)',
          boxShadow:
            '0 0 90px rgba(115,185,255,0.44), 0 32px 120px rgba(0,0,0,0.38)',
          scale: panelScale,
          translate: `0 ${panelY}px`,
          filter: `blur(${blur}px)`,
          border: '1px solid rgba(255,255,255,0.7)',
        }}
      >
        <div
          style={{
            height: 78,
            display: 'flex',
            alignItems: 'center',
            padding: '0 34px',
            gap: 16,
            borderBottom: '1px solid rgba(15,23,42,0.08)',
          }}
        >
          <div style={{width: 148, height: 24, borderRadius: 12, background: '#0f172a'}} />
          <div style={{marginLeft: 'auto', width: 120, height: 18, borderRadius: 9, background: '#cbd5e1'}} />
          <div style={{width: 96, height: 18, borderRadius: 9, background: '#cbd5e1'}} />
          <div style={{width: 132, height: 42, borderRadius: 21, background: '#2563eb'}} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 30,
            padding: 38,
          }}
        >
          <div>
            <div style={{width: 520, height: 46, borderRadius: 23, background: '#111827'}} />
            <div style={{width: 430, height: 28, borderRadius: 14, background: '#94a3b8', marginTop: 18}} />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginTop: 38}}>
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  style={{
                    height: 154,
                    borderRadius: 20,
                    background: item === 0 ? '#dbeafe' : '#f1f5f9',
                    boxShadow: '0 14px 28px rgba(15,23,42,0.08)',
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              borderRadius: 24,
              background: 'linear-gradient(135deg, #eff6ff, #ffffff)',
              boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.06)',
              minHeight: 454,
              padding: 24,
            }}
          >
            <div style={{height: 250, borderRadius: 20, background: '#bfdbfe'}} />
            <div style={{height: 24, width: 300, borderRadius: 12, background: '#1e293b', marginTop: 24}} />
            <div style={{height: 18, width: 230, borderRadius: 9, background: '#94a3b8', marginTop: 14}} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TyumenIntro: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#070b12', opacity: fadeOut}}>
      {introShots.map((_, index) => (
        <ShotLayer key={index} index={index} total={introShots.length} />
      ))}
      <MovingClouds />
      <SpeedMist />
      <Atmosphere />
      <TransitionFlares />
      <FilmTexture />
      <InterfaceReveal />
    </AbsoluteFill>
  );
};

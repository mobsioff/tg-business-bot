import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOGO_ICON = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="14" fill="url(#logoGrad)" />
    <path
      d="M14 17h20M14 24h14M14 31h8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="35" cy="31" r="5" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2" />
    <path d="M37.5 31h-5M35 28.5v5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5b6ef5" />
        <stop offset="1" stopColor="#a87ff5" />
      </linearGradient>
    </defs>
  </svg>
);

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    // Simulate loading: fast at first, then completes
    const steps = [
      { target: 30, delay: 100, duration: 300 },
      { target: 65, delay: 400, duration: 500 },
      { target: 85, delay: 900, duration: 300 },
      { target: 100, delay: 1300, duration: 400 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach(({ target, delay, duration }) => {
      const t = setTimeout(() => {
        const startTime = Date.now();
        const startProgress = progress;
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const ratio = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - ratio, 3);
          setProgress(startProgress + (target - startProgress) * eased);
          if (ratio < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }, delay);
      timers.push(t);
    });

    const doneTimer = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 600);
    }, 1800);
    timers.push(doneTimer);

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <motion.div
          key="loader"
          style={styles.container}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background orbs */}
          <div style={styles.orb1} />
          <div style={styles.orb2} />

          {/* Noise overlay */}
          <div style={styles.noise} />

          {/* Content */}
          <motion.div
            style={styles.content}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              style={styles.logoWrap}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {LOGO_ICON}
            </motion.div>

            <motion.h1
              style={styles.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              SavedBot
            </motion.h1>

            <motion.p
              style={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Message Archive Dashboard
            </motion.p>

            {/* Progress bar */}
            <motion.div
              style={styles.progressWrap}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
            >
              <div style={styles.progressTrack}>
                <motion.div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                  }}
                />
                <div style={{ ...styles.progressGlow, left: `${progress}%` }} />
              </div>
              <div style={styles.progressLabel}>
                {progress < 100 ? 'Loading…' : 'Ready'}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: '#08080e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 360,
    height: 360,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(91,110,245,0.18) 0%, transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    bottom: '10%',
    right: '15%',
    width: 280,
    height: 280,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,127,245,0.12) 0%, transparent 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  noise: {
    position: 'absolute',
    inset: 0,
    opacity: 0.025,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px',
    pointerEvents: 'none',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '0 32px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  logoWrap: {
    marginBottom: 8,
    filter: 'drop-shadow(0 0 24px rgba(91,110,245,0.4))',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#f0f0f8',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.8125rem',
    color: '#8888aa',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 500,
    marginTop: 2,
  },
  progressWrap: {
    marginTop: 32,
    width: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 99,
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    background: 'linear-gradient(90deg, #5b6ef5, #a87ff5)',
    transition: 'width 0.15s ease-out',
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#a87ff5',
    boxShadow: '0 0 8px 3px rgba(168,127,245,0.7)',
    transition: 'left 0.15s ease-out',
  },
  progressLabel: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.75rem',
    color: '#55556b',
    letterSpacing: '0.04em',
  },
};

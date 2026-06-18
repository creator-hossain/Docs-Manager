import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle 
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Focus states for input labels
  const [userFocused, setUserFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Mouse coordinate tracker for background glow flare
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Refs for canvas and interactive elements
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Typing animation state variables
  const phrases = [
    "Welcome to Garir Dokan Imports...",
    "Manage Your Documents Safely...",
    "Verify Authenticated Cargo Sheets...",
    "Automotive Legacy, Secured.",
  ];
  const [displayedText, setDisplayedText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Trigger typing loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleType = () => {
      const currentPhrase = phrases[phraseIdx];
      if (!isDeleting) {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        setTypingSpeed(100);

        if (displayedText === currentPhrase) {
          // Pause before deleting
          setTypingSpeed(2500);
          setIsDeleting(true);
        }
      } else {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        setTypingSpeed(50);

        if (displayedText === '') {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(500);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIdx]);

  // Track mouse position over the screen for ambient neon glare
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // HTML5 Interactive Canvas particle mesh background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 60;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Fill initial particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    const mouseRef = { x: -1000, y: -1000 };
    const handleCanvasMouseMove = (e: MouseEvent) => {
      mouseRef.x = e.clientX;
      mouseRef.y = e.clientY;
    };

    window.addEventListener('mousemove', handleCanvasMouseMove);

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections first for optimized rendering
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            // Crimson Red neon tint line connecting nodes
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update isolated nodes
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Soft red-glow nodes
        ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
        ctx.fill();

        // Basic physics translation
        p.x += p.vx;
        p.y += p.vy;

        // Subtle attraction to mouse cursor if close
        if (mouseRef.x > 0 && mouseRef.y > 0) {
          const mdx = mouseRef.x - p.x;
          const mdy = mouseRef.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 220) {
            // Apply slight gravitational pull
            p.x += mdx * 0.001;
            p.y += mdy * 0.001;
          }
        }

        // Screen boundary rebound checks
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, []);

  // Form submission authentication check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsShaking(false);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please supply username and passcode.');
      setIsShaking(true);
      return;
    }

    setIsLoading(true);

    // Simulated short timeout for premium loading state feedback
    setTimeout(() => {
      if (username === 'garir_dokan' && password === 'garirdokan07') {
        setIsSuccess(true);
        setIsLoading(false);
        sessionStorage.setItem('gd_auth', 'true');
        
        // Timeout to admire the gorgeous complete state
        setTimeout(() => {
          onLoginSuccess();
        }, 1300);
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid authorization credentials.');
        setIsShaking(true);
        
        // Reset shake state after it finishes playing
        setTimeout(() => {
          setIsShaking(false);
        }, 600);
      }
    }, 1200);
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-[#070708] flex items-center justify-center overflow-hidden font-sans selection:bg-red-700 selection:text-white"
    >
      {/* Styles embedded inline for shake and dynamic classes */}
      <style>{`
        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-8px); }
          30%, 60%, 90% { transform: translateX(8px); }
        }
        .shake-active {
          animation: loginShake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .crimson-glow-ring {
          box-shadow: 0 0 40px rgba(185, 28, 28, 0.25), inset 0 0 15px rgba(185, 28, 28, 0.1);
        }
        .crimson-logo-glow {
          text-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
        }
        .pulse-light {
          animation: pulseFade 2s infinite alternate;
        }
        @keyframes pulseFade {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* HTML5 Canvas interactive background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0" 
      />

      {/* Dynamic Cursor Flare Overlay */}
      <div 
        className="hidden md:block pointer-events-none absolute w-[450px] h-[450px] bg-red-700/[0.04] blur-[130px] rounded-full z-0 transition-opacity duration-700"
        style={{
          left: `${mousePos.x - 225}px`,
          top: `${mousePos.y - 225}px`,
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center">
        
        {/* Animated Brand Header */}
        <div className="mb-8 text-center select-none animate-in">
          <div className="relative inline-flex items-center justify-center mb-5 group">
            {/* Hexagonal Crimson Red Border Frame */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-700 to-red-950 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-16 h-16 bg-[#0c0c0f] rounded-2xl flex items-center justify-center border border-white/5 shadow-xl transition-all">
              <span className="text-white font-extrabold text-2xl tracking-tighter">
                GD
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-white uppercase crimson-logo-glow">
            GARIR <span className="text-red-700">DOKAN</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mt-1">
            IMPORTS & DOCUMENT LOGISTICS
          </p>

          {/* Typing Terminal Feed Column */}
          <div className="mt-4 h-6 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-[#b91c1c] tracking-wide relative">
              {displayedText}
              <span className="ml-[2px] w-[5px] h-[14px] bg-red-700 inline-block animate-pulse align-middle" />
            </span>
          </div>
        </div>

        {/* glassmorphism Card */}
        <div 
          id="login-card"
          className={`w-full bg-[#0a0a0c]/85 border border-white/5 rounded-3xl p-8 backdrop-blur-2xl crimson-glow-ring transition-all duration-500 relative overflow-hidden ${
            isShaking ? 'shake-active' : ''
          } ${isSuccess ? 'scale-[0.96] opacity-90' : ''}`}
        >
          {/* Card subtle scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(to_bottom,transparent_50%,#fff_50%)] bg-[length:100%_4px]" />

          {/* Top Border Red Line Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

          {/* Dynamic inner loading or lock icon when validation completes */}
          {isSuccess && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-40 transition-all duration-300">
              <div className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-full flex items-center justify-center text-red-500 animate-bounce mb-4 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.4em] text-white">
                Access Granted
              </p>
              <p className="text-[9px] font-mono text-gray-500 mt-2">
                Routing credentials to control matrix...
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#d1d5db]">
                Secure Entry Portal
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-900/30 px-2.5 py-0.5 rounded-full">
              <span className="text-[8px] font-bold tracking-wider uppercase text-red-500 font-mono">
                ADMIN_SYS
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input Field */}
            <div className="relative group/field">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <User className={`w-4 h-4 transition-colors duration-300 ${
                  userFocused || username ? 'text-red-500' : 'text-gray-500'
                }`} />
              </div>
              
              <input
                id="username-input"
                type="text"
                autoComplete="off"
                className={`w-full bg-[#0c0c10] text-[#f3f4f6] text-sm font-bold pl-11 pr-4 py-4 rounded-xl border outline-none transition-all duration-300 placeholder-transparent ${
                  username 
                    ? 'border-red-900/40 focus:border-red-600' 
                    : 'border-white/5 focus:border-red-800/40'
                }`}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setUserFocused(true)}
                onBlur={() => setUserFocused(false)}
                disabled={isLoading || isSuccess}
              />
              
              <label 
                htmlFor="username-input"
                className={`absolute left-11 transition-all duration-300 pointer-events-none origin-left ${
                  userFocused || username
                    ? 'top-[-10px] text-[10px] bg-[#0c0c0f] px-2 text-red-500 font-black tracking-widest uppercase scale-90'
                    : 'top-4 text-sm text-gray-500 font-bold'
                }`}
              >
                Username
              </label>
            </div>

            {/* Password Input Field */}
            <div className="relative group/field">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Lock className={`w-4 h-4 transition-colors duration-300 ${
                  passwordFocused || password ? 'text-red-500' : 'text-gray-500'
                }`} />
              </div>

              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className={`w-full bg-[#0c0c10] text-[#f3f4f6] text-sm font-bold pl-11 pr-12 py-4 rounded-xl border outline-none transition-all duration-300 placeholder-transparent ${
                  password 
                    ? 'border-red-900/40 focus:border-red-600' 
                    : 'border-white/5 focus:border-red-800/40'
                }`}
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                disabled={isLoading || isSuccess}
              />

              <label 
                htmlFor="password-input"
                className={`absolute left-11 transition-all duration-300 pointer-events-none origin-left ${
                  passwordFocused || password
                    ? 'top-[-10px] text-[10px] bg-[#0c0c0f] px-2 text-red-500 font-black tracking-widest uppercase scale-90'
                    : 'top-4 text-sm text-gray-500 font-bold'
                }`}
              >
                Passcode
              </label>

              {/* Password visibility toggle */}
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-red-500 transition-colors"
                  disabled={isLoading || isSuccess}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Red Alert Banner on Error */}
            {errorMsg && (
              <div className="bg-red-950/30 border border-red-900/40 p-4 rounded-xl flex items-start gap-3 animate-in shadow-inner">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-red-400 tracking-wide">
                    Authentication Failure
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-1">
                    {errorMsg}
                  </p>
                </div>
              </div>
            )}

            {/* Custom styled submit button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full relative py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] text-white flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 overflow-hidden group/btn ${
                isLoading 
                  ? 'bg-red-850/60 cursor-not-allowed shadow-none' 
                  : 'bg-red-700 hover:bg-gradient-to-r hover:from-red-800 hover:to-red-600 active:scale-98 shadow-red-700/10 hover:shadow-red-700/20'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Validating Key...</span>
                </>
              ) : (
                <>
                  <span>Initialize Connection</span>
                  <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Warning Footer Detail */}
        <div className="mt-8 text-center select-none opacity-50 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest font-mono">
            Encrypted tunnel TLS AES-256
          </span>
        </div>
      </div>
    </div>
  );
};

// BannerSlider.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";

const BannerSlider = ({ slides = [], autoPlayMs = 3000, className = "" }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const hoverRef = useRef(false);
  const touchStartX = useRef(null);

  const go = useCallback(
    (dir) => {
      setIndex((prev) => {
        const next = (prev + dir + slides.length) % slides.length;
        return next;
      });
    },
    [slides.length]
  );

  useEffect(() => {
    if (!slides.length) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!hoverRef.current) go(1);
    }, autoPlayMs);
    return () => clearInterval(timerRef.current);
  }, [slides.length, autoPlayMs, go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      go(delta < 0 ? 1 : -1);
      touchStartX.current = null;
    }
  };
  const onTouchEnd = () => (touchStartX.current = null);

  if (!slides.length) return null;

  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Banner slider"
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="min-w-full h-[42vh] sm:h-[52vh] md:h-[62vh] lg:h-[72vh] relative"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <img
              src={s.image}
              alt={s.alt || s.title || `Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />

            {(s.title || s.subtitle || s.ctaText || s.kicker) && (
              <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center">
                  <div className="mx-auto inline-block text-left sm:text-center rounded-2xl bg-white/8 backdrop-blur-sm ring-1 ring-white/15 px-4 py-4 sm:px-6 sm:py-6">
                    {s.kicker && (
                      <div className="mb-2 inline-block rounded-full bg-white/12 px-3 py-1 text-[10px] sm:text-xs uppercase tracking-widest text-blue-200 ring-1 ring-white/20">
                        {s.kicker}
                      </div>
                    )}
                    {s.title && (
                      <h2 className="text-white drop-shadow-md text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-center">
                        {s.title}
                      </h2>
                    )}
                    {s.subtitle && (
                      <p className="mt-3 text-white/90 drop-shadow text-sm sm:text-base md:text-lg leading-relaxed text-center">
                        {s.subtitle}
                      </p>
                    )}
                    {s.ctaText && (
                      <div className="mt-5 flex justify-center">
                        <a
                          href={s.ctaHref || "#"}
                          className="group inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 md:px-6 md:py-3 font-semibold shadow-lg shadow-black/20 ring-1 ring-white/30 backdrop-blur transition"
                        >
                          {s.ctaText}
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 md:w-5 md:h-5 translate-x-0 group-hover:translate-x-0.5 transition"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 hover:bg-black/60 p-2 text-white shadow-md ring-1 ring-white/20 backdrop-blur transition"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M15 18l-6-6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 hover:bg-black/60 p-2 text-white shadow-md ring-1 ring-white/20 backdrop-blur transition"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full ring-1 ring-white/40 transition-all ${
              i === index
                ? "w-7 bg-white shadow-sm"
                : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerSlider;

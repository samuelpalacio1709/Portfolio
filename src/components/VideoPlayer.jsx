import { useEffect, useRef } from 'react';
import gsap from 'gsap';
export function VideoPlayer({ src, OnVideoShown }) {
  const videoRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const srcRef = useRef('');
  function handleKeyPress(e) {
    if (e.key === 'Escape' && srcRef.current != '') {
      OnVideoShown('');
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    videoRef.current.addEventListener('mousedown', () => {
      if (srcRef.current != '') {
        OnVideoShown('');
      }
    });
  }, []);

  function hidePanel() {
    gsap.to(videoRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(videoRef.current, { x: -2000, delay: 0.5, duration: 0 });
    gsap.to(videoPlayerRef.current, { x: -30, opacity: 0, duration: 0.5 });
  }
  function showPanel() {
    gsap.to(videoRef.current, { opacity: 1, duration: 0.4 });
    gsap.to(videoRef.current, { x: 0, duration: 0 });
    gsap.to(videoPlayerRef.current, { x: 0, opacity: 1, duration: 0.4, delay: 0.4 });
  }
  useEffect(() => {
    if (videoRef.current && videoPlayerRef.current) {
      if (src === '') {
        hidePanel();
      } else {
        showPanel();
      }
    }
    srcRef.current = src;
  }, [src]);

  return (
    <div ref={videoRef} className="video-player align-center">
      <div ref={videoPlayerRef} className="video-container ">
        <iframe
          src={src}
          title="Video Showcase"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <div
          className="close-button"
          onClick={() => {
            OnVideoShown('');
          }}
        >
          <h5>Close</h5>
        </div>
      </div>
    </div>
  );
}

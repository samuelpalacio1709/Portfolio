export function VideoPlayer() {
  return (
    <div className="video-player align-center">
      <div className="video-container ">
        <iframe
          src="https://www.youtube.com/embed/ZiqQ_eK0oqE?si=rAARPGa5paoF4YUr"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
}

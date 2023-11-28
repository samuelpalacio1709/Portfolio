import '../styles/Card.css';
export function Card({ project, OnVideoShown }) {
  return (
    <div className="card">
      <div className="card-inside">
        <div className="top-bar">
          <div className="tools">
            {project.tools.map((tool, index) => {
              return <Tool key={index} dsc={tool} />;
            })}
          </div>
        </div>
        <div className="showcase">
          <div className="showcase-video">
            <div className="project-video align-center">
              <div
                className="button-img"
                onClick={() => {
                  OnVideoShown(project.videoLink);
                }}
              >
                <img className="project-img align-center" src={project.img} alt={project.title} />
              </div>
              <div className="expand-video">
                <h5>Click to watch video</h5>
              </div>
            </div>
            <div className="project-links">
              {project.links.map((link, index) => {
                return <Link key={index} link={link} />;
              })}
            </div>
          </div>
          <div className="showcase-dsc">
            <p>{project.description}</p>
          </div>
        </div>
      </div>
      <div className="title">
        <h2>{project.title}</h2>
      </div>
    </div>
  );
}

export function Tool({ dsc }) {
  return (
    <div className="tool">
      <p>{dsc}</p>
    </div>
  );
}

export function Link({ link }) {
  return (
    <div className="link align-center">
      <a target="new" href={link.href}>
        <p>{link.name}</p>
      </a>
    </div>
  );
}

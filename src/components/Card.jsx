export function Card({ project }) {
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
          <div className="project-video align-center">
            <div className="button-img">
              <img className="project-img align-center" src={project.img} alt={project.title} />
            </div>
          </div>
          <div className="project-links"></div>
        </div>
      </div>
      <div className="title ">
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

import '../styles/About.css';

export function About({ sectionRef }) {
  return (
    <section className=" section" ref={sectionRef}>
      <div className="about">
        <div className="about-me" style={{ zIndex: 10 }}>
          <h2>About me</h2>
          <br />
          <p>
            I am an <strong>Engineer in Design of Digital Entertainment </strong> based in Colombia
            with a strong passion and skills in{' '}
            <strong className="strong"> game and interactive web development.</strong> <br /> <br />
            I love creating interactive and cool experiences <br /> like this.
          </p>
        </div>
        <br /> <br />
        <div className="skills" style={{ zIndex: 10 }}>
          <h2>Skills</h2>
          <br />
          <p>Game Development</p>
          <p>XR Development</p>
          <p>Front-End Development</p>
          <p>3D Modeling</p>
        </div>
      </div>
    </section>
  );
}

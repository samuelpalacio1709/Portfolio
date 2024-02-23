import '../styles/About.css';

export function About({ sectionRef }) {
  return (
    <section className=" section" ref={sectionRef}>
      <div className="about">
        <div className="about-me">
          <h2>About me</h2>
          <br />
          <p>
            I am an Engineer in Design of Digital Entertainment based in Colombia with a strong
            passion and skills in game and interactive web development. <br /> <br />I love creating
            interactive and cool experiences like this.
          </p>
        </div>
        <br /> <br />
        <div className="skills">
          <h2>Skills</h2>
          <br />
          <p>Game Development</p>
          <p>Front-End Development</p>
          <p>3D Modeling</p>
        </div>
      </div>
    </section>
  );
}

import '../styles/Work.css';
import { info } from '../information';
import { Card } from './Card';
export function Work({ sectionRef }) {
  return (
    <section className="work section" ref={sectionRef}>
      <div className="showcase-work">
        <div className="control">
          <div className="control-project">
            <img className="left-arrow" src="assets/imgs/Arrow_L.png" alt="Arrow" />
          </div>
        </div>
        <div className="cards-content">
          {info.map((item, index) => {
            return <Card key={index} project={item} />;
          })}
        </div>
        <div className="control">
          <div className="control-project">
            <img className="rigth-arrow" src="assets/imgs/Arrow_R.png" alt="Arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}

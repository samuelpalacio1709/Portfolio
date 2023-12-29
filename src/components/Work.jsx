import '../styles/Work.css';
import { projectsInfo } from '../information';
import { Card } from './Card';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

export function Work({ sectionRef, OnVideoShown }) {
  // init Swiper:
  const customPrevButton = '<div class="my-swiper-button-prev">Prev</div>';
  const customNextButton = '<div class="my-swiper-button-next">Next</div>';
  return (
    <section className="work section" ref={sectionRef}>
      <div className="showcase-work">
        <div className="control">
          <div className="control-project left-slide">
            <img className="left-arrow" src="assets/imgs/Arrow_L.png" alt="Arrow" />
          </div>
        </div>
        <Swiper
          style={{
            '--swiper-navigation-color': 'var(--green-color)',
            '--swiper-pagination-color': 'var(--green-color)'
          }}
          loop={true}
          slidesPerView={1}
          spaceBetween={0}
          navigation={{
            nextEl: '.rigth-slide',
            prevEl: '.left-slide'
          }}
          modules={[Navigation]}
          breakpoints={{
            950: {
              slidesPerView: 2
            },
            1450: {
              slidesPerView: 3
            }
          }}
          className="mySwiper"
        >
          {projectsInfo.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <Card key={index} project={item} OnVideoShown={OnVideoShown} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="control">
          <div className="control-project rigth-slide">
            <img className="rigth-arrow" src="assets/imgs/Arrow_R.png" alt="Arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}

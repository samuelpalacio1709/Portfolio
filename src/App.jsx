import './App.css';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { info } from './information';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  return (
    <>
      <Header />
      {/* {info.map((item, index) => {
        return <Card key={index} project={item} />;
      })} */}
    </>
  );
}

export default App;

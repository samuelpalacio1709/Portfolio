import './App.css';
import { Header } from './components/Header';
import { Card } from './components/Card';

const projects = [
  {
    title: 'Froggo Jump!',
    tools: ['Unity', 'C#'],
    description: 'Froggo Jump! is a hypercasual game currently available on the Google Store.',
    img: 'assets/imgs/froggo_jump.png'
  }
];

function App() {
  return (
    <>
      <Header />
      {projects.map((item, index) => {
        return <Card key={index} project={item} />;
      })}
    </>
  );
}

export default App;

import { MotionConfig } from 'framer-motion';
import { AmbientBackground } from './components/three/AmbientBackground';
import { Deck } from './components/deck/Deck';
import { SimHarness } from './components/deck/SimHarness';
import { ModelHarness } from './components/deck/ModelHarness';
import { Presenter } from './components/deck/Presenter';

const params = new URLSearchParams(window.location.search);
const simName = params.get('sim');
const modelName = params.get('model');
const isPresenter = params.has('apresentador');
// Prévia do próximo passo na janela do apresentador (iframe): sem o fundo 3D.
const isPreview = params.has('previa');

function App() {
  // Movimento reduzido do sistema vale para toda animação do framer-motion (transform some, opacidade fica).
  return (
    <MotionConfig reducedMotion="user">
      <main className="w-screen h-[100dvh] relative bg-[#04080F] overflow-hidden">
        {isPresenter ? <Presenter /> : (
          <>
            {!isPreview && <AmbientBackground />}
            {modelName ? <ModelHarness name={modelName} /> : simName ? <SimHarness name={simName} /> : <Deck />}
          </>
        )}
      </main>
    </MotionConfig>
  );
}

export default App;

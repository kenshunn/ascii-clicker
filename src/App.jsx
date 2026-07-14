import { useGame, currentChar, clickValue } from './game/useGame'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import BitCounter from './components/BitCounter'
import ClickTarget from './components/ClickTarget'

export default function App() {
  const { state, click } = useGame()

  return (
    <div className="app">
      <Header />
      <div className="body">
        <main className="play-area">
          <BitCounter bits={state.bits} />
          <ClickTarget
            char={currentChar(state)}
            gain={clickValue(state)}
            onClick={click}
          />
        </main>
        <Sidebar />
      </div>
    </div>
  )
}

import {BrowserRouter} from 'react-router-dom';
import Router from './Routes.jsx';
import { WebSocketProvider } from './WebSocketProvider.jsx';
function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
          <Router/>
      </BrowserRouter>
    </WebSocketProvider>
  )
}

export default App;

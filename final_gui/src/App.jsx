import {BrowserRouter} from 'react-router-dom';
import Router from './Routes.jsx';
import { WebSocketProvider } from './WebSocketProvider.jsx';
function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
          <Router/>
      </WebSocketProvider>
    </BrowserRouter>
  )
}

export default App;

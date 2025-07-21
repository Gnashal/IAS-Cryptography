import {Route, Routes} from 'react-router';
import { Dashboard } from './pages/dashboard.jsx';
import { Host } from './pages/host.jsx';
import { Join } from './pages/join.jsx';
function Router() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/host" element={<Host />} />
            <Route path="/join" element={<Join />} />
        </Routes>
    )
}

export default Router;
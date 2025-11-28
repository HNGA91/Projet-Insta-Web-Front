import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Menu from './Composants/Menu.jsx';
import Authentification from './Authentification.jsx';
import Home from './Home.jsx';
import Inscription from './Register.jsx';

function Controller () {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Authentification/>} />
                <Route path="/inscription" element={<Inscription/>} />
            </Routes>

        </BrowserRouter>
    );
}

export default Controller;
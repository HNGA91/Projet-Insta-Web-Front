import './Style/Style.css'
import Header from './Composants/Header.jsx'
import Footer from './Composants/Footer.jsx'
import MenuLateral1 from './Composants/MenuLateral1.jsx';
import MenuLateral2 from './Composants/MenuLateral2.jsx';

function Home () {
    return (
        <>
            <Header/>
            <div className='main-content'>
                <MenuLateral1/>
                <main>

                    <div className="content-section">
                        <h2>Page d'accueil</h2>
                    </div>

                </main>
                <MenuLateral2/>
            </div>
            <Footer/>     
        </>
    );
};

export default Home;
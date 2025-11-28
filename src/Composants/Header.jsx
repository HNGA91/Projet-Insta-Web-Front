import '../Style/Style.css';
import Menu from './Menu';

function Header () {

    return (
    <header className='header'>
        <h1>Bienvenue sur ma page</h1> 
        <Menu/>      
    </header>
    );
}

export default Header
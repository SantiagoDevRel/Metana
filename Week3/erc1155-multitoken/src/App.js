import './App.css';
import Tabs from './components/Tabs';
import { SiGithub } from "react-icons/si";


function App() {
  return (
    <div className='app'>
      <div className='header'>
        <h1>Metana Dapp ERC1155 Minter</h1>
      </div>
      <Tabs />
      <footer><a href='https://github.com/strujilloz/Metana/tree/main/Week3/erc1155-multitoken'><SiGithub /> Santiago Trujillo Zuluaga <SiGithub /> </a></footer>
    </div>
  );
}

export default App;

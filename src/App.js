import logo from './logo.svg';
import './App.css';
import {Home} from './home';
import {Product} from './product';
import {BrowserRouter,Route,Switch,Link} from 'react-router-dom';


function App() {


  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">Product</h3>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul >
          <li className="nav-item- m-1"><Link className="btn btn-light " to="/home">Home</Link></li>
          <li className="nav-item- m-1"><Link className="btn btn-light " to="/product">Product</Link></li>
        </ul>
      </nav>

      <Switch>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/product" component={Product}/>
      </Switch>

    </div>
    </BrowserRouter>
  );
}

export default App;

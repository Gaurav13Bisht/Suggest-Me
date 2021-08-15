
import Movies from './Components/Movies';   // default import
import Home from './Components/Home';
import About from './About';
import Nav from './Components/Nav';

    // synax to impourt react-router-dom
    // {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
    // Router => wrap all the components from Router
    // Switch => when first Component is matched , don't serach for comoponent(exit)
    // Route => to ser Route _________________________________________ syntax
    // <Route path = 'our route' component={which component need to render on screen};
    //  exact => used for matching exact String;    
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
       <Nav/>     {/* to show this component with all other component*/}
     <Switch>
    <Route path = '/' exact component={Home}/>
    <Route path = '/movies'  component={Movies}/>
    {/* to pass props */}
    {/* <Route path='/about' component={About} isAuth={true} /> */}
    <Route path='/about' render={(props)=>(
      <About {...props} isAuth={true}/>
    )}/>

   <Movies/>
   </Switch>
   </Router>
  );
}

export default App;

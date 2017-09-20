import React, { Component } from 'react';
import { render } from 'react-dom';
import Onboard from './onboard.jsx';
import OnboardStep1 from './onboardStep1.jsx';
import OnboardStep2 from './onboardStep2.jsx';
import OnboardTitle from './onboardTitle.jsx';
// Import routing components
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Home extends Component {
    render(){
        return (<div>
                  <div className="logo"></div>
                  <div className="headline">Smart Shopping2.0</div><br/>
                  <div className="description">Say hello to hassle-free shopping! Share your shopping list and cherrypick sets up everything for a fast shopping experience in store!</div>
                  
                  <div className="button-container">
                    {showOnboarding == 'f' ? <a id="cta" href="/fit-profile" className="btn"><span>Tell me how</span></a> : <Link id="cta" to="/onboard" className="btn"><span>Tell me how</span></Link>}
                  </div>
                </div>
          );
    }
}

render(<Router>
        <div>
        <Route exact path="/" component={Home}/>
        <Route path="/onboard" render={()=>(
            <div>
            <OnboardTitle />
            <Route exact path="/onboard" component={Onboard}/>
            <Route exact path="/onboard/step1" component={OnboardStep1}/>
            <Route exact path="/onboard/step2" component={OnboardStep2}/>
          </div>)} />
        </div>
    </Router>, document.getElementById('container'));
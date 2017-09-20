import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';

class OnboardStep2 extends Component {
    componentDidMount(){
      $('.content').fadeOut(0).fadeIn(300);
    }
    render(){
        return (<div className="content"><div style={{fontSize:'20px',textAlign:'center',padding:'0 20px'}}>Visit the store and use cherrypick to shop in a jiffy!</div><br/>
            <img src="../img/step3.png"  width="160px" style={{margin:'0 auto',width:'220px',display:'inherit',padding:'40px'}}/>
            <a href="/share-list" className="btn" style={{margin:'0 auto',zIndex:0}}>
              <span>Get started</span>
            </a>
          </div>
          );
    }
}

export default OnboardStep2;
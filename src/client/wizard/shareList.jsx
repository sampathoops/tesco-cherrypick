import React, { Component } from 'react';
import { render } from 'react-dom';
import CaptureList from './captureList.jsx';
import WizTitle from './wizTitle.jsx';
import Shop from './shop.jsx';
// Import routing components
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
let noteContent = '';

recognition.continuous = true;

class ShareList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      speaking: false
    }

    this.startRecognition = this.startRecognition.bind(this)
    this.stopRecognition = this.stopRecognition.bind(this)
  }
    propTypes: {
      match: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    }
    componentDidMount(){
      console.log('this.props.history:',this.props.history);
      var h = this.props.history;
      window.onCaptureComplete = function() {
        h.push('/share-list/update');
        $('#snap').hide();
      }
    }

    startRecognition(e) {
      this.setState({
        speaking: true
      })
      if (noteContent.length) {
       noteContent += ' ';
      }
      recognition.start();
      setTimeout()
    }

    stopRecognition(e) {
      this.setState({
        speaking: false
      })
      recognition.stop();
      recognition.onresult = function(event) {

      // event is a SpeechRecognitionEvent object.
      // It holds all the lines we have captured so far.
      // We only need the current one.
      var current = event.resultIndex;

      // Get a transcript of what was said.
      var transcript = event.results[current][0].transcript;
      // Add the current transcript to the contents of our Note.
      // There is a weird bug on mobile, where everything is repeated twice.
      // There is no official solution so far so we have to handle an edge case.
      var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

      if (!mobileRepeatBug) {
          noteContent += transcript;
      }
      }

      $.ajax({
        url:"https://api.myjson.com/bins",
        type:"POST",
        data: JSON.stringify({"list": noteContent}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
          console.log(data, textStatus, jqXHR)
        }
      });
      console.log(noteContent)
    }

    render(){
        const { match, location, history } = this.props;
        return (<div>
                <div className="content">
                <div id="selfieMsg">Once your shopping list is ready, tap the below green button.</div>
                  <div><img id="micIcon" src="img/mic.png" style={{width:'85px',marginTop:'80px'}}></img></div>
                  <div className="btn" style={{margin:'0 auto',zIndex:0,marginTop:'100px'}}>
                <span onClick={(e) => this.state.speaking === false ? this.startRecognition(e) : this.stopRecognition(e)}>{this.state.speaking === false ? 'Read out Shopping list' : 'Save shopping list'}</span>
            </div>
                </div>
              </div>
          );
    }
}

var ShareListWithRouter = withRouter(ShareList)

render(<Router>
        <div>
        <Route path="/share-list" render={()=>(
            <div>
            <div className="logo"/>
            <WizTitle />
            <Route exact path="/share-list" component={ShareListWithRouter}/>
            <Route exact path="/share-list/update" component={CaptureList}/>
          </div>)} />
        <Route exact path="/shop" render={()=>(
            <div>
            <div className="logo"/>
            <Route exact path="/shop" component={Shop}/>
          </div>
          )}/>
        </div>
    </Router>, document.getElementById('containerWiz'));

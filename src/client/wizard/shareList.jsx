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
let noteContent = [];
let interval;
//let currentContent = '';

recognition.continuous = false;

class ShareList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      speaking: false,
      start: false,
      result: false
    }

    this.startRecognition = this.startRecognition.bind(this)
    this.stopRecognition = this.stopRecognition.bind(this)
    this.captureVoice = this.captureVoice.bind(this)
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
      // window.self = this;
      // var interval = setInterval(function() {
      //     $('.circle_animation').css('stroke-dashoffset', initialOffset-((i+1)*(initialOffset/time)));
      //     i++;
      //     window.self.captureVoice();
      // }, 2000);
    }

    captureVoice() {
      console.log('captureVoice');
      var that = this;

      //  debugger;
      // $('.circle_animation').css('stroke-dashoffset', initialOffset-((i+1)*(initialOffset/time)));
      // i++;
        recognition.start();

        recognition.onstart = function(event) {
          $('.speak').show();
          $('#micIcon').show();
          $('.result').hide();
        }

        recognition.onresult = function(event) {
          $('.speak').hide();
          $('#micIcon').hide();
          $('.result').show();
          // this.setState({
          //   result: true
          // })
        // debugger;
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
          console.log(transcript)
            noteContent.push(transcript);
            fetch(`https://pixabay.com/api/?key=6502773-b63784a2647c85d2c0d01e277&q=${transcript}&image_type=photo&pretty=true`)
            .then(response => response.json())
            .then(result => {
              $("#result").html(`<img class='searched-image' src=${result.hits[0].previewURL}></img>`);
            })
        }

        // recognition.onend = function(event) {
        //   this.setState({
        //     result: false
        //   })
        // }
        recognition.stop();
    }
  }

    startRecognition(e) {
      console.log('startRecognition');

      this.setState({
        speaking: true
      })

      /* Need initial run as interval hasn't yet occured... */
      //$('.circle_animation').css('stroke-dashoffset', initialOffset-(1*(initialOffset/time)));
      this.captureVoice();
      interval = setInterval(this.captureVoice, 3000);
  }

    stopRecognition(e) {
      $('.speak').hide();
      $('#micIcon').show();
      $('.result').hide();
      recognition.stop();
      clearInterval(interval);

      $.ajax({
        url:"https://api.myjson.com/bins",
        type:"POST",
        data: JSON.stringify({"list": noteContent}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
          sessionStorage.setItem('shopping-list', JSON.stringify(data))
          onCaptureComplete();
        }
      });
    }

    render(){
        const { match, location, history } = this.props;
        return (<div>
                <div className="content">
                <div id="selfieMsg">Once your shopping list is ready, tap the below green button.</div>
                  <div>
                    <img id="micIcon" src="img/mic.png" style={{width:'85px',marginTop:'80px'}}></img>
                    <div className='speak blink'>Speak Now</div>
                  </div>

                <div id='result' className='result'>

                </div>
                  <div className="btn" style={{margin:'0 auto',zIndex:0,marginTop:'100px'}} onClick={(e) => this.state.speaking === false ? this.startRecognition(e) : this.stopRecognition(e) }>
                <span>{this.state.speaking === false ? 'Start' : 'Save'}</span>

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

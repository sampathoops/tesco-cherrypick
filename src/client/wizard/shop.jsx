import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';

class Shop extends Component {

    componentDidMount(){

      let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
      scanner.addListener('scan', function (content) {
        alert(content);

        $('#selfieMsg').html("Welcome to Tesco star daily! Here's your shopping list. Click 'Cherrypick' to begin picking items");
        $('.btn').show();
        
        $.get(JSON.parse(sessionStorage.getItem('shopping-list')).uri, function(data, textStatus, jqXHR) {
            console.log('data: ', data);
            debugger;
              for(var i=0;i<data.list.length;i++){
                debugger;
                fetch(`https://pixabay.com/api/?key=6502773-b63784a2647c85d2c0d01e277&q=${data.list[i]}&image_type=photo&pretty=true`)
                .then(response => response.json())
                .then(result => {
                  debugger;
                  $("#shoppingList").append(`<img class='searched-image-shop' src=${result.hits[0].previewURL}></img>`);
              });

            }
        });

        $('.btn').show();
      });
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 1) {
          scanner.start(cameras[1]);
        } else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });
    }
    render(){
        return (<div className="contentShop" style={{minHeight:'100vh',width:'100%'}}>
          <div id="selfieMsg" style={{width:'300px',margin:'0 auto'}}>Scan the QR code sticker on the shop floor entrance to begin your shopping journey.</div>
          <video id="preview"></video>
          <div id="shoppingList"></div>
          <div className="products">
            <div className="product" id="product">
            </div>
          </div>

          <a className="btn" href="/shop" style={{margin: '24px auto 0px', zIndex: '0',display:'none'}}><span>Cherrypick</span></a>

        <div id="tabs" style={{display:'none',position: 'fixed',width:'100%',top:'0px',left:'0px',height:'70px',textAlign:'center',padding:'22px'}}>


        <div id="tabs-container">
          <ul className="tabs-menu">
              <li className="current"><a href="#tab-1">Item1</a></li>
              <li><a href="#tab-2">Item2</a></li>
              <li><a href="#tab-3">Item3</a></li>
              <li><a href="#tab-4">Item4</a></li>
          </ul>
          <div className="tab">
              <div id="tab-1" className="tab-content">
                 
              </div>
              <div id="tab-2" className="tab-content">
                 
              
              </div>
              <div id="tab-3" className="tab-content">
                  
              </div>
              <div id="tab-4" className="tab-content">
                 
              </div>
          </div>

        </div>
        </div>
        </div>

          );
    }
}

export default Shop;
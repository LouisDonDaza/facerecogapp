import React, { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import Rank from './components/Rank/Rank.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import './App.css';


const particleParam = {
  particles: {
                  number: {
                    value: 30,
                    density:{
                      enable: true,
                      value_area: 800
                    }
                  },
                  line_linked: {
                    shadow: {
                      enable: true,
                      color: "#3CA9D1",
                      blur: 5
                    }
                  }
                }
}
const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedin: false,
  user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
      isSignedin: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
  componentDidMount(){
    fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(console.log)
  }
  calcFaceLocation = (data)=>{
    const clarifaiFace = data;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row *height),
    }
  }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})

  }
  displayFaceBox = (box) => {
    this.setState({box: box})
  }
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response =>{
      if(response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id:this.state.user.id,
          })
        }).then(response=>response.json())
        .then(count=> this.setState(Object.assign(this.state.user, {entries: count})))
        console.log('updated');
      }
      let boxList = [];
      boxList = response.outputs[0].data.regions.map(region => {
        return region.region_info.bounding_box;
      });
      this.displayFaceBox(
        boxList.map(box => {
          return this.calcFaceLocation(box);
        })
        )
    })
    .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if(route === 'signout' || route === 'register'){
      this.setState(initialState)
    }
    else {
      this.setState({isSignedin:true})
    }
    this.setState({route: route});
  }
  render() {
   const {isSignedin, imageUrl, route, box, user} = this.state;
    return (
      <div className="App">
        <Particles className="particles"
              params={particleParam}
            />
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div>
          <Logo/>
          <Rank name={user.name} entries={user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (
          route === "register" ?
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>:
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        )
      }
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props)

    this.state = { 
      storageValue: "", 
      web3: null, 
      accounts: null, 
      contract: null,
      pname: "",
      imgFile: null,
      imgSrc: null,
      dataIsLoaded: "",
      result: null 
    };
    
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  url = 'http://127.0.0.1:5000/predict'

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  insertToBlockchain = async (pred) => {
    const { accounts, contract } = this.state;

    // Stores a given value
    await contract.methods.set(this.state.pname,this.state.result).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    console.log(response)
    // Update state with the result.
    this.setState({ 
      storageValue: response.result,
      dataIsLoaded: pred
     });
  };

  async captureFile (event) {
    event.preventDefault()
    if(event.target.files.length===0)
      return
    const file = event.target.files[0]
    console.log(file.name)
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      alert('Please select an image');
      return
    }
    console.log(file);
    this.setState({imgFile: file, imgSrc: URL.createObjectURL(file)})
  }

  async onSubmit (event) {
    event.preventDefault()
    console.log(event)
    this.setState({pname: event.target[0].value})
    const postData = new FormData();
    postData.append("file", this.state.imgFile)
    await fetch('http://127.0.0.1:5000/predict',
    {
      method: 'POST',
      mode: 'cors',
      body: postData
    }).then(res => 
      res.json()
    ).then(
      data => {
        let pred = data.prediction[1]
        console.log(pred)
        switch(pred){
          case "0": 
            pred="covid-19 positive, needs further diagnosis"
            break; 
          case "1": 
            pred="covid-19 negative, other possible lung infections, needs further diagnosis"
            break;
          case "2": 
            pred="normal, lung not infected"
            break;
          default: 
            console.log(data.prediction)
            this.setState({dataIsLoaded: data.prediction})
            return 
        }
        this.setState({
          result: data.prediction[1]
        })
        this.insertToBlockchain(pred)
      }
    ).catch(error => console.log(error))
    let vacc  
    (event.target[4].checked)? vacc = "Yes" : vacc = "No" 
    const info = {
      "age": event.target[2].value,
      "gender": event.target[1].value.toUpperCase(),
      "location": event.target[3].value,
      "vaccination": vacc,
      "result": this.state.result
    }

    fetch('https://script.google.com/macros/s/AKfycbzAxKPLbdDDHXonrQhinuD6z-fYUCNcWnBEalG10Qdz0wzmn7noiVcVydMUuyyyRBvalg/exec?action=addUser',
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(info)
    }).catch(error => console.log(error))
  }

  render() {
    if (!this.state.web3) {  //(!this.state.web3)
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <header>
        <div id="header-container">
            <h1>COVID-19 PROGNOSIS TOOL</h1>
        </div>
        </header>
        <div id="main-container">
          <div id="top-section-main">
            <div id="top-section-content">
              <form id="main-form" onSubmit={this.onSubmit}>
                <p style={{marginTop:"0"}}>Enter your Name:</p>
                <input type="text" name="pName" placeholder="Name" size="30" required></input>
                <p>Enter your Gender:</p>
                <input type="text" name="pGen" placeholder="Gender" size="30" required></input>
                <p>Enter your Age:</p>
                <input type="number" name="pAge" placeholder="age" required></input>
                <p>Which state are you from?</p>
                <input type="text" name="pLoc" placeholder="State" required></input>
                <p>Vaccinated?</p>
                <input type="radio" id="yes" name="vaccinated" value="Yes"></input>
                <label for="yes">Yes</label>
                <input type="radio" id="no" name="vaccinated" value="No"></input>
                <label for="no">No</label>
                <p>Symptoms</p>
                <input type="checkbox" id="s1" name="symp"></input>
                <label for="s1">No Smell</label>
                <input type="checkbox" id="s2" name="symp"></input>
                <label for="s2">No Taste</label>
                <p>Upload the chest X-Ray:</p>
                <input style = {{marginBottom:"15px", marginRight:"30px"}} type="file" onChange={this.captureFile} name="xrayimg" accept="image/*" required></input>
                <br></br>
                <button type="submit" name="submitBtn">
                Analyze
                </button>
              </form>
            </div>
          </div>
          <div id="bottom-section-main">
            <div id="bottom-section-content">
              <img src = {this.state.imgSrc} alt="Upload a chest X-Ray" width="200" height="200"></img>
              <h3>{this.state.dataIsLoaded}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

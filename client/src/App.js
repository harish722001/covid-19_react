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
      imgFile: null,
      imgSrc: null 
    };
    
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  

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
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set("id5645","positive").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get(3).call();

    // Update state with the result.
    this.setState({ storageValue: response.result });
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

  }

  render() {
    if (this.state.web3) {  //(!this.state.web3)
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
                <p>Enter your Age:</p>
                <input type="number" name="pAge" placeholder="age" step="1" value="0" min="1" max="150" required></input>
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
              <h3>The result will be shown here.</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

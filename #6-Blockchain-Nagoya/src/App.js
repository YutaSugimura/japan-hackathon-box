import React, { Component } from "react";
import "./css/App.css";

import UserTop from './Components/UserTop';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App container">
        <UserTop />
      </div>
    );
  }
}
export default App;

/*
  address: AVhDg6z4umV4u8U6wa7D8jDQ745LLt9LfB //Address (little endian)
  privateKey: c9574d40a5f81d00e792f0a6c9198474b7b11a7ba6e83f4b9d53f38576e457dc
  Wif : L3y6G87B4bURtBC5d8yNd3pquaPzH2ATKmTMJruhncQBVBg6qZjj
  password : aaa 
  publicKey : 02192434e0b56d503a6d79b38187c3e0c7d7c7f206fda9179bfc4b5590d9c2c426
*/
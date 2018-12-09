import React, { Component } from "react";

import {Row, Col, Modal, Input, Button, Card} from 'react-materialize';

import { client } from 'ontology-dapi';
import {
  Crypto, Account, Identity,
  RestClient, Parameter, ParameterType
} from 'ontology-ts-sdk';

class InputPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null, contract: '',
      handleAddress: '', handlePassword: '', file: null, open: false,
      did:'', didPrivateKey: null
    }
    this.handleAddress = this.handleAddress.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    //this.handleFile = this.handleFile.bind(this);
  }
  
  //input 必要情報
  // 生徒のアドレス、　画像のハッシュ値、　日付

  handleAddress = e => {
    this.setState({handleAddress: e.target.value});
  }

  handlePassword = e => {
    this.setState({handlePassword: e.target.value});
  }

  componentDidMount = async() => {
    client.registerClient({});
    const address = await client.api.asset.getAccount();
    const provider = await client.api.provider.getProvider();
    console.log('onGetProvider: ' + JSON.stringify(provider));

    this.connectContract();
    this.connectAccount();
    
    this.putInfoOf = this.putInfoOf.bind(this);
    this.generatedid = this.generatedid.bind(this);
  }

  connectContract = async() => {
    const URL = 'http://polaris1.ont.io:20334';
    const contract = 'f4c029de0779ca64e53646dfb5d3fe1771881d96';
    const restClient = new RestClient(URL);
    const res = await restClient.getContract(contract);
    console.log(JSON.stringify(res));

    this.setState({ contract });
  }

  connectAccount = async() => {
    const WIF = 'L3y6G87B4bURtBC5d8yNd3pquaPzH2ATKmTMJruhncQBVBg6qZjj';
    const privateKey = Crypto.PrivateKey.deserializeWIF(WIF);  //WIF
    const password = "aaa";
    const account = Account.create(privateKey, password);
    
    console.log(`
      account: ${account.address.value},
      privateKey: ${privateKey}
      password: ${password}
    `);
    this.setState({ account });
  }

  // Contract methods
  putInfoOf = async() => {

    const { contract, account, did } = this.state;
    const method = 'PutInfoOf';
    const accounts = new Crypto.Address(account.address.toBase58());
    const parameters = [
      new Parameter('account', ParameterType.ByteArray, accounts.serialize()),
      new Parameter('did', ParameterType.String, did)
    ];
    const gasPrice = '550';
    const gasLimit = '30000';

    const params = { contract, method, parameters, gasPrice, gasLimit }
    const res = await this.scInvoke(params, false);
    console.log(res);
    this.setState({open: false});
  }

  scInvoke = async(params, preExec) => {
    try {
      let result;
      if(preExec) {
         result = await client.api.smartContract.invokeRead(params);       
      } else {
         result = await client.api.smartContract.invoke(params);
      }
      console.log('onScCall finished, result:' + JSON.stringify(result));        
      return result;
    } catch (e) {
      console.log('onScCall error:', e);
      return null;
    }
  }

  // generate DID
  generatedid = async() => {
    const { handlePassword } = this.state;
    const label = 'Graduation certificate';
    const privateKey = Crypto.PrivateKey.random();
    console.log(privateKey);

    let identity = Identity.create(privateKey, handlePassword, label);

    this.setState({ did: identity.ontid, didPrivateKey: privateKey, open: true });
    console.log(identity.ontid);
  }

  /*
  createTransactionDid = async() => {
    const { privateKey, did, account, didPrivateKey } = this.state;

    const pk = didPrivateKey.getPublicKey();
    const gasPrice = '550';
    const gasLimit = '20000';

    const tx = OntidContract.buildRegisterOntidTx(did, pk, gasPrice, gasLimit);
    tx.payer = account.address;
    TransactionBuilder.signTransaction(tx, didPrivateKey);

    const pri = privateKey;
    TransactionBuilder.addSign(tx, pri)
    console.log(tx);

    const rest = new RestClient();
    rest.sendRawTransaction(tx.serialize(), false).then(res => {
      console.log(res);
    })

    this.setState({ tx });
  }
  */


  /*
  handleFile = e => {
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
  

    reader.onload = () => {
      let buf = buffer.Buffer(reader.result);

      ipfs.add(buf, (err, result) => {
        const imageHash = result[0].hash;
        var url = "https://ipfs.io/ipfs/" + imageHash;
      });
    }
    reader.readAsArrayBuffer(file.files[0]);
  }
  */




  render() {
    const { handleAddress, handlePassword, file, open } = this.state;
    return (
      <Row className="center-align">
          <div className="col s8 offset-s2">
            <Col s={12}>
              <h2>学生証</h2>
            </Col>
            <Col s={12}>
              <Input type="text" value={handlePassword} onChange={this.handlePassword} label="password" s={12} />
            </Col>
            <Col s={12}>
              <Button waves='light' onClick={this.generatedid}>発行する</Button>
            </Col>
          </div>

        <Modal className="center-align" open={open}　header='登録'>
          <Col s={12}>
            <Input type="text" value={handleAddress} onChange={this.handleAddress} label="address" s={12} />
          </Col>
          <Col s={12}>
            <Input type="file" label="File" onChange={this.handleFile} vlaue={file} s={12} />
          </Col>
          <Col>
            <Button waves='light' onClick={this.putInfoOf} >発行する</Button>
          </Col>
        </Modal>

      </Row>
    );
  }
}
export default InputPage;
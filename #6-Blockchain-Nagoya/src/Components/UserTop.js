import React, { Component } from "react";
import {Row, Button, CardPanel} from 'react-materialize';
import { client } from 'ontology-dapi';

import {
  Crypto, Account,
  RestClient, Parameter, ParameterType, utils
} from 'ontology-ts-sdk';

class UserTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '', account: null, contract: '',
      type: 'student',did: '確認して下さい',
    }
  }

  componentDidMount = async() => {
    client.registerClient({});
    const result = await client.api.provider.getProvider();
    const address = await client.api.asset.getAccount();
    const network = await client.api.network.getNetwork();
    console.log(JSON.stringify(result));
    console.log(JSON.stringify(address));
    console.log(network);

    this.connectContract();
    this.connectAccount();

    this.GetInfoOf = this.GetInfoOf.bind(this);
  
    this.setState({
      address
    });
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

  GetInfoOf = async() => {
    const { contract, account } = this.state;

    const method = 'GetInfoOf';
    const accounts = new Crypto.Address(account.address.toBase58());
    const parameters = [
      new Parameter('account', ParameterType.ByteArray, accounts.serialize()),
    ];
    const gasPrice = '550';
    const gasLimit = '30000';

    const params = { contract, method, parameters, gasPrice, gasLimit }
    const res = await this.scInvoke(params, true);

    console.log("----"+res)
    // const res1 = JSON.stringify(res)
    // console.log(res1)
    const res2 = utils.hexstr2str(res)
    console.log("*******************" + res2)


    this.setState({did: utils.hexstr2str(res)});
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

  render() {
    return (
      <Row className="top center-align">
        <CardPanel className="">
            <h2>学生証</h2>
            <p>ADDRESS</p>
            <p>{this.state.address}</p>
            <p>{this.state.type}</p>
            <p>{this.state.did}</p>
            <Button onClick={this.GetInfoOf}>学生証を確認する</Button>
        </CardPanel>
        

        
      </Row>
    );
  }
}
export default UserTop;
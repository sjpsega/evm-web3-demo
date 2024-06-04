"use client"
import React, {useState, useEffect} from 'react';
import { ABI } from './constant/abi';
import Web3 from 'web3';
import { RegisteredSubscription } from 'web3-eth';
import { Button } from "./ui/button"

export default function Page() {
  let contractAddress = "0xC4a6441e1c61504B3A6eC4017FaF70b1Ee4435EB"    
  
  const [web3, setWeb3] = useState(null)
  const [address, setAddress] = useState("")
  const [contract, setContract] = useState(null)
  const [balanceOf, setBalanceOf] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    updateData()
  }, [contract, address])

  const updateData = () => {
    if (contract && address) {
      balanceOfHandler()
    }
    if (contract) {
      totalSupplyHandle()
    }
  }

  const connectWallet = async () => {
    if (typeof window !== 'undefineed' && typeof window.ethereum !== "undefined") {
      try {
        setErrorMsg("")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const web3 = new Web3(ethereum)
        setWeb3(web3)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]
        setAddress(address)
  
        connectContract(web3)
      } catch (err) {
        console.error(err)
        setErrorMsg(err.message)
      }
    } else {
      console.error("Please install MetaMask")
      setErrorMsg("Please install MetaMask")
    }
  }

  const connectContract = (web3: Web3<RegisteredSubscription>) => {
    if(web3) {
      let c = new web3.eth.Contract(ABI, contractAddress)
      setContract(c)
    }
  }

  const balanceOfHandler = async () => {
    if (contract && address) {
      const _balanceOf = await contract.methods.balanceOf(address).call()
      const _balanceOfWei = Web3.utils.toWei(_balanceOf, 'wei');
      setBalanceOf(_balanceOfWei)
    } 
  }

  const totalSupplyHandle = async () => {
    if (contract) {
      const _totalSupply = await contract.methods.totalSupply().call();
      const _totalSupplyWei = Web3.utils.toWei(_totalSupply, 'wei');
      setTotalSupply(_totalSupplyWei)
    }
  }

  const mintHandler = async () => {
    try {
      setErrorMsg("")
      const amount = 1
      await contract.methods.mint(address, amount).send({
        from: address
      })
      updateData()
    } catch(err) {
      console.error(err)
      setErrorMsg(err.message)
    } 
  }

  const mintNoCheckHandler = async () => {
    try {
      setErrorMsg("")
      const amount = 1
      await contract.methods.mintNoCheck(address, amount).send({
        from: address
      })
      updateData()
    } catch(err) {
      console.error(err)
      setErrorMsg(err.message)
    } 
  }
  

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          {
          (web3 && address && contract) ? <div className="flex items-center px-4 text-sm bg-blue-100 rounded-lg h-10">connected</div> :
          <Button onClick={connectWallet}>connectWallet</Button>
          }
          <Button onClick={balanceOfHandler}>balanceOf</Button>
          <div>balanceOf：{balanceOf}</div>

          <Button onClick={totalSupplyHandle}>totalSupply</Button>
          <div>totalSupply：{totalSupply}</div>

          <Button onClick={mintHandler}>mint</Button>

          <Button onClick={mintNoCheckHandler}>mintNoCheck</Button>

          <div className="text-red-500">{errorMsg}</div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
        </div>

      </div>
    </main>
  );
}

import { Button, Divider, List } from "antd";
import { useBalance, useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Address, Balance } from "../components";
import humanizeDuration from "humanize-duration";
import { Transactor } from "../helpers";
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ provider, address, gasPrice, readContracts, writeContracts }) {
  const rewardRatePerSecond = useContractReader(readContracts, "Staker", "rewardRatePerSecond");
  // ** keep track of a variable from the contract in the local React state:
  const claimPeriodLeft = useContractReader(readContracts, "Staker", "claimPeriodLeft");
  console.log("⏳ Claim Period Left:", claimPeriodLeft);

  const withdrawalTimeLeft = useContractReader(readContracts, "Staker", "withdrawalTimeLeft");
  console.log("⏳ Withdrawal Time Left:", withdrawalTimeLeft);

  const stakerContractBalance = useBalance(provider, readContracts?.Staker?.address);

  const balanceStaked = useContractReader(readContracts, "Staker", "balances", [address]);
  console.log("address: ", address);
  console.log("balanceStaked: ", balanceStaked);
  const tx = Transactor(provider, gasPrice);

  return (
    <>
      <div style={{ padding: 8, marginTop: 32 }}>
        <div>Staker Contract:</div>
        <Address value={readContracts && readContracts.Staker && readContracts.Staker.address} />
      </div>
      <Divider />
      <div style={{ padding: 8, marginTop: 16 }}>
        <div>Reward Rate Per Second:</div>
        <Balance balance={rewardRatePerSecond} fontSize={64} /> ETH
      </div>
      <Divider />
      <div style={{ padding: 8, marginTop: 16, fontWeight: "bold" }}>
        <div>Claim Period Left:</div>
        {claimPeriodLeft && humanizeDuration(claimPeriodLeft.toNumber() * 1000)}
      </div>
      <Divider />
      <div style={{ padding: 8, marginTop: 16, fontWeight: "bold" }}>
        <div>Withdrawal Period Left:</div>
        {withdrawalTimeLeft && humanizeDuration(withdrawalTimeLeft.toNumber() * 1000)}
      </div>

      <div style={{ padding: 8, fontWeight: "bold" }}>
        <div>Total Available ETH in Contract:</div>
        <Balance balance={stakerContractBalance} fontSize={64} />
      </div>

      <Divider />

      <div style={{ padding: 8, fontWeight: "bold" }}>
        <div>ETH Locked 🔒 in Staker Contract:</div>
        <Balance balance={balanceStaked} fontSize={64} />
      </div>

      <div style={{ padding: 8 }}>
        <Button
          type={"default"}
          onClick={() => {
            tx(writeContracts.Staker.execute());
          }}
        >
          📡 Execute!
        </Button>
      </div>

      <div style={{ padding: 8 }}>
        <Button
          type={"default"}
          onClick={() => {
            tx(writeContracts.Staker.withdraw());
          }}
        >
          🏧 Withdraw
        </Button>
      </div>

      <div style={{ padding: 8 }}>
        <Button
          type={balanceStaked ? "success" : "primary"}
          onClick={() => {
            tx(writeContracts.Staker.stake({ value: ethers.utils.parseEther("0.5") }));
          }}
        >
          🥩 Stake 0.5 ether!
        </Button>
      </div>

      {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

      {/* <div style={{ width: 500, margin: "auto", marginTop: 64 }}>
        <div>Stake Events:</div>
        <List
          dataSource={stakeEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber}>
                <Address value={item.args[0]} ensProvider={mainnetProvider} fontSize={16} /> {"=>"}
                <Balance balance={item.args[1]} />
              </List.Item>
            );
          }}
        />
      </div> */}
    </>
  );
}

export default Home;

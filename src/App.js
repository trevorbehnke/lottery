import "./App.css";
import { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";
import lotteryImg from "./assets/lottery.jpeg";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  // const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    const init = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setContractBalance(balance);
    };
    init();
  }, [players, contractBalance]);

  const submitForm = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setMessage("You have been entered!");
    setValue("");
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    // setCurrentAccount(accounts[0]);
    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  };
  return (
    <div className="bg-gradient-to-r from-green-300 to-purple-400 h-screen scc">
      <div className="bg-white scc p-8 rounded-lg shadow-2xl">
        <img
          src={lotteryImg}
          alt="lottery"
          className=" w-96 rounded-full pb-4"
        />
        {/* <h2>Lottery Contract</h2> */}
        <p>This contract is managed by:</p>
        <span className="font-bold">
          {" "}
          <p>{manager}</p>
        </span>
        <br />
        <p>
          There are currently{" "}
          <span className="font-bold">{players.length} </span> entered,
          competing to win{" "}
          <span className="font-bold">
            {web3.utils.fromWei(contractBalance, "ether")}
          </span>{" "}
          ether!
        </p>
        <br />
        <h4>Want to try your luck?</h4>
        <form onSubmit={submitForm} className="scc">
          <div className="scc">
            <label>Enter more than .01 (Ropsten) ether.</label>
            <input
              style={{ marginLeft: "1vw" }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button style={{ display: "block", marginTop: "1vh" }}>
              Enter
            </button>
          </div>
        </form>

        <br />

        <div className="scc">
          <h4>Ready to pick a winner?</h4>
          <button onClick={onPickWinner}>Pick a winner!</button>
        </div>
        <hr />
        <h2 className="text-green-500">{message}</h2>
      </div>
    </div>
  );
};
export default App;

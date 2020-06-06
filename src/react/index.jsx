const { useState, useContext, useReducer, useRef, useMemo } = React;

const RootData = React.createContext({ name: 'haibo' });

function Button(props) {
  const [count, setCount] = useState(0);
  const ctx = useContext(RootData);
  console.log(ctx);
  return (
    <div>
      <button onClick={props.change}>{props.children}</button>
      <br />
      <button onClick={() => setCount(c => ++c)}>+</button>
      <button onClick={() => setCount(c => --c)}>-</button>
      <p>{count}</p>
      <AddTodo />
    </div>
  );
}

function AddTodo() {
  const textRef = useRef();
  const [data, setData] = useState([]);
  const list = useMemo(() => {
    return data.map((item, index) => <li key={index}>{item.text}</li>);
  }, [data.length]);

  return (
    <div>
      <input ref={textRef} type="text" />
      <ul>{list}</ul>
    </div>
  );
}

class App extends React.Component {
  onChange() {
    console.log('form haibo react');
  }

  render() {
    return (
      <div>
        hello world react
        <Button change={this.onChange}>click</Button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

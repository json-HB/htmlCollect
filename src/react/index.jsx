const { useState, useContext, useReducer, useRef, useMemo, useTransition } = React;

const RootData = React.createContext({ name: 'haibo' });
// const [ignore, forceUpdate] = useReducer(x => x + 1, 0);

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

function reduceFn(state, action) {
  switch (action.type) {
    case 'add':
      return {
        count: state.count + 1,
      };
    case 'decrease':
      return {
        count: state.count - 1,
      };
    default:
      return {
        count: 0,
      };
  }
}

function ReduceDemo() {
  const ctx = useContext(RootData);
  const initFn = n => ({ count: n });
  const [state, dispatch] = useReducer(reduceFn, 0, initFn);
  return (
    <div>
      <h1>{ctx.name}</h1>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'add' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrease' })}>-</button>
    </div>
  );
}

// function Transiton() {
//   const config = useMemo(
//     () => ({
//       timeoutMs: 1000,
//     }),
//     []
//   );
//   const [startTransition, isPending] = useTransition(config);
//   const [value, setValue] = useState(null);
//   return (
//     <>
//       <button
//         disabled={isPending}
//         onClick={() => {
//           startTransition(() => {
//             setTimeout(() => {
//               setValue('haibo');
//             }, 1500);
//           });
//         }}
//       >
//         Next
//       </button>
//       {isPending ? ' 加载中...' : null}
//       <div>{value}</div>
//     </>
//   );
// }

class App extends React.Component {
  onChange() {
    console.log('form haibo react');
  }

  render() {
    return (
      <div>
        hello world react
        <Button change={this.onChange}>click</Button>
        <ReduceDemo />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'), function() {
  console.log('load');
});

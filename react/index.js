"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _React = React,
    useState = _React.useState,
    useContext = _React.useContext,
    useReducer = _React.useReducer,
    useRef = _React.useRef,
    useMemo = _React.useMemo,
    useTransition = _React.useTransition;
var RootData = React.createContext({
  name: 'haibo'
}); // const [ignore, forceUpdate] = useReducer(x => x + 1, 0);

function Button(props) {
  var _useState = useState(0),
      count = _useState[0],
      setCount = _useState[1];

  var ctx = useContext(RootData);
  console.log(ctx);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: props.change
  }, props.children), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setCount(function (c) {
        return ++c;
      });
    }
  }, "+"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setCount(function (c) {
        return --c;
      });
    }
  }, "-"), /*#__PURE__*/React.createElement("p", null, count));
}

function AddTodo() {
  var textRef = useRef();

  var _useState2 = useState([]),
      data = _useState2[0],
      setData = _useState2[1];

  var list = useMemo(function () {
    return data.map(function (item, index) {
      return /*#__PURE__*/React.createElement("li", {
        key: index
      }, item.text);
    });
  }, [data.length]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    ref: textRef,
    type: "text"
  }), /*#__PURE__*/React.createElement("ul", null, list));
}

function reduceFn(state, action) {
  switch (action.type) {
    case 'add':
      return {
        count: state.count + 1
      };

    case 'decrease':
      return {
        count: state.count - 1
      };

    default:
      return {
        count: 0
      };
  }
}

function ReduceDemo() {
  var ctx = useContext(RootData);

  var initFn = function initFn(n) {
    return {
      count: n
    };
  };

  var _useReducer = useReducer(reduceFn, 0, initFn),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, ctx.name), /*#__PURE__*/React.createElement("span", null, state.count), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return dispatch({
        type: 'add'
      });
    }
  }, "+"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return dispatch({
        type: 'decrease'
      });
    }
  }, "-"));
} // function Transiton() {
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


var App = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(App, _React$Component);

  function App() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = App.prototype;

  _proto.onChange = function onChange() {
    console.log('form haibo react');
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("div", null, "hello world react", /*#__PURE__*/React.createElement(Button, {
      change: this.onChange
    }, "click"), /*#__PURE__*/React.createElement(ReduceDemo, null));
  };

  return App;
}(React.Component);

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'), function () {
  console.log('load');
});
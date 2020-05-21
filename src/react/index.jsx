import marked from 'marked';

class App extends React.Component {
  onChange() {
    console.log('form haibo react');
  }

  render() {
    return (
      <div>
        hello world react
        <Button change={this.onChange} />
      </div>
    );
  }
}

class Button extends React.Component {
  render() {
    return <button onClick={this.props.change}>click</button>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

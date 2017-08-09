import { Component } from 'react';

export default class NameForm extends Component {
  constructor() {
    super();
    this.state = {};
    this.onInputChange = e => this.setState({ value: e.target.value });
    this.onReset = () => this.setState({ value: null });
    this.onSubmit = e => {
      e.preventDefault();
      let { onChange, value } = this.props || {};
      if (typeof this.state.value !== 'string' || this.state.value === value) return;
      onChange(this.state.value);
    }
  }

  render() {
    let { onChange, value, label } = this.props || {};
    let changed = typeof this.state.value !== 'string' || this.state.value === value
    
    return (
      <form onSubmit={this.onSubmit}>
        <label>{label}</label>
        <input value={(typeof this.state.value !== 'string' ? value : this.state.value) || ""} onChange={this.onInputChange}/>
        <button onClick={this.onReset} disabled={changed} type='button'>Reset</button>
        <button onClick={this.onSubmit} disabled={changed}>Submit</button>
      </form>
    )
  }
}
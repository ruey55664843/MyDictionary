import React, { Component } from 'react';
import 'babel-polyfill';
import './MyWordList.css';

class Selection extends Component {
  render(){
    const {index, highlight, testNumber, selectedValue,
      title, onChange, checked, disabled} = this.props;
    if(highlight && disabled){
      return(
        <div className="question">
          <input
            type = "radio"
            name = {testNumber}
            value = {title}
            disabled = {disabled}
            onChange = {function(event){return onChange(event,index,testNumber)}}
          />
          <label><u>{title}</u></label>
        </div>
        );
    }else{
      return(
        <div className="question">
          <input
            type = "radio"
            name = {testNumber}
            value = {title}
            disabled = {disabled}
            onChange = {function(event){return onChange(event,index,testNumber)}}
          />
          <label>{title}</label>
        </div>
        );
    }
  }
}
export default Selection;

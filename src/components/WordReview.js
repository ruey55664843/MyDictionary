import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import Selection from './Selection'
import './MyWordList.css';

class WordReview extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      WordList: {wordcards:[]},
      test: [],
      score: 0,
    };
  }

  setWordList(temp){
    this.setState({WordList:temp});
  }
  setTest(temp){
    let countTestNumber = 0;
    let countSelection = 0;
    let index = [0,0,0];
    let checkRepeat = 0;
    let shuffleSelection = 0;
    for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
      const {WordList, test} = this.state;
      const {wordcards} = WordList;
      const length = wordcards.length;
      index = [0,0,0];
      while(index[0] === index[1] || index[1] === index[2] || index[0] === index[2]){
        for (countSelection = 0; countSelection<3; countSelection ++){
          index[countSelection] = Math.floor(Math.random()*length);
        }
      }
      shuffleSelection = Math.floor(Math.random()*3);
      this.setState({
        test: test.concat({
          topic: wordcards[index[shuffleSelection]].name,
          answer: shuffleSelection,
          submitted: false,
          highlightQ: false,
          selectedValue: '',
          selection: [
            {highlight:false,title: wordcards[index[0]].trans,checked:false,testNumber:countTestNumber},
            {highlight:false,title: wordcards[index[1]].trans,checked:false,testNumber:countTestNumber},
            {highlight:false,title: wordcards[index[2]].trans,checked:false,testNumber:countTestNumber}
          ]
        })
      })
    }
  }
  handleTest(test, i){
    const {topic, submitted, highlightQ, selection, selectedValue} = test;
    const questionNumber = i + 1;
    if(submitted){
      if(highlightQ){
        return(
          <div>
            <h4 className = 'text-danger'>Question {questionNumber}: {topic}</h4>
            <ul>{selection.map(this.handleSelectionList,this)}</ul>
          </div>
          );
      }else{
        return(
          <div>
            <h4>Question {questionNumber}: {topic}</h4>
            <ul>{selection.map(this.handleSelectionList,this)}</ul>
          </div>
          );
      }
    }else{
      return(
        <div>
          <h4>Question {questionNumber}: {topic}</h4>
          <ul>{selection.map(this.handleSelectionList,this)}</ul>
        </div>
        );
    }
  }
  handleSelectionList(oneSelection,i){
    const {title, testNumber, checked, highlight} = oneSelection;
    const {selectedValue, submitted} = this.state.test[testNumber];
    return(
        <Selection
          index = {i}
          highlight = {highlight}
          testNumber = {testNumber}
          checked = {checked}
          disabled = {submitted}
          selectedValue = {selectedValue}
          title = {title}
          onChange = {this.handleSelectionChecked.bind(this)}
        />
        );
  }
  handleSelectionChecked(event, i, testNumber){
    const {test} = this.state;
    //test[testNumber].selectedValue = event.target.checked;
    test.splice(testNumber,1,{
      topic: test[testNumber].topic,
      submitted: test[testNumber].submitted,
      highlightQ: test[testNumber].highlightQ,
      answer: test[testNumber].answer,
      selectedValue: event.target.value,
      selection: test[testNumber].selection
    });
    this.setState({
      test: test
    });
  }
  handleScore(){
    const {test, score,WordList} = this.state;
    fetch('/api/wordreview',{
      method: 'post',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(WordList.wordcards),
    });
    let score_temp = 0;
    let countTopic = 0;
    for(countTopic = 0; countTopic<3; countTopic++){
      const {selectedValue, answer} = test[countTopic];
      if(selectedValue === test[countTopic].selection[answer].title){
        score_temp = score_temp + 1;
        test.splice(countTopic,1,{
          topic: test[countTopic].topic,
          submitted: true,
          highlightQ: false,
          answer: test[countTopic].answer,
          selectedValue: test[countTopic].selectedValue,
          selection: test[countTopic].selection
        });
      }else{
        test.splice(countTopic,1,{
          topic: test[countTopic].topic,
          submitted: true,
          highlightQ: true,
          answer: test[countTopic].answer,
          selectedValue: test[countTopic].selectedValue,
          selection: test[countTopic].selection
        });
        test[countTopic].selection.splice(answer,1,{
          highlight:true,
          title:test[countTopic].selection[answer].title,
          checked:test[countTopic].selection[answer].checked,
          testNumber:test[countTopic].selection[answer].testNumber
        });
      }
    }
    if(score_temp === 0)score_temp = 0;
    else if(score_temp === 1)score_temp = 60;
    else if(score_temp === 2)score_temp = 80;
    else if(score_temp === 3)score_temp = 100;
    else score_temp = -1;

    this.setState({
      test: test,
      score: score_temp
    });
  }
  componentDidMount() {
    fetch('/api/mywordlist')
      .then(function(res){return res.json()})
      .then(this.setWordList.bind(this))
      .then(this.setTest.bind(this))
  }

  render() {
    const {test, score} = this.state;
    const {wordcards} = this.state.WordList;
    return (
        <div className="container">
          <h1>Selection Test</h1>
          <small>Please select the correct translation to the following words.</small>
          <section>{test.map(this.handleTest,this)}</section>
          <button type = "button" className = "btn btn-success" onClick = {this.handleScore.bind(this)}>submit</button>
          <h4>Score: {score}</h4>
          <Link to ={'/'}><h4>Back to List</h4></Link>
        </div>
        );
  }
}

WordReview.propTypes = {
  WordList: React.PropTypes.object,
  test: React.PropTypes.array,
  score: React.PropTypes.number
}

export default WordReview;

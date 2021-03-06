import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import Selection from './Selection'
import date from 'date-and-time';
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
    let countTestTopic = 0;
    let index = [0,0,0];
    let checkRepeat = 0;
    let shuffleSelection = 0;
    for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
      const {WordList, test} = this.state;
      const {wordcards} = WordList;
      const length = wordcards.length;

      let wordcardsADDtt = [];
      let recordADDmap = [];
      let countWordCards = 0;
      for(;countWordCards<length;countWordCards++){
        const wordcard = wordcards[countWordCards];
        let countADDtt = 0;
        let countADDttMax = wordcard.testTime;
        if(countADDttMax == 0 && wordcard.updateTime == wordcard.inputTime){
          countADDttMax = length/5;
        }
        for(;countADDtt<countADDttMax;countADDtt++){
          wordcardsADDtt.push(wordcards[countWordCards]);
          recordADDmap.push(countWordCards);
        }
      }
      const lengthADDtt = wordcardsADDtt.length;
      let SelectionRepeat = true;
      index = [0,0,0];
      while(SelectionRepeat){
        for (countSelection = 0; countSelection<3; countSelection ++){
          index[countSelection] = Math.floor(Math.random()*lengthADDtt);
        }
        const name1 = wordcardsADDtt[index[0]].name;
        const name2 = wordcardsADDtt[index[1]].name;
        const name3 = wordcardsADDtt[index[2]].name;
        SelectionRepeat = (name1 == name2)?true:
          (name2 == name3)?true:(name3==name1)?true:false;
      }
      shuffleSelection = Math.floor(Math.random()*3);
      if (countTestNumber>0){
        for (countTestTopic = 0;countTestTopic<countTestNumber;countTestTopic++){
          if(wordcardsADDtt[index[shuffleSelection]].name === test[countTestTopic].topic){
            shuffleSelection = Math.floor(Math.random()*3);
            countTestTopic--;
          }
        }
      }
      this.setState({
        test: test.concat({
          topic: wordcardsADDtt[index[shuffleSelection]].name,
          wordcardsTag:recordADDmap[index[shuffleSelection]],
          answer: shuffleSelection,
          submitted: false,
          highlightQ: false,
          selectedValue: '',
          selection: [
            {highlight:false,title: wordcardsADDtt[index[0]].trans,checked:false,testNumber:countTestNumber},
            {highlight:false,title: wordcardsADDtt[index[1]].trans,checked:false,testNumber:countTestNumber},
            {highlight:false,title: wordcardsADDtt[index[2]].trans,checked:false,testNumber:countTestNumber}
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
            <h4 className = 'text-danger question-warn'><b>Question {questionNumber}: {topic}</b></h4>
            <ul>{selection.map(this.handleSelectionList,this)}</ul>
          </div>
          );
      }else{
        return(
          <div>
            <h4 className="question">Question {questionNumber}: {topic}</h4>
            <ul>{selection.map(this.handleSelectionList,this)}</ul>
          </div>
          );
      }
    }else{
      return(
        <div>
          <h4 className="question">Question {questionNumber}: {topic}</h4>
          <div className="">
            <ul>{selection.map(this.handleSelectionList,this)}</ul>
          </div>
        </div>
        );
    }
  }
  
  handleSelectionList(oneSelection,i){
    const {title, testNumber, checked, highlight} = oneSelection;
    const {selectedValue, submitted} = this.state.test[testNumber];
    var forceChecked = false;
    if(selectedValue == title && submitted)forceChecked = true;
    return(
        <Selection
          className="question"
          index = {i}
          highlight = {highlight}
          testNumber = {testNumber}
          checked = {checked}
          forceChecked = {forceChecked}
          submitted = {submitted}
          selectedValue = {selectedValue}
          title = {title}
          onChange = {this.handleSelectionChecked.bind(this)}
        />
        );
  }
  handleSelectionChecked(event, i, testNumber){
    const {test} = this.state;
    const {submitted} = test[testNumber];
    if(!submitted){
      test.splice(testNumber,1,{
        topic: test[testNumber].topic,
        wordcardsTag: test[testNumber].wordcardsTag,
        submitted: test[testNumber].submitted,
        highlightQ: test[testNumber].highlightQ,
        answer: test[testNumber].answer,
        selectedValue: event.target.value,
        selection: test[testNumber].selection
      });
      let countSelection = 0;
      for(;countSelection < 3;countSelection ++){
        test[testNumber].selection.splice(countSelection,1,{
          highlight:test[testNumber].selection[countSelection].highlight,
          title:test[testNumber].selection[countSelection].title,
          checked:false,
          testNumber:test[testNumber].selection[countSelection].testNumber
        });
      }
      test[testNumber].selection.splice(i,1,{
        highlight:test[testNumber].selection[i].highlight,
        title:test[testNumber].selection[i].title,
        checked:event.target.checked,
        testNumber:test[testNumber].selection[i].testNumber
      });
      this.setState({
        test: test
      });
    }
  }
  handleScore(){
    const {test, score,WordList} = this.state;
    let score_temp = 0;
    let countTopic = 0;
    for(countTopic = 0; countTopic<3; countTopic++){
      const {selectedValue, answer} = test[countTopic];
      if(selectedValue === test[countTopic].selection[answer].title){
        score_temp = score_temp + 1;
        test.splice(countTopic,1,{
          topic: test[countTopic].topic,
          wordcardsTag: test[countTopic].wordcardsTag,
          submitted: true,
          highlightQ: false,
          answer: test[countTopic].answer,
          selectedValue: test[countTopic].selectedValue,
          selection: test[countTopic].selection
        });
        var now = new Date();
        let nowString = date.format(now,'YYYY/MM/DD HH:mm:ss');
        const {wordcardsTag} = test[countTopic];
        const {name, trans, testTime, number, total, inputTime} = WordList.wordcards[wordcardsTag];
        const newTestTime = parseInt(testTime,10) - 1;
        WordList.wordcards.splice(wordcardsTag,1,{
          name: name,
          trans: trans,
          testTime: newTestTime,
          number: number,
          total: total,
          updateTime: nowString,
          inputTime: inputTime
        })
      }else{
        test.splice(countTopic,1,{
          topic: test[countTopic].topic,
          wordcardsTag: test[countTopic].wordcardsTag,
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
        var now = new Date();
        let nowString = date.format(now,'YYYY/MM/DD HH:mm:ss');
        const {wordcardsTag} = test[countTopic];
        const {name, trans, testTime, number, total, inputTime} = WordList.wordcards[wordcardsTag];
        const newTestTime = parseInt(testTime,10) + 1;
        WordList.wordcards.splice(wordcardsTag,1,{
          name: name,
          trans: trans,
          testTime: newTestTime,
          number: number,
          total: total,
          updateTime: nowString,
          inputTime: inputTime
        })
      }
    }
    if(score_temp === 0)score_temp = 0;
    else if(score_temp === 1)score_temp = 60;
    else if(score_temp === 2)score_temp = 80;
    else if(score_temp === 3)score_temp = 100;
    else score_temp = -1;

    this.setState({
      test: test,
      score: score_temp,
      WordList: WordList
    });
    fetch('/api/wordreview',{
      method: 'post',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(WordList.wordcards),
    });
  }
  handleReset(){
        let countTestNumber = 0;
        let countSelection = 0;
        let countTestTopic = 0;
        let index = [0,0,0];
        let checkRepeat = 0;
        let shuffleSelection = 0;
        const {WordList, test} = this.state;
        for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
          const {wordcards} = WordList;
          const length = wordcards.length;
          index = [0,0,0];
          while(index[0] === index[1] || index[1] === index[2] || index[0] === index[2]){
            for (countSelection = 0; countSelection<3; countSelection ++){
              index[countSelection] = Math.floor(Math.random()*length);
            }
          }
          shuffleSelection = Math.floor(Math.random()*3);
          if (countTestNumber>0){
            for (countTestTopic = 0;countTestTopic<countTestNumber;countTestTopic++){
              if(wordcards[index[shuffleSelection]].name === test[countTestTopic].topic){
                shuffleSelection = Math.floor(Math.random()*3);
                countTestTopic--;
              }
            }
          }
          test.splice(countTestNumber,1,{
            topic: wordcards[index[shuffleSelection]].name,
            wordcardsTag:index[shuffleSelection],
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
        }
        this.setState({
          test: test,
          score: 0
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
          <h1 className="Select-title"><b>Selection Test</b></h1>
            <div className="homepage-btn-crew">
                <Link to ={'/info'}><button type="button" className="btn btn-info homepage-btn">
                    Info</button></Link> &nbsp;
                <Link to ={'/mywordlist'}><button type="button" className="btn btn-success homepage-btn">
                    My Word List</button></Link> &nbsp;
                <Link to ={'/wordreview'}><button type="button" disabled="disabled"className="btn btn-warning homepage-btn">
                    Selection Test</button></Link> &nbsp;
                <Link to ={'/wordreview_trans'}><button type="button" className="btn btn-danger homepage-btn">
                    Translation Test</button></Link> &nbsp;
                <Link to ={'/reviewmode'}><button type="button" className="btn btn-default btn-change homepage-btn">
                    Review</button></Link>
            </div>
            <br/>
          <small className="Select-subtitle">Please select the correct translation to the following words.</small> <br></br>
            <section>{test.map(this.handleTest,this)}</section>
            <h4 className="test-foot">Score: {score}</h4>
            <div className="test-foot">
                <button type = "button" className = "btn btn-success" onClick = {this.handleScore.bind(this)}>
                    submit</button> &nbsp;
                <button type="submit" className="btn btn-danger" onClick ={this.handleReset.bind(this)}> 
                    Reset </button>
            </div>
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

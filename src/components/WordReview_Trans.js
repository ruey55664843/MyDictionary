import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import Translation from './Translation';
import date from 'date-and-time';
import './MyWordList.css';


class WordReview_Trans extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            WordList: {wordcards:[]},
            test: [],
            score: 0
        };
    }

    setWordList(temp){
        this.setState({WordList:temp});
    }
    
    setTest(temp){
        let countTestNumber = 0;
        let countSelection = 0;
        let index = [0,0,0];
        const { WordList, test } = this.state;
        const { wordcards } = WordList;
        const length = wordcards.length;
        let wordcardsADDtt = [];
        let recordADDmap = [];
        let countWordCards = 0;
        for (;countWordCards<length;countWordCards++){
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
        let TopicRepeat = true; 
        while(TopicRepeat){
            for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
                index[countTestNumber] = Math.floor(Math.random()*lengthADDtt);
            }
            const name1 = wordcardsADDtt[index[0]].name;
            const name2 = wordcardsADDtt[index[1]].name;
            const name3 = wordcardsADDtt[index[2]].name;
            TopicRepeat = (name1 == name2)?true:
              (name2 == name3)?true:(name3 == name1)?true:false;
        }
        for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
            const { WordList, test } = this.state;
            const { wordcards } = WordList;
            const length = wordcards.length;
            this.setState({
                test: test.concat({
                  topic: wordcardsADDtt[index[countTestNumber]].trans,
                  wordcardsTag: recordADDmap[index[countTestNumber]],
                  testID: countTestNumber+1,
                  highlightQ: false,
                  submitted: false,
                  answer: wordcardsADDtt[index[countTestNumber]].name,
                  userAns: "",
                })
            })
        }
    }
    
    reloadTest(){
        let countTestNumber = 0;
        let countSelection = 0;
        let index = [0,0,0];
        const { WordList, test } = this.state;
        const { wordcards } = WordList;
        const length = wordcards.length;
        let wordcardsADDtt = [];
        let recordADDmap = [];
        let countWordCards = 0;
        for (;countWordCards<length;countWordCards++){
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
        let TopicRepeat = true; 
        while(TopicRepeat){
            for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
                index[countTestNumber] = Math.floor(Math.random()*lengthADDtt);
            }
            const name1 = wordcardsADDtt[index[0]].name;
            const name2 = wordcardsADDtt[index[1]].name;
            const name3 = wordcardsADDtt[index[2]].name;
            TopicRepeat = (name1 == name2)?true:
              (name2 == name3)?true:(name3 == name1)?true:false;
        }
        for (countTestNumber = 0; countTestNumber<3; countTestNumber++){
            test.splice(countTestNumber,1,{
              topic: wordcardsADDtt[index[countTestNumber]].trans,
              wordcardsTag: recordADDmap[index[countTestNumber]],
              testID: countTestNumber+1,
              highlightQ: false,
              submitted: false,
              answer: wordcardsADDtt[index[countTestNumber]].name,
              userAns: "",
            })
        }
        this.setState({
            test: test,
            score: 0
        })
    }

    handleTransTest(test,i){
        const {topic,testID,userAns,submitted,highlightQ,answer} = test;
        const questionNumber = test.testID;
        if(submitted && highlightQ){
          return(
            <div>
              <h4 className ="text-warning question-warn"><b>Question {questionNumber} : {topic}({answer})</b></h4>
              <form name="formName" className="Trans-blank">
                <Translation
                  value = {userAns}
                  i = {i}
                  disabled = {submitted}
                  onChange = {this.handleChange.bind(this)}
                />
              </form>
              <br/>
            </div>
          )
        }else{
          return(
            <div>
              <h4 className="question">Question {questionNumber} : {topic}</h4>
              <form name="formName" className="Trans-blank">
                <Translation
                  value = {userAns}
                  i = {i}
                  disabled = {submitted}
                  onChange = {this.handleChange.bind(this)}
                />
              </form>
              <br/>
            </div>
          )
        }
    }

    handleChange(event,i){
        const {test} = this.state;
        const {testID} = test;
        test.splice(i,1,{
            topic: test[i].topic,
            wordcardsTag: test[i].wordcardsTag,
            highlightQ: test[i].highlightQ,
            submitted: test[i].submitted,
            testID: test[i].testID,
            answer: test[i].answer,
            userAns: event.target.value
        });
        this.setState({
            test :test
        });
    }

    handleTransScore(){
        const {test ,score, userInput, WordList} = this.state;
        let score_temp = 0;
        let countTestNumber = 0;
        for(countTestNumber = 0; countTestNumber< 3; countTestNumber++){
            const {topic,wordcardsTag,testID,answer,userAns} = test[countTestNumber];
            if(userAns === answer){
              score_temp++;
              test.splice(countTestNumber,1,{
                topic: topic,
                wordcardsTag: wordcardsTag,
                testID: testID,
                highlightQ: false,
                submitted: true,
                answer: answer,
                userAns: userAns,
              })
              
              var now = new Date();
              let nowString = date.format(now,'YYYY/MM/DD HH:mm:ss');
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
              test.splice(countTestNumber,1,{
                topic: topic,
                wordcardsTag: wordcardsTag,
                testID: testID,
                highlightQ: true,
                submitted: true,
                answer: answer,
                userAns: userAns,
              })
              var now = new Date();
              let nowString = date.format(now,'YYYY/MM/DD HH:mm:ss');
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
            score: score_temp,
            test: test,
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
                <h1 className="Trans-title"><b>Translation Test</b></h1>
            <div className="homepage-btn-crew">
                <button type="button" className="btn btn-info homepage-btn">Info</button> &nbsp;
                <Link to ={'/mywordlist'}><button type="button" className="btn btn-success homepage-btn">My Word List</button></Link> &nbsp;
                <Link to ={'/wordreview'}><button type="button" className="btn btn-warning homepage-btn">Selection Test</button></Link> &nbsp;
                <Link to ={'/wordreview_trans'}><button type="button" disabled="disabled"className="btn btn-danger homepage-btn">
                    Translation Test</button></Link> &nbsp;
                <Link to ={'/reviewmode'}><button type="button" className="btn btn-default btn-change homepage-btn">Review</button></Link>
            </div>
                <br/>
                <small className="Trans-subtitle">Please fill the correct translation to the following words.</small>
                <br/><br/>
                    <section>{test.map(this.handleTransTest,this)}</section>
                <br/>
                <h4 className="test-foot">Score: {score}</h4>
                <div className="test-foot">    
                    <button type="button" className="btn btn-success" onClick = {this.handleTransScore.bind(this)}>submit</button> &nbsp;
                    <button type="button" className="btn btn-danger" onClick = {this.reloadTest.bind(this)}> Reset </button>
                </div>
            </div>
        );
    }
}

WordReview_Trans.propTypes = { 
    test: React.PropTypes.array,
    score: React.PropTypes.number
}

export default WordReview_Trans;

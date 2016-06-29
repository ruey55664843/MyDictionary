import React, { Component } from 'react';
import { Link } from 'react-router';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import qsort from 'quicksorter';
import date from 'date-and-time';

import './MyWordList.css';

class MyWordList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      WordList: {wordcards:[]},
      English: '',
      Chinese: '',
      ValidInput:true 
    };
  }

  setWordList(temp){

    let arr = [];
    let tempSize = 0;
    let cnt = 0;
    let inv = 0;
    tempSize = parseInt(temp.wordcards[0].total,10);
    
    for(cnt = 0; cnt<tempSize; cnt++){
        arr.push(temp.wordcards[cnt]);
    }
    
    qsort(arr, function(a, b) {
        var at = 0;
        var bt = 0;
        at = parseInt(a.testTime,10);
        bt = parseInt(b.testTime,10);
        return at < bt ? -1 : at > bt ? 1 : 0
    })
    
    for(cnt = tempSize-1, inv=0; cnt>0, inv<tempSize; cnt--,inv++){
        temp.wordcards.splice(inv,1,arr[cnt]);
    }
    
    
    this.setState({
        WordList:temp
    });
  }

  handleWordList(wordcard){
    const {name, trans} = wordcard;
    return (
        <div>
            <ul>
                <div className="tooltip wordlist-english"><b> ★ &nbsp; {name}
                    <span className="tooltiptext wordlist-trans">{trans}</span>
                    </b>
                </div> 
            </ul>
        </div>
        )
  }
  handleNewEnglish(event){
    this.setState({English:event.target.value});
  }
  handleNewChinese(event){
    this.setState({Chinese:event.target.value});
  }
  handleSubmit(event){
    const {WordList, Chinese, English} = this.state;
    if(Chinese === '' || English === ''){
      this.setState({ValidInput:false});
    }else{
      const countLength = WordList.wordcards.length + 1;
      let countWordCards = 1;
      var now = new Date();
      let nowString = date.format(now,'YYYY/MM/DD HH:mm:ss');
      for(;countWordCards<=countLength;countWordCards++){
        if(countWordCards<=countLength-1){
          const {name,trans,testTime,number,updateTime,inputTime} = WordList.wordcards[countWordCards-1];
          WordList.wordcards.splice(countWordCards-1,1,{
            name: name,
            trans: trans,
            testTime: testTime,
            number: number,
            total: countLength,
            updateTime: updateTime,
            inputTime: inputTime
          })
        }else{
          WordList.wordcards.splice(countWordCards-1,0,{
            name: English,
            trans: Chinese,
            testTime: 0,
            number: countWordCards,
            total: countLength,
            updateTime: nowString,
            inputTime: nowString
          })
        }
      }
      this.setState({WordList:WordList});
      fetch('/api/wordreview',{
        method: 'post',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(WordList.wordcards),
      });
    }
  }
  componentDidMount() {
    fetch('/api/mywordlist')
      .then(function(res){return res.json()})
      .then(this.setWordList.bind(this));

  }

  render() {
    const {English, Chinese, ValidInput} = this.state;
    const {wordcards} = this.state.WordList;
    if(ValidInput){ 
      return (
          <div className="container">
            <h1 className="homepage-title"><b>My WordList</b></h1>
              <div className="homepage-btn-crew">
                  <Link to ={'/info'}><button type="button" className="btn btn-info homepage-btn">
                    Info</button></Link> &nbsp;
                  <Link to ={'/mywordlist'}><button type="button" disabled="disabled" className="btn btn-success homepage-btn">
                    My Word List</button></Link> &nbsp;
                  <Link to ={'/wordreview'}><button type="button" className="btn btn-warning homepage-btn">
                    Selection Test</button></Link> &nbsp;
                  <Link to ={'/wordreview_trans'}><button type="button" className="btn btn-danger homepage-btn">
                    Translation Test</button></Link> &nbsp;
                  <Link to ={'/reviewmode'}><button type="button" className="btn btn-default btn-change homepage-btn">
                    Review</button></Link>
              </div>
              <form className="homepage-input-instr">
                  <div className="form-group input-btn-crew">   
                      <input type="text" placeholder='English' className="homepage-input input-btn-change" value = {English} onChange = {this.handleNewEnglish.bind(this)}/> &nbsp;
                      <input type="text" placeholder='Chinese' className="homepage-input input-btn-change" value = {Chinese} onChange = {this.handleNewChinese.bind(this)}/> &nbsp;
                      <input type="submit" value="Add To List" onClick = {this.handleSubmit.bind(this)} className="submit-btn"/>
                  </div>
              </form>
              
              <span>
                  {wordcards.map(this.handleWordList.bind(this))}
              </span>
          </div>
          );
    }else{
      return (
          <div className="container">
            <h1 className="homepage-title"><b>My WordList</b></h1>
              <div className="homepage-btn-crew">
                  <button type="button" className="btn btn-info homepage-btn">Info</button> &nbsp;
                  <button type="button" className="btn btn-success homepage-btn">Designer</button> &nbsp;
                  <Link to ={'/wordreview'}><button type="button" className="btn btn-warning homepage-btn">Selection Test</button></Link> &nbsp;
                  <Link to ={'/wordreview_trans'}><button type="button" className="btn btn-danger homepage-btn">Translation Test</button></Link> &nbsp;
                  <Link to ={'/reviewmode'}><button type="button" className="btn btn-default btn-change homepage-btn">Review</button></Link>
              </div>
              <form className="homepage-input-instr">
                  <div className="form-group input-btn-crew">   
                      <input type="text" placeholder='Empty!' className="homepage-input input-btn-change" value = {English} onChange = {this.handleNewEnglish.bind(this)}/> &nbsp;
                      <input type="text" placeholder='Empty!' className="homepage-input input-btn-change" value = {Chinese} onChange = {this.handleNewChinese.bind(this)}/> &nbsp;
                      <select name="Word Of Speech">
                          <option value="VERB">Verb</option>
                          <option value="NOUN">Noun</option>
                          <option value="ADJECTIE">Adjective</option>
                          <option value="ADVERB">Adverb</option>
                          <option value="PREPOSITION">Preposition</option>
                      </select> &nbsp;
                      <input type="submit" value="Add To List" onClick = {this.handleSubmit.bind(this)} className="submit-btn"/>
                  </div>
              </form>
              
              <span>
                  {wordcards.map(this.handleWordList.bind(this))}
              </span>
          </div>
          );
    }
  }
}

export default MyWordList;

import React from 'react'
import sampleSchedules from './schedule/sampleSchedules.json'
import ColorPicker from './ColorPicker.jsx'
import Lanes from './Lanes.jsx'
import * as Ons from 'react-onsenui'

export default class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sleepLane: 0,
      color: 'red',
      selectedSchedule: "",
      scheduleInfo: "Select a schedule from list",
      recommendFor: false
    }
  }

  selectSchedule = (event) => {
    this.setState({
      selectedSchedule: event.target.value  
    })
    sampleSchedules.forEach(schedule => {
      if(schedule.name === this.state.selectedSchedule){
        this.setState({
          scheduleInfo: schedule.info,
          recommendFor: schedule.recommend
        })
        this.changeSchedule(schedule);
        return;
      }      
    });
    
  }
  render() {
    return (
      <div className="Schedule">
        <div className="field">
          <Lanes
            napchart={this.props.napchart}
            clickLane={this.setLane}
            active={this.state.sleepLane}
            disabledLane={(lane) => lane > this.props.napchart.data.lanes}
          />
        </div>
          <Ons.Select style={{width: "100%"}} id="choose-sel" value={this.state.selectedSchedule} modifier={this.state.selectedSchedule} onChange={this.selectSchedule}>
            {sampleSchedules.map(schedule => {
              return <option value={schedule.name}>
                <div className="left">
                  <div className="level-item">
                    <span>{schedule.name}</span>
                  </div>
                </div>
                <p>  </p>
                <div className="right">
                  <div className="level-item">
                    <span className="duration">{this.calculateDuration(schedule)}</span>
                  </div>
                </div>
              </option>
            })}
          </Ons.Select>
          <Ons.Card>
          <p>{this.state.scheduleInfo}</p>
          <span><h5>Recommend : </h5>{this.state.recommendFor} </span>
          </Ons.Card>
      </div>
    )
  }

  calculateDuration = (schedule) => {
    if(this.props.napchart === false){
      return;
    }
    
    var helpers = this.props.napchart.helpers
    const minutes = schedule.elements.reduce((minutes, element) => {
      return minutes + helpers.duration(element.start, element.end)
    }, 0)
    return helpers.minutesToReadable(minutes)
  }

  changeSchedule = (schedule) => {
    var lane = this.state.sleepLane // because napchart counts from 0, 1, 2 ...
    var elements = schedule.elements.map(element => {
      return {
        start: element.start,
        end: element.end,
        lane: lane,
        color: this.state.color
      }
    })
    var napchart = this.props.napchart
    napchart.emptyLane(lane)
    napchart.initAndAddElements(elements)
    napchart.history.add('Use polyphasic schedule')

    // find a element on the lane and select it
    var eol = napchart.data.elements.find(e => e.lane == lane)
    napchart.setSelected(eol.id)
  }

  setLane = (lane) => {
    this.setState({
      sleepLane: lane
    })
  }

  changeColor = (color) => {
    this.setState({
      color: color
    })
  }

}
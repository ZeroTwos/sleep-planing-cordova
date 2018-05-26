import React, {Component} from 'react'
import uuid from 'uuid'
import Napchart from 'napchart'
import * as ons from "onsenui";


export default class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: uuid.v4()
    }
  }

  componentDidMount() {
    var resizer = this.refs.resizer

    this.updateDimensions(() =>
      this.initializeChart()
    )

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize)
  }

  componentWillUpdate() {
    return false
  }

  render() {
    var blurClass = ''
    if (this.props.loading) {
      blurClass = 'blur'
    }
    return (
      <div className="Chart" ref="resizer">
        <canvas className={"canvas " + blurClass} width={this.state.width} height={this.state.height} ref={this.state.id}>
          A chart
        </canvas>
      </div>
    )
  }

  handleResize = () => {
    this.updateDimensions(() =>
      this.props.napchart.updateDimensions()
    )
  }

  updateDimensions = (callback) => {
    var resizer = this.refs.resizer
    this.setState({
      width: resizer.clientWidth,
      height: resizer.clientHeight,
    }, callback)
  }

  initializeChart() {
    let storage = window.localStorage;
    let chartData = JSON.parse(storage.getItem("chartData"));
    if (chartData === null){
        chartData = {};
    } else {
        ons.notification.toast("Load chart data successful", {timeout: 1000});
    }
    this.loadChartData(chartData)

  }

    loadChartData = (chartData = {}) => {
        var canvas = this.refs[this.state.id];
        var ctx = canvas.getContext('2d');

        var napchart = Napchart.init(ctx, chartData, {
            responsive: true,
            ampm: this.props.ampm
        })

        napchart.onUpdate = () => {
            this.props.onUpdate()
        }

        // for debugging
        window.napchart = napchart

        canvas.oncontextmenu = function (event) {
            event.preventDefault()
            event.stopPropagation()
            return false
        };

        this.props.setGlobalNapchart(napchart);
    }
}

import * as Ons from 'react-onsenui'
import * as ons from 'onsenui';
import React, {Component} from 'react'

import Chart from './Chart.jsx'
import Cookies from 'js-cookie';
import $ from "jquery";

import SelectedElement from './Control/SelectedElement.jsx'
import Shapes from './Control/Shapes.jsx'
import SuperLanes from './Control/SuperLanes.jsx'
import Schedule from './Control/Schedule1.jsx'
import axios from "axios/index";


export default class Editor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            napchart: false, // until it is initialized
            ampm: this.getAmpm(),
            selectedControl: 0,
            toastShown: false,
            napchartUrlDialogShown: false,
            settingDialogShown: false,
            aboutDialogShown: false,
            chartId: window.chartid,
            title: window.title || '',
            description: window.description || '',
            menuShown: false
        }
    }

    renderToolbar = () => {
        var {napchart} = this.state;
        if (!napchart) {
            return null;
        }

        return (
            <Ons.Toolbar>
                <div className='left'>Sleep Planing</div>
                <div className='right'>
                    <Ons.ToolbarButton onClick={napchart.history.back.bind(napchart)}
                                       disabled={!napchart.history.canIGoBack()}>
                        <Ons.Icon icon='md-undo'></Ons.Icon>
                    </Ons.ToolbarButton>
                    <Ons.ToolbarButton onClick={napchart.history.forward.bind(napchart)}
                                       disabled={!napchart.history.canIGoForward()}>
                        <Ons.Icon icon='md-redo'></Ons.Icon>
                    </Ons.ToolbarButton>
                    <Ons.ToolbarButton onClick={this.saveSchedule}>
                        <Ons.Icon icon='md-floppy'></Ons.Icon>
                    </Ons.ToolbarButton>
                    <Ons.ToolbarButton id="menuButton" ref="menuButton" onClick={this.showMenu}>
                        <Ons.Icon icon='md-menu'></Ons.Icon>
                    </Ons.ToolbarButton>
                </div>
            </Ons.Toolbar>
        )
    };


    selectControl = (index) => {
        this.setState({selectedControl: index});
        console.log(this.state.selectedControl);
    }


    renderBottomToolbar = () => {
        return (
            <Ons.BottomToolbar className='ons-toolbar'>
                <div className="center">
                    <Ons.Segment index={this.state.selectedControl}
                                 onPostChange={() => this.setState({selectedControl: event.index})}
                                 style={{width: '100%'}}>
                        <button style={{width: '33%'}}>Element</button>
                        <button style={{width: '33%'}}>Lanes</button>
                        <button style={{width: '33%'}}>Schedule</button>
                    </Ons.Segment>
                </div>
            </Ons.BottomToolbar>)
    }

    showSettingDialog = () => {
        this.setState({
            settingDialogShown: true
        })
    }

    hideSettingDialog = () => {
        this.setState({
            settingDialogShown: false
        })
    }

    renderSettingDialog = () => {
        return(
        <Ons.AlertDialog
            isOpen={this.state.settingDialogShown}
            isCancelable={true}
            onCancel={this.hideSettingDialog}>
            <div className='alert-dialog-title'>Setting</div>
            <div className='alert-dialog-content'>
                <Shapes napchart={this.state.napchart}/>
            </div>
            <div className='alert-dialog-footer'>
                <button onClick={this.hideSettingDialog} className='alert-dialog-button'>
                    Ok
                </button>
            </div>
        </Ons.AlertDialog>)
    }

    showAboutDialog = () => {
        this.setState({
            aboutDialogShown: true
        })
    }

    hideAboutDialog = () => {
        this.setState({
            aboutDialogShown: false
        })
    }

    renderAboutDialog = () => {
        return (<Ons.AlertDialog
            isOpen={this.state.aboutDialogShown}
            isCancelable={true}
            onCancel={this.hideAboutDialog}>
            <div className='alert-dialog-title'>About</div>
            <div className='alert-dialog-content'>
                <Ons.ListItem>
                    <div className='center'>
                        A simple tool to plan your sleep schedule by ZeroTwos
                    </div>
                </Ons.ListItem>
                <Ons.ListItem>
                    <div className='center'>
                        Free and open source at :
                        <a href={"https://github.com/ZeroTwos/sleep-planing-cordova"}>https://github.com/ZeroTwos/sleep-planing-cordova</a>
                    </div>
                </Ons.ListItem>
                <Ons.ListItem>
                    <div className='center'>
                        <p>Made possible thanks to larskarbo's napchart and napchart-website</p>
                        <p>Checkout his github : <a href={"https://github.com/larskarbo"}>https://github.com/larskarbo</a></p>
                    </div>
                </Ons.ListItem>
                <p></p>

            </div>
            <div className='alert-dialog-footer'>
                <button onClick={this.hideAboutDialog} className='alert-dialog-button'>
                    Ok
                </button>
            </div>
        </Ons.AlertDialog>)
    }

    handleChange = (e) => {
        this.setState({selectedControl: e.activeIndex});
    }

    changeTitle = (e) => {
        this.setState({
            title: e.target.value
        })
    };

    changeDescription = (e) => {
        this.setState({
            description: event.target.value
        })
    };

    showMenu = (e) => {
        this.setState({
            menuShown: true
        })
    };

    closeMenu = (e) => {
        this.setState({
            menuShown: false
        })
    };

    loadFromNapChart = (url) => {
        ons.notification.prompt("Enter napchart url or id : ", {
            cancelable: true,
            title: "Load from napchart"
        }).then((response) => {
            let chartId = "";
            //Get the chart id from url
            if (response.length === 5) {
                chartId = response;
            } else {
                chartId = response.slice(response.length - 5, response.length);
            }
            //Load data from data
            axios.get(`http://napchart.com/api/get?chartid=${chartId}`,)
                .then(response => {
                    var data = {
                        ...response.data,
                        ...response.data.chartData,
                    }
                    delete data.chartData;
                    if (data != {}) {
                        this.refs.chart.loadChartData(data);
                        this.setState({
                            chartId: chartId
                        })
                    } else {
                        ons.notification.alert("Data is empty. Maybe wrong chartId or url");
                    }

                    ons.notification.toast("Load data from napchart successful", {timeout: 1000});
                    console.log(data);
                })
                .catch(error => ons.notification.alert("Can't get data from napchart"))

        })
    }

    saveDataToNapchart = () => {
        var dataForDatabase = {
            metaInfo: {
                title: this.state.title,
                description: this.state.description
            },
            chartData: {
                ...this.state.napchart.data
            }
        }
        console.log(dataForDatabase)
        axios.post('http://napchart.com/api/create', {
            data: JSON.stringify(dataForDatabase)
        })
            .then((response) => {
                console.log(response)
                var chartid = response.data.id

                this.setState({
                    chartId: chartid
                });
                this.openNapchartUrlDialog();
                ons.notification.toast('Save chart successful', {timeout: 1000}).then(response =>
                    this.openNapchartUrlDialog()
                )
            })
            .catch((hm) => {
                console.error('oh no!:', hm)
                ons.notification.alert('Oh no!:. Something wrong!')
            })
    }

    openNapchartUrlDialog = () => {
        this.setState({
            napchartUrlDialogShown: true
        });
    }

    hideNapchartUrlDialog = () => {
        this.setState({
            napchartUrlDialogShown: false
        });
    }

    renderNapchartUrlDialog = () => {
        let napchartUrl = `http://napchart.com/${this.state.chartId}`
        return (
            <Ons.Dialog
                isOpen={this.state.napchartUrlDialogShown}
                isCancelable={true}
                onCancel={this.hideNapchartUrlDialog}>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <p style={{opacity: 0.5}}>Napchart url!</p>
                    <p>
                        <Ons.Input
                            underbar
                            transparent
                            value={napchartUrl}
                            disabled={true}
                        />
                    </p>
                    <p>
                        <button onClick={this.hideNapchartUrlDialog} className='alert-dialog-button'>Close</button>
                    </p>
                </div>
            </Ons.Dialog>)
    }

    shareNapChartUrl = () => {
        if (this.state.chartId === undefined) {
            ons.notification.confirm(<div>
                <p>You must save your chart data to Napchart before sharing</p>
                <p>Do you want to save now ? </p>
            </div>, {timeout: 1000}).then(response => {
                //OK button
                if(response === 1){
                    this.saveDataToNapchart();
                    this.shareUrl(`http://napchart.com/${this.state.chartId}`)
                }
            })
        } else {
            this.shareUrl(`http://napchart.com/${this.state.chartId}`);
        }
        // this is the complete list of currently supported params you can pass to the plugin (all optional)

    }

    shareUrl = (url) => {
        var options = {
            url: url,
            chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title,
            appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
        };

        var onSuccess = function (result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function (msg) {
            console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }

    clearChartData = () => {
        ons.notification.confirm("Do you want to clear chart data ?").then(response => {
            if(response === 1){
                this.refs.chart.loadChartData({});
            }
        })
    }




    render() {
        let controls = [
            <SelectedElement napchart={this.state.napchart}/>,
            <SuperLanes napchart={this.state.napchart}/>,
            <Schedule napchart={this.state.napchart}/>
        ];

        {/*<Shapes napchart={this.state.napchart}/>*/
        }


        return (
            <Ons.Splitter>
                <Ons.SplitterSide side='right' width={220} collapse={true} swipeable={true} isOpen={this.state.menuShown} onClose={this.closeMenu} onOpen={this.showMenu}>
                    <Ons.Page>
                        <Ons.List>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.loadFromNapChart()}}><Ons.Icon fixedWidth size="25" icon='md-cloud-download'></Ons.Icon>Load from napchart</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.saveSchedule()}}><Ons.Icon fixedWidth size="25" icon='md-floppy'></Ons.Icon>Save</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.saveDataToNapchart()}}><Ons.Icon fixedWidth size="25" icon='md-cloud-upload'></Ons.Icon>Save to napchart</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.shareNapChartUrl()}}><Ons.Icon fixedWidth size="25" icon='md-share'></Ons.Icon>Share</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.clearChartData()}}><Ons.Icon fixedWidth size="25" icon='md-spinner'></Ons.Icon>Clear</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.showSettingDialog(); this.closeMenu(); }}><Ons.Icon fixedWidth size="25" icon='md-settings'></Ons.Icon>Setting</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.showAboutDialog(); this.closeMenu();}}><Ons.Icon fixedWidth size="25" icon='md-make'></Ons.Icon>About</Ons.ListItem>
                        </Ons.List>
                    </Ons.Page>
                </Ons.SplitterSide>
                <Ons.SplitterContent>
                    <Ons.Page
                        renderToolbar={this.renderToolbar}
                        renderBottomToolbar={this.renderBottomToolbar}>
                        {this.renderSettingDialog()}
                        {this.renderNapchartUrlDialog()}
                        {this.renderAboutDialog()}
                        <Chart
                            ref="chart"
                            napchart={this.state.napchart}
                            onUpdate={this.somethingUpdate}
                            setGlobalNapchart={this.setGlobalNapchart}
                            onLoading={this.loading} onLoadingFinish={this.loadingFinish}
                            ampm={this.state.ampm}
                            showToast={this.showToast}
                        />
                        <Ons.Carousel onPostChange={this.handleChange} index={this.state.selectedControl}>
                            {controls.map((item, index) => (
                                <Ons.CarouselItem key={index}>
                                    {item}
                                </Ons.CarouselItem>
                            ))}
                        </Ons.Carousel>
                    </Ons.Page>
                </Ons.SplitterContent>
            </Ons.Splitter>

        )
    }


    setGlobalNapchart = (napchart) => {
        this.setState({
            napchart: napchart
        })
    }

    somethingUpdate = (napchart) => {
        this.forceUpdate()
    }


    setNumberOfLanes = (lanes) => {
        console.log(lanes)
        this.state.napchart.setNumberOfLanes(lanes)
    }

    getAmpm = () => {

        const cookiePref = Cookies.get('preferAmpm')
        if (cookiePref) {
            return eval(cookiePref)
        }

        var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
        var dateString = date.toLocaleTimeString();

        //apparently toLocaleTimeString() has a bug in Chrome. toString() however returns 12/24 hour formats. If one of two contains AM/PM execute 12 hour coding.
        if (dateString.match(/am|pm/i) || date.toString().match(/am|pm/i)) {
            return true
        }
        else {
            return false
        }
    }

    setAmpm = (ampm) => {
        Cookies.set('preferAmpm', ampm)

        this.setState({
            ampm: ampm
        })
    }

    saveSchedule = () => {
        let storage = window.localStorage;
        storage.setItem("chartData", JSON.stringify(this.state.napchart.data));
        console.log(this.state.napchart.data);
        ons.notification.toast("Save chart data successful", {timeout: 1000});
    };

    setAlarm = () => {
        console.log(this.state.napchart.data.elements);
        let sucess = () => {
            console.log("success");
        };
        let fail = () => {
            console.log("fall");
        };
        this.state.napchart.data.elements.forEach(element => {
            cordova.exec(sucess, fail, 'setalarm', 'coolMethod', [Math.floor(element.start / 60), element.start % 60]);
            cordova.exec(sucess, fail, 'setalarm', 'coolMethod', [Math.floor(element.end / 60), element.end % 60]);

        });
    }

}

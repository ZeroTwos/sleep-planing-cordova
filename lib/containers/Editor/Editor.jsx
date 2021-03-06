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
        super(props);

        this.state = {
            napchart: false, // until it is initialized
            canvas: false,
            isNapchartUpdated: false,
            ampm: this.getAmpm(),
            selectedControl: 0,
            loadingModalShown: false,
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
                        <a href={"https://github.com/ZeroTwos/sleep-planing-cordova"}>sleep-planing-cordova</a>
                    </div>
                </Ons.ListItem>
                <Ons.ListItem>
                    <div className='center'>
                        <p>Made possible thanks to larskarbo's napchart and napchart-website</p>
                        <p>Checkout his github : <a href={"https://github.com/larskarbo"}>larskarbo</a></p>
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

    renderLoadingModal = () => {
        return (<Ons.Modal
            isOpen={this.state.loadingModalShown}>
            <Ons.ProgressCircular indeterminate />
        </Ons.Modal>)
    }

    showLoadingModal = () => {
        this.setState({
            loadingModalShown: true
        })
    }

    closeLoadingModal = () => {
        this.setState({
            loadingModalShown: false
        })
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
        //No network connection
        if(this.checkConnection() === false){
            ons.notification.alert('Oh internet connection avaiable!');
            return false;
        }

        ons.notification.prompt("Enter napchart url or id : ", {
            cancelable: true,
            title: "Load from napchart"
        }).then((response) => {
            this.showLoadingModal();
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
                        this.closeLoadingModal();
                        ons.notification.alert("Data is empty. Maybe wrong chartId or url");
                    }
                    this.closeLoadingModal();
                    ons.notification.toast("Load data from napchart successful", {timeout: 1000});
                    console.log(data);
                })
                .catch(error => {
                    this.closeLoadingModal();
                    ons.notification.alert("Can't get data from napchart")
                })

        })
    }

    saveDataToNapchart = (showUrl = true, callBack = () => {}) => {
        //No network connection
        if(this.checkConnection() === false){
            ons.notification.alert('Oh internet connection avaiable!');
            return false;
        }

        var dataForDatabase = {
            metaInfo: {
                title: this.state.title,
                description: this.state.description
            },
            chartData: {
                ...this.state.napchart.data
            }
        }
        console.log(dataForDatabase);
        this.showLoadingModal();
        axios.post('http://napchart.com/api/create', {
            data: JSON.stringify(dataForDatabase)
        })
            .then((response) => {
                console.log(response)
                var chartid = response.data.id

                this.setState({
                    chartId: chartid,
                    isNapchartUpdated: true,
                });
                this.closeLoadingModal();
                ons.notification.toast('Save chart successful', {timeout: 1000}).then(response =>{
                    if(showUrl){
                        this.openNapchartUrlDialog()
                    }
                })
                callBack(chartid);
            })
            .catch((error) => {
                this.closeLoadingModal();
                console.error('oh no!:', error)
                ons.notification.alert('Oh no!:. Something wrong!')
                return false;
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
                <Ons.AlertDialog
                    isOpen={this.state.napchartUrlDialogShown}
                    isCancelable={true}
                    onCancel={this.hideNapchartUrlDialog}>
                    <div className='alert-dialog-title'>Napchart URL</div>
                    <div className='alert-dialog-content'>
                        <Ons.Input
                            underbar
                            transparent
                            value={napchartUrl}
                        />
                    </div>
                    <div className='alert-dialog-footer'>
                        <button onClick={this.hideNapchartUrlDialog} className='alert-dialog-button'>
                            Ok
                        </button>
                    </div>
                </Ons.AlertDialog>)
    }

    shareNapChartUrl = () => {
        if (this.state.chartId === undefined) {
            console.log("Share undefined");
            ons.notification.confirm({messageHTML : `<div>
                <p>You must save your chart data to Napchart before sharing</p>
                <p>Do you want to save now ?</p>
            </div>`}).then(response => {
                //OK button
                if(response === 1){
                    let shareResult = this.saveDataToNapchart(false, (chartid) => {this.shareUrl(`http://napchart.com/${chartid}`)});
                }
            }).catch((error) => {console.log(error)})
        } else {
            if(this.state.isNapchartUpdated === true) {
                console.log("Share successful");
                this.shareUrl(`http://napchart.com/${this.state.chartId}`);
            }
            else {
                console.log("Share not updated");
                ons.notification.confirm({messageHTML : `<div>
                    <p>Your chart have changed</p>
                    <p>Do you want to share the new one ? </p>
                </div>`}).then(response => {
                    //OK button
                    if(response === 1){
                        let shareResult = this.saveDataToNapchart(false, (chartid) => {this.shareUrl(`http://napchart.com/${chartid}`)});
                    }
                    else
                    {
                        this.shareUrl(`http://napchart.com/${this.state.chartId}`)
                    }

                }).catch(error => console.log(error))
            }
        }
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

        return (
            <Ons.Splitter>
                <Ons.SplitterSide side='right' width={220} collapse={true} swipeable={true} isOpen={this.state.menuShown} onClose={this.closeMenu} onOpen={this.showMenu}>
                    <Ons.Page>
                        <Ons.List>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.loadFromNapChart()}}><Ons.Icon fixedWidth size={25} icon='md-cloud-download'></Ons.Icon>Load from napchart</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.saveDataToNapchart()}}><Ons.Icon fixedWidth size={25} icon='md-cloud-upload'></Ons.Icon>Save to napchart</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.shareNapChartUrl()}}><Ons.Icon fixedWidth size={25} icon='md-share'></Ons.Icon>Share napchart link</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.saveSchedule()}}><Ons.Icon fixedWidth size={25} icon='md-floppy'></Ons.Icon>Save</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.shareChart()}}><Ons.Icon fixedWidth size={25} icon='md-share'></Ons.Icon>Share chart</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.closeMenu(); this.clearChartData()}}><Ons.Icon fixedWidth size={25} icon='md-spinner'></Ons.Icon>Clear</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.showSettingDialog(); this.closeMenu(); }}><Ons.Icon fixedWidth size={25} icon='md-settings'></Ons.Icon>Setting</Ons.ListItem>
                            <Ons.ListItem tappable onClick={() => {this.showAboutDialog(); this.closeMenu();}}><Ons.Icon fixedWidth size={25} icon='md-make'></Ons.Icon>About</Ons.ListItem>
                        </Ons.List>
                    </Ons.Page>
                </Ons.SplitterSide>
                <Ons.SplitterContent>
                    <Ons.Page
                        renderToolbar={this.renderToolbar}
                        renderBottomToolbar={this.renderBottomToolbar}
                        renderModal={this.renderLoadingModal}>
                        {this.renderSettingDialog()}
                        {this.renderNapchartUrlDialog()}
                        {this.renderAboutDialog()}
                        <Chart
                            ref="chart"
                            setCanvas={this.setCanvas}
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
        this.setState({
            isNapchartUpdated: false
        })
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

    // setAlarm = () => {
    //     console.log(this.state.napchart.data.elements);
    //     let sucess = () => {
    //         console.log("success");
    //     };
    //     let fail = () => {
    //         console.log("fall");
    //     };
    //     this.state.napchart.data.elements.forEach(element => {
    //         cordova.exec(sucess, fail, 'setalarm', 'coolMethod', [Math.floor(element.start / 60), element.start % 60]);
    //         cordova.exec(sucess, fail, 'setalarm', 'coolMethod', [Math.floor(element.end / 60), element.end % 60]);
    //     });
    // }

    shareChart = () => {
        var dt = this.state.canvas.toDataURL();
        var link = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        window.plugins.socialsharing.share(null, null, dt);
    }

    setCanvas = (canvas) => {
        this.setState({
            canvas:  canvas
        })
    }

    checkConnection = () => {
        var networkState = navigator.connection.type;
        return networkState !== Connection.NONE;
    }
}

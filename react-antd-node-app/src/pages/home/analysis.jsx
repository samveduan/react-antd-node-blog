import React, { Component } from 'react'
import { Row, Col, Card, Avatar, Statistic } from 'antd'
import { Typography } from 'antd';
import avatar from './images/avatar.png'
import ReactEcharts from 'echarts-for-react'
import './analysis.less'

const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK

function onFinish() {
    console.log('finished!');
}

const { Title, Paragraph, Text, Link } = Typography;
const { Meta } = Card;

const gridStyle = {
    width: '25%',
    textAlign: 'left',
};

export default class Analysis extends Component {
    state = {

    }

    getOption = () => {
        return {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'center',
                top: 'bottom',
                data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '半径模式',
                    type: 'pie',
                    radius: [20, 140],
                    center: ['25%', '50%'],
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 5
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: [
                        { value: 40, name: 'rose 1' },
                        { value: 33, name: 'rose 2' },
                        { value: 28, name: 'rose 3' },
                        { value: 22, name: 'rose 4' },
                        { value: 20, name: 'rose 5' },
                        { value: 15, name: 'rose 6' },
                        { value: 12, name: 'rose 7' },
                        { value: 10, name: 'rose 8' }
                    ]
                },
                {
                    name: '面积模式',
                    type: 'pie',
                    radius: [20, 140],
                    center: ['75%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 5
                    },
                    data: [
                        { value: 30, name: 'rose 1' },
                        { value: 28, name: 'rose 2' },
                        { value: 26, name: 'rose 3' },
                        { value: 24, name: 'rose 4' },
                        { value: 22, name: 'rose 5' },
                        { value: 20, name: 'rose 6' },
                        { value: 18, name: 'rose 7' },
                        { value: 16, name: 'rose 8' }
                    ]
                }
            ]
        };
    }

    getOption2 = () => {
        return {
            title: {
                text: '',
                subtext: 'From ExcelHome',
                sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var tar;
                    if (params[1].value !== '-') {
                        tar = params[1];
                    }
                    else {
                        tar = params[0];
                    }
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                }
            },
            legend: {
                data: ['支出', '收入']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                splitLine: { show: false },
                data: function () {
                    var list = [];
                    for (var i = 1; i <= 11; i++) {
                        list.push('11月' + i + '日');
                    }
                    return list;
                }()
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '辅助',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        barBorderColor: 'rgba(0,0,0,0)',
                        color: 'rgba(0,0,0,0)'
                    },
                    emphasis: {
                        itemStyle: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
                },
                {
                    name: '收入',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'top'
                    },
                    data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
                },
                {
                    name: '支出',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'bottom'
                    },
                    data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
                }
            ]
        };
    }

    getCardList = cardList => {
        return cardList.map((value, index) => {
            return (
                <Card.Grid style={gridStyle} key={index} >
                    <Meta
                        avatar={<Avatar src={require("./images/" + value.img).default} />}
                        title={value.title}
                        description={value.description}
                    />
                </Card.Grid>);
        })
    }

    render() {
        const cardList = [{
            title: "Alipay",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'bootstrap.png'
        }, {
            title: "Angular",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'alipay.png'
        }, {
            title: "Ant Design",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'react.png'
        }, {
            title: "Ant Design Pro",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'pro.png'
        }, {
            title: "Ant Design",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'ai.png'
        }, {
            title: "Ant Design Pro",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'bootstrap.png'
        }, {
            title: "Alipay",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一",
            img: 'alipay.png'
        }, {
            title: "Angular",
            description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一的",
            img: 'ai.png'
        }];

        return (
            <div>
                <Row gutter={24}>
                    <Col span={24}>
                        <Card title="工作台">
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Meta
                                        avatar={<Avatar src={require("./images/avatar.png").default} style={{ width: 60, height: 60 }} />}
                                        title={<Title level={4}>"早安，Serati Ma，祝你开心每一天！"</Title>}
                                        description="交互专家 |蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED"
                                    />
                                </Col>
                                <Col span={3}>
                                    <Statistic title="今日交易总额" value={112893} />
                                </Col>
                                <Col span={3}>
                                    <Statistic title="销售目标完成率" value={112893} precision={2} />
                                </Col>
                                <Col span={3}>
                                    <Countdown title="活动剩余时间" value={deadline} onFinish={onFinish} />
                                </Col>
                                <Col span={3}>
                                    <Countdown title="每秒交易总额" value={deadline} format="HH:mm:ss:SSS" />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <div style={{ height: 24, clear: 'both' }}></div>

                <Row gutter={24}>
                    <Col span={24}>
                        <Card title="进行中的项目" extra={<a href="#">更多</a>}>
                            {this.getCardList(cardList)}
                        </Card>
                    </Col>
                </Row>

                <div style={{ height: 24, clear: 'both' }}></div>

                <Row gutter={24}>
                    <Col span={18}>
                        <Card title="南丁格尔玫瑰图" style={{ width: '100%' }}>
                            <ReactEcharts option={this.getOption()}></ReactEcharts>
                        </Card>

                        <div style={{ height: '20px' }}></div>
                    </Col>

                    <Col span={6}>
                        <Card title="阶梯瀑布图">
                            <ReactEcharts option={this.getOption2()}></ReactEcharts>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
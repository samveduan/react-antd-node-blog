import React, { Component } from 'react'
import { Layout } from 'antd'
import { Route, Redirect, Switch } from 'react-router-dom'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import Monitor from '../home/monitor'
import Analysis from '../home/analysis'
import StandardList from '../home/standard-list'
import './admin.less'

const { Content, Sider } = Layout;

export default class Admin extends Component {
    state = {
        collapsed: false
    };

    // 控制菜单左右缩放
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Header/>
                <Layout style={{ height: '100%' }}>
                    <Sider width={200} style={{ background: '#000000' }} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <LeftNav/>
                    </Sider>
                    <Layout className="site-layout" style={{ paddingTop: 64 }}>
                        <Content
                            className="main-content"
                            style={{ overflowX: 'hidden' }}
                        >
                            <Switch>
                                <Route path="/monitor" component={Monitor}/>
                                <Route path="/analysis" component={Analysis}/>
                                <Route path="/standardlist" component={StandardList}/>
                                <Redirect to="/monitor"/>
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
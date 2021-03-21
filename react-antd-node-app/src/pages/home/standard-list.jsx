import React, { Component, useState } from 'react'
import { Row, Col, Card, Table, Avatar, Typography, Progress, Button, Input, Radio, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import store from '../../store'
import { sendAction } from '../../action'

const { Search } = Input;
const { Title, Paragraph, Text, Link } = Typography;
const { Meta } = Card;

export default class StandardList extends Component {
    state = {
        type: 'all',
        selectedRowKeys: [], // 表格选择项Keys
        selectedRows: [], // 表格选择项Rows
        tableData: [],
        total: 0
    }

    onSearch = value => console.log(value);

    onSizeChange = e => this.setState({
        type: e.target.value
    })

    getDataSource = (pageNumber, pageSize) => {
        axios.get(`http://localhost:5555/api/blog_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
            let ajaxData = [];
            for (let i = 0; i < resp.data.rows.length; i++) {
                ajaxData.push({
                    key: resp.data.rows[i].id,
                    id: resp.data.rows[i].id,
                    title: resp.data.rows[i].title,
                    content: resp.data.rows[i].content.replace(/<[^>]*>|<\/[^>]*>/gm, "").substring(0, 54),
                    datetime: resp.data.rows[i].datetime,
                });
            }

            this.setState({
                tableData: ajaxData,
                total: resp.data.total
            })
        }, (err) => {
            console.log(err);
        });
    }

    getColumns = () => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 30,
            },
            {
                title: '标题',
                dataIndex: 'title',
                render: (text, record) => {
                    if (record.title.length < 15) {
                        return <Meta
                            avatar={<Avatar src={require("./images/bootstrap.png").default} style={{ width: 30, height: 30 }} />}
                            title={<Title level={5}>{record.title}</Title>}
                            description={record.content}
                        />
                    } else if (record.title.length >= 15 && record.title.length < 20) {
                        return <Meta
                            avatar={<Avatar src={require("./images/react.png").default} style={{ width: 30, height: 30 }} />}
                            title={<Title level={5}>{record.title}</Title>}
                            description={record.content}
                        />
                    } else if (record.title.length >= 20 && record.title.length < 25) {
                        return <Meta
                            avatar={<Avatar src={require("./images/alipay.png").default} style={{ width: 30, height: 30 }} />}
                            title={<Title level={5}>{record.title}</Title>}
                            description={record.content}
                        />
                    } else if (record.title.length >= 25 && record.title.length < 30) {
                        return <Meta
                            avatar={<Avatar src={require("./images/pro.png").default} style={{ width: 30, height: 30 }} />}
                            title={<Title level={5}>{record.title}</Title>}
                            description={record.content}
                        />
                    } else {
                        return <Meta
                            avatar={<Avatar src={require("./images/ai.png").default} style={{ width: 30, height: 30 }} />}
                            title={<Title level={5}>{record.title}</Title>}
                            description={record.content}
                        />
                    }
                }
            },
            {
                title: '内容',
                width: 300,
                dataIndex: 'content',
                render(text, record) {
                    return <Progress percent={record.title.length * 2.5} status={record.title.length * 2.5 > 80 ? 'exception ' : 'normal '} />
                }
            },
            {
                title: '发布时间',
                width: 200,
                dataIndex: 'datetime'
            }
        ];
    }

    onChange = (pageNumber, pageSize) => {
        this.pageNum = pageNumber;
        this.pageSize = pageSize;
        this.getDataSource(pageNumber, pageSize);
    };

    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    onClickForRedux = () => {
        const action = sendAction();
        store.dispatch(action);
    }

    componentDidMount() {
        this.getDataSource(1, 5);

        store.subscribe(() => {
            console.log("subscribe store.getState()");
            console.log(store.getState());
        })
    }

    render() {
        // 控制表格选择
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange
        };

        return (<>
            <Row gutter={24}>
                <Col span={24}>
                    <Card title="标准列表" extra={<Space><Radio.Group value={this.state.type} onChange={this.onSizeChange}><Radio.Button value="all">全部</Radio.Button><Radio.Button value="ing">进行中</Radio.Button><Radio.Button value="waiting">等待</Radio.Button></Radio.Group><Search placeholder="请输入" allowClear onSearch={this.onSearch} style={{ width: 200 }} /></Space>}>
                        <Button type="dashed" block icon={<PlusOutlined />} style={{ borderColor: "#1890ff", marginBottom: 15, color: "#1890ff" }} onClick={() => this.onClickForRedux()} >
                            添加
                        </Button>

                        <Table
                            onRow={record => {
                                return {
                                    onClick: event => { console.log(record) }, // 点击行
                                    onDoubleClick: event => { },
                                    onContextMenu: event => { },
                                    onMouseEnter: event => { }, // 鼠标移入行
                                    onMouseLeave: event => { },
                                };
                            }}
                            rowSelection={rowSelection}
                            columns={this.getColumns()}
                            dataSource={this.state.tableData}
                            pagination={{
                                current: this.pageNum,
                                total: this.state.total,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                defaultPageSize: 5,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `共 ${total} 条`,
                                onChange: this.onChange
                            }}
                            bordered
                        >
                        </Table>
                    </Card>
                </Col>
            </Row>
        </>)
    }
}

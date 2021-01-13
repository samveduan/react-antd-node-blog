import React, { Component } from 'react'
import { Table, Card, Modal, Button, Form, Input, notification } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

// react-draft-wysiwyg begin
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './react-draft-wysiwyg.less'
// react-draft-wysiwyg end

const layout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 19,
    }
};

export default class Home extends Component {
    state = {
        showRichText: false, // react-draft-wysiwyg
        editorContent: '', // react-draft-wysiwyg
        editorState: '', // react-draft-wysiwyg
        selectedRowKeys: [], // 表格选择项Keys
        selectedRows: [], // 表格选择项Rows
        tableData: [],
        total: 0, // for Pagination
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 30,
            },
            {
                title: '标题',
                dataIndex: 'title',
                width: 500,
                render: (text, record) => <a href="javascript: void(0)" target="_self" onClick={() => this.handleShowDetailBlog(record.id)}>{text}</a>
            },
            {
                title: '内容',
                dataIndex: 'content'
            },
            {
                title: '发布时间',
                dataIndex: 'datetime'
            },
        ],
        addModalVisible: false,
        showBlogModalVisible: false,
        blogDetail: ''
    };

    /**
     * 
     * @react-draft-wysiwyg begin
     */
    handleClearContent = () => {
        this.setState({
            editorState: ''
        })
    }

    handleGetText = () => {
        this.setState({
            showRichText: true
        })
    }

    onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };
    // @react-draft-wysiwyg end

    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log('selectedRows changed: ', selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
    };

    /**
     * 表格
     */

    // 获取表格数据
    getData(pageNumber, pageSize) {
        axios.get(`http://localhost:5555/api/blog_list/?pageSize=${pageSize}&pageNumber=${pageNumber}&sortName=id&sortOrder=desc&_=1595230808893`).then((resp) => {
            let ajaxData = [];
            for (let i = 0; i < resp.data.rows.length; i++) {
                ajaxData.push({
                    key: resp.data.rows[i].id,
                    id: resp.data.rows[i].id,
                    title: resp.data.rows[i].title,
                    content: resp.data.rows[i].content.substring(0, 54),
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

    onChange = (pageNumber, pageSize) => {
        this.pageNum = pageNumber;
        this.pageSize = pageSize;
        this.getData(pageNumber, pageSize);
    };

    /**
     * 添加modal
     */

    // for modal
    showAddModal = () => {
        this.setState({
            addModalVisible: true
        })
    }

    addModalHandleOk = e => {
        const _this = this;
        this.addModalFormRef.current.validateFields()
            .then(values => {
                console.log(this.state.editorContent);
                const params = {
                    title: values.title,
                    content: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
                };

                axios.post(`http://localhost:5555/api/add_blog`, qs.stringify(params)).then((resp) => {
                    if (resp.ret) {
                        console.log(resp.msg);
                    } else {
                        this.addModalFormRef.current.resetFields();
                        this.setState({
                            editorState: '',
                            addModalVisible: false
                        });

                        this.pageNum = 1;
                        this.getData(this.pageNum, this.pageSize);
                    }
                }, (err) => {
                    console.log(err);
                });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    addModalHandCancel = e => {
        this.addModalFormRef.current.resetFields();
        this.setState({
            addModalVisible: false
        })
    }

    /**
     * 删除blog
     */
    onDeleteAdministrators = () => {
        let len = this.state.selectedRowKeys.length;

        if (len === 0) {
            notification['error']({
                message: '错误提示',
                description: '请选择要删除的文章！',
            })
        } else {
            const params = {
                idArr: JSON.stringify(this.state.selectedRowKeys)
            }

            const _this = this;

            axios.post(`http://localhost:5555/api/delete_blogs`, qs.stringify(params)).then((resp) => {
                if (resp.data.ret) {
                    notification['success']({
                        message: '成功提示',
                        description: resp.data.msg,
                    })

                    this.pageNum = 1;
                    _this.getData(this.pageNum, this.pageSize);
                } else {
                    notification['error']({
                        message: '错误提示',
                        description: resp.data.msg,
                    })
                }
            }, (err) => {
                notification['error']({
                    message: '错误提示',
                    description: '网络错误，删除失败！'
                })
            });
        }
    }

    // 表单相关
    addModalFormRef = React.createRef(); // 定义一个表单

    /**
     * 显示blog Modal
     */
    handleShowDetailBlog = (id) => {
        axios.get(`http://localhost:5555/api/get_blog_detail?id=${id}`, {}).then((resp) => {
            if (resp.data.ret) {
                this.setState({
                    showBlogModalVisible: true,
                    blogDetail: resp.data.content
                })
            } else {

            }
        }, (err) => {
            console.log(err);
        });
    }

    handleShowBlogModalHandleOk = () => {
        this.setState({
            showBlogModalVisible: false
        })
    }

    handleShowBlogModalHandleCancel = () => {
        this.setState({
            showBlogModalVisible: false
        })
    }

    /**
     * 钩子函数
     */
    componentDidMount() {
        this.getData(1, 10);
    }

    render() {
        // 控制表格选择
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange
        };

        return (<>
            <Card title="博客列表" extra={<span><Button type="primary" ghost size="small" icon={<PlusOutlined />} style={{ marginRight: 15 }} onClick={this.showAddModal}>添加</Button><Button type="primary" ghost size="small" icon={<MinusOutlined />} onClick={() => { this.onDeleteAdministrators() }}>删除</Button></span>} style={{ width: '100%' }}>
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
                    columns={this.state.columns}
                    dataSource={this.state.tableData}
                    pagination={{
                        current: this.pageNum,
                        total: this.state.total,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `共 ${total} 条`,
                        onChange: this.onChange
                    }}
                    bordered
                >
                </Table>

                <Modal
                    title="创建"
                    visible={this.state.addModalVisible}
                    width={800}
                    onOk={this.addModalHandleOk}
                    onCancel={this.addModalHandCancel}
                    okText="确认"
                    cancelText="取消"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form {...layout} ref={this.addModalFormRef} name="control-ref" preserve={false}>
                        <Form.Item label="标题" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="title"
                                style={{ display: 'inline-block', width: 'calc(100% - 8px)', marginRight: 15 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "标题不能为空"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="内容" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="content"
                                style={{ display: 'inline-block', width: 'calc(100% - 8px)' }}
                                rules={[
                                    {
                                        required: true,
                                        message: "内容不能为空"
                                    }
                                ]}
                            >
                                <Editor
                                    editorState={this.state.editorState}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                />
                                {/* <TextArea rows={4} /> */}
                            </Form.Item>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="详情"
                    visible={this.state.showBlogModalVisible}
                    width={800}
                    onOk={this.handleShowBlogModalHandleOk}
                    onCancel={this.handleShowBlogModalHandleCancel}
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    destroyOnClose={true}
                    footer={null}
                >
                    <div dangerouslySetInnerHTML={{ __html: this.state.blogDetail }} style={{ height: 400, overflow: 'auto' }} />
                </Modal>
            </Card>
        </>
        )
    }
}
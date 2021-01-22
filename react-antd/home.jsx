import React, { Component } from 'react'
import { Table, Card, Modal, Button, Form, Input, notification } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { PlusOutlined, MinusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// react-draft-wysiwyg begin
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './react-draft-wysiwyg.less'
// react-draft-wysiwyg end

const { confirm } = Modal;

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
        selectedRowKeys: [], // ���ѡ����Keys
        selectedRows: [], // ���ѡ����Rows
        tableData: [],
        total: 0, // for Pagination
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 30,
            },
            {
                title: '����',
                dataIndex: 'title',
                width: 500,
                render: (text, record) => <a href="javascript: void(0)" target="_self" onClick={() => this.handleShowDetailBlog(record.id)}>{text}</a>
            },
            {
                title: '����',
                dataIndex: 'content',
                render(text, record) {
                    return <div dangerouslySetInnerHTML={{ __html: record.content }} style={{}} />
                }
            },
            {
                title: '����ʱ��',
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

    // ͼƬ�ϴ�
    uploadImageCallBack = file => {
        const formData = new FormData();
        formData.append('pic-upload', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5555/api/upload');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
            }
        }
    }
    // @react-draft-wysiwyg end

    onTableSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    /**
     * ���
     */

    // ��ȡ�������
    getData(pageNumber, pageSize) {
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

    onChange = (pageNumber, pageSize) => {
        this.pageNum = pageNumber;
        this.pageSize = pageSize;
        this.getData(pageNumber, pageSize);
    };

    /**
     * ���modal
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
     * ɾ��blog
     */
    onDeleteAdministrators = () => {
        let len = this.state.selectedRowKeys.length;
        const _this = this;

        if (len === 0) {
            notification['error']({
                message: '������ʾ',
                description: '��ѡ��Ҫɾ�������£�',
            })
        } else {
            confirm({
                title: 'ȷ��ɾ��ѡ���������?',
                icon: <ExclamationCircleOutlined />,
                content: '',
                okText: "ȷ��",
                cancelText: "ȡ��",
                onOk() {
                    // ɾ�� begin
                    const params = {
                        idArr: JSON.stringify(_this.state.selectedRowKeys)
                    }

                    axios.post(`http://localhost:5555/api/delete_blogs`, qs.stringify(params)).then((resp) => {
                        if (resp.data.ret) {
                            notification['success']({
                                message: '�ɹ���ʾ',
                                description: resp.data.msg,
                            })

                            _this.pageNum = 1;
                            _this.getData(_this.pageNum, _this.pageSize);
                        } else {
                            notification['error']({
                                message: '������ʾ',
                                description: resp.data.msg,
                            })
                        }
                    }, (err) => {
                        notification['error']({
                            message: '������ʾ',
                            description: '�������ɾ��ʧ�ܣ�'
                        })
                    });
                    // ɾ�� end
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }

    // �����
    addModalFormRef = React.createRef(); // ����һ����

    /**
     * ��ʾblog Modal
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
     * ���Ӻ���
     */
    componentDidMount() {
        this.getData(1, 10);
    }

    render() {
        // ���Ʊ��ѡ��
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onTableSelectChange
        };

        return (<>
            <Card title="�����б�" extra={<span><Button type="primary" ghost size="small" icon={<PlusOutlined />} style={{ marginRight: 15 }} onClick={this.showAddModal}>���</Button><Button type="primary" ghost size="small" icon={<MinusOutlined />} onClick={() => { this.onDeleteAdministrators() }}>ɾ��</Button></span>} style={{ width: '100%' }}>
                <Table
                    onRow={record => {
                        return {
                            onClick: event => { console.log(record) }, // �����
                            onDoubleClick: event => { },
                            onContextMenu: event => { },
                            onMouseEnter: event => { }, // ���������
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
                        showTotal: (total, range) => `�� ${total} ��`,
                        onChange: this.onChange
                    }}
                    bordered
                >
                </Table>

                <Modal
                    title="����"
                    visible={this.state.addModalVisible}
                    width={800}
                    onOk={this.addModalHandleOk}
                    onCancel={this.addModalHandCancel}
                    okText="ȷ��"
                    cancelText="ȡ��"
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <Form {...layout} ref={this.addModalFormRef} name="control-ref" preserve={false}>
                        <Form.Item label="����" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="title"
                                style={{ display: 'inline-block', width: 'calc(100% - 8px)', marginRight: 15 }}
                                rules={[
                                    {
                                        required: true,
                                        message: "���ⲻ��Ϊ��"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="����" style={{ marginBottom: 0 }}>
                            <Form.Item
                                name="content"
                                style={{ display: 'inline-block', width: 'calc(100% - 8px)' }}
                                rules={[
                                    {
                                        required: true,
                                        message: "���ݲ���Ϊ��"
                                    }
                                ]}
                            >
                                <Editor
                                    editorState={this.state.editorState}
                                    localization={{ locale: 'zh' }}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                    toolbar={{
                                        image: {
                                            urlEnabled: true,
                                            uploadEnabled: true,
                                            alignmentEnabled: true,   // �Ƿ���ʾ���а�ť �൱��text-align
                                            uploadCallback: this.uploadImageCallBack,
                                            previewImage: true,
                                            inputAccept: 'image/*',
                                            alt: { present: false, mandatory: false, previewImage: true }
                                        },
                                    }}
                                />
                                {/* <TextArea rows={4} /> */}
                            </Form.Item>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="����"
                    visible={this.state.showBlogModalVisible}
                    width={800}
                    onOk={this.handleShowBlogModalHandleOk}
                    onCancel={this.handleShowBlogModalHandleCancel}
                    okText="ȷ��"
                    cancelText="ȡ��"
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
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Collapse, Modal, Descriptions, Slider, Form, Input, InputNumber, message, Row, Space, Spin, Steps, Switch, theme, Upload, UploadProps, InputNumberProps, Divider, FormInstance } from 'antd';
import { MinusCircleOutlined, CheckOutlined, CloseOutlined, MoneyCollectTwoTone, PlusCircleTwoTone, PlusOutlined, ReconciliationTwoTone, ToolTwoTone, UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TokenMetaPage } from './Tokenmeta';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createWallets, saveTokenMeta } from '../../services/Services';
import { TokenMeta } from '../../components/constants';
import { FormListFieldData } from 'antd/lib';
import { createMetadata } from '../../utils/util';

export const NewLaunch: React.FC = () => {
  const { token } = theme.useToken();
  const { user } = useAuth();
  const { connection } = useConnection();
  const { connected, publicKey, wallet, signTransaction, sendTransaction } = useWallet();
  const [metadataform] = Form.useForm();
  const [walletsMetaForm] = Form.useForm();

  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [dataSource, setDataSource] = useState<TokenMeta>();
  const [inputValue, setInputValue] = useState<number>(0.01);
  const [totalBudget, setTotalBudget] = useState<number>(0.01);
  const [tokenMint, setTokenMint] = useState<string | undefined>(undefined);
  const [walletsData, setWalletsData] = useState<any>([]);
  const [inputJitoFeesValue, setInputJitoFeesValue] = useState<number>(0.001)
  //Modal Configs

  const [jitofeesvisible, setJitofeesvisible] = useState(false);
  const [genWalletsvisible, setGenWalletsvisible] = useState(false);
  const [walletCount, setWalletCount] = useState<number>(1)
  const [maxWalletSpend, setMaxWalletSpend] = useState<number>(0.01)


  const onChange: InputNumberProps['onChange'] = (value) => {
    if (isNaN(value as number)) {
      return;
    }
    setInputValue(value as number);
  };

  const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    margin: '0px', padding: '0px'
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  const props: UploadProps = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png' || file.type == 'image/jpeg';
      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleBuyerWallets = async () => {
    console.log('Received values of form:', await walletsMetaForm.getFieldsValue());
  };
  const handleWalletsFormSubmit = async () => {
    const genwallets = await walletsMetaForm.getFieldsValue(); 
 
    if (!publicKey) {
      message.error(' Wallet Not Connected');
      return;
    }

    if (publicKey && dataSource) {
      setSpinning(true) 
      const mint = dataSource.mint;
      const walletsCount = genwallets.walletCount;

      if (walletsCount > 17) {
        message.error('Wallet Count cannot be greater than 17');
        return;
      }
      const walletMeta = {
        mint: mint,
        walletsCount: walletsCount,
        maxWalletSpend: maxWalletSpend
      }

      const { wallets, tokenMeta } = await createWallets(walletMeta).catch((err)=>{
        setSpinning(false);
        message.error(err);

      });

      if (wallets && tokenMeta) {
        console.log(JSON.stringify(wallets));
        setDataSource(tokenMeta);
      }
      setSpinning(false)
      setGenWalletsvisible(false)
      //message.error(JSON.stringify(walletMeta));
    } else {
      message.error(' Token Meta Not Generated');
      return;
    }
  }
  const disableForm = (dform: FormInstance) => {
    const fields = dform.getFieldsValue();
    const updatedFields = Object.keys(fields).map((field) => ({
      name: field,
      value: fields[field],
      disabled: true,
    }));
    dform.setFields(updatedFields);
  };

  const handleSubmit = async () => {

    if (!publicKey) {
      message.error(' Wallet Not Connected ');
      return;
    }
    const values = await metadataform.validateFields();
    const file = values.imageFile.length > 0 ? values.imageFile[0].originFileObj : null;
    const name = values.tokenName ? values.tokenName : null;
    const symbol = values.tokenSymbol ? values.tokenSymbol : null;
    const description = values.description ? values.description : null;
    const twitter = values.twitterUrl ? values.twitterUrl : '';
    const telegram = values.telegramUrl ? values.telegramUrl : '';
    const website = values.websiteUrl ? values.websiteUrl : '';

    if (file == null) message.error(' Image File is Missing ');
    if (name == null) message.error(' Token Name is Missing ');
    if (symbol == null) message.error(' Token Symbol is Missing ');
    if (description == null) message.error(' Description is Missing ');
    setSpinning(true)
    
    const result: any = await createMetadata(
      symbol+'.png',
      name,
      symbol,
      description,
      twitter,
      telegram,
      website,
      file
    )
     

    if (result != null) {

      const tokenMeta = {
        name: name,
        symbol: symbol,
        description: description,
        metadataUrl: result,
        twitter: twitter,
        telegram: telegram,
        website: website,
        showName: true,
        publicKey: publicKey.toBase58(),
        bundleStatus: 'INIT'
      }
      await saveTokenMeta(tokenMeta).catch((err) => {
        setSpinning(false);
        message.error(new String(err));
        return;
      }).then((data: TokenMeta) => {
        if (data && data._id) {
          setSpinning(false);
          console.log(data);
          setDataSource(data);
          setTokenMint(data.mint);
          return;
        }
      });
      setSpinning(false);
    }
  }


  return (
    <PageContainer>
      <Spin spinning={spinning} fullscreen />
      <Card
        style={{
          borderRadius: 8,
          boxShadow: '1px 1px 10px 0px #2196f38c, -1px -1px 1px 0px #fff9'
        }}
      >
        <Collapse defaultActiveKey={['1']} accordion style={{
          borderRadius: 0,
          padding: '0px',
          width: '100%',
          border: 'none'
        }}>
          <Collapse.Panel header=<h4>Token Meta</h4> key="1" >
            <Form layout="horizontal" form={metadataform} autoComplete="off" onFinish={handleSubmit} lang='en_US'>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="tokenName"
                    label="Token Name"
                    rules={[{ required: true, message: 'Please enter token name' }]}
                  >
                    <Input placeholder="Please enter token name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="tokenSymbol"
                    label="Symbol"
                    rules={[{ required: true, message: 'Please enter Token Symbol' }]}
                  >
                    <Input placeholder="Please enter Token Symbol" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="telegramUrl"
                    label="Telegram"
                  >
                    <Input
                      addonBefore="http://"
                      placeholder="Please enter url"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="imageFile"
                    label="Image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload a image file' }]}
                  >
                    <Upload  {...props}
                      listType="picture"
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload (Max: 1)</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="twitterUrl"
                    label="Twitter"
                  >
                    <Input
                      addonBefore="http://"
                      placeholder="Please enter url"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="websiteUrl"
                    label="Website"
                  >
                    <Input
                      addonBefore="http://"
                      placeholder="Please enter url"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: 'please enter url description',
                      },
                    ]}
                  >
                    <Input.TextArea rows={3} placeholder="please enter url description" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <div style={{ marginTop: 24, justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end' }}>
                  <Space align='end'>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                    <Button type="dashed" htmlType="reset">
                      Reset
                    </Button>
                  </Space>
                </div>
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header=<h4>Bundler Meta</h4> key="2" collapsible={!tokenMint ? "header" : 'header'} >
            <Modal
              title="Generate Wallets Config"
              open={genWalletsvisible}
              onOk={() => setGenWalletsvisible(false)}
              onCancel={() => setGenWalletsvisible(false)}
              okText="Submit"
              cancelText="Cancel"
              width={400} // Adjust the width as needed
              footer={null}
            >
              <Form
                name="myForm"
                form={walletsMetaForm}
                layout='horizontal'
                labelCol={{ span: 16 }} // Adjust label column width as needed
                wrapperCol={{ span: 24 }} // Adjust wrapper column width as needed
              >
                <Form.Item
                  label="Wallets Count "
                  name="walletCount"
                  rules={[{ required: true, message: 'Enter Wallets Count' }]}
                >
                  <InputNumber
                    value={walletCount}
                    onChange={(value: any) => setWalletCount(value)}
                    placeholder="Enter Wallets Count "
                    min={1}
                    step={4}
                    max={17}
                    defaultValue={2}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Wallet Spend"
                  name="maxWalletSpend"
                  rules={[{ required: true, message: 'Enter Max Wallet Spend' }]}
                >
                  <InputNumber
                    value={maxWalletSpend}
                    onChange={(value: any) => setMaxWalletSpend(value)}
                    placeholder="Enter Max Wallet Spend"
                    min={0.01}
                    step={0.01}
                    max={20}
                    defaultValue={0.01}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" onClick={() => handleWalletsFormSubmit()}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>

            </Modal>
            <Modal
              title="Set Jito Fees"
              open={jitofeesvisible}
              onOk={() => setJitofeesvisible(false)}
              onCancel={() => setJitofeesvisible(false)}
              okText="Submit"
              cancelText="Cancel"
              width={300} // Adjust the width as needed
              footer={null}
            >
              <Space size={'small'} direction='horizontal'>
                <InputNumber
                  value={inputJitoFeesValue}
                  onChange={(value: any) => setInputJitoFeesValue(value)}
                  placeholder="Enter Jito Fees"
                  min={0.001}
                  step={0.001}
                  defaultValue={0.001}
                />
                <Button type="primary" onClick={() => setJitofeesvisible(false)}>
                  Ok
                </Button>
              </Space>
            </Modal>
            <Card title="" extra={
              <Space>
                {/* <Button type="dashed" size='small' onClick={() => setJitofeesvisible(true)}>Set Jito Fees</Button> */}
                <Button type="dashed" size='small' onClick={() => setGenWalletsvisible(true)}>Generate Wallets</Button>
              </Space>

            } bordered={false} >

              <Form
                name="dynamic_form_item" form={walletsMetaForm}
                {...formItemLayoutWithOutLabel}
                onFinish={handleBuyerWallets}
                size='small'
                style={{
                  maxWidth: '100%',
                }}
              >
                <Row gutter={4}>
                  <Col span={8}>
                    <Form.Item
                      name="walletBuyRange"
                      label="Each Wallet Max Spend (in SOL)"
                      labelAlign='right'
                    >
                      <Input defaultValue={inputValue} onChange={(value: any) => setInputValue(value)} step={0.005} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="jitoFees"
                      label="Jito Fees (in SOL)"
                      labelAlign='right'
                      isListField
                    >
                      <Input defaultValue={inputValue} onChange={(value: any) => setInputValue(value)} step={0.005} />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Form.List
                  name="wallets"
                  rules={[
                    {
                      validator: async (_, wallets) => {
                        if (!wallets || wallets.length < 2) {
                          return Promise.reject(new Error('At least 2 Wallets'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <Row gutter={3}>
                      {fields.map((field, index) => (
                        <Col span={6}>
                          <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayout)}
                            label={index === 0 ? 'W' + index : 'W' + index}
                            required={false}
                            key={field.key}
                          >
                            <Form.Item
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              noStyle
                            >
                              <Input
                                placeholder="Enter Sol Amount"
                                style={{
                                  width: '60%',
                                }}
                              />
                            </Form.Item>
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                              />
                            ) : null}
                          </Form.Item>
                        </Col>
                      ))}
                      <Divider />
                      <Row gutter={3}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              let totalBudget = 0;
                              let data = [];

                              for (var i = 0; i < 17; i++) {
                                if (fields.length < 17) {
                                  let val = Number(Number(Math.random() * inputValue).toFixed(4));
                                  while (val == 0) {
                                    val = Number(Number(Math.random() * inputValue).toFixed(4))
                                  }
                                  totalBudget += val;
                                  data.push({ wallet: 'Wallet', amount: val });

                                  setTotalBudget(totalBudget)
                                  add(val)
                                } else {
                                  message.error('Cannot add more than 17 wallets')
                                  break;
                                }
                              }
                              setWalletsData(data);
                            }}
                            style={{
                              marginTop: '20px',
                            }}
                            icon={<PlusOutlined />}
                          >
                            Add Max Wallets
                          </Button>
                          <Button
                            type="dashed"
                            onClick={() => {
                              if (fields.length < 17) {
                                let val = Number(Math.random() * inputValue).toFixed(4);
                                walletsData.push({ wallet: 'Wallet', amount: val });
                                add(Number(Number(Math.random() * inputValue).toFixed(4)))
                                setWalletsData(walletsData);

                              } else {
                                message.error('Cannot add more than 17 wallets')
                              }
                            }}
                            style={{
                              marginTop: '20px',
                            }}
                            icon={<PlusOutlined />}
                          >
                            Add One Wallet
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </Row>
                    </Row>

                  )}
                </Form.List>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button> &nbsp;&nbsp;&nbsp;
                  <Button type="dashed" htmlType="reset">
                    Reset
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            <Card title="Wallets and Total Budget" bordered={false} style={{ marginTop: '24px' }}>
              <Descriptions bordered column={5} layout="vertical" size='small'>
                {walletsData.map((wallet: any, index: number) => (
                  <Descriptions.Item label={`Wallet ${index + 1}`} key={index}>
                    {wallet.amount} SOL
                  </Descriptions.Item>
                ))}
                <Descriptions.Item label="Total Budget">
                  <h4>{totalBudget.toFixed(4)} SOL</h4>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Collapse.Panel>
          <Collapse.Panel header=<h4>Fund & Launch</h4> key="3" collapsible={!tokenMint ? "disabled" : 'header'} >
            <Card.Grid style={gridStyle}>
              {dataSource &&

                <>
                  <Descriptions column={3} size="small" bordered={true} >
                    <Descriptions.Item label="Bundle Status"> {dataSource.bundleStatus}</Descriptions.Item>
                    <Descriptions.Item label="Token Name"> {dataSource.name}</Descriptions.Item>
                    <Descriptions.Item label="Token Symbol"> {dataSource.symbol}</Descriptions.Item>
                    <Descriptions.Item label="MetaData Uri"> {dataSource.metadataUrl.substring(0, 999)}</Descriptions.Item>
                  </Descriptions>
                  <Descriptions column={2} size="small" bordered={true}>
                    <Descriptions.Item label="Funder Wallet"> {dataSource.fundingwallet}</Descriptions.Item>
                    <Descriptions.Item label="Balance">
                      <Button type="primary">
                        Fund
                      </Button>
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions column={2} size="small" bordered={true}>
                    <Descriptions.Item label="Deploy Wallet"> {dataSource.devwallet}</Descriptions.Item>
                    <Descriptions.Item label="Balance">
                      <Button type="primary">
                        Fund
                      </Button>
                    </Descriptions.Item>
                  </Descriptions>
                </>

              }
            </Card.Grid >
          </Collapse.Panel>
        </Collapse>
      </Card>
    </PageContainer >
  );
};

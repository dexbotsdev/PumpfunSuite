import React from "react";
import { BankTwoTone, CheckOutlined, CloseOutlined, MoneyCollectTwoTone, PlusCircleTwoTone, PlusOutlined, ReconciliationTwoTone, ToolTwoTone, UploadOutlined } from '@ant-design/icons';
import { Form, Row, Col, Input, Upload, Button, InputNumber, UploadProps, message, Switch } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { saveTokenMeta } from "../../../services/Services";
import { createMetadata } from "../../../utils/util";

export const TokenMetaPage: React.FC = () => {
    const { connection } = useConnection();
    const { connected, publicKey, wallet, signTransaction, sendTransaction } = useWallet();
    const [metadataform] = Form.useForm();
    const [spinning, setSpinning] = React.useState<boolean>(false);

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



            const resp = await saveTokenMeta(tokenMeta);


            setSpinning(false);
        } 
    }

    
    return (
        <main
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: '10px'
            }}
        >
            <Form layout="horizontal" form={metadataform} autoComplete="off" onFinish={handleSubmit}>
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
                                <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
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

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="enableRandom"
                            label="Enable Random Buys"
                            rules={[{
                                required: true
                            }]}
                        >
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="maxTradeTokens"
                            label="Max Wallet Buys (in M)"
                            rules={[{
                                required: true
                            }]}
                        >
                            <InputNumber min={0.01} max={1000} defaultValue={1}

                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="devWalletBuys"
                            label="Dev Wallet Buys (in Sol)"
                            rules={[{
                                required: true
                            }]}
                        >
                            <InputNumber min={0.01} max={1000} defaultValue={1}

                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </main>
    );
};

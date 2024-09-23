import { FundTwoTone, PlusOutlined, ReloadOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Descriptions, message, Spin, } from 'antd';
import { Button, Card, Flex, Input, Modal, Form, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { claimDevSols, claimSols, getTokenMeta } from '../services/Services';
import { TokenMeta } from '../components/constants';
import { recoverSols } from '../services/Services';
import { sellAllWallets } from '../services/Services';
import WalletsManagerTable from '../components/WalletsManagerTable';
import { useParams } from 'react-router-dom';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";




const ManageLaunch: React.FC = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();

  const { connection } = useConnection();
  const { connected, publicKey, wallet, signTransaction, sendTransaction } = useWallet();
  const [dataSource, setDataSource] = useState<TokenMeta>();
  const [TokenMetaCreated, setTokenMetaCreated] = useState(false);
  const [spinning, setSpinning] = React.useState<boolean>(false);
  const {user} = useKindeAuth();


  const [walletBalance, setWalletBalance] = useState<any>();
  const [fundingwalletBalance, setFundingwalletBalance] = useState<any>();
  const [devwalletBalance, setDevwalletBalance] = useState<any>();

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchTokenForm] = Form.useForm();

  const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    margin: '0px', padding: '0px'
  };

  const handleSearchToken = async () => {

    const values = await searchTokenForm.validateFields();
    setSpinning(true);


    const tokenMeta = await getTokenMeta(''+user?.id,values.tokenMint);

    if (tokenMeta.fundingwallet) {
      const fwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.fundingwallet));
      const dwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.devwallet));

      setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
      setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')

      setDataSource(tokenMeta);
      setTokenMetaCreated(true);
      setSearchOpen(false);
      setSpinning(false);

    }

  }


  const searchAndLoadToken = async () => {
    
    const values = await searchTokenForm.validateFields();
    setSpinning(true);


    const tokenMeta = await getTokenMeta(''+user?.id,values.tokenMint);


    if (tokenMeta) {
 
      
      if (tokenMeta.fundingwallet) {
        const fwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.fundingwallet));
        const dwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.devwallet));

        setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
        setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')

        setDataSource(tokenMeta);
        setTokenMetaCreated(true);
        setSearchOpen(false);
        setSpinning(false);

      }
    }
  }



  const sellAllWalletTokens = async () => {
    if (dataSource && publicKey) {
      setSpinning(true);
      const tokenAddress = dataSource.mint;

      const sellMeta = {
        mint: tokenAddress,
        userId:''+user?.id
      }
      const tokenMeta = await sellAllWallets(sellMeta)
      console.log(tokenMeta);
      if (tokenMeta.fundingwallet) {
        const fwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.fundingwallet));
        const dwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.devwallet));

        setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
        setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')

        setDataSource(tokenMeta);
        setTokenMetaCreated(true);
        setSearchOpen(false);
        setSpinning(false);

      }


    }
  }

  const claimWalletSols = async () => {

    if (dataSource && publicKey) {

      setSpinning(true);
      const tokenAddress = dataSource.mint;

      const fundsMeta = {
        mint: tokenAddress,
        userId:''+user?.id
      }
      const tokenMeta = await claimSols(fundsMeta)
      console.log(tokenMeta);
      if (tokenMeta.fundingwallet) {
        const fwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.fundingwallet));
        const dwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.devwallet));

        setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
        setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')

        setDataSource(tokenMeta);
        setTokenMetaCreated(true);
        setSearchOpen(false);
        setSpinning(false);

      }
    }
    setSpinning(false);

  }

  const claimDevWalletSols = async () => {

    if (dataSource && publicKey) {

      setSpinning(true);
      const tokenAddress = dataSource.mint;

      const fundsMeta = {
        mint: tokenAddress,
        userId:''+user?.id
      }
      const tokenMeta = await claimDevSols(fundsMeta)
      console.log(tokenMeta);
      if (tokenMeta.fundingwallet) {
        const fwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.fundingwallet));
        const dwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.devwallet));

        setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
        setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')

        setDataSource(tokenMeta);
        setTokenMetaCreated(true);
        setSearchOpen(false);
        setSpinning(false);

      }
    }
    setSpinning(false);

  }

  const recoverWalletSols = async () => {

    if (dataSource && publicKey) {

      setSpinning(true);
      const tokenAddress = dataSource.mint;

      const fundsMeta = {
        mint: tokenAddress,
        userId:''+user?.id
      }
      const tokenMeta = await recoverSols(fundsMeta)
      console.log(tokenMeta);
      if (tokenMeta.fundingwallet) {
        const fwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.fundingwallet));
        const dwalletBalance = await connection.getBalance(new PublicKey(tokenMeta.devwallet));

        setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
        setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')


        setDataSource(tokenMeta);
        setTokenMetaCreated(true);
        setSearchOpen(false);

      }
      setSpinning(false);

    }
    setSpinning(false);

  }

  useEffect(() => {
    // Replace this with your actual API call 
    if (tokenAddress) {
      searchAndLoadToken();
    }

  }, [tokenAddress]);

  return (
    <PageContainer>
      <Spin spinning={spinning} fullscreen />
      <Card title={`Token : ${dataSource ? dataSource.mint : ''}`} bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: '1px 1px 10px 0px #2196f38c, -1px -1px 1px 0px #fff9'

        }}
        extra={
          <Flex gap="small" wrap>
            <Button type="primary" size='small'
              onClick={() => setSearchOpen(true)} icon={<PlusOutlined />}>Open Bundle</Button>
              <Button type="primary" size='small'
              onClick={() => searchAndLoadToken()} icon={<ReloadOutlined />} disabled={!TokenMetaCreated}>Refresh Wallet Balances</Button>
          </Flex>
        }
      >
        <Card.Grid style={gridStyle} hoverable={false}>
          {dataSource &&

            <>
              <Descriptions column={3} size="small" bordered={true} >
                <Descriptions.Item label="Bundle Status"> {dataSource.bundleStatus}</Descriptions.Item>
                <Descriptions.Item label="Token Name"> {dataSource.name}</Descriptions.Item>
                <Descriptions.Item label="Token Symbol"> {dataSource.symbol}</Descriptions.Item>
              </Descriptions>
              <Descriptions column={6} size="small" bordered={true} layout='vertical'>
                <Descriptions.Item label="Funding Wallet" style={{ width: '50%' }}> {dataSource.fundingwallet}</Descriptions.Item>
                <Descriptions.Item label="Balance"> {fundingwalletBalance && fundingwalletBalance}</Descriptions.Item>
                <Descriptions.Item label="Withdraw">

                  <Space>
                    <Button type="primary" style={{ backgroundColor: 'red' }}
                      onClick={() => claimWalletSols()}
                      size='small' shape="circle" icon={<DollarOutlined />} />
                    &lt; - Withdraw
                  </Space>

                </Descriptions.Item>
              </Descriptions>
              <Descriptions column={6} size="small" bordered={true} layout='vertical'>
                <Descriptions.Item label="Dev Wallet" style={{ width: '50%' }}> {dataSource.devwallet}</Descriptions.Item>
                <Descriptions.Item label="Token Balance"> {devwalletBalance && devwalletBalance}</Descriptions.Item>
                <Descriptions.Item label="Balance"> {devwalletBalance && devwalletBalance}</Descriptions.Item>
                <Descriptions.Item label="Sell/WithDraw">
                  <Space>
                    Sell - &gt;<Button type="primary" style={{ backgroundColor: 'indigo' }} size='small' shape="circle" icon={<ShoppingCartOutlined />} />
                    <Button type="primary" style={{ backgroundColor: 'red' }} onClick={() => claimDevWalletSols()} size='small' shape="circle" icon={<DollarOutlined />} />
                    &lt; - Withdraw
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </>

          }
        </Card.Grid >
        {dataSource && <WalletsManagerTable dataSource={dataSource} />}
      </Card>

      <Modal
        title={`Fetch token Metadata`}
        centered
        open={searchOpen}
        onCancel={() => setSearchOpen(false)}
        footer={[]}
      >
        <Form form={searchTokenForm} layout="vertical" autoComplete="off">
          <Form.Item name="tokenMint" label="Enter Token Mint" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" onClick={() => handleSearchToken()}>Submit</Button>
              <Button type='dashed' onClick={() => { searchTokenForm.resetFields(); setSearchOpen(false) }}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>



    </PageContainer >
  );
};

export default ManageLaunch;

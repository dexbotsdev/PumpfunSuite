import { BankTwoTone, FundTwoTone, ShoppingCartOutlined, PlusCircleTwoTone, PlusOutlined, DollarOutlined, ToolTwoTone, UploadOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormDigit } from '@ant-design/pro-components';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import type { InputNumberProps, UploadProps } from 'antd';
import { Alert, Col, Descriptions, Drawer, Row, Spin, Upload, DatePicker, Slider, Divider, } from 'antd';
import { Button, Card, Flex, Input, InputNumber, Modal, Form, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { claimDevSols, claimSols, createBundleSchedule, createWallets, getTokenMeta, getWalletsForMint, saveTokenMeta, transferFunds } from '../services/Services';
import { TokenMeta } from '../components/constants';
import { recoverSols } from '../services/Services';
import { sellAllWallets } from '../services/Services';
import { createMetadata, pinJsonToPinata, uploadFileToLightHouse } from '../utils/util';
import WalletsGenerationTable from '../components/WalletsGenerationTable';
import WalletsManagerTable from '../components/WalletsManagerTable';
import { Segmented } from 'antd';
import { useParams } from 'react-router-dom';
  import {useKindeAuth} from "@kinde-oss/kinde-auth-react";


const Launch: React.FC = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const [genWalletsOpen, setGenWalletsOpen] = useState(false);
  const { connection } = useConnection();
  const { connected, publicKey, wallet, signTransaction, sendTransaction } = useWallet();
  const [dataSource, setDataSource] = useState<TokenMeta>();
  const [walletsSource, setWalletsSource] = useState<any>();
  const [showTable, setShowTable] = useState(false);
  const [metadataform] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [TokenMetaCreated, setTokenMetaCreated] = useState(false);
  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<any>();
  const [fundingwalletBalance, setFundingwalletBalance] = useState<any>();
  const [devwalletBalance, setDevwalletBalance] = useState<any>();
  const [depositOpen, setDepositOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [fundsModalOpen, setFundsModalOpen] = useState(false);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [walletsCount, setWalletsCount] = useState(1);
  const [totalBudget, setTotalbudget] = useState(1);

  const onChange: InputNumberProps['onChange'] = (newValue) => {
    setWalletsCount(newValue as number);
  };
  const [form] = Form.useForm();
  const [walletsform] = Form.useForm();
  const [depositWalletForm] = Form.useForm();
  const [searchTokenForm] = Form.useForm();
  const [totalfunds, setTotalfunds] = useState('0');
  const [minWallet, setMinWallet] = useState(0);
  const [maxWallet, setMaxWallet] = useState(0);
  const [depositableFunds, setDepositableFunds] = useState('0');
  const [deployerFunds, setDeployerFunds] = useState('0.02');
  const [warning, setWarning] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false)
  const [fundAmountsform] = Form.useForm();
  const [bundleform] = Form.useForm();
  const [devAmountsform] = Form.useForm();
  const [jitoFees, setJitoFees] = useState<string | number>(0);
  const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    margin: '0px', padding: '0px'
  };
  const {user} = useKindeAuth();


  const openFundsModal = async () => {

    if (publicKey && dataSource) {
      const genWallets = await getWalletsForMint( ''+user?.id,dataSource.mint);

      if (genWallets && genWallets.length > 0) {
        setWalletsSource(genWallets);

        setFundsModalOpen(true);
      } else {

        setFundsModalOpen(false);
      } 
    }
  }


  const fetchProjectData = async () => {
    try {
      setShowTable(false)
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
  };

  const handleDevWalletBuysFormSubmit = async () => {

  }

  const handleWalletsFormSubmit = async () => {
    const genwallets = await walletsform.getFieldsValue();

    if (!publicKey) {
      message.error(' Wallet Not Connected');
      return;
    }

    if (publicKey && dataSource) {

      const mint = dataSource.mint;

      if (walletsCount > 17) {
        message.error('Wallet Count cannot be greater than 17');
        return;
      }

      if (genwallets.totalBudget > 50) {
        message.error('Budget Cannot be more than 50 Sols');
        return;
      }
      const walletMeta = {
        mint: mint,
        walletsCount: walletsCount,
        maxWalletSpend: genwallets.maxWalletSpend,
        totalBudget: genwallets.totalBudget,
        userId: ''+user?.id
      }
      setSpinning(true)
      await createWallets(walletMeta).catch((error: any) => {
        setSpinning(false)
        message.error(error.message);

        return;
      }).then((result) => {
        if (result.error) {
          setSpinning(false)
          message.error(result.message);

          return;
        } else {
          const { wallets, tokenMeta } = result;
          if (wallets && tokenMeta) {
            console.log(wallets);
            setDataSource(tokenMeta);
          }
          setSpinning(false)
        }
        return;
      });



    }
  }


  const handleBundleFormSubmit = async () => {

    if (!publicKey) {
      message.error(' Wallet Not Connected');
      return;
    }

    const bundlTimer = await bundleform.validateFields();
    setSpinning(true)

    if (publicKey && dataSource && bundlTimer) {
      const schedule = {
        mint: dataSource.mint,
        schedule: bundlTimer.bundleTime,
        jitoFees: jitoFees,
        userId: user?.id
      }
      const saveTime = await createBundleSchedule(schedule);

      message.info(' Schedule Created Successfully')

    }
    setBundleModalOpen(false)
    setSpinning(false);
  }


  const depositWalletFormSubmit = async (depositableFunds: string, type: string): Promise<any> => {


    if (!publicKey) {
      message.error(' Wallet Not Connected ');
      setEstimateOpen(false);
      setSpinning(false)

      return;
    }

    setSpinning(true)

    if (publicKey && dataSource && signTransaction && sendTransaction) {
      const ix = type == 'F' ? SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(dataSource.fundingwallet),
        lamports: Number(Number(depositableFunds) * LAMPORTS_PER_SOL)
      }) : SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(dataSource.devwallet),
        lamports: Number(Number(depositableFunds) * LAMPORTS_PER_SOL)
      })
      const tnx: Transaction = new Transaction();
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      tnx.feePayer = publicKey;
      tnx.recentBlockhash = blockhash;
      tnx.add(ix)

      const tnrx = await signTransaction(tnx);
      const sig = await sendTransaction(tnrx, connection);


      let done = false;
      if (dataSource.fundingwallet) {

        setTimeout(()=>{
          done=true; 
        },30000)

        while (!done) {
          const status = await connection.getSignatureStatus(sig);

          console.log(status); 

          if (status.value && status.value.err) {
            done = false;
            break;
          } else if (status.value && status.value.confirmations && status.value.confirmationStatus) {
            done = true;
            break;
          }
          await sleep(1000);
        }
        if (dataSource.fundingwallet) {
          const fwalletBalance = await connection.getBalance(new PublicKey(dataSource.fundingwallet));
          const dwalletBalance = await connection.getBalance(new PublicKey(dataSource.devwallet));
          const mwalletBalance = await connection.getBalance(publicKey);

          setWalletBalance(Number(mwalletBalance / 1e9).toFixed(4) + ' sol')
          setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
          setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')
        }

      }
      setSpinning(false)
      setEstimateOpen(false);
    }

  }


  function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 

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
    try {
      console.log(file);
      const result = await uploadFileToLightHouse(file);
      console.log(result);
        
  
     console.log(user)

    if (result != null) {

      let tokenMeta = {
        name: name,
        symbol: symbol,
        description: description,
        metadataUrl: result,
        twitter: twitter,
        telegram: telegram,
        website: website,
        showName: true,
        publicKey: publicKey.toBase58(),
        bundleStatus: 'INIT',
        userId: user?.id
      }

      const uri = await pinJsonToPinata(tokenMeta);
      console.log(uri); 

      tokenMeta.metadataUrl=uri
      const resp = await saveTokenMeta(tokenMeta);

      if (resp.fundingwallet) {
        const fwalletBalance = await connection.getBalance(new PublicKey(resp.fundingwallet));
        const dwalletBalance = await connection.getBalance(new PublicKey(resp.devwallet));
        const mwalletBalance = await connection.getBalance(publicKey);

        setWalletBalance(Number(mwalletBalance / 1e9).toFixed(4) + ' sol')
        setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
        setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')
      }
      setDataSource(resp);
      setTokenMetaCreated(true);
      setOpen(false);
      setSpinning(false);
    }
  }
  catch (err) {
      console.log(err);
   }

  }


  useEffect(() => {
    fetchProjectData();
  }, [publicKey]);

  const showDrawer = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setFundsModalOpen(false);
  };


  const handleFundsTransferFormSubmit = async () => {
    const fundsvals = await fundAmountsform.validateFields();

    if (!publicKey) {
      message.error(' Wallet Not Connected');
      return;
    }

    setSpinning(true);

    const fundsMeta = {
      mint: dataSource?.mint,
      fundAmount: fundsvals.fundAmount,
      userId:''+user?.id
    }
    const response = await transferFunds(fundsMeta);

    if (response.tokenMeta) {
      const fwalletBalance = await connection.getBalance(new PublicKey(response.tokenMeta.fundingwallet));
      const dwalletBalance = await connection.getBalance(new PublicKey(response.tokenMeta.devwallet));
      const mwalletBalance = await connection.getBalance(publicKey);

      setWalletBalance(Number(mwalletBalance / 1e9).toFixed(4) + ' sol')
      setFundingwalletBalance(Number(fwalletBalance / 1e9).toFixed(4) + ' sol')
      setDevwalletBalance(Number(dwalletBalance / 1e9).toFixed(4) + ' sol')
    }
    setDataSource(response.tokenMeta);
    setTokenMetaCreated(true);
    setOpen(false);
    setSpinning(false);
    setFundsModalOpen(false);


  }


  const onClose = () => {
    setOpen(false);
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


  const handleBundleCancel = () => {
    setBundleModalOpen(false);
  }

  const handleSearchToken = async () => {

    const values = await searchTokenForm.validateFields();
    setSpinning(true);

    let userId = ''+user?.id
    const tokenMeta = await getTokenMeta(userId,values.tokenMint);

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
    if (tokenAddress) {
      setSpinning(true);
      let userId = ''+user?.id
      const tokenMeta =  await getTokenMeta(userId,tokenAddress).catch((error) => {
        setSpinning(false);
        message.error('Unable to Load Token')
      });

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
        mint: tokenAddress
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
        mint: tokenAddress
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
        mint: tokenAddress
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
        mint: tokenAddress
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
          boxShadow: '1px 1px 10px 0px #2196f38c, -1px -1px 1px 0px #fff9',
          minHeight:'650px'

        }}
        extra={
          <Flex gap="small" wrap>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} disabled={TokenMetaCreated} size='small'>New Token</Button>
          </Flex>
        }
      >
        <Card.Grid style={gridStyle} hoverable={false} >
          {dataSource &&
            <>
              <Descriptions column={3} size="small" bordered={true} style={{borderRadius:'0px'}}>
                <Descriptions.Item label="Bundle Status"> {dataSource.bundleStatus}</Descriptions.Item>
                <Descriptions.Item label="Token Name"> {dataSource.name}</Descriptions.Item>
                <Descriptions.Item label="Token Symbol"> {dataSource.symbol}</Descriptions.Item>
                <Descriptions.Item label="MetaData Uri"> {dataSource.metadataUrl}</Descriptions.Item>
              </Descriptions> 
              <Descriptions column={3} size="small" bordered={true} style={{borderRadius:'0px'}} layout="vertical">
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

        <Modal
          title={`Estimate Funds`}
          centered
          open={estimateOpen}
          onCancel={() => {
            setSpinning(false);
            setEstimateOpen(false)
          }}
          footer={[]}
          width={'75%'}
        >
          <>
            <Spin spinning={spinning} fullscreen style={{ zIndex: '999' }} />
            <ProForm

              onReset={async () => {

                setMaxWallet(0)
                setMinWallet(0)
                setTotalfunds('0')
                setDeployerFunds('0.02');
                setWarning(false)

              }}
              onFinish={async (values) => {

                if (dataSource && dataSource.mint) {
                  const genWallets = await getWalletsForMint(''+user?.id,dataSource.mint);
                  const initialSolFunds = values.initialSolFunds;
                  const devWalletBuy = values.devWalletBuy;
                  setWalletsSource(genWallets);
                  const numWallets: number = genWallets.length;

                  const initialTokenPrice = 0.000000028; // Price per token in SOL
                  const tokenAccountCreationCost = 0.0023098; // Cost to create token account in SOL
                  const tradingFee = 0.000005; // Trading fee per transaction in SOL
                  const tokenPrice = 0.02; // Cost to create a token in SOL

                  let totalBudget: number = 0;
                  let totalSupplyBought: number = 0;
                  for (var i = 0; i < numWallets; i++) {
                    totalBudget += Number(genWallets[i].solanaSpend);
                    totalSupplyBought += Number(genWallets[i].estimatedSupply)
                  }

                  // Budget for all wallets 

                  // Calculate total initial cost for all wallets
                  const totalAccountCreationCost = numWallets * 2 * tokenAccountCreationCost;
                  const totalTradingFee = numWallets * 2 * tradingFee;

                  // Calculate total cost including token creation, account creation, and trading fees
                  const totalCost = tokenPrice + totalAccountCreationCost + totalBudget + totalTradingFee;
                  const devFundsRequired = devWalletBuy + totalAccountCreationCost * 2 + tradingFee * 2;
                  setTotalfunds(Number(totalCost*1.25).toFixed(3));
                  setDeployerFunds(Number(devFundsRequired*1.25).toFixed(3));

                  const totalCommission = 0.02* (Number(totalCost*1.25)+Number(devFundsRequired*1.25))


                }
              }}
            >
              <ProForm.Group>
                <ProFormDigit name="devWalletBuy" label="Dev Wallet Buys" min={0.01} max={10000000} />
              </ProForm.Group>
            </ProForm>
            <Divider />
            <Descriptions title="Funds Transfer (Click on Blue Button To Transfer)" column={2}>
              <Descriptions.Item label="Total Funds :*">{totalfunds && totalfunds &&
                <Button type="primary" icon={<BankTwoTone />} onClick={() => {
                  setDepositableFunds(Number(totalfunds).toFixed(3));
                  depositWalletFormSubmit(Number(totalfunds).toFixed(3), 'F')
                }}>   Deposit {Number(totalfunds).toFixed(3)} sol</Button>
              }
              </Descriptions.Item>
              <Descriptions.Item label="Dev Funds :*">{deployerFunds && deployerFunds &&
                <Button type="primary" icon={<BankTwoTone />} onClick={() => {
                  setDepositableFunds(Number(deployerFunds).toFixed(3));
                  depositWalletFormSubmit(Number(deployerFunds).toFixed(3), 'D')
                }}>   Deposit {Number(deployerFunds).toFixed(3)} sol</Button>
              }
              </Descriptions.Item>
            </Descriptions>
            <br />
            <br />
            {warning && <Alert type='warning' message='Fund Amount Insufficient' />
            }
          </>
        </Modal>
        <Card.Grid style={{ 'padding': '5px', width: '100%' }} hoverable={false} >
          {dataSource &&
            <Flex gap="middle" justify='space-evenly' wrap>
              <Button type="primary" icon={<PlusCircleTwoTone />} disabled={dataSource.bundleStatus == 'FUNDED' || dataSource.bundleStatus == 'SCHEDULED' || dataSource.bundleStatus == 'SOL_CLAIMED'} onClick={() => setGenWalletsOpen(true)} size='small'>Generate Wallets</Button>
              <Button type="primary" icon={<BankTwoTone />} disabled={dataSource.bundleStatus == 'INIT' || dataSource.bundleStatus == 'SCHEDULED'} onClick={() => setEstimateOpen(true)} size='small'>Estimate Funds</Button>
              <Button type="primary" icon={<FundTwoTone />} onClick={() => openFundsModal()} size='small'>Transfer Funds</Button>

              <Button type="primary" icon={<ToolTwoTone />} onClick={() => {
                setBundleModalOpen(true);
              }} size='small'>Schedule Bundle</Button>
            </Flex>
          }
        </Card.Grid>
        {dataSource && <WalletsManagerTable dataSource={dataSource} />}
      </Card>
      <Modal
        title={`Generate Wallets`}
        centered
        open={genWalletsOpen}
        onCancel={() => setGenWalletsOpen(false)}
        footer={[]}
      >
        <Form form={walletsform} layout="vertical" autoComplete="off">
          <Form.Item name="mint" label="Token" >
            <h4>{dataSource ? dataSource.mint : ''}</h4>
          </Form.Item>
          <Form.Item name="walletsCount" label="Wallets Count (Max 17)">
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={17}
                  onChange={onChange}
                  value={typeof walletsCount === 'number' ? walletsCount : 0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={17}
                  style={{ margin: '0 16px' }}
                  value={walletsCount}
                  onChange={onChange}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="totalBudget" label="Max Budget to Spend (in SOL, Max 50)" >
            <Input name="totalBudget" type='number' max={50} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" onClick={handleWalletsFormSubmit}>Submit</Button>
              <Button type='dashed' onClick={() => setGenWalletsOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Fetch token Metadata`}
        centered
        open={searchOpen}
        onCancel={() => setSearchOpen(false)}
        footer={[]}
      >
        <Form form={searchTokenForm} layout="vertical" autoComplete="off">
          <Form.Item name="tokenMint" label="Enter Token Address" rules={[{ required: true }]}>
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
      <Modal
        title="Transfer Funds to Wallets"
        centered
        open={fundsModalOpen}
        onOk={fundAmountsform.submit}
        onCancel={() => setFundsModalOpen(false)}
        footer={[]}
      >            
      <Spin spinning={spinning} fullscreen style={{ zIndex: '999' }} />

        <Form form={fundAmountsform} layout="vertical" autoComplete="off">
          <Form.Item name="fundAmount" label="Transfer Funds Amount To Each Wallet (Includes Tnx Fees)">
            <Descriptions bordered column={4} layout="vertical" size='small'>
              {walletsSource && walletsSource.map((wallet: any, index: number) => (
                <Descriptions.Item label={`Wallet ${index + 1}`} key={index}>
                  {Number(wallet.solanaSpend + 0.01).toFixed(4)} SOL
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" onClick={() => handleFundsTransferFormSubmit()}>Submit</Button>

              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Set Dev Wallet Buy Amount"
        centered
        open={devModalOpen}
        onOk={devAmountsform.submit}
        onCancel={() => setDevModalOpen(false)}
        footer={[]}
      >
        <Form form={devAmountsform} layout="vertical" autoComplete="off">
          <Form.Item name="devBuysAmount" label="Dev Wallet Buy Amount" rules={[{ required: true, min: 0.03, max: 100000 }]}
            initialValue={0.05}
          >
            <Input type='number' step={0.01} min={0.03} max={10000} defaultValue={0.05} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" onClick={() => handleDevWalletBuysFormSubmit()}>Submit</Button>

              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Schedule Bundle Execution"
        open={bundleModalOpen}
        onCancel={() => {
          setSpinning(false)
          handleBundleCancel()
        }
        }
        footer={[]}
      >
        
        <Form form={bundleform} layout="vertical" autoComplete="off">
          <Form.Item name="bundleTime" label="Select Time of Launch" rules={[{ required: true }]}>
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="jitoFees" label="Select JitoFees" rules={[{ required: true }]}>
          <Segmented options={['Low(0.0001)', 'Medium(0.001)', 'High(0.02)']} value={jitoFees} onChange={setJitoFees} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" onClick={() => handleBundleFormSubmit()}>Submit</Button>

              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="Initialize Metadata"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Spin spinning={spinning} fullscreen style={{ zIndex: '999' }} />

        <Form layout="horizontal" form={metadataform} autoComplete="off" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tokenName"
                label="Token Name"
                rules={[{ required: true, message: 'Please enter token name' }]}
              >
                <Input placeholder="Please enter token name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tokenSymbol"
                label="Symbol"
                rules={[{ required: true, message: 'Please enter Token Symbol' }]}
              >
                <Input placeholder="Please enter Token Symbol" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            <Col span={12}>
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
            <Row gutter={16}>
              <Col span={12}>
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
              <Col span={12}>
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
        </Form>
      </Drawer>
    </PageContainer>
  );
};

export default Launch;

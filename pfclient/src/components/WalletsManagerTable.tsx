import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Modal, Form, Button, Space, Spin } from 'antd';
import Table from 'antd/es/table';
import { SearchOutlined, FundOutlined, DollarOutlined, ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";

import React, { useEffect, useState } from 'react';
import { claimAllWallets, claimOneWallet, getWalletsForMint, getWalletsWithTokens } from '../services/Services';
import { PublicKey  } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SPL_ACCOUNT_LAYOUT } from '@raydium-io/raydium-sdk';
const { confirm } = Modal;


interface DataType {
  key: number;
  projectName: string;
  walletAddress: string;
  status: string;
  balance: number;
  tokenbalance: number;
};

const WalletsManagerTable = ({ dataSource }: any) => {
  const [modal1Open, setModal1Open] = useState(false);
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const [showTable, setShowTable] = useState(false);
  const [spinning, setSpinning] = useState(false)
  const [form] = Form.useForm<DataType>();
  const [genWalletsList, setGenWalletsList] = useState<any[]>([]);
  const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    margin: '0px', padding: '0px'
  };
  const {user} = useKindeAuth();

  const refreshBalances = async () => {

    if (publicKey && genWalletsList) {

      const genNew: any[] = []
      setSpinning(true)
      for (var i = 0; i < genWalletsList.length; i++) {
        const wallet: any = genWalletsList[i];
        const bal = await connection.getBalance(new PublicKey(wallet.walletAddress))
        wallet.solBalance = Number(Number(bal) / 1e9).toFixed(3)
        genNew.push(wallet)
      }
      setSpinning(false)

      console.log(genNew);
      setGenWalletsList(genNew);

    }
  }
  function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const refreshTokenBalances = async () => {

    if (publicKey && genWalletsList) {

      const genNew: any[] = []
      setSpinning(true)
      try{
      for (var i = 0; i < genWalletsList.length; i++) {
        await sleep(400);

        const wallet: any = genWalletsList[i];
        const mint: any = new PublicKey(genWalletsList[i].mint);
        const walletTokenAccount = await connection.getTokenAccountsByOwner(new PublicKey(genWalletsList[i].walletAddress), {
          programId: TOKEN_PROGRAM_ID,
        });
        const accountInfos=  walletTokenAccount.value.filter((i)=>SPL_ACCOUNT_LAYOUT.decode(i.account.data).mint.toBase58().toLowerCase() == mint.toBase58().toLowerCase());
        if(accountInfos.length>0){
        wallet.boughtTokens = Number(Number(SPL_ACCOUNT_LAYOUT.decode(accountInfos[0].account.data).amount.toString())).toFixed(0)
        } else {
          wallet.boughtTokens=0
        }
        genNew.push(wallet)
      }}catch(err){
        setSpinning(false)  
      }
      setSpinning(false)

      console.log(genNew);
      setGenWalletsList(genNew);

    }
  }


  const columns = [
    {
      title: 'Index',
      key: 'rowNumber',
      render: (text: any, record: any, index: number) => index + 1 // Display row number starting from 1
    },
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
    },
    {
      title: 'Est Spend',
      dataIndex: 'solanaSpend',
      key: 'solanaSpend',
    },
    {
      title: 'Est Supply(%)',
      dataIndex: 'estimatedSupply',
      key: 'estimatedSupply',
    },
    {
      title: <Space>
      <Button type="primary" style={{ backgroundColor: 'blue' }} size='small' shape="circle" icon={<ReloadOutlined />} onClick={() => { refreshTokenBalances() }} />
      Token Balance </Space>,
      dataIndex: 'boughtTokens',
      key: 'boughtTokens',
    },
    {
      title: <Space>
        <Button type="primary" style={{ backgroundColor: 'green' }} size='small' shape="circle" icon={<ReloadOutlined />} onClick={() => { refreshBalances() }} />
        Sol Balance </Space>,
      dataIndex: 'solBalance',
      key: 'solBalance',
    },
    {
      title: <Space>
              <Button type="primary" style={{ backgroundColor: 'indigo' }} size='small' shape="circle" icon={<ShoppingCartOutlined />} />
            <Button type="primary" style={{ backgroundColor: '#651ABA' }}  
            onClick={()=>claimAllWalletsSubmit()}
            size='small' shape="circle" icon={<DollarOutlined />} />
                
      </Space>,
      dataIndex: '',
      key: 'x',
      render: (record: any, index: number) => 
        <Space>
            <Button type="primary" style={{ backgroundColor: 'indigo' }} size='small' shape="circle" icon={<ShoppingCartOutlined />} />
            <Button type="primary" style={{ backgroundColor: '#651ABA' }} 
              onClick={()=>claimOneWalletsSubmit(record.walletAddress)}
            size='small' shape="circle" icon={<DollarOutlined />} />
                   
        </Space>
    },
  ];


  const claimAllWalletsSubmit= async()=>{
    try {
      if (publicKey && dataSource) {
        console.log(dataSource.mint);
        setSpinning(true)
        const genWallets = await getWalletsForMint(''+user?.id,dataSource.mint);

        if (genWallets) {
           const fundsMeta = {
            mint:dataSource.mint,
            userId:''+user?.id
           }
           const allInfo = await claimAllWallets(fundsMeta);
           console.log(allInfo);
            
        }
        setShowTable(true)
      } else {
        setShowTable(false)
      }
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
    setSpinning(false)

  }
  const claimOneWalletsSubmit= async(walletAddress:any)=>{
    try {
      if (publicKey && dataSource) {
        console.log(dataSource.mint);
        setSpinning(true)

        const genWallets = await getWalletsForMint(''+user?.id,dataSource.mint);

        if (genWallets) {
           const fundsMeta = {
            mint:dataSource.mint,
            walletAddress:walletAddress,
            userId:''+user?.id
           }
           const allInfo = await claimOneWallet(fundsMeta);
           console.log(allInfo);
            
        }
        setShowTable(true)
      } else {
        setShowTable(false)
      }
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
    setSpinning(false)

  }

  const fetchProjectData = async () => {
    try {
      if (publicKey && dataSource) {
        console.log(dataSource.mint);

        const genWallets = await getWalletsForMint(''+user?.id,dataSource.mint);

        if (genWallets) {
          setGenWalletsList(genWallets);
        }
        setShowTable(true)
      } else {
        setShowTable(false)
      }
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
  };



  useEffect(() => {
    fetchProjectData();

  }, [publicKey, dataSource]);


  return (
    <>
      <Spin spinning={spinning} fullscreen />

      {dataSource && <Table
        style={{ margin: '0px', padding: '0px', width: '100%' }}
        size='small'
        columns={columns}
        dataSource={genWalletsList}
        key={'_id'}
        pagination={false}
        bordered
      />}
    </>
  );
};

export default WalletsManagerTable;



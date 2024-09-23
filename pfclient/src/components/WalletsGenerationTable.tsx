import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Modal, Form ,Typography} from 'antd';
import Table from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { getWalletsForMint } from '../services/Services';
const { confirm } = Modal;
const { Text } = Typography;
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";



interface DataType {
  key: number;
  projectName: string;
  walletAddress: string;
  status: string;
  balance: number;
};

const WalletsGenerationTable = ({dataSource}:any) => {
  const [modal1Open, setModal1Open] = useState(false);
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const [showTable, setShowTable] = useState(false);
  const [form] = Form.useForm<DataType>();
  const [genWalletsList, setGenWalletsList] = useState([]);
  const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    margin: '0px', padding: '0px'
  };
  const {user} = useKindeAuth();

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
      title: 'Estimated Spend',
      dataIndex: 'solanaSpend',
      key: 'solanaSpend',
      render: (text: any, record: any, index: number) => Number(text).toFixed(4) 
    },
    {
      title: 'Estimated Supply(%)',
      dataIndex: 'estimatedSupply',
      key: 'estimatedSupply',
      render: (text: any, record: any, index: number) => Number(text).toFixed(2) +'%'
    },
  ];

  const fetchProjectData = async () => {
    try { 
      if (publicKey && dataSource) {
        console.log(dataSource.mint);

        const genWallets = await getWalletsForMint(''+user?.id,dataSource.mint);

        if(genWallets){
          setGenWalletsList(genWallets);
        }
        setShowTable(true) 
      } else{
        setShowTable(false) 
      }
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
  };

 

  useEffect(() => {
    fetchProjectData(); 
     
  }, [publicKey,dataSource]);


  return (
    <>
      {dataSource && <Table
        style={{ margin: '0px', padding: '0px',width:'100%' }}
        size='small'
        columns={columns}
        dataSource={genWalletsList}
        key={'_id'}
        pagination={false}
      bordered
      summary={(pageData) => {
        let totalSpend = 0;
        let totalSupply = 0;

        pageData.forEach(({ solanaSpend, estimatedSupply }) => {
          totalSpend += Number(solanaSpend);
          totalSupply += Number(estimatedSupply);
        });
         

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Estimated Sol Spend</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text type="danger">{Number(totalSpend).toFixed(4)} SOL</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>Estimated Supply Bought</Table.Summary.Cell> 
              <Table.Summary.Cell index={3}>
                <Text>{Number(totalSupply).toFixed(2)} %</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
      />}
    </>
  );
};

export default WalletsGenerationTable;

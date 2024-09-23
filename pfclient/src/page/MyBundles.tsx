import { ExclamationCircleFilled, HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import type { FormInstance } from 'antd';
import { Divider, Tag, Tooltip } from 'antd';
import { NavLink } from "react-router-dom";
import { CopyOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Flex, Input, Modal, Form, Space } from 'antd';
import Table, { ColumnProps } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { fetchBundles } from '../services/Services';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";


interface DataType {
  mint: string;
  symbol: string;
  name: any;
  key: number;
  projectName: string;
  walletAddress: string;
  status: string;
  balance: number;
  reason:string;
};

const MyBundles: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [form] = Form.useForm<DataType>();
  const {user} = useKindeAuth();

  const gridStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    margin: '0px', padding: '0px'
  };

  const columns: ColumnProps<DataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => [
        <a key="link" style={{ color: 'grey', fontWeight: 'bold', fontSize: '16px' }}>{text}</a>
      ],
    }, {
      title: 'Symbol',
      dataIndex: 'symbol',
      render: (value, record, index) => [
        <NavLink to={`#`}>
          {record.symbol}
        </NavLink>
      ],
    },
    {
      title: 'Token Address',
      dataIndex: 'mint',
      render: (value, record, index) => [
        <Tooltip title={record.mint}>
          <NavLink to={`/app/manageLaunch/${record.mint}`}> 
            {record.mint.substring(0, 6)}...
          </NavLink> 
          <CopyToClipboard text={record.mint}>
            <Button type="dashed" size="small" icon={<CopyOutlined />} />
          </CopyToClipboard>
        </Tooltip>
      ],
    },
    {
      title: 'Status',
      dataIndex: 'bundleStatus',
      render: (text) => [
        <Tag color="#108ee9">{text}</Tag>
      ]
    },
  ];

  const fetchProjectData = async () => {
    try {
      setShowTable(false)
      let userId :string= ''+user?.id;
      if (publicKey) {
        const response = await fetchBundles(userId, publicKey.toBase58());
        if (response.length > 0) {
          setDataSource(response);
        }
        setShowTable(true)
      }
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
  };


  useEffect(() => {
    if (connected) {
      fetchProjectData();
    }
  }, [connected])

  return (
    <PageContainer>
      <Card bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: '1px 1px 10px 0px #2196f38c, -1px -1px 1px 0px #fff9'

        }}
        extra={
          <Flex gap="small" wrap>
            <Button type="dashed" onClick={() => fetchProjectData()}>Refresh</Button>
          </Flex>
        }
      >
        <Card.Grid style={gridStyle}>
          {dataSource && <Table
            style={{ margin: '0px', padding: '0px' }}
            columns={columns}
            dataSource={dataSource}
            key={'_id'}
            expandable={{
              expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.reason}</p>,
              rowExpandable: (record) => !record.reason,
            }}
          />}
        </Card.Grid>

      </Card>

    </PageContainer>
  );
};

export default MyBundles;

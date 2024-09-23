import { PageContainer } from '@ant-design/pro-components';
import { Card, theme } from 'antd';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        Go {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken(); 
  const {user } = useAuth();
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage: 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            Welcome to PFVerse
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            PFVerse Enables you to launch a Pump Fun Token on Solana, Manage multiple wallets,
            Bundle Launch a Token with one addon Snipe associated with multiple wallets snipes to ensure your token reaches
            the required Mcap faster than others.
            <br/><br/><br/>
            <h3><strong>Note :</strong> Commission:  Platform Fee is applied for every launch at 2% of the Bundler Volume </h3>
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="https://umijs.org/docs/introduce/introduce"
              title="Create a Bundler Project"
              desc="Create Bundle project with all required parameters for a token, save it for launch"
            />
            <InfoCard
              index={2}
              title="Manage Wallets "
              href="https://ant.design"
              desc="Generate Wallets, distribute sols, "
            />
            <InfoCard
              index={3}
              title="Sell and Recover"
              href="https://procomponents.ant.design"
              desc="Sell all wallet tokens and recover the sol to main wallet"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;

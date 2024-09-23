import React, { useContext, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';

import { Layout } from "../../layout/index";
import { Page404 } from "../../page/Page404";
import Welcome from "../../page/Welcome";
import MyBundles from "../../page/MyBundles";
import Launch from "../../page/Launch";
import { AuthContext } from "../../contexts/AuthContext";
import { Home } from "../../page/Home";
import Login from "../../page/Login";
import { NewLaunch } from "../../page/NewLaunch";
import { clusterApiUrl } from "@solana/web3.js";
import ManageLaunch from "../../page/ManageLaunch";
import { useNavigate } from 'react-router-dom'

import {useKindeAuth} from '@kinde-oss/kinde-auth-react';


const PrivateRoutes = () => {
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const navigate = useNavigate();

  useEffect(()=>{ 
    if(!isAuthenticated && !user && !isLoading){
      navigate('/')
    }
  },[1])


  return <Layout />
}

require('@solana/wallet-adapter-react-ui/styles.css');

export const Router: React.FC = () => {

 
  const network = WalletAdapterNetwork.Mainnet;
  const rpcUrl = 'https://mainnet.helius-rpc.com/?api-key=f0c11eb0-ccc8-4f5f-afb3-b11308f4e46e'
  const endpoint = useMemo(() => rpcUrl, [network]);
  const wallets = useMemo(
    () => [

      new UnsafeBurnerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter()
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );


  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>

            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<PrivateRoutes />}>
                <Route path="app/*" element={<Page404 />} />
                <Route path="/app" element={<Welcome />} />
                <Route path="/app/myprojects" element={<MyBundles />} />
                <Route path="/app/launchBundle" element={<Launch />} />
                <Route path="/app/manageLaunch" element={<ManageLaunch />} />
                <Route path="/app/manageLaunch/:tokenAddress" element={<Launch />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

  );
};

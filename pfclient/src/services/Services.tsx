import axios from "axios";
import authHeader from "./authHeader";
 

export const saveTokenMeta = async (tokenMeta: any) => {
    try {
      const response = await axios.post("/api/v1/token/createTokenMeta", { tokenMeta }, ).then(resp => resp.data);
      return response; // This will include the response data, status, and other information
    } catch (error) {
      // Handle or throw the error as needed
      console.error('Error saving token meta data:', error);
      throw error;
    }
};


export const getTokenMeta = async (userId:string,mint:string) => {
    try {
      const response = await axios.get(`/api/v1/token/getTokenMeta?mint=${mint}&userId=${userId}`, ).then(resp => resp.data);
      return response; // This will include the response data, status, and other information
    } catch (error) {
      // Handle or throw the error as needed
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  export const getWalletsForMint = async (userId:string,mint:string) => {
    try {
      const response = await axios.get(`/api/v1/wallets/getWalletsForMint?mint=${mint}&userId=${userId}`, ).then(resp => resp.data);
      return response; // This will include the response data, status, and other information
    } catch (error) {
      // Handle or throw the error as needed
      console.error('Error fetching wallets:', error);
      throw error;
    }
  };


  export const getWalletsWithTokens = async (mint:string) => {
    try {
      const response = await axios.get(`/api/v1/wallets/getWalletsWithTokens?mint=${mint}`, ).then(resp => resp.data);
      return response; // This will include the response data, status, and other information
    } catch (error) {
      // Handle or throw the error as needed
      console.error('Error fetching wallets:', error);
      throw error;
    }
  };
  export const fetchBundles = async (userId:string,publicKey:string) => {
    try {
      const response = await axios.get(`/api/v1/token/getMyBundles?publicKey=${publicKey}&userId=${userId}`, ).then(resp => resp.data);
      return response; // This will include the response data, status, and other information
    } catch (error) {
      // Handle or throw the error as needed
      console.error('Error fetching wallets:', error);
      throw error;
    }
  };

  export const createWallets = async (walletMeta: any) => {
    try {
      const response = await axios.post("/api/v1/wallets/createWalletMeta", { walletMeta }, ).then(resp => resp.data);
      return response; // This will include the response data, status, and other information
    } catch (error) {
      // Handle or throw the error as needed
      console.error('Error creating wallets:', error);
      throw error;
    }
};

export const transferFunds = async (fundsMeta: any) => {
  try {
    const response = await axios.post("/api/v1/wallets/transferFunds", { fundsMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error Transfering Funds:', error);
    throw error;
  }
};

export const createBundleSchedule = async (schedule: any) => {
  try {
    const response = await axios.post("/api/v1/bundle/createBundleSchedule", { schedule }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error createBundleSchedule  :', error);
    throw error;
  }
} 


export const sellAllWallets = async (sellMeta: any) => {
  try {
    const response = await axios.post("/api/v1/bundle/sellAllTokenWallets", { sellMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error sellAllWallets  :', error);
    throw error;
  }
} 

export const recoverSols = async (fundsMeta: any) => {
  try {
    const response = await axios.post("/api/v1/funds/recoverSol", { fundsMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error recoverSols  :', error);
    throw error;
  }
};


export const claimDevSols = async (fundsMeta: any) => {
  try {
    const response = await axios.post("/api/v1/wallets/claimDevWallet", { fundsMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error recoverSols  :', error);
    throw error;
  }
};


export const claimSols = async (fundsMeta: any) => {
  try {
    const response = await axios.post("/api/v1/wallets/claimFunding", { fundsMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error recoverSols  :', error);
    throw error;
  }
};



export const claimOneWallet = async (fundsMeta: any) => {
  try {
    const response = await axios.post("/api/v1/wallets/claimOneWallet", { fundsMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error recoverSols  :', error);
    throw error;
  }
};



export const claimAllWallets = async (fundsMeta: any) => {
  try {
    const response = await axios.post("/api/v1/wallets/claimAllWallets", { fundsMeta }, ).then(resp => resp.data);
    return response; // This will include the response data, status, and other information
  } catch (error) {
    // Handle or throw the error as needed
    console.error('Error recoverSols  :', error);
    throw error;
  }
};

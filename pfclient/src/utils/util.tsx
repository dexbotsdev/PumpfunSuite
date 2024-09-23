import { Connection, Signer, Transaction } from "@solana/web3.js";
import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";

const pinataKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDI1ZTUzNi0xNzU1LTRmMzktODRjOC1lZWQyZGUyNDRkM2YiLCJlbWFpbCI6InJhZGlhbGRhcHBzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4ZDdlZThlYTE1NTEyYTIwNzZmNiIsInNjb3BlZEtleVNlY3JldCI6IjJkMmI5ZjkwMjc0MmI1ZDkzY2YzMDFiZjU2YTNkNWYyNDFhMjYxMTRmNjVmZjhhNGQzZTBkMWY5M2JmZGMyY2MiLCJpYXQiOjE3MjYwNDAzMDR9.ZDzrAiWjC1yVL1snItSeFRZCalXmsviLvQD6ZujWaWU'
const lighthouseKey='192ba508.94526b4514b7491b916ef886d71713b9'

const PINATA_JWT = "Bearer "+pinataKey;

export const UPLOADING_FILE_TYPES = {
  OTHERS: 0,
  JSON: 1,
};

/* Pinata */

export const uploadFileToLightHouse = async(file: any)=>{ 

  const {data:uploadResponse} = await lighthouse.upload([file], lighthouseKey);

  return 'https://gateway.lighthouse.storage/ipfs/'+uploadResponse.Hash;
}

export const pinFileToPinata = async (file: string | Blob) => {
  let ipfsCid = "";
  try {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data;`,
          Authorization: PINATA_JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = ''+null;
  }
  return ipfsCid;
};

export const pinJsonToPinata = async (jsonObj: any) => {
    let ipfsCid = "";
    try {
      let res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        { ...jsonObj },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: PINATA_JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = ''+null;
    }
    return 'https://ipfs.io/ipfs/'+ipfsCid;
  };
  

export const createMetadata = async (
    filename: string,
    name: string,
    symbol: string,
    description: string,
    twitterUrl: string,
    telegramUrl: string,
    websiteUrl: string,
    imageFile: File,
    ) => {
 
     var myHeaders = new Headers();
     var formdata = new FormData();
    formdata.append("file", imageFile, symbol+'.png');
    formdata.append("name", name);
    formdata.append("symbol",symbol);
    formdata.append("description", description);
    formdata.append("twitter",  twitterUrl);
    formdata.append("telegram",   telegramUrl);
    formdata.append("website",   websiteUrl);
    formdata.append("showName", 'true');
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata
    }; 
    const result :any= await fetch("https://pump.fun/api/ipfs", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    console.log(result);
    return result.metadataUri;
}

 


// Function to generate random amounts that sum up to a given total
export const generateRandomAmounts = (total: number, numParts: number) => {
    const randoms = Array.from({ length: numParts }, () => Math.random());
    const sumOfRandoms = randoms.reduce((acc, val) => acc + val, 0);
    const randomAmounts = randoms.map((r) => (r / sumOfRandoms) * total);
    return randomAmounts.map((amount) => parseFloat(amount.toFixed(4)));
  };

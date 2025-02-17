const sdk = require("@defillama/sdk");
import {
  ChainBlocks,
  PeggedIssuanceAdapter,
  Balances
} from "../peggedAsset.type";
import { sumSingleBalance } from "../helper/generalUtil";

const chainContracts = {
    ethereum: {
        issued: "0x865377367054516e17014CcdED1e7d814EDC9ce4",
    },
    fantom: {
        bridgedFromETH: "0x3129662808bEC728a27Ab6a6b9AFd3cBacA8A43c", // multichain
    },
    optimism: {
        bridgedFromETH: "0x8aE125E8653821E851F12A49F7765db9a9ce7384",
    },
    bsc: {
        bridgedFromETH: "0x2f29bc0ffaf9bff337b31cbe6cb5fb3bf12e5840",
  },
    arbitrum: {
       bridgedFromETH: "0x6a7661795c374c0bfc635934efaddff3a7ee23b6",
    },
    polygon: {
      bridgedFromETH: "0xbc2b48bc930ddc4e5cfb2e87a45c379aab3aac5c",
    },
    avax: {
      bridgedFromETH: "0x221743dc9e954be4f86844649bf19b43d6f8366d",
    }
};

async function ethereumMinted() {
return async function (
    _timestamp: number,
    _ethBlock: number,
    _chainBlocks: ChainBlocks
) {
  let balances = {} as Balances;
    const totalSupply = (
      await sdk.api.abi.call({
        abi: "erc20:totalSupply",
        target: chainContracts.ethereum.issued,
        block: _ethBlock,
        chain: "ethereum",
      })
    ).output;
    sumSingleBalance(
      balances,
      "peggedUSD",
      totalSupply / 10 ** 18,
      chainContracts.ethereum.issued,
      true
    );
    return balances;
  };
}

async function bridgedFromEthereum(chain: string, decimals: number, address: string) {
return async function (
    _timestamp: number,
    _ethBlock: number,
    _chainBlocks: ChainBlocks
) {
  let balances = {} as Balances;
    const totalSupply = (
      await sdk.api.abi.call({
        abi: "erc20:totalSupply",
        target: address,
        block: _chainBlocks?.[chain],
        chain: chain,
      })
    ).output;
    sumSingleBalance(
      balances,
      "peggedUSD",
      totalSupply / 10 ** decimals,
      address,
      true
    );
    return balances;
  };
}

const adapter: PeggedIssuanceAdapter = {
  ethereum: {
    minted: ethereumMinted(),
    unreleased: async () => ({}),
  },
  fantom: {
    minted: async () => ({}),
    unreleased: async () => ({}),
    ethereum: bridgedFromEthereum("fantom", 18, chainContracts.fantom.bridgedFromETH),
  },
  optimism: {
    minted: async () => ({}),
    unreleased: async () => ({}),
    ethereum: bridgedFromEthereum("optimism", 18, chainContracts.optimism.bridgedFromETH),
  },
  bsc: {
    minted: async () => ({}),
    unreleased: async () => ({}),
    ethereum: bridgedFromEthereum("bsc", 18, chainContracts.bsc.bridgedFromETH),
  },
  arbitrum: {
    minted: async () => ({}),
    unreleased: async () => ({}),
    ethereum: bridgedFromEthereum("arbitrum", 18, chainContracts.arbitrum.bridgedFromETH),
  },
  polygon: {
    minted: async () => ({}),
    unreleased: async () => ({}),
    ethereum: bridgedFromEthereum("polygon", 18, chainContracts.polygon.bridgedFromETH),
  },
  avalanche: {
    minted: async () => ({}),
    unreleased: async () => ({}),
    ethereum: bridgedFromEthereum("avax", 18, chainContracts.avax.bridgedFromETH),
  },
};

export default adapter;
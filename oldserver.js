const { ethers } = require("ethers");
const axios = require("axios");
const cron = require("node-cron");
const provider = new ethers.providers.JsonRpcProvider(
  "https://arbitrum.llamarpc.com"
);

const contractAddresses = [
  "0x80d1A3c84B7C7185Dc7dbf4787713d55eea95e27",
  "0xcBCaA63925dC615Bde957657f49842ae5C595ea2",
  "0x7b9F49fc73C380E13a0bDCf91B53C0AE612Df8BF",
  "0x372e2aE366E3DF4454cD432F194367854b54fEE7",
  "0x958E5cC35fD7f95C135D55C7209Fa972bDb68617",
  "0x255D8393c5A343F4040C31f3acd38A44d5d3245e",
  "0x1D7725Ca66C7eb4089C80D92876CB69558830367",
];

const token = "6740327743:AAGo-qaSqRWeS1FwLuHDwff_XDB8eU6ubMQ";
const chat_id = "2070429208";

async function sendMessage(message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chat_id,
    text: message,
  };

  try {
    const response = await axios.post(url, body);

    if (!response.data.ok) {
      throw new Error(`Telegram API error: ${response.data.description}`);
    }
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function checkContracts() {
  try {
    for (let address of contractAddresses) {
      const contract = new ethers.Contract(address, abi, provider);

      const stakedKeysCount = await contract.getStakedKeysCount();
      const pool = await contract.getPoolInfo();
      const poolName = pool._name;

      console.log("Pool Name:", poolName);
      console.log(poolName, ":", stakedKeysCount.toString());

      if (stakedKeysCount.lt(1001)) {
        const message = `Alert: ${poolName} has staked keys count less than 1000. Current count: ${stakedKeysCount.toString()}`;
        await sendMessage(message);
      }
    }
  } catch (error) {
    console.error("Error checking contracts:", error);
  }
}
// Define the contract ABI
const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "POOL_ADMIN",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "period", type: "uint256" },
    ],
    name: "createUnstakeEsXaiRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "keyAmount", type: "uint256" },
      { internalType: "uint256", name: "period", type: "uint256" },
    ],
    name: "createUnstakeKeyRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "period", type: "uint256" },
    ],
    name: "createUnstakeOwnerLastKeyRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "delegateOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "esXaiAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "esXaiStakeBucket",
    outputs: [
      { internalType: "contract BucketTracker", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDelegateOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolInfo",
    outputs: [
      {
        components: [
          { internalType: "address", name: "poolAddress", type: "address" },
          { internalType: "address", name: "owner", type: "address" },
          {
            internalType: "address",
            name: "keyBucketTracker",
            type: "address",
          },
          {
            internalType: "address",
            name: "esXaiBucketTracker",
            type: "address",
          },
          { internalType: "uint256", name: "keyCount", type: "uint256" },
          {
            internalType: "uint256",
            name: "totalStakedAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updateSharesTimestamp",
            type: "uint256",
          },
          { internalType: "uint32", name: "ownerShare", type: "uint32" },
          { internalType: "uint32", name: "keyBucketShare", type: "uint32" },
          { internalType: "uint32", name: "stakedBucketShare", type: "uint32" },
        ],
        internalType: "struct StakingPool.PoolBaseInfo",
        name: "baseInfo",
        type: "tuple",
      },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string", name: "_logo", type: "string" },
      { internalType: "string[]", name: "_socials", type: "string[]" },
      { internalType: "uint32[]", name: "_pendingShares", type: "uint32[]" },
      { internalType: "uint256", name: "_ownerStakedKeys", type: "uint256" },
      {
        internalType: "uint256",
        name: "_ownerRequestedUnstakeKeyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ownerLatestUnstakeRequestLockTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getStakedAmounts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakedKeys",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakedKeysCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getStakedKeysCountForUser",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUndistributedClaimAmount",
    outputs: [
      { internalType: "uint256", name: "claimAmountFromKeys", type: "uint256" },
      {
        internalType: "uint256",
        name: "claimAmountFromEsXai",
        type: "uint256",
      },
      { internalType: "uint256", name: "claimAmount", type: "uint256" },
      { internalType: "uint256", name: "ownerAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getUnstakeRequest",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "open", type: "bool" },
          { internalType: "bool", name: "isKeyRequest", type: "bool" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "lockTime", type: "uint256" },
          { internalType: "uint256", name: "completeTime", type: "uint256" },
          { internalType: "uint256[5]", name: "__gap", type: "uint256[5]" },
        ],
        internalType: "struct StakingPool.UnstakeRequest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "getUnstakeRequestCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserPoolData",
    outputs: [
      {
        internalType: "uint256",
        name: "userStakedEsXaiAmount",
        type: "uint256",
      },
      { internalType: "uint256", name: "userClaimAmount", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "userStakedKeyIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "unstakeRequestkeyAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "unstakeRequestesXaiAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserRequestedUnstakeAmounts",
    outputs: [
      { internalType: "uint256", name: "keyAmount", type: "uint256" },
      { internalType: "uint256", name: "esXaiAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "_ownerShare", type: "uint32" },
      { internalType: "uint32", name: "_keyBucketShare", type: "uint32" },
      { internalType: "uint32", name: "_stakedBucketShare", type: "uint32" },
    ],
    name: "initShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_refereeAddress", type: "address" },
      { internalType: "address", name: "_esXaiAddress", type: "address" },
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "address", name: "_delegateOwner", type: "address" },
      { internalType: "address", name: "_keyBucket", type: "address" },
      { internalType: "address", name: "_esXaiStakeBucket", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "isUserEngagedWithPool",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "keyBucket",
    outputs: [
      { internalType: "contract BucketTracker", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "keyBucketShare",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "keyIdIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "logo",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerShare",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolOwnerClaimableRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "refereeAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "socials",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "stakeEsXai",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256[]", name: "keyIds", type: "uint256[]" },
    ],
    name: "stakeKeys",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "stakedAmounts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakedBucketShare",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "stakedKeys",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "stakedKeysIndices",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "stakedKeysOfOwner",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "unstakeRequestIndex", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "unstakeEsXai",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "unstakeRequestIndex", type: "uint256" },
      { internalType: "uint256[]", name: "keyIds", type: "uint256[]" },
    ],
    name: "unstakeKeys",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "delegate", type: "address" }],
    name: "updateDelegateOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string[3]", name: "_metaData", type: "string[3]" },
      { internalType: "string[]", name: "_socials", type: "string[]" },
    ],
    name: "updateMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "_ownerShare", type: "uint32" },
      { internalType: "uint32", name: "_keyBucketShare", type: "uint32" },
      { internalType: "uint32", name: "_stakedBucketShare", type: "uint32" },
      { internalType: "uint256", name: "period", type: "uint256" },
    ],
    name: "updateShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
// Schedule the task to run every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("Running checkContracts every 30 minutes");
  checkContracts();
});

// Run the function initially when the script starts
checkContracts();

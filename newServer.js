const { ethers } = require("ethers");
const axios = require("axios");
const cron = require("node-cron");

const provider = new ethers.providers.JsonRpcProvider(
  "https://arbitrum.llamarpc.com"
);

let contracts = [
  "0x255D8393c5A343F4040C31f3acd38A44d5d3245e",
  "0x1D7725Ca66C7eb4089C80D92876CB69558830367",
  "0x372e2aE366E3DF4454cD432F194367854b54fEE7",
  "0x80d1A3c84B7C7185Dc7dbf4787713d55eea95e27",
  "0x958E5cC35fD7f95C135D55C7209Fa972bDb68617"
];

const apiKey = "6740327743:AAGo-qaSqRWeS1FwLuHDwff_XDB8eU6ubMQ";
const chatId = "2070429208";
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

async function sendMessage(apiKey, chatId, message) {
  const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: message,
  };

  try {
    const response = await axios.post(url, body);

    if (!response.data.ok) {
      throw new Error(`Telegram API error: ${response.data.description}`);
    }

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

async function checkContracts() {
  const currentDate = new Date();
  console.log(`Running check at: ${currentDate.toLocaleString()}`);
  for (let address of contracts) {
    const contract = new ethers.Contract(address, abi, provider);

    try {
      const stakedKeysCount = await contract.getStakedKeysCount();
      const pool = await contract.getPoolInfo();
      const poolName = pool._name;
      console.log(poolName, ":", stakedKeysCount.toString());

      if (parseInt(stakedKeysCount) < 1000) {
        await sendMessage(
          apiKey,
          chatId,
          `Pool: ${poolName} has ${stakedKeysCount.toString()} staked keys.`
        );
      }
    } catch (error) {
      console.error("Error fetching staked keys count:", error);
    }
  }
}

// Schedule the task to run every 1 minute

// Function to send a test message to Telegram
async function testTelegram() {
  await sendMessage(
    apiKey,
    chatId,
    "This is a test message to verify Telegram integration."
  );
}

// Call the test function on script start
testTelegram();

// Start the initial check
checkContracts();
let lastUpdateId = 0;
// Function to process incoming messages
async function processLatestMessages() {
  const updatesUrl = `https://api.telegram.org/bot${apiKey}/getUpdates?offset=${
    lastUpdateId + 1
  }`;
  try {
    const response = await axios.get(updatesUrl);
    const updates = response.data.result;

    if (updates.length > 0) {
      for (const update of updates) {
        let message = update.message
          ? update.message.text
          : update.edited_message
          ? update.edited_message.text
          : null;
        const chatId = update.message
          ? update.message.chat.id
          : update.edited_message
          ? update.edited_message.chat.id
          : null;
        lastUpdateId = update.update_id;

        if (message) {
          if (message.startsWith("add ")) {
            const address = message.split(" ")[1];
            if (!contracts.includes(address)) {
              contracts.push(address);
              await sendMessage(apiKey, chatId, `Contract ${address} added.`);
            } else {
              await sendMessage(
                apiKey,
                chatId,
                `Contract ${address} is already in the list.`
              );
            }
          } else if (message.startsWith("remove ")) {
            const address = message.split(" ")[1];
            const index = contracts.indexOf(address);
            if (index > -1) {
              contracts.splice(index, 1);
              await sendMessage(apiKey, chatId, `Contract ${address} removed.`);
            } else {
              await sendMessage(
                apiKey,
                chatId,
                `Contract ${address} not found.`
              );
            }
          } else if (message === "list") {
            let messageList = "Contracts:\n";
            for (let address of contracts) {
              const contract = new ethers.Contract(address, abi, provider);
              try {
                const pool = await contract.getPoolInfo();
                const poolName = pool._name;
                messageList += `${poolName} : ${address}\n`;
              } catch (error) {
                console.error("Error fetching pool info:", error);
                messageList += `Unknown Pool : ${address}\n`;
              }
            }
            await sendMessage(apiKey, chatId, messageList);
          } else {
            await sendMessage(
              apiKey,
              chatId,
              "Invalid command. Use add <address>, remove <address>, or list."
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing incoming messages:", error.message);
  }
}
processLatestMessages();
// Schedule the task to check for incoming messages every minute

cron.schedule("* * * * *", () => {
  //   const currentDate = new Date();
  //   console.log(`Cron job triggered at: ${currentDate.toLocaleString()}`);
  checkContracts();
  processLatestMessages();
});

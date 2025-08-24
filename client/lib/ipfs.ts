// IPFS upload utility using web3.storage
// You need to set your API token in VITE_WEB3STORAGE_TOKEN in your .env file

// Pinata IPFS upload helpers
// Set your Pinata API key and secret in .env as VITE_PINATA_API_KEY and VITE_PINATA_API_SECRET

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;
const PINATA_BASE_URL = "https://api.pinata.cloud/pinning";

async function pinataUpload(formData: FormData, endpoint: string): Promise<string> {
  const res = await fetch(`${PINATA_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_API_JWT()}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Pinata upload failed: ${res.status}`);
  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}

function PINATA_API_JWT() {
  // If you use JWT, set VITE_PINATA_JWT in .env and return it here
  // Otherwise, Pinata now recommends JWT for new API keys
  const jwt = import.meta.env.VITE_PINATA_JWT;
  if (jwt) return jwt;
  // Fallback: use API key/secret (legacy)
  // Pinata does not support key/secret in browser fetch headers, so JWT is recommended
  throw new Error("Please set VITE_PINATA_JWT in your .env for Pinata uploads");
}

export async function uploadImageToIPFS(imageDataUrl: string): Promise<string> {
  // Convert data URL to Blob
  const res = await fetch(imageDataUrl);
  const blob = await res.blob();
  const formData = new FormData();
  formData.append("file", blob, "avatar.png");
  return pinataUpload(formData, "pinFileToIPFS");
}

export async function uploadMetadataToIPFS(metadata: object): Promise<string> {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
  formData.append("file", blob, "metadata.json");
  return pinataUpload(formData, "pinFileToIPFS");
}

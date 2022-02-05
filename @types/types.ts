export type NFT = {
  name: string;
  token_address: string;
  token_uri?: string;
};

export type NFTMetaData = {
  image_url?: string;
  image?: string;
  name: string;
  description: string;
}

export type EmailAttachment = {
  filename: string,
  content: string,
  contentType: string
}

export {}

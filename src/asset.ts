import { registerAssetService } from '@soda/soda-asset'
import axios from 'axios'
const MAINNET_CHAIN_ID = 137
const retrieveCollections = () => {}

const retrieveAssets = () => {}

const getNFT = async (metaData: any) => {
  const chainId = metaData.chainId
  let url = ''
  if (Number(chainId) === MAINNET_CHAIN_ID) {
    url = `https://api.opensea.io/api/v1/asset/${metaData.contract}/${metaData.tokenId}/`
  } else {
    url = `https://testnets-api.opensea.io/api/v1/asset/${metaData.contract}/${metaData.tokenId}/`
  }
  const res = await axios.get(url)
  const result = res.data
  return {
    ...metaData,
    source: result.image_url,
    type: 'image',
    storage: 'ipfs'
  }
}

const init = () => {
  registerAssetService({
    name: 'opensea',
    meta: {
      retrieveAssets: retrieveAssets,
      retrieveCollections: retrieveCollections,
      getNFTFunc: getNFT
    }
  })
}

export default init

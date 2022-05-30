import { Function, registerAssetService } from '@soda/soda-asset'
import { httpRequest } from '@soda/soda-util'
const MAINNET_CHAIN_ID = 137

const actions = {
  1: [Function.getAssetInfo, Function.getBalance, Function.getRole],
  4: [Function.getAssetInfo, Function.getBalance, Function.getRole]
}

const getNFT = async (metaData: any) => {
  const chainId = metaData.chainId
  let url = ''
  if (Number(chainId) === MAINNET_CHAIN_ID) {
    url = `https://api.opensea.io/api/v1/asset/${metaData.contract}/${metaData.tokenId}/`
  } else {
    url = `https://testnets-api.opensea.io/api/v1/asset/${metaData.contract}/${metaData.tokenId}/`
  }
  const result = await httpRequest({ url })
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
      getNFTFunc: getNFT
    }
  })
}

export default init

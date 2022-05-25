import { registerAssetService } from '@soda/soda-asset'
import { MessageTypes, sendMessage } from '@soda/soda-core'

const MAINNET_CHAIN_ID = 1
const retrieveCollections = () => {}

const retrieveAssets = () => {}

const CachedAssetResult = {}

const getNFT = async (metaData: any) => {
  if (metaData.source) {
    //v1
    return {
      ...metaData,
      chainId: Number(metaData.chainId),
      contract: metaData.contract,
      type: 'image',
      storage: 'ipfs'
    }
  }
  const req = {
    type: MessageTypes.InvokeERC721Contract,
    request: {
      contract: metaData.contract,
      method: 'tokenURI',
      readOnly: true,
      args: [metaData.tokenId]
    }
  }
  const res: any = await sendMessage(req)
  // console.log('InvokeERC721Contract: ', res)
  let source = res.result
  try {
    const obj = JSON.parse(source)
    if (source) {
      source = obj.image || obj.image_url
    }
  } catch (err) {}
  return {
    chainId: Number(metaData.chainId),
    contract: metaData.contract,
    tokenId: metaData.tokenId,
    source,
    type: 'image',
    storage: 'ipfs'
  }
  // const key = `${metaData.contract}_${metaData.tokenId}`
  // if (CachedAssetResult[key]) {
  //   return CachedAssetResult[key]
  // }
  // const chainId = metaData.chainId
  // let url = ''
  // if (Number(chainId) === MAINNET_CHAIN_ID) {
  //   url = `https://api.opensea.io/api/v1/asset/${metaData.contract}/${metaData.tokenId}/`
  // } else {
  //   url = `https://testnets-api.opensea.io/api/v1/asset/${metaData.contract}/${metaData.tokenId}/`
  // }
  // const res = await axios.get(url)
  // console.log('get opensea NFT: ', res)
  // const result = res.data
  // const nft = {
  //   ...metaData,
  //   source: result.image_url || result?.asset_contract.image_url,
  //   type: 'image',
  //   storage: 'ipfs'
  // }

  // if (!CachedAssetResult[key]) {
  //   CachedAssetResult[key] = nft
  // }
  // return nft
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

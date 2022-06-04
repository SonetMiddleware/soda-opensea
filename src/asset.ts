import { registerAssetService } from '@soda/soda-asset'
import {
  getChainId,
  getNFTSource,
  MessageTypes,
  sendMessage
} from '@soda/soda-core'

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
  const currentChainId = await getChainId()
  if (Number(currentChainId) !== Number(metaData.chainId)) {
    return {
      ...metaData,
      source: '',
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

  let source = ''
  if (res && res.result && typeof res.result === 'string') {
    // source = res.result
    source = await getNFTSource(res.result)
    console.log('nft source: ', source)
  }
  if (source && source.startsWith('{')) {
    try {
      const obj = JSON.parse(source)
      if (source) {
        source = obj.image || obj.image_url
      }
    } catch (err) {}
  }
  return {
    chainId: Number(metaData.chainId),
    contract: metaData.contract,
    tokenId: metaData.tokenId,
    source,
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

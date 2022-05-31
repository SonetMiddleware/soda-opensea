import { AssetType, NFT } from '@soda/soda-asset'
import { getChainId, httpRequest } from '@soda/soda-util'

const MAINNET_ID = 1
const getHost = async (meta?: NFT | number) => {
  let chainId = 0
  if (meta) {
    if (typeof meta == 'number') chainId = meta
    else chainId = (meta as NFT).chainId
  } else chainId = await getChainId()
  const prefix = MAINNET_ID !== chainId ? 'testnets-' : ''
  return `https://${prefix}api.opensea.io/api/v1`
}
export interface ICollectionItem {
  id: string
  name: string
  img: string
}
export interface IGetCollectionListResult {
  total: number
  data: ICollectionItem[]
}
export interface IRetrieveCollectionsParam {
  owner_address: string
  offset?: number
  limit?: number
}
export const retrieveCollections = async (
  params: IRetrieveCollectionsParam
): Promise<IGetCollectionListResult> => {
  const { owner_address, offset, limit } = params
  const url = `${await getHost()}/collections`
  const p = {
    asset_owner: owner_address,
    offset: offset || 0,
    limit: limit || 300
  }
  const res: any = await httpRequest({ url, params: p })
  console.debug('[asset-opensea] retrieveCollections: ', res)
  const result = {
    total: res.data.length,
    data: res.data.map((item: any) => ({
      id: item.slug,
      name: item.name,
      img: item.image_url
    }))
  }
  return result
}

export const toToken = (t: IOwnedNFTData, chainId?: number): NFT => {
  return {
    type: t.erc == '1155' ? AssetType.PFT : AssetType.NFT,
    balance: t.amount,
    contract: t.contract,
    tokenId: t.token_id,
    source: t.uri,
    owner: t.owner,
    meta: { type: 'image', storage: 'ipfs' }
  }
}

export interface IOwnedNFTData {
  contract: string
  erc: string
  token_id: string
  amount?: number
  uri: string
  owner: string
  update_block?: string
}
export interface IGetCollectionNFTListResult {
  total: number
  collection_id: string
  collection_name: string
  collection_img: string
  data: IOwnedNFTData[]
}
export interface IRetrieveAssetsParams {
  owner: string
  offset?: number
  limit?: number
  collection?: string
  chainId?: number
}
export const retrieveAssets = async (
  params: IRetrieveAssetsParams
): Promise<IGetCollectionNFTListResult> => {
  const { chainId, owner, offset, limit, collection } = params
  const url = `${await getHost(chainId)}/assets`
  const p = {
    owner: owner,
    order_direction: 'desc',
    offset: offset || 0,
    limit: limit || 50,
    collection: collection
  }
  const res: any = await httpRequest({ url, params: p })
  console.debug('[asset-opensea] retrieveAssets: ', res)
  const assets: any[] = res.data.assets
  const result = {
    total: assets.length,
    collection_id: collection,
    collection_name: assets[0]?.collection.name,
    collection_img: assets[0]?.collection.image_url,
    data: assets.map((item) => ({
      contract: item?.asset_contract.address,
      erc: item?.asset_contract.schema_name,
      token_id: item.token_id,
      uri: item.image_url || item.asset_contract.image_url,
      owner: item?.owner.address,
      name: item.asset_contract.name
    }))
  }
  return result
}

const CachedAssetResult = {}
export const retrieveAsset = async (contract: string, tokenId: string) => {
  const key = `${contract}_${tokenId}`
  if (CachedAssetResult[key]) {
    return CachedAssetResult[key]
  }
  const url = `${await getHost()}/asset/${contract}/${tokenId}/`
  const res: any = await httpRequest({ url })
  const asset = res.data
  if (!CachedAssetResult[key]) {
    CachedAssetResult[key] = asset
  }
  return asset
}

import { NFT, Collection } from '@soda/soda-asset'
import { getChainId } from '@soda/soda-util'
import * as Api from './service/apis'

export const getCollectionList = async (params: {
  address: string
  offset?: number
  limit?: number
}): Promise<{ total: number; data: Collection[] }> => {
  const { address, offset, limit } = params
  const collections = await Api.retrieveCollections({
    owner_address: address,
    offset,
    limit
  })
  const res = { total: collections.total, data: [] }
  for (const c of collections.data) {
    res.data.push({
      id: c.id,
      name: c.name,
      image: c.img
    })
  }
  return res
}

export const getCollectionTokenList = async (params: {
  collectionId: string
  address?: string
  offset?: number
  limit?: number
}): Promise<{
  total: number
  collection: Collection
  data: NFT[]
}> => {
  const { collectionId, address, offset, limit } = params
  const nfts = await Api.retrieveAssets({
    collection: collectionId,
    owner: address,
    offset,
    limit
  })
  const res = {
    total: nfts.total,
    collection: {
      id: nfts.collection_id,
      name: nfts.collection_name,
      image: nfts.collection_img
    },
    data: []
  }
  const chainId = await getChainId()
  for (const t of nfts.data) {
    res.data.push(Api.toToken(t, chainId))
  }
  return res
}

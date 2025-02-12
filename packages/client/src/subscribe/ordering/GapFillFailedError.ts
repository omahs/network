import { MessageRef } from "@streamr/protocol"
import { EthereumAddress } from '@streamr/utils'

export default class GapFillFailedError extends Error {

    from: MessageRef
    to: MessageRef
    publisherId: EthereumAddress
    msgChainId: string

    constructor(from: MessageRef, to: MessageRef, publisherId: EthereumAddress, msgChainId: string, nbTrials: number) {
        super(`Failed to fill gap between ${from.serialize()} and ${to.serialize()}`
            + ` for ${publisherId}-${msgChainId} after ${nbTrials} trials`)
        this.from = from
        this.to = to
        this.publisherId = publisherId
        this.msgChainId = msgChainId
    }
}

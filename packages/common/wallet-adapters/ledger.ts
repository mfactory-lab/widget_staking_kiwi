/*
 * This file is part of the Web3 Library developed by mFactory GmbH.
 *
 * Copyright © 2021, mFactory GmbH
 *
 * Solana Reference Stake Pool is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Solana Reference Stake Pool is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 * If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 *
 * You can be released from the requirements of the Affero GNU General Public License
 * by purchasing a commercial license. The purchase of such a license is
 * mandatory as soon as you develop commercial activities using the
 * Solana Reference Stake Pool code without disclosing the source code of
 * your own applications.
 *
 * The developer of this program can be contacted at <info@mfactory.ch>.
 */

// import type { PublicKey, Transaction } from '@solana/web3.js'
// import EventEmitter from 'eventemitter3'
// import type Transport from '@ledgerhq/hw-transport'
// import TransportWebHID from '@ledgerhq/hw-transport-webhid'
//
// let TRANSPORT: Transport | null = null
//
// export class LedgerWalletAdapter extends EventEmitter implements WalletAdapter {
//   _connecting: boolean
//   _publicKey: PublicKey | null
//   _transport: Transport | null
//
//   constructor() {
//     super()
//     this._connecting = false
//     this._publicKey = null
//     this._transport = null
//   }
//
//   get publicKey() {
//     return this._publicKey
//   }
//
//   async signTransaction(transaction: Transaction) {
//     if (!this._transport || !this._publicKey) {
//       throw new Error('Not connected to Ledger')
//     }
//
//     // @TODO: account selection (derivation path changes with account)
//     const signature = await signTransaction(this._transport, transaction)
//
//     transaction.addSignature(this._publicKey, signature)
//
//     return transaction
//   }
//
//   async connect() {
//     if (this._connecting) {
//       return
//     }
//
//     this._connecting = true
//
//     try {
//       // @TODO: transport selection (WebUSB, WebHID, bluetooth, ...)
//       if (TRANSPORT === null) {
//         TRANSPORT = await TransportWebHID.create()
//       }
//       this._transport = TRANSPORT
//       // @TODO: account selection
//       this._publicKey = await getPublicKey(this._transport)
//       this.emit('connect', this._publicKey)
//     } catch (error) {
//       notify({
//         message: 'Ledger Error',
//         description: error.message,
//       })
//       await this.disconnect()
//     } finally {
//       this._connecting = false
//     }
//   }
//
//   async disconnect() {
//     let emit = false
//     if (this._transport) {
//       await this._transport.close()
//       this._transport = null
//       emit = true
//     }
//
//     this._connecting = false
//     this._publicKey = null
//
//     if (emit) {
//       this.emit('disconnect')
//     }
//   }
// }
//
// const INS_GET_PUBKEY = 0x05
// const INS_SIGN_MESSAGE = 0x06
//
// const P1_NON_CONFIRM = 0x00
// const P1_CONFIRM = 0x01
//
// const P2_EXTEND = 0x01
// const P2_MORE = 0x02
//
// const MAX_PAYLOAD = 255
//
// const LEDGER_CLA = 0xe0
//
// /*
//  * Helper for chunked send of large payloads
//  */
// async function ledgerSend(transport: Transport, instruction: number, p1: number, payload: Buffer) {
//   let p2 = 0
//   let payloadOffset = 0
//
//   if (payload.length > MAX_PAYLOAD) {
//     while (payload.length - payloadOffset > MAX_PAYLOAD) {
//       const chunk = payload.slice(payloadOffset, payloadOffset + MAX_PAYLOAD)
//       payloadOffset += MAX_PAYLOAD
//       console.log('send', (p2 | P2_MORE).toString(16), chunk.length.toString(16), chunk)
//       const reply = await transport.send(LEDGER_CLA, instruction, p1, p2 | P2_MORE, chunk)
//       if (reply.length !== 2) {
//         throw new Error('Received unexpected reply payload')
//       }
//       p2 |= P2_EXTEND
//     }
//   }
//
//   const chunk = payload.slice(payloadOffset)
//   console.log('send', p2.toString(16), chunk.length.toString(16), chunk)
//   const reply = await transport.send(LEDGER_CLA, instruction, p1, p2, chunk)
//
//   return reply.slice(0, reply.length - 2)
// }
//
// const BIP32_HARDENED_BIT = (1 << 31) >>> 0
// function harden(n = 0) {
//   return (n | BIP32_HARDENED_BIT) >>> 0
// }
//
// export function getSolanaDerivationPath(account?: number, change?: number) {
//   let length
//   if (account !== undefined) {
//     if (change !== undefined) {
//       length = 4
//     } else {
//       length = 3
//     }
//   } else {
//     length = 2
//   }
//
//   const derivationPath = Buffer.alloc(1 + length * 4)
//   // eslint-disable-next-line
//   var offset = 0;
//   offset = derivationPath.writeUInt8(length, offset)
//   offset = derivationPath.writeUInt32BE(harden(44), offset) // Using BIP44
//   offset = derivationPath.writeUInt32BE(harden(501), offset) // Solana's BIP44 path
//
//   if (length > 2) {
//     offset = derivationPath.writeUInt32BE(harden(account), offset)
//     if (length === 4) {
//       // @FIXME: https://github.com/project-serum/spl-token-wallet/issues/59
//       derivationPath.writeUInt32BE(harden(change), offset)
//     }
//   }
//
//   return derivationPath
// }
//
// export async function signTransaction(
//   transport: Transport,
//   transaction: Transaction,
//   derivationPath: Buffer = getSolanaDerivationPath()
// ) {
//   const messageBytes = transaction.serializeMessage()
//   return signBytes(transport, messageBytes, derivationPath)
// }
//
// export async function signBytes(
//   transport: Transport,
//   bytes: Buffer,
//   derivationPath: Buffer = getSolanaDerivationPath()
// ) {
//   const numPaths = Buffer.alloc(1)
//   numPaths.writeUInt8(1, 0)
//
//   const payload = Buffer.concat([numPaths, derivationPath, bytes])
//
//   // @FIXME: must enable blind signing in Solana Ledger App per https://github.com/project-serum/spl-token-wallet/issues/71
//   // See also https://github.com/project-serum/spl-token-wallet/pull/23#issuecomment-712317053
//   return ledgerSend(transport, INS_SIGN_MESSAGE, P1_CONFIRM, payload)
// }
//
// export async function getPublicKey(transport: Transport, derivationPath: Buffer = getSolanaDerivationPath()) {
//   const publicKeyBytes = await ledgerSend(transport, INS_GET_PUBKEY, P1_NON_CONFIRM, derivationPath)
//
//   return new PublicKey(publicKeyBytes)
// }

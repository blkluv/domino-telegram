import {PhraseMsg} from "./PhraseMsg";


export type SocketPhrase = PhrasePass | PhraseFine | PhraseWin | PhraseReward | PhraseAllReward | PhraseDeadEnd | PhraseLowCoins | PhraseHighCoins | PhraseFirst
export type PhrasePass = {msg: PhraseMsg.PASS}
export type PhraseDeadEnd = {msg: PhraseMsg.DEAD_END}
export type PhraseLowCoins = {msg: PhraseMsg.LOW_COINS}
export type PhraseHighCoins = {msg: PhraseMsg.HIGH_COINS}
export type PhraseFine = {msg: PhraseMsg.FINE, coins: number, targetUserId: number}
export type PhraseWin = {msg: PhraseMsg.WIN, factor: number}
export type PhraseReward = {msg: PhraseMsg.REWARD, coins: number, targetUserId: number}
export type PhraseAllReward = {msg: PhraseMsg.ALL_REWARD, factor: number, allReward: {[key: string]: number}}
export type PhraseFirst = {msg: PhraseMsg.FIRST, duration: number}

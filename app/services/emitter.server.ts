import { EventEmitter } from 'node:events';
import { NFCEmitterMessage, ReactionEmitterMessage } from '~/types/emitter';

export const reactionEmitter = new EventEmitter<{
  message: [ReactionEmitterMessage];
}>();

export const nfcEmitter = new EventEmitter<{ message: [NFCEmitterMessage] }>();

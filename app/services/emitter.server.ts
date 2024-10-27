import { EventEmitter } from 'node:events';
import { ReactionEmitterMessage } from '~/types/emitter';
export const reactionEmitter = new EventEmitter<{
  message: [ReactionEmitterMessage];
}>();
